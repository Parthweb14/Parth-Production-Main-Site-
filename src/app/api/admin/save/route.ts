import { NextResponse } from 'next/server';
import { vercelDb } from '@/utils/vercelDb';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '@/utils/s3';

async function deleteFromR2(url: string) {
  try {
    const publicUrlPrefix = process.env.R2_PUBLIC_URL || '';
    if (url.startsWith(publicUrlPrefix)) {
      const key = url.replace(`${publicUrlPrefix}/`, '');
      const command = new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
      });
      await s3.send(command);
      console.log('Successfully deleted key from R2:', key);
    }
  } catch (err) {
    console.warn('R2 delete warning for URL:', url, err);
  }
}

export async function POST(request: Request) {
  try {
    const { 
      token, 
      settings, 
      images, 
      videos, 
      serviceImages, 
      vibrants,
      adminCredentials,
      deletedUrls 
    } = await request.json();

    // 1. Verify token session validity
    if (!token) {
      return NextResponse.json({ error: 'Token missing.' }, { status: 401 });
    }
    try {
      const payload = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
      if (Date.now() > payload.exp) {
        return NextResponse.json({ error: 'Admin session expired. Please log in again.' }, { status: 401 });
      }
    } catch {
      return NextResponse.json({ error: 'Invalid authentication token.' }, { status: 401 });
    }

    // 2. Perform updates to R2 DB (saved as database.json in R2)
    if (settings) {
      await vercelDb.setSettings(settings);
    }
    if (images) {
      await vercelDb.setImages(images);
    }
    if (videos) {
      await vercelDb.setVideos(videos);
    }
    if (serviceImages) {
      await vercelDb.setServices(serviceImages);
    }
    if (vibrants) {
      await vercelDb.setVibrants(vibrants);
    }
    if (adminCredentials) {
      await vercelDb.setCredentials(adminCredentials);
    }

    // 3. Clean up deleted files from R2
    if (deletedUrls && Array.isArray(deletedUrls) && deletedUrls.length > 0) {
      console.log('Cleaning up deleted files from Cloudflare R2:', deletedUrls);
      for (const url of deletedUrls) {
        await deleteFromR2(url);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
export const dynamic = 'force-dynamic';
