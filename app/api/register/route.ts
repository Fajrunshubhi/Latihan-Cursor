import { NextResponse } from "next/server";
import { createUser, emailExists, usernameExists } from "@/lib/users";

type RegisterBody = {
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RegisterBody;
    const name = String(body.name || "").trim();
    const username = String(body.username || "").trim().toLowerCase();
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

    if (!/^[a-z0-9._-]+$/.test(username)) {
      return NextResponse.json(
        { message: "Username hanya boleh huruf, angka, titik, underscore, atau strip." },
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

    if (await usernameExists(username)) {
      return NextResponse.json(
        { message: "Username sudah digunakan." },
        { status: 409 }
      );
    }

    if (await emailExists(email)) {
      return NextResponse.json(
        { message: "Email sudah terdaftar." },
        { status: 409 }
      );
    }

    await createUser({ username, email, name, password, role: "USER" });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("REGISTER_ERROR", error);
    const message =
      error instanceof Error
        ? error.message
        : "Pendaftaran gagal. Isi DATABASE_URL PostgreSQL (Neon) di .env.local dan di Vercel.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
