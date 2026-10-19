import { DatabaseSync, type SQLInputValue } from 'node:sqlite';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

// Test-only stand-in for Cloudflare D1, backed by Node's built-in SQLite and
// set up by running the real migrations. Implements only what the API uses.

class Statement {
  constructor(
    private db: DatabaseSync,
    private sql: string,
    private params: SQLInputValue[] = [],
  ) {}
  bind(...params: unknown[]) {
    return new Statement(this.db, this.sql, params as SQLInputValue[]);
  }
  async run() {
    this.db.prepare(this.sql).run(...this.params);
    return { success: true };
  }
  async all<T>() {
    return { results: this.db.prepare(this.sql).all(...this.params) as T[] };
  }
  async first<T>() {
    return (this.db.prepare(this.sql).get(...this.params) as T | undefined) ?? null;
  }
}

export function testDb() {
  const db = new DatabaseSync(':memory:');
  const dir = join(import.meta.dirname, 'migrations');
  for (const f of readdirSync(dir).sort()) db.exec(readFileSync(join(dir, f), 'utf8'));
  const d1 = {
    prepare: (sql: string) => new Statement(db, sql),
    batch: async (stmts: Statement[]) => Promise.all(stmts.map((s) => s.run())),
  };
  return { d1: d1 as unknown as D1Database, raw: db };
}
