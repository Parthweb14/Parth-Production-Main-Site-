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

function getFFmpegPath() {
  const cwd = process.cwd();
  const winPath = path.join(cwd, 'node_modules', '@ffmpeg-installer', 'win32-x64', 'ffmpeg.exe');
  const linuxPath = path.join(cwd, 'node_modules', '@ffmpeg-installer', 'linux-x64', 'ffmpeg');
  if (fs.existsSync(linuxPath)) return linuxPath;
  if (fs.existsSync(winPath)) return winPath;
  return 'ffmpeg';
}

function safeKey(originalName: string): string {
  const base = path.basename(originalName).replace(/\s+/g, '_');
  const ext = path.extname(base).toLowerCase();
  const stem = path.basename(base, ext).replace(/[^a-zA-Z0-9._-]/g, '').slice(0, 80) || 'file';
  return `uploads/${crypto.randomUUID()}-${stem}${ext}`;
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
        let pipeline = sharp(buffer).resize({ width: 1920, withoutEnlargement: true });
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

    if (ext === '.mp4') {
      try {
        const ffmpegPath = getFFmpegPath();
        const tempDir = os.tmpdir();
        const randId = crypto.randomBytes(8).toString('hex');
        const localInput = path.join(tempDir, `input_${randId}.mp4`);
        const localOptMp4 = path.join(tempDir, `opt_${randId}.mp4`);
        const localOptWebm = path.join(tempDir, `opt_${randId}.webm`);

        fs.writeFileSync(localInput, buffer);
        execFileSync(
          ffmpegPath,
          ['-y', '-i', localInput, '-c:v', 'libx264', '-profile:v', 'high', '-level:v', '4.1', '-crf', '23', '-an', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', localOptMp4],
          { stdio: 'ignore', timeout: 45000 }
        );
        execFileSync(
          ffmpegPath,
          ['-y', '-i', localInput, '-c:v', 'libvpx-vp9', '-crf', '32', '-b:v', '800k', '-an', localOptWebm],
          { stdio: 'ignore', timeout: 45000 }
        );

        buffer = fs.readFileSync(localOptMp4);
        webmBuffer = fs.readFileSync(localOptWebm);
        contentType = 'video/mp4';
        webmKey = objectKey.replace(/\.mp4$/i, '.webm');

        fs.unlinkSync(localInput);
        fs.unlinkSync(localOptMp4);
        fs.unlinkSync(localOptWebm);
      } catch (videoError: unknown) {
        console.warn('Video compression skipped:', videoError);
      }
    }

    const useR2 = !!process.env.R2_BUCKET_NAME && !!process.env.R2_PUBLIC_URL;

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
      }

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME,
          Key: objectKey,
          Body: buffer,
          ContentType: contentType,
        })
      );

      return NextResponse.json({ url: `${process.env.R2_PUBLIC_URL}/${objectKey}` });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const localName = path.basename(objectKey);
    fs.writeFileSync(path.join(uploadDir, localName), buffer);
    if (webmBuffer && webmKey) {
      fs.writeFileSync(path.join(uploadDir, path.basename(webmKey)), webmBuffer);
    }

    return NextResponse.json({ url: `/uploads/${localName}` });
  } catch (err: unknown) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: safeErrorMessage(err, 'Upload failed.') }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
export const maxDuration = 60;
