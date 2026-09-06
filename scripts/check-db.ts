import { neon } from "@neondatabase/serverless";

async function main() {
  const url = process.env.DATABASE_URL || "";

  if (!/^(postgres|postgresql):\/\//i.test(url)) {
    console.error(
      "DATABASE_URL belum diisi atau bukan PostgreSQL.\nIsi .env.local dengan connection string Neon (postgresql://...)."
    );
    process.exit(1);
  }

  const sql = neon(url);

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
  const rows = (await sql`SELECT COUNT(*)::int AS count FROM users`) as {
    count: number;
  }[];
  console.log("Koneksi PostgreSQL berhasil.");
  console.log(`Tabel users siap. Jumlah baris saat ini: ${rows[0].count}`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error("Gagal terhubung ke database:", message);
  process.exit(1);
});
