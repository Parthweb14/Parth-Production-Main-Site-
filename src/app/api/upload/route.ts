import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '@/utils/s3';
import { NextResponse } from 'next/server';
import sharp from 'sharp';
import path from 'path';
import { execFileSync } from 'child_process';
import os from 'os';
import crypto from 'crypto';
import fs from 'fs';

function getFFmpegPath() {
  const cwd = process.cwd();
  const winPath = path.join(cwd, 'node_modules', '@ffmpeg-installer', 'win32-x64', 'ffmpeg.exe');
  const linuxPath = path.join(cwd, 'node_modules', '@ffmpeg-installer', 'linux-x64', 'ffmpeg');
  
  if (fs.existsSync(linuxPath)) return linuxPath;
  if (fs.existsSync(winPath)) return winPath;
  return 'ffmpeg'; // system fallback
}

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename') || 'upload.bin';

  try {
    if (!request.body) {
      return NextResponse.json({ error: 'Request body is empty.' }, { status: 400 });
    }

    const arrayBuffer = await request.arrayBuffer();
    let buffer: Buffer = Buffer.from(arrayBuffer);
    let contentType = request.headers.get('content-type') || 'application/octet-stream';

    const ext = path.extname(filename).toLowerCase();
    
    // Automatically compress images (png, jpg, jpeg) on upload if they exceed 200 KB
    if (['.png', '.jpg', '.jpeg'].includes(ext) && buffer.length > 200 * 1024) {
      try {
        console.log(`Automatically compressing uploaded image: ${filename} (${(buffer.length / 1024).toFixed(1)} KB)`);
        let pipeline = sharp(buffer).resize({ width: 1920, withoutEnlargement: true });
        
        if (ext === '.png') {
          buffer = await pipeline.png({ quality: 80, compressionLevel: 9 }).toBuffer();
          contentType = 'image/png';
        } else {
          buffer = await pipeline.jpeg({ quality: 80, progressive: true }).toBuffer();
          contentType = 'image/jpeg';
        }
        console.log(`Compressed to: ${(buffer.length / 1024).toFixed(1)} KB`);
      } catch (sharpError) {
        console.warn('Image compression failed, uploading raw file instead:', sharpError);
      }
    }

    // Video compression variables
    let webmBuffer: Buffer | null = null;
    let webmFilename = '';

    // Automatically compress and convert videos on upload to MP4 + WebM
    if (ext === '.mp4') {
      try {
        console.log(`Automatically compressing and converting video: ${filename}`);
        const ffmpegPath = getFFmpegPath();
        const tempDir = os.tmpdir();
        const randId = crypto.randomBytes(8).toString('hex');
        const localInput = path.join(tempDir, `input_${randId}.mp4`);
        const localOptMp4 = path.join(tempDir, `opt_${randId}.mp4`);
        const localOptWebm = path.join(tempDir, `opt_${randId}.webm`);

        fs.writeFileSync(localInput, buffer);

        // 1. Compress to HQ H.264 MP4 (no audio, faststart, CRF 23)
        console.log('Running FFmpeg H.264 compression...');
        execFileSync(ffmpegPath, [
          '-y',
          '-i', localInput,
          '-c:v', 'libx264',
          '-profile:v', 'high',
          '-level:v', '4.1',
          '-crf', '23',
          '-an',
          '-pix_fmt', 'yuv420p',
          '-movflags', '+faststart',
          localOptMp4
        ], { stdio: 'ignore', timeout: 45000 });

        // 2. Compress to WebM VP9 (no audio, CRF 32)
        console.log('Running FFmpeg WebM compression...');
        execFileSync(ffmpegPath, [
          '-y',
          '-i', localInput,
          '-c:v', 'libvpx-vp9',
          '-crf', '32',
          '-b:v', '800k',
          '-an',
          localOptWebm
        ], { stdio: 'ignore', timeout: 45000 });

        buffer = fs.readFileSync(localOptMp4);
        webmBuffer = fs.readFileSync(localOptWebm);
        contentType = 'video/mp4';

        const baseName = filename.slice(0, -4);
        webmFilename = `${baseName}.webm`;

        // Cleanup temp files
        fs.unlinkSync(localInput);
        fs.unlinkSync(localOptMp4);
        fs.unlinkSync(localOptWebm);
        console.log('Video compression and conversion complete!');
      } catch (videoError: any) {
        console.warn('Video compression failed, uploading raw video instead:', videoError.message || videoError);
      }
    }

    const useR2 = !!process.env.R2_BUCKET_NAME;

    if (useR2) {
      if (webmBuffer) {
        console.log(`Uploading WebM companion to R2: ${webmFilename}...`);
        const putWebmCmd = new PutObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME,
          Key: webmFilename,
          Body: webmBuffer,
          ContentType: 'video/webm',
        });
        await s3.send(putWebmCmd);
      }

      const command = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: filename,
        Body: buffer,
        ContentType: contentType,
      });

      await s3.send(command);

      const fileUrl = `${process.env.R2_PUBLIC_URL}/${filename}`;
      return NextResponse.json({ url: fileUrl });
    } else {
      console.log('No Cloudflare R2 credentials found. Falling back to local upload...');
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const localFilePath = path.join(uploadDir, filename);
      fs.writeFileSync(localFilePath, buffer);

      if (webmBuffer && webmFilename) {
        const localWebmPath = path.join(uploadDir, webmFilename);
        fs.writeFileSync(localWebmPath, webmBuffer);
      }

      const fileUrl = `/uploads/${filename}`;
      return NextResponse.json({ url: fileUrl });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
export const dynamic = 'force-dynamic';
export const maxDuration = 60;
