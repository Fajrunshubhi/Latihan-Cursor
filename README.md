# Prototipe Ticketing Event — Login

## Penyebab error Vercel `NO_SECRET`

File `.env.local` **tidak ikut ter-deploy**. NextAuth di production wajib punya `NEXTAUTH_SECRET`.

Di Vercel → project **ticketin** → **Settings** → **Environment Variables**, tambahkan:

| Nama | Nilai |
|---|---|
| `NEXTAUTH_SECRET` | string acak panjang (boleh sama dengan isi `.env.local`) |
| `NEXTAUTH_URL` | `https://ticketin.vercel.app` |
| `DATABASE_URL` | URL PostgreSQL (Neon), mulai `postgresql://...` |

Lalu **Redeploy**.

Tanpa `DATABASE_URL`, daftar di Vercel hanya tersimpan sementara. Agar akun baru permanen, buat database gratis di [Neon](https://neon.tech) lalu tempel connection string ke `DATABASE_URL`.

## Akun uji

| Username | Kata sandi | Peran |
|---|---|---|
| demo | demo123 | Peserta |
| admin | admin123 | Admin |
| fajrunsh | 12345678 | Peserta |

## Lokal

```bash
npm install
npm run dev
```
