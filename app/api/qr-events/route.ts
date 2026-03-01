import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

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

    // ── 1. Increment qr_counter via RPC (runs first — critical counter) ──────
    const rpcName =
      event_type === 'generated' ? 'increment_qr_generated' : 'increment_qr_downloaded';

    const { error: rpcError } = await supabaseAdmin.rpc(rpcName);

    if (rpcError) {
      console.error(`[qr-events] RPC ${rpcName} failed:`, rpcError.message, '| code:', rpcError.code);

      // Fallback: read current value then increment (handles missing row too)
      const col = event_type === 'generated' ? 'total_generated' : 'total_downloaded';

      const { data: counterRow } = await supabaseAdmin
        .from('qr_counter')
        .select(col)
        .eq('id', 1)
        .maybeSingle();

      if (counterRow) {
        // Row exists — bump the counter
        const current = (counterRow as Record<string, number>)[col] ?? 0;
        const { error: fallbackError } = await supabaseAdmin
          .from('qr_counter')
          .update({ [col]: current + 1, updated_at: new Date().toISOString() })
          .eq('id', 1);

        if (fallbackError) {
          console.error('[qr-events] Fallback UPDATE failed:', fallbackError.message);
        } else {
          rpcOk = true;
          console.log(`[qr-events] Fallback UPDATE succeeded for ${col} → ${current + 1}`);
        }
      } else {
        // Row missing — create it
        const { error: insertCounterError } = await supabaseAdmin
          .from('qr_counter')
          .insert([{
            total_generated: event_type === 'generated' ? 1 : 0,
            total_downloaded: event_type === 'downloaded' ? 1 : 0,
          }]);

        if (insertCounterError) {
          console.error('[qr-events] Counter row INSERT failed:', insertCounterError.message);
        } else {
          rpcOk = true;
          console.log('[qr-events] Created new qr_counter row');
        }
      }
    } else {
      rpcOk = true;
    }

    // ── 2. Insert detailed event row (non-fatal if qr_events not migrated) ───
    const { error: insertError } = await supabaseAdmin.from('qr_events').insert([{
      event_type,
      qr_type: qr_type ?? null,
      export_format: export_format ?? null,
      color_modified: Boolean(color_modified),
      style_modified: Boolean(style_modified),
      frame_modified: Boolean(frame_modified),
      logo_added: Boolean(logo_added),
      text_added: Boolean(text_added),
    }]);

    if (insertError) {
      console.error('[qr-events] qr_events insert failed:', insertError.message, '| code:', insertError.code);
    } else {
      insertOk = true;
    }

    if (!rpcOk && !insertOk) {
      return NextResponse.json({ error: 'All operations failed' }, { status: 500 });
    }

    return NextResponse.json({ success: true, rpcOk, insertOk }, { status: 200 });

  } catch (error) {
    console.error('[qr-events] Unexpected error:', error);
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 });
  }
}
