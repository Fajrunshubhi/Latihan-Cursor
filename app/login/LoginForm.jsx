"use client";

import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BrandMark from "@/components/BrandMark";
import GoogleButton from "@/components/GoogleButton";

export default function LoginForm({ googleEnabled }) {
  const router = useRouter();
  const { status } = useSession();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/home");
    }
  }, [status, router]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
      callbackUrl: "/home",
    });

    setLoading(false);

    if (result?.error) {
      setError("Username atau kata sandi salah.");
      return;
    }

    router.push("/home");
    router.refresh();
  }

  return (
    <main className="auth-shell min-h-screen grid lg:grid-cols-2">
      <section className="relative hidden overflow-hidden border-r border-white/10 p-12 lg:flex lg:flex-col lg:justify-between">
        <BrandMark />
        <div>
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.28em] text-gold-400">
            Aplikasi TicketIn
          </p>
          <h1 className="font-display max-w-xl text-5xl leading-tight text-white">
            Ticketing Event untuk Pemesanan, Pembayaran, dan Validasi Peserta
          </h1>
          <p className="mt-6 max-w-lg text-lg text-white/65">
            Masuk untuk mulai menggunakan aplikasi TicketIn
          </p>
        </div>
        <p className="text-sm text-white/40">Aplikasi TicketIn</p>
      </section>

      <section className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/30 backdrop-blur-md">
          <div className="lg:hidden">
            <BrandMark />
          </div>
          <h2 className="font-display text-3xl text-white">Masuk</h2>
          <p className="mt-2 text-sm text-white/60">
            Gunakan akun Gmail atau username dan kata sandi.
          </p>

          <div className="mt-8">
            <GoogleButton enabled={googleEnabled} />
          </div>

          <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-white/35">
            <span className="h-px flex-1 bg-white/10" />
            atau
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm text-white/70">Username atau email</span>
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-ink/60 px-4 py-3 text-white outline-none ring-gold-500/40 placeholder:text-white/30 focus:ring-2"
                placeholder="..."
                autoComplete="username"
                required
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm text-white/70">Kata sandi</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-ink/60 px-4 py-3 text-white outline-none ring-gold-500/40 placeholder:text-white/30 focus:ring-2"
                placeholder="•••"
                autoComplete="current-password"
                required
              />
            </label>

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
              {loading ? "Memeriksa..." : "Masuk"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-white/60">
            Belum punya akun?{" "}
            <Link href="/register" className="font-semibold text-gold-400 hover:text-gold-50">
              Daftar
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
