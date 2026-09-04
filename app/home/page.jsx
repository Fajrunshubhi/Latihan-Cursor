import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import BrandMark from "@/components/BrandMark";
import LogoutButton from "@/components/LogoutButton";
import { authOptions } from "@/lib/auth";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const displayName = session.user?.name || session.user?.username || "Pengguna";
  const loginMethod =
    session.user?.loginMethod === "google" ? "Gmail" : "username & kata sandi";

  return (
    <main className="auth-shell min-h-screen">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <BrandMark compact />
        <LogoutButton />
      </header>

      <section className="mx-auto w-full max-w-6xl px-6 pb-16">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 md:p-12">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-gold-400">
            Beranda prototipe
          </p>
          <h1 className="font-display mt-4 max-w-3xl text-4xl text-white md:text-5xl">
            Selamat datang, {displayName}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/65">
            Anda berhasil masuk ke aplikasi ticketing event. Fitur pemesanan tiket,
            pembayaran, dan validasi peserta akan ditambahkan pada tahap berikutnya.
          </p>
          <dl className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-ink/40 p-5">
              <dt className="text-sm text-white/45">Email</dt>
              <dd className="mt-1 text-white">{session.user?.email || "-"}</dd>
            </div>
            <div className="rounded-2xl border border-white/10 bg-ink/40 p-5">
              <dt className="text-sm text-white/45">Metode masuk</dt>
              <dd className="mt-1 capitalize text-white">{loginMethod}</dd>
            </div>
          </dl>
        </div>
      </section>
    </main>
  );
}
