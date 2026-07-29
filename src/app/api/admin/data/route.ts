import { NextResponse } from 'next/server';
import { vercelDb } from '@/utils/vercelDb';
import { adminSettingsSafe, assertSameOrigin, requireAdmin, safeErrorMessage } from '@/utils/auth';

export async function GET(request: Request) {
  try {
    const auth = await requireAdmin(request);
    if (!auth.ok) return auth.response;

    const [settings, images, videos, services, vibrants] = await Promise.all([
      vercelDb.getSettings(),
      vercelDb.getImages(),
      vercelDb.getVideos(),
      vercelDb.getServices(),
      vercelDb.getVibrants(),
    ]);

    return NextResponse.json({
      settings: adminSettingsSafe(settings as unknown as Record<string, unknown>),
      images: [...images].sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0)),
      videos: [...videos].sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0)),
      services,
      vibrants: [...vibrants].sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0)),
      stage_gallery: [...vibrants].sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0)),
    });
  } catch (err: unknown) {
    console.error('Admin data error:', err);
    return NextResponse.json({ error: safeErrorMessage(err) }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
