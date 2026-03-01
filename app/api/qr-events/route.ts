import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * POST /api/qr-events
 *
 * Logs a QR event with anonymous metadata.
 * NEVER stores the actual QR content, URL, or any personal data.
 *
 * Body shape:
 *   event_type:     'generated' | 'downloaded'  (required)
 *   qr_type:        string                       (optional — website, payment, wifi …)
 *   export_format:  string                       (optional — png, svg, jpeg, webp)
 *   color_modified: boolean
 *   style_modified: boolean
 *   frame_modified: boolean
 *   logo_added:     boolean
 *   text_added:     boolean
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

    // 1. Insert detailed event (no QR content stored)
    const { error: insertError } = await supabase.from('qr_events').insert([{
      event_type,
      qr_type: qr_type ?? null,
      export_format: export_format ?? null,
      color_modified: Boolean(color_modified),
      style_modified: Boolean(style_modified),
      frame_modified: Boolean(frame_modified),
      logo_added: Boolean(logo_added),
      text_added: Boolean(text_added),
    }]);

    if (insertError) throw insertError;

    // 2. Increment the running counter in qr_counter via the existing RPC
    const rpcName =
      event_type === 'generated' ? 'increment_qr_generated' : 'increment_qr_downloaded';
    const { error: rpcError } = await supabase.rpc(rpcName);
    if (rpcError) {
      // Non-fatal — counter might be stale but event is recorded
      console.error('RPC counter increment failed:', rpcError);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error logging QR event:', error);
    return NextResponse.json({ error: 'Failed to log event' }, { status: 500 });
  }
}
