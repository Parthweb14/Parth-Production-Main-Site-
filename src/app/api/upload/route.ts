import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '@/utils/s3';
import { NextResponse } from 'next/server';
import path from 'path';
import { execFileSync } from 'child_process';
import os from 'os';
import crypto from 'crypto';
import fs from 'fs';
import { requireAdmin, safeErrorMessage } from '@/utils/auth';

const ALLOWED_EXT = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.gif',
  '.mp4',
  '.webm',
  '.mov',
]);
const MAX_BYTES = 80 * 1024 * 1024;
/** Tall showcase clips — keep detail, cap height for faster loads */
const VIDEO_MAX_H = 1280;
/** H.264 quality (~visually lossless for web, still much smaller than phone dumps) */
const MP4_CRF = '26';
/** VP9 quality — moderate; lower number = bigger/better. 32–34 is a good web balance */
const WEBM_CRF = '33';

function getFFmpegPath() {
  const cwd = process.cwd();
  const winPath = path.join(cwd, 'node_modules', '@ffmpeg-installer', 'win32-x64', 'ffmpeg.exe');
  const linuxPath = path.join(cwd, 'node_modules', '@ffmpeg-installer', 'linux-x64', 'ffmpeg');
  if (fs.existsSync(linuxPath)) return linuxPath;
  if (fs.existsSync(winPath)) return winPath;
  return 'ffmpeg';
}

function safeKey(originalName: string, forceExt?: string): string {
  const base = path.basename(originalName).replace(/\s+/g, '_');
  const ext = (forceExt || path.extname(base).toLowerCase()) || '.bin';
  const stem = path.basename(base, path.extname(base)).replace(/[^a-zA-Z0-9._-]/g, '').slice(0, 80) || 'file';
  return `uploads/${crypto.randomUUID()}-${stem}${ext}`;
}

function cleanup(...files: string[]) {
  for (const f of files) {
    try {
      if (f && fs.existsSync(f)) fs.unlinkSync(f);
    } catch {
      /* ignore */
    }
  }
}

/**
 * Compress showcase videos to optimized MP4 + WebM (muted, max 1280px tall).
 * Same settings for every admin upload so homepage clips stay consistent.
 */
function compressShowcaseVideo(inputBuffer: Buffer, inputExt: string): {
  mp4: Buffer;
  webm: Buffer;
} | null {
  try {
    const ffmpegPath = getFFmpegPath();
    const tempDir = os.tmpdir();
    const randId = crypto.randomBytes(8).toString('hex');
    const localInput = path.join(tempDir, `input_${randId}${inputExt || '.mp4'}`);
    const localOptMp4 = path.join(tempDir, `opt_${randId}.mp4`);
    const localOptWebm = path.join(tempDir, `opt_${randId}.webm`);

    fs.writeFileSync(localInput, inputBuffer);

    const scaleFilter = `scale=-2:'min(${VIDEO_MAX_H},ih)'`;

    execFileSync(
      ffmpegPath,
      [
        '-y',
        '-i',
        localInput,
        '-vf',
        scaleFilter,
        '-c:v',
        'libx264',
        '-profile:v',
        'high',
        '-level:v',
        '4.1',
        '-preset',
        'veryfast',
        '-crf',
        MP4_CRF,
        '-an',
        '-pix_fmt',
        'yuv420p',
        '-movflags',
        '+faststart',
        localOptMp4,
      ],
      { stdio: 'ignore', timeout: 90000 }
    );

    execFileSync(
      ffmpegPath,
      [
        '-y',
        '-i',
        localInput,
        '-vf',
        scaleFilter,
        '-c:v',
        'libvpx-vp9',
        '-crf',
        WEBM_CRF,
        '-b:v',
        '0',
        '-row-mt',
        '1',
        '-cpu-used',
        '3',
        '-an',
        localOptWebm,
      ],
      { stdio: 'ignore', timeout: 120000 }
    );

    const mp4 = fs.readFileSync(localOptMp4);
    const webm = fs.readFileSync(localOptWebm);
    cleanup(localInput, localOptMp4, localOptWebm);
    return { mp4, webm };
  } catch (err) {
    console.warn('Video compression skipped:', err);
    return null;
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const rawName = searchParams.get('filename') || 'upload.bin';

  try {
    if (!request.body) {
      return NextResponse.json({ error: 'Request body is empty.' }, { status: 400 });
    }

    const ext = path.extname(rawName).toLowerCase();
    if (!ALLOWED_EXT.has(ext)) {
      return NextResponse.json({ error: 'File type not allowed.' }, { status: 400 });
    }

    const arrayBuffer = await request.arrayBuffer();
    let buffer: Buffer = Buffer.from(arrayBuffer);
    if (buffer.length > MAX_BYTES) {
      return NextResponse.json({ error: 'File too large.' }, { status: 413 });
    }

    let contentType = request.headers.get('content-type') || 'application/octet-stream';
    let objectKey = safeKey(rawName);

    // Optional image compression when sharp is available
    if (['.png', '.jpg', '.jpeg'].includes(ext) && buffer.length > 200 * 1024) {
      try {
        const sharp = (await import('sharp')).default;
        const pipeline = sharp(buffer).resize({ width: 1920, withoutEnlargement: true });
        if (ext === '.png') {
          buffer = await pipeline.png({ quality: 80, compressionLevel: 9 }).toBuffer();
          contentType = 'image/png';
        } else {
          buffer = await pipeline.jpeg({ quality: 80, progressive: true }).toBuffer();
          contentType = 'image/jpeg';
        }
      } catch (sharpError) {
        console.warn('Image compression skipped:', sharpError);
      }
    }

    let webmBuffer: Buffer | null = null;
    let webmKey = '';

    if (['.mp4', '.mov', '.webm'].includes(ext)) {
      const compressed = compressShowcaseVideo(buffer, ext);
      if (compressed) {
        buffer = compressed.mp4;
        webmBuffer = compressed.webm;
        contentType = 'video/mp4';
        objectKey = safeKey(rawName, '.mp4');
        webmKey = objectKey.replace(/\.mp4$/i, '.webm');
      } else if (ext === '.mov') {
        // Keep original if ffmpeg unavailable — still upload as-is
        contentType = 'video/quicktime';
      } else if (ext === '.webm') {
        contentType = 'video/webm';
      } else {
        contentType = 'video/mp4';
      }
    }

    const useR2 = !!process.env.R2_BUCKET_NAME && !!process.env.R2_PUBLIC_URL;
    let publicUrl = '';
    let webmUrl: string | undefined;

    if (useR2) {
      if (webmBuffer && webmKey) {
        await s3.send(
          new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: webmKey,
            Body: webmBuffer,
            ContentType: 'video/webm',
          })
        );
        webmUrl = `${process.env.R2_PUBLIC_URL}/${webmKey}`;
      }

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME,
          Key: objectKey,
          Body: buffer,
          ContentType: contentType,
        })
      );

      publicUrl = `${process.env.R2_PUBLIC_URL}/${objectKey}`;
      return NextResponse.json({ url: publicUrl, webmUrl });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const localName = path.basename(objectKey);
    fs.writeFileSync(path.join(uploadDir, localName), buffer);
    publicUrl = `/uploads/${localName}`;

    if (webmBuffer && webmKey) {
      const webmName = path.basename(webmKey);
      fs.writeFileSync(path.join(uploadDir, webmName), webmBuffer);
      webmUrl = `/uploads/${webmName}`;
    }

    return NextResponse.json({ url: publicUrl, webmUrl });
  } catch (err: unknown) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: safeErrorMessage(err, 'Upload failed.') }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
export const maxDuration = 120;
