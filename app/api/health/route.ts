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
    const rows = (await sql`SELECT COUNT(*)::int AS count FROM users`) as {
      count: number;
    }[];

    return NextResponse.json({
      ok: true,
      storage: "postgres",
      users: rows[0].count,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Database error";
    return NextResponse.json(
      { ok: false, storage: "none", message },
      { status: 500 }
    );
  }
}
