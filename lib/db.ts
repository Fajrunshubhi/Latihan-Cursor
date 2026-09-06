import bcrypt from "bcryptjs";
import { neon } from "@neondatabase/serverless";
import type { AppUser, PgUserRow, SeedAccount, UserRole } from "./types";

export const seedAccounts: SeedAccount[] = [
  {
    id: "seed-demo",
    username: "demo",
    email: "demo@event.id",
    name: "Pengguna Demo",
    password: "demo123",
    role: "USER",
  },
  {
    id: "seed-admin",
    username: "admin",
    email: "admin@event.id",
    name: "Admin Tixora",
    password: "admin123",
    role: "ADMIN",
  },
  {
    id: "seed-fajrun",
    username: "fajrunsh",
    email: "fajrunss7@gmail.com",
    name: "Fajrun Shubhi",
    password: "12345678",
    role: "USER",
  },
];

export function usePostgres(): boolean {
  return /^(postgres|postgresql):\/\//i.test(process.env.DATABASE_URL || "");
}

export function assertDatabase(): void {
  if (usePostgres()) return;

  if (process.env.VERCEL) {
    throw new Error(
      "DATABASE_URL PostgreSQL wajib di Vercel. Isi Environment Variables, lalu Redeploy."
    );
  }
}

export function getSql() {
  if (!usePostgres()) {
    throw new Error("DATABASE_URL harus diawali postgresql:// atau postgres://");
  }
  return neon(process.env.DATABASE_URL as string);
}

let postgresReady = false;

export async function ensurePostgres() {
  const sql = getSql();
  if (postgresReady) return sql;

  await sql`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    role TEXT NOT NULL DEFAULT 'USER',
    google_id TEXT UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`;

  for (const account of seedAccounts) {
    const passwordHash = bcrypt.hashSync(account.password, 10);
    await sql`
      INSERT INTO users (id, name, username, email, password_hash, role)
      VALUES (${account.id}, ${account.name}, ${account.username}, ${account.email}, ${passwordHash}, ${account.role})
      ON CONFLICT (username) DO NOTHING
    `;
  }

  postgresReady = true;
  return sql;
}

export function mapPgUser(row: PgUserRow | undefined | null): AppUser | null {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    username: row.username,
    email: row.email,
    passwordHash: row.password_hash,
    role: row.role,
    googleId: row.google_id,
    createdAt: row.created_at,
  };
}

export type { AppUser, UserRole };
