import { NextRequest, NextResponse } from 'next/server';
import { sharedDB } from '@/lib/sharedDB';

/**
 * POST /api/qr-events
 *
 * Logs an anonymous QR event.
 * NEVER stores the actual QR content, URL, or any personal data.
 *
 * Body:
 *   event_type     'generated' | 'downloaded'  (required)
 *   qr_type        string   — website, payment, wifi …
 *   export_format  string   — png, svg, jpeg, webp
 *   color_modified boolean
 *   style_modified boolean
 *   frame_modified boolean
 *   logo_added     boolean
 *   text_added     boolean
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      event_type,
      qr_type,
      export_format,
      color_modified = false,
      style_modified = false,
      frame_modified = false,
      logo_added = false,
      text_added = false,
    } = body as Record<string, unknown>;

    if (!event_type || !['generated', 'downloaded'].includes(event_type as string)) {
      return NextResponse.json(
        { error: 'Invalid event_type. Must be "generated" or "downloaded".' },
        { status: 400 },
      );
    }

    let rpcOk = false;
    let insertOk = false;

    await sharedDB.tx(async (client) => {
      // ── 1. Increment qr_counter via SQL function (runs first — critical counter) ─
      await client.query('SAVEPOINT sp_counter');
      try {
        const fn = event_type === 'generated' ? 'increment_qr_generated' : 'increment_qr_downloaded';
        await client.query(`SELECT * FROM ${fn}()`);
        rpcOk = true;
      } catch (err) {
        console.error('[qr-events] Counter increment failed:', err);
        await client.query('ROLLBACK TO SAVEPOINT sp_counter');
      }

      // ── 2. Insert detailed event row (non-fatal if qr_events not migrated) ──
      await client.query('SAVEPOINT sp_event');
      try {
        await client.query(
          `INSERT INTO qr_events (
             event_type, qr_type, export_format,
             color_modified, style_modified, frame_modified,
             logo_added, text_added
           ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
          [
            event_type,
            (qr_type ?? null) as string | null,
            (export_format ?? null) as string | null,
            Boolean(color_modified),
            Boolean(style_modified),
            Boolean(frame_modified),
            Boolean(logo_added),
            Boolean(text_added),
          ],
        );
        insertOk = true;
      } catch (err) {
        console.error('[qr-events] qr_events insert failed:', err);
        await client.query('ROLLBACK TO SAVEPOINT sp_event');
      }
    });

    if (!rpcOk && !insertOk) {
      return NextResponse.json({ error: 'All operations failed' }, { status: 500 });
    }

    return NextResponse.json({ success: true, rpcOk, insertOk }, { status: 200 });

  } catch (error) {
    console.error('[qr-events] Unexpected error:', error);
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 });
  }
}
