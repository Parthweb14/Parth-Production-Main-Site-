import { NextResponse } from 'next/server';
import { vercelDb } from '@/utils/vercelDb';

export async function GET() {
  try {
    const [settings, images, videos, services, vibrants] = await Promise.all([
      vercelDb.getSettings(),
      vercelDb.getImages(),
      vercelDb.getVideos(),
      vercelDb.getServices(),
      vercelDb.getVibrants()
    ]);

    // Sort items by order_index
    const sortedImages = [...images].sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));
    const sortedVideos = [...videos].sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));
    const sortedVibrants = [...vibrants].sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));

    return NextResponse.json({
      settings,
      images: sortedImages,
      videos: sortedVideos,
      services,
      vibrants: sortedVibrants
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
export const dynamic = 'force-dynamic';
export const revalidate = 0;
