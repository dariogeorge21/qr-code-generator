import { NextRequest, NextResponse } from 'next/server';
import { sharedDB } from '@/lib/sharedDB';

export async function GET() {
  try {
    const result = await sharedDB.query(
      'SELECT total_generated, total_downloaded FROM qr_counter WHERE id = 1 LIMIT 1',
    );

    const row = (result.rows[0] as { total_generated: number; total_downloaded: number } | undefined) ?? {
      total_generated: 0,
      total_downloaded: 0,
    };

    return NextResponse.json(row, { status: 200 });
  } catch (error) {
    console.error('Error fetching QR counter:', error);
    return NextResponse.json(
      { error: 'Failed to fetch counter' },
      { status: 500 }
    );
  }
}
