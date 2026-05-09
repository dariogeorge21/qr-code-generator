import { NextRequest, NextResponse } from 'next/server';
import { sharedDB } from '@/lib/sharedDB';

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

    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 200 });
  } catch (error) {
    console.error('Error incrementing counter:', error);
    return NextResponse.json(
      { error: 'Failed to increment counter' },
      { status: 500 }
    );
  }
}
