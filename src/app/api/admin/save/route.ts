import { NextResponse } from 'next/server';
import { vercelDb } from '@/utils/vercelDb';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '@/utils/s3';
import { assertSameOrigin, requireAdmin, safeErrorMessage } from '@/utils/auth';

async function deleteFromR2(url: string) {
  try {
    const publicUrlPrefix = process.env.R2_PUBLIC_URL || '';
    if (!publicUrlPrefix || !url.startsWith(publicUrlPrefix)) return;

    const key = url.replace(`${publicUrlPrefix}/`, '');
    if (!key || key.includes('..')) return;

    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
      })
    );
  } catch (err) {
    console.warn('R2 delete warning for URL:', url, err);
  }
}

export async function POST(request: Request) {
  try {
    const originBlock = assertSameOrigin(request);
    if (originBlock) return originBlock;

    const auth = await requireAdmin(request);
    if (!auth.ok) return auth.response;

    const { settings, images, videos, serviceImages, vibrants, deletedUrls } = await request.json();

    if (settings) {
      const current = await vercelDb.getSettings();
      const next = { ...settings };
      // Blank SMTP password means "keep existing" — never wipe secrets accidentally.
      if (!next.smtp_pass) {
        next.smtp_pass = current.smtp_pass || '';
      }
      delete next.smtp_pass_set;
      await vercelDb.setSettings(next);
    }
    if (images) await vercelDb.setImages(images);
    if (videos) await vercelDb.setVideos(videos);
    if (serviceImages) await vercelDb.setServices(serviceImages);
    if (vibrants) await vercelDb.setVibrants(vibrants);

    if (deletedUrls && Array.isArray(deletedUrls) && deletedUrls.length > 0) {
      for (const url of deletedUrls) {
        if (typeof url === 'string') await deleteFromR2(url);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error('Admin save error:', err);
    return NextResponse.json({ error: safeErrorMessage(err) }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
