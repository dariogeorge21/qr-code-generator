import 'server-only';

import { Pool } from '@neondatabase/serverless';

type Queryable = {
  query: (text: string, params?: unknown[]) => Promise<{ rows: unknown[] }>;
};

let pool: Pool | null = null;

function getPool() {
  if (pool) return pool;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    // Don't throw at import-time: Next.js may evaluate route modules during build.
    // We fail at request-time instead, with a clearer error.
    throw new Error('Missing DATABASE_URL environment variable');
  }

  pool = new Pool({ connectionString });
  return pool;
}

export const sharedDB = {
  query(text: string, params?: unknown[]) {
    return getPool().query(text, params as unknown[] | undefined);
  },

  /**
   * Runs a function in a transaction and provides a query-capable client.
   * Use this for multi-step operations where partial failure should be handled.
   */
  async tx<T>(fn: (client: Queryable) => Promise<T>): Promise<T> {
    const client = await getPool().connect();
    try {
      await client.query('BEGIN');
      const result = await fn(client);
      await client.query('COMMIT');
      return result;
    } catch (err) {
      try {
        await client.query('ROLLBACK');
      } catch {
        // ignore rollback errors
      }
      throw err;
    } finally {
      client.release();
    }
  },
};
