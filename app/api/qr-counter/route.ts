import { NextRequest, NextResponse } from 'next/server';
import { sharedDB } from '@/lib/sharedDB';

type PostgresErrorLike = {
  code?: string;
  message?: string;
};

function toSafeNumber(value: unknown): number {
  const n = typeof value === 'bigint' ? Number(value) : Number(value);
  return Number.isFinite(n) ? n : 0;
}

async function getDbInfoSafe() {
  try {
    const result = await sharedDB.query(
      'SELECT current_database() as db, current_schema() as schema, current_user as user',
    );
    return (result.rows[0] as { db?: unknown; schema?: unknown; user?: unknown } | undefined) ?? null;
  } catch {
    return null;
  }
}

async function getServerInfoSafe() {
  try {
    const result = await sharedDB.query(
      'SELECT inet_server_addr()::text as server_addr, inet_server_port() as server_port, version() as version',
    );
    return (
      (result.rows[0] as
        | { server_addr?: unknown; server_port?: unknown; version?: unknown }
        | undefined) ?? null
    );
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const debug =
    process.env.NODE_ENV !== 'production' && request.nextUrl.searchParams.get('debug') === '1';

  try {
    const result = await sharedDB.query(
      'SELECT total_generated, total_downloaded, updated_at::text as updated_at FROM public.qr_counter WHERE id = 1 LIMIT 1',
    );

    const raw = result.rows[0] as
      | { total_generated?: unknown; total_downloaded?: unknown; updated_at?: unknown }
      | undefined;

    const row = {
      total_generated: toSafeNumber(raw?.total_generated ?? 0),
      total_downloaded: toSafeNumber(raw?.total_downloaded ?? 0),
    };

    if (debug) {
      const dbInfo = await getDbInfoSafe();
      const serverInfo = await getServerInfoSafe();
      return NextResponse.json(
        {
          ...row,
          debug: {
            hasRow: Boolean(raw),
            dbInfo,
            serverInfo,
            counter_updated_at: typeof raw?.updated_at === 'string' ? raw.updated_at : null,
            raw_counter: raw ?? null,
          },
        },
        { status: 200 },
      );
    }

    return NextResponse.json(row, { status: 200 });
  } catch (error) {
    const pgErr = error as PostgresErrorLike;
    // SQLSTATE 42P01 = undefined_table (e.g. schema not applied to the DB this app is connected to)
    const msg = pgErr?.message;
    const looksLikeMissingTable =
      typeof msg === 'string' &&
      msg.toLowerCase().includes('relation') &&
      msg.includes('qr_counter') &&
      msg.toLowerCase().includes('does not exist');

    if (pgErr?.code === '42P01' || looksLikeMissingTable) {
      console.error('qr_counter table missing (schema not applied to this DATABASE_URL):', error);

      if (debug) {
        const dbInfo = await getDbInfoSafe();
        return NextResponse.json(
          {
            total_generated: 0,
            total_downloaded: 0,
            debug: {
              reason: 'missing_table',
              code: pgErr?.code ?? null,
              message: pgErr?.message ?? null,
              dbInfo,
            },
          },
          { status: 200 },
        );
      }

      return NextResponse.json(
        { total_generated: 0, total_downloaded: 0 },
        { status: 200 },
      );
    }

    console.error('Error fetching QR counter:', error);
    return NextResponse.json(
      { error: 'Failed to fetch counter' },
      { status: 500 }
    );
  }
}
