"use client";

import type { ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BrandMark from "@/components/BrandMark";
import GoogleButton from "@/components/GoogleButton";

type RegisterForm = {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const initialForm: RegisterForm = {
  name: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function RegisterPage() {
  const router = useRouter();
  const { status } = useSession();
  const [form, setForm] = useState<RegisterForm>(initialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/home");
    }
  }, [status, router]);

  function updateField(field: keyof RegisterForm) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = (await response.json().catch(() => ({}))) as { message?: string };

    if (!response.ok) {
      setLoading(false);
      setError(data.message || "Pendaftaran gagal.");
      return;
    }

    const result = await signIn("credentials", {
      username: form.username,
      password: form.password,
      redirect: false,
      callbackUrl: "/home",
    });

    setLoading(false);

    if (result?.error) {
      setError(
        "Akun berhasil dibuat, tetapi login otomatis gagal. Buka halaman Masuk dan gunakan username serta kata sandi yang baru saja didaftarkan."
      );
      return;
    }

    router.push("/home");
    router.refresh();
  }

  return (
    <main className="auth-shell flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/30 backdrop-blur-md">
        <BrandMark />
        <h1 className="font-display text-3xl text-white">Buat akun</h1>
        <p className="mt-2 text-sm text-white/60">
          Daftar dengan Gmail atau isi formulir di bawah, lalu lanjut ke beranda.
        </p>

        <div className="mt-8">
          <GoogleButton />
        </div>

        <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-white/35">
          <span className="h-px flex-1 bg-white/10" />
          atau
          <span className="h-px flex-1 bg-white/10" />
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <label className="block">
            <span className="mb-2 block text-sm text-white/70">Nama lengkap</span>
            <input
              value={form.name}
              onChange={updateField("name")}
              className="w-full rounded-xl border border-white/10 bg-ink/60 px-4 py-3 text-white outline-none ring-gold-500/40 placeholder:text-white/30 focus:ring-2"
              placeholder="Nama Anda"
              required
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-white/70">Username</span>
            <input
              value={form.username}
              onChange={updateField("username")}
              className="w-full rounded-xl border border-white/10 bg-ink/60 px-4 py-3 text-white outline-none ring-gold-500/40 placeholder:text-white/30 focus:ring-2"
              placeholder="username"
              autoComplete="username"
              required
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-white/70">Email</span>
            <input
              type="email"
              value={form.email}
              onChange={updateField("email")}
              className="w-full rounded-xl border border-white/10 bg-ink/60 px-4 py-3 text-white outline-none ring-gold-500/40 placeholder:text-white/30 focus:ring-2"
              placeholder="nama@gmail.com"
              autoComplete="email"
              required
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm text-white/70">Kata sandi</span>
              <input
                type="password"
                value={form.password}
                onChange={updateField("password")}
                className="w-full rounded-xl border border-white/10 bg-ink/60 px-4 py-3 text-white outline-none ring-gold-500/40 placeholder:text-white/30 focus:ring-2"
                placeholder="Minimal 6 karakter"
                autoComplete="new-password"
                required
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm text-white/70">Konfirmasi</span>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={updateField("confirmPassword")}
                className="w-full rounded-xl border border-white/10 bg-ink/60 px-4 py-3 text-white outline-none ring-gold-500/40 placeholder:text-white/30 focus:ring-2"
                placeholder="Ulangi kata sandi"
                autoComplete="new-password"
                required
              />
            </label>
          </div>

          {error && (
            <p className="rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gold-500 px-4 py-3 font-semibold text-ink transition hover:bg-gold-400 disabled:opacity-60"
          >
            {loading ? "Membuat akun..." : "Daftar"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/60">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-semibold text-gold-400 hover:text-gold-50">
            Masuk
          </Link>
        </p>
      </div>
    </main>
  );
}
