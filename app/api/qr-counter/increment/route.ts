import { NextRequest, NextResponse } from 'next/server';
import { sharedDB } from '@/lib/sharedDB';

function toSafeNumber(value: unknown): number {
  const n = typeof value === 'bigint' ? Number(value) : Number(value);
  return Number.isFinite(n) ? n : 0;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type } = body; // 'generated' or 'downloaded'

    if (!type || !['generated', 'downloaded'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type. Must be "generated" or "downloaded"' },
        { status: 400 }
      );
    }

    const functionName = type === 'generated' ? 'increment_qr_generated' : 'increment_qr_downloaded';

    const result = await sharedDB.query(
      `SELECT total_generated, total_downloaded, updated_at::text as updated_at FROM ${functionName}()`,
    );

    const raw = result.rows[0] as
      | { total_generated?: unknown; total_downloaded?: unknown; updated_at?: unknown }
      | undefined;

    const data = raw
      ? {
          ...raw,
          total_generated: toSafeNumber(raw.total_generated ?? 0),
          total_downloaded: toSafeNumber(raw.total_downloaded ?? 0),
        }
      : null;

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Error incrementing counter:', error);
    return NextResponse.json(
      { error: 'Failed to increment counter' },
      { status: 500 }
    );
  }
}
