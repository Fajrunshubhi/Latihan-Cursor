import { NextResponse } from "next/server";
import { ensurePostgres, usePostgres } from "@/lib/db";

export async function GET() {
  try {
    if (!usePostgres()) {
      return NextResponse.json({
        ok: true,
        storage: "json",
        hint: "Isi DATABASE_URL postgresql://... agar akun tersimpan di Neon.",
      });
    }

    const sql = await ensurePostgres();
    const rows = await sql`SELECT COUNT(*)::int AS count FROM users`;

    return NextResponse.json({
      ok: true,
      storage: "postgres",
      users: rows[0].count,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, storage: "none", message: error.message },
      { status: 500 }
    );
  }
}
