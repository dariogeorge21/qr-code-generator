import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for your tables
export interface Contact {
  id?: number;
  name: string;
  email: string;
  subject?: string;
  message: string;
  created_at?: string;
}

export interface QRCounter {
  id?: number;
  total_generated: number;
  total_downloaded: number;
  updated_at?: string;
}

// Helper functions
export async function submitContact(contact: Contact) {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .insert([contact])
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error submitting contact:', error);
    return { success: false, error };
  }
}

export async function getQRCounter(): Promise<QRCounter | null> {
  try {
    const { data, error } = await supabase
      .from('qr_counter')
      .select('*')
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching QR counter:', error);
    return null;
  }
}

export async function incrementQRGenerated() {
  try {
    const { data, error } = await supabase.rpc('increment_qr_generated');
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error incrementing QR generated:', error);
    return { success: false, error };
  }
}

export async function incrementQRDownloaded() {
  try {
    const { data, error } = await supabase.rpc('increment_qr_downloaded');
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error incrementing QR downloaded:', error);
    return { success: false, error };
  }
}

// ── Detailed event analytics (privacy-safe: no QR content stored) ──────────

export interface QREvent {
  event_type: 'generated' | 'downloaded';
  qr_type?: string;       // 'website' | 'payment' | 'wifi' | 'text' | etc.
  export_format?: string; // 'png' | 'svg' | 'jpeg' | 'webp'
  color_modified?: boolean;
  style_modified?: boolean;
  frame_modified?: boolean;
  logo_added?: boolean;
  text_added?: boolean;
}

export async function logQREvent(event: QREvent) {
  try {
    const { error } = await supabase.from('qr_events').insert([{
      event_type: event.event_type,
      qr_type: event.qr_type ?? null,
      export_format: event.export_format ?? null,
      color_modified: event.color_modified ?? false,
      style_modified: event.style_modified ?? false,
      frame_modified: event.frame_modified ?? false,
      logo_added: event.logo_added ?? false,
      text_added: event.text_added ?? false,
    }]);
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error logging QR event:', error);
    return { success: false, error };
  }
}
