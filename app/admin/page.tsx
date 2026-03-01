import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import AdminLogout from './AdminLogout';

// ─── Types ────────────────────────────────────────────────────────────────────

interface QREvent {
  id: number;
  event_type: 'generated' | 'downloaded';
  qr_type: string | null;
  export_format: string | null;
  color_modified: boolean;
  style_modified: boolean;
  frame_modified: boolean;
  logo_added: boolean;
  text_added: boolean;
  created_at: string;
}

interface Contact {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  created_at: string;
}

interface QRCounter {
  total_generated: number;
  total_downloaded: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function pct(count: number, total: number) {
  if (!total) return 0;
  return Math.round((count / total) * 100);
}

function fmt(ts: string) {
  return new Date(ts).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string | number;
  sub?: string;
  color: string;
}) {
  return (
    <div className={`rounded-2xl border ${color} bg-gray-900/60 p-5`}>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-3xl font-extrabold text-white">{value.toLocaleString()}</p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </div>
  );
}

function BarRow({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const p = pct(count, total);
  return (
    <div className="flex items-center gap-3">
      <span className="w-28 shrink-0 text-sm text-gray-300 capitalize">{label || '—'}</span>
      <div className="flex-1 bg-gray-800 rounded-full h-2 overflow-hidden">
        <div className={`${color} h-2 rounded-full transition-all`} style={{ width: `${p}%` }} />
      </div>
      <span className="w-16 text-right text-sm font-semibold text-gray-300">
        {count.toLocaleString()} <span className="text-gray-500 font-normal">({p}%)</span>
      </span>
    </div>
  );
}

// ─── Page (Server Component) ──────────────────────────────────────────────────

export default async function AdminPage() {
  // ── Auth guard ─────────────────────────────────────────────────────────────
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  if (!session || session.value !== 'authenticated') {
    redirect('/admin/login');
  }

  // ── Fetch data ─────────────────────────────────────────────────────────────
  const [{ data: counterRaw }, { data: eventsRaw }, { data: contactsRaw }] = await Promise.all([
    supabase.from('qr_counter').select('total_generated, total_downloaded').single(),
    supabase
      .from('qr_events')
      .select('id, event_type, qr_type, export_format, color_modified, style_modified, frame_modified, logo_added, text_added, created_at')
      .order('created_at', { ascending: false })
      .limit(5000),
    supabase
      .from('contacts')
      .select('id, name, email, subject, message, created_at')
      .order('created_at', { ascending: false })
      .limit(100),
  ]);

  const counter: QRCounter = counterRaw ?? { total_generated: 0, total_downloaded: 0 };
  const events: QREvent[] = (eventsRaw as QREvent[]) ?? [];
  const contacts: Contact[] = (contactsRaw as Contact[]) ?? [];

  // ── Aggregate events ───────────────────────────────────────────────────────
  const downloads = events.filter((e) => e.event_type === 'downloaded');
  const generated = events.filter((e) => e.event_type === 'generated');
  const totalEvents = events.length;

  // QR type breakdown
  const typeCounts: Record<string, number> = {};
  for (const e of generated) {
    const t = e.qr_type ?? 'unknown';
    typeCounts[t] = (typeCounts[t] ?? 0) + 1;
  }
  const typeEntries = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]);

  // Export format breakdown
  const formatCounts: Record<string, number> = {};
  for (const e of downloads) {
    const f = e.export_format ?? 'unknown';
    formatCounts[f] = (formatCounts[f] ?? 0) + 1;
  }
  const formatEntries = Object.entries(formatCounts).sort((a, b) => b[1] - a[1]);

  // Modification stats (over downloaded events)
  const dl = downloads.length || 1;
  const modStats = [
    { label: 'Colors changed', count: downloads.filter((e) => e.color_modified).length },
    { label: 'Style changed',  count: downloads.filter((e) => e.style_modified).length },
    { label: 'Frame enabled',  count: downloads.filter((e) => e.frame_modified).length },
    { label: 'Logo added',     count: downloads.filter((e) => e.logo_added).length },
    { label: 'Text added',     count: downloads.filter((e) => e.text_added).length },
  ];

  // Conversion rate
  const convRate = counter.total_generated > 0
    ? ((counter.total_downloaded / counter.total_generated) * 100).toFixed(1)
    : '0.0';

  // Daily activity (last 14 days)
  const today = new Date();
  const dayBuckets: Record<string, { gen: number; dl: number }> = {};
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    dayBuckets[key] = { gen: 0, dl: 0 };
  }
  for (const e of events) {
    const key = e.created_at.slice(0, 10);
    if (dayBuckets[key]) {
      if (e.event_type === 'generated') dayBuckets[key].gen++;
      else dayBuckets[key].dl++;
    }
  }
  const maxDayVal = Math.max(...Object.values(dayBuckets).flatMap((b) => [b.gen, b.dl]), 1);

  // Recent events (last 30)
  const recentEvents = events.slice(0, 30);

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/80 sticky top-0 z-20 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-extrabold tracking-tight text-white">QR CODE STUDIO</span>
            <span className="text-xs bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded-full font-semibold">
              Admin
            </span>
          </div>
          <AdminLogout />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* ── Overview Cards ─────────────────────────────────────────────── */}
        <section>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">Overview</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="QRs Generated"
              value={counter.total_generated}
              sub="All-time, from counter"
              color="border-indigo-500/30"
            />
            <StatCard
              label="QRs Downloaded"
              value={counter.total_downloaded}
              sub="All-time, from counter"
              color="border-emerald-500/30"
            />
            <StatCard
              label="Conversion Rate"
              value={`${convRate}%`}
              sub="Downloads ÷ Generated"
              color="border-amber-500/30"
            />
            <StatCard
              label="Contact Submissions"
              value={contacts.length}
              sub={`Up to last 100 shown`}
              color="border-rose-500/30"
            />
          </div>
        </section>

        {/* ── Events Counter vs DB ────────────────────────────────────────── */}
        <section>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
            Detailed Event Log Totals
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <StatCard
              label="Generated Events (log)"
              value={generated.length}
              sub="From qr_events table (up to 5k)"
              color="border-indigo-500/20"
            />
            <StatCard
              label="Download Events (log)"
              value={downloads.length}
              sub="From qr_events table (up to 5k)"
              color="border-emerald-500/20"
            />
          </div>
        </section>

        {/* ── Activity Last 14 Days ──────────────────────────────────────── */}
        <section>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
            Activity — Last 14 Days
          </h2>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 overflow-x-auto">
            <div className="flex items-end gap-1.5 h-32 min-w-[600px]">
              {Object.entries(dayBuckets).map(([date, { gen, dl }]) => (
                <div key={date} className="flex-1 flex flex-col items-center gap-0.5">
                  <div className="flex items-end gap-0.5 h-24 w-full">
                    <div
                      title={`Generated: ${gen}`}
                      className="flex-1 bg-indigo-500/70 rounded-t-sm"
                      style={{ height: `${(gen / maxDayVal) * 100}%`, minHeight: gen > 0 ? '4px' : '0' }}
                    />
                    <div
                      title={`Downloaded: ${dl}`}
                      className="flex-1 bg-emerald-500/70 rounded-t-sm"
                      style={{ height: `${(dl / maxDayVal) * 100}%`, minHeight: dl > 0 ? '4px' : '0' }}
                    />
                  </div>
                  <span className="text-[9px] text-gray-600 whitespace-nowrap">
                    {date.slice(5)}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-3">
              <span className="flex items-center gap-1.5 text-xs text-gray-400">
                <span className="w-3 h-3 rounded-sm bg-indigo-500/70 inline-block" /> Generated
              </span>
              <span className="flex items-center gap-1.5 text-xs text-gray-400">
                <span className="w-3 h-3 rounded-sm bg-emerald-500/70 inline-block" /> Downloaded
              </span>
            </div>
          </div>
        </section>

        {/* ── Two Column: Type & Format ──────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* QR Type Breakdown */}
          <section className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
              QR Type Breakdown (Generated)
            </h2>
            <div className="space-y-3">
              {typeEntries.length === 0 ? (
                <p className="text-sm text-gray-600 italic">No data yet.</p>
              ) : (
                typeEntries.map(([type, count]) => (
                  <BarRow
                    key={type}
                    label={type}
                    count={count}
                    total={generated.length}
                    color="bg-indigo-500"
                  />
                ))
              )}
            </div>
          </section>

          {/* Export Format Breakdown */}
          <section className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
              Export Format Breakdown (Downloaded)
            </h2>
            <div className="space-y-3">
              {formatEntries.length === 0 ? (
                <p className="text-sm text-gray-600 italic">No download data yet.</p>
              ) : (
                formatEntries.map(([fmt, count]) => (
                  <BarRow
                    key={fmt}
                    label={fmt.toUpperCase()}
                    count={count}
                    total={downloads.length}
                    color="bg-emerald-500"
                  />
                ))
              )}
            </div>
          </section>
        </div>

        {/* ── Modification Stats ─────────────────────────────────────────── */}
        <section className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">
            Customisation Usage
          </h2>
          <p className="text-xs text-gray-600 mb-4">
            % of downloaded QR codes that had each feature applied (out of {downloads.length} downloads)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {modStats.map((m) => (
              <div key={m.label} className="bg-gray-800/60 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300">{m.label}</span>
                  <span className="text-sm font-bold text-white">{pct(m.count, dl)}%</span>
                </div>
                <div className="bg-gray-700 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-amber-400 h-1.5 rounded-full"
                    style={{ width: `${pct(m.count, dl)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-1">{m.count} / {downloads.length}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Recent Events ──────────────────────────────────────────────── */}
        <section>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
            Recent Events (last 30)
          </h2>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800 text-xs text-gray-500 uppercase tracking-wider">
                    <th className="text-left px-4 py-3">Type</th>
                    <th className="text-left px-4 py-3">QR Type</th>
                    <th className="text-left px-4 py-3">Format</th>
                    <th className="text-left px-4 py-3">Mods</th>
                    <th className="text-left px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentEvents.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-gray-600 italic">
                        No events yet.
                      </td>
                    </tr>
                  ) : (
                    recentEvents.map((e) => (
                      <tr key={e.id} className="border-b border-gray-800/60 hover:bg-gray-800/30 transition">
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                              e.event_type === 'downloaded'
                                ? 'bg-emerald-900/50 text-emerald-400'
                                : 'bg-indigo-900/50 text-indigo-400'
                            }`}
                          >
                            {e.event_type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-300 capitalize">{e.qr_type ?? '—'}</td>
                        <td className="px-4 py-3 text-gray-400 uppercase">{e.export_format ?? '—'}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1 flex-wrap">
                            {e.color_modified  && <Tag color="violet" label="🎨 color" />}
                            {e.style_modified  && <Tag color="blue"   label="⬡ style" />}
                            {e.frame_modified  && <Tag color="orange" label="◻ frame" />}
                            {e.logo_added      && <Tag color="pink"   label="🖼 logo" />}
                            {e.text_added      && <Tag color="teal"   label="T text" />}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{fmt(e.created_at)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── Contact Submissions ────────────────────────────────────────── */}
        <section>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
            Contact Submissions (last 100)
          </h2>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800 text-xs text-gray-500 uppercase tracking-wider">
                    <th className="text-left px-4 py-3">Name</th>
                    <th className="text-left px-4 py-3">Email</th>
                    <th className="text-left px-4 py-3">Subject</th>
                    <th className="text-left px-4 py-3">Message</th>
                    <th className="text-left px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-gray-600 italic">
                        No contact submissions yet.
                      </td>
                    </tr>
                  ) : (
                    contacts.map((c) => (
                      <tr key={c.id} className="border-b border-gray-800/60 hover:bg-gray-800/30 transition">
                        <td className="px-4 py-3 text-gray-200 font-medium whitespace-nowrap">{c.name}</td>
                        <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                          <a href={`mailto:${c.email}`} className="hover:text-white transition">
                            {c.email}
                          </a>
                        </td>
                        <td className="px-4 py-3 text-gray-400">{c.subject ?? '—'}</td>
                        <td className="px-4 py-3 text-gray-500 max-w-xs truncate" title={c.message}>
                          {c.message}
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{fmt(c.created_at)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <footer className="border-t border-gray-800 pt-6 text-center text-xs text-gray-700 pb-10">
          QR Code Studio Admin Panel · Data is anonymous usage metadata · No QR content or user identifiers stored
        </footer>
      </main>
    </div>
  );
}

// ─── Tiny Tag helper ─────────────────────────────────────────────────────────
function Tag({ label, color }: { label: string; color: string }) {
  const cls: Record<string, string> = {
    violet: 'bg-violet-900/40 text-violet-400',
    blue:   'bg-blue-900/40 text-blue-400',
    orange: 'bg-orange-900/40 text-orange-400',
    pink:   'bg-pink-900/40 text-pink-400',
    teal:   'bg-teal-900/40 text-teal-400',
  };
  return (
    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${cls[color] ?? ''}`}>
      {label}
    </span>
  );
}
