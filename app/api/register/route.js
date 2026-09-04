import { NextResponse } from "next/server";
import { createUser, emailExists, usernameExists } from "@/lib/users";

export async function POST(request) {
  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    const username = String(body.username || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const confirmPassword = String(body.confirmPassword || "");

    if (!name || !username || !email || !password) {
      return NextResponse.json(
        { message: "Semua kolom wajib diisi." },
        { status: 400 }
      );
    }

    if (username.length < 3) {
      return NextResponse.json(
        { message: "Username minimal 3 karakter." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { message: "Format email tidak valid." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Kata sandi minimal 6 karakter." },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: "Konfirmasi kata sandi tidak sama." },
        { status: 400 }
      );
    }

    if (usernameExists(username)) {
      return NextResponse.json(
        { message: "Username sudah digunakan." },
        { status: 409 }
      );
    }

    if (emailExists(email)) {
      return NextResponse.json(
        { message: "Email sudah terdaftar." },
        { status: 409 }
      );
    }

    createUser({ username, email, name, password });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { message: "Pendaftaran gagal. Coba lagi." },
      { status: 500 }
    );
  }
}
