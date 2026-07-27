import { NextResponse } from 'next/server';
import { vercelDb } from '@/utils/vercelDb';
import { publicSettings, safeErrorMessage } from '@/utils/auth';

export async function GET() {
  try {
    const [settings, images, videos, services, vibrants] = await Promise.all([
      vercelDb.getSettings(),
      vercelDb.getImages(),
      vercelDb.getVideos(),
      vercelDb.getServices(),
      vercelDb.getVibrants(),
    ]);

    const sortedImages = [...images].sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));
    const sortedVideos = [...videos].sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));
    const sortedVibrants = [...vibrants].sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));

    return NextResponse.json({
      settings: publicSettings(settings as unknown as Record<string, unknown>),
      images: sortedImages,
      videos: sortedVideos,
      services,
      vibrants: sortedVibrants,
      stage_gallery: sortedVibrants,
    });
  } catch (err: unknown) {
    console.error('Public data error:', err);
    return NextResponse.json({ error: safeErrorMessage(err) }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
