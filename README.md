# TicketIn — Login Prototipe

Akun disimpan di **PostgreSQL (Neon)**. Tabel `users` dibuat otomatis saat aplikasi pertama kali terhubung.

## 1. Buat database Neon (gratis)

1. Buka [https://console.neon.tech](https://console.neon.tech) lalu daftar/masuk (boleh pakai GitHub).
2. **New Project**
   - Name: `ticketin` (bebas)
   - Region: pilih yang dekat, misalnya **Singapore** atau **Asia**
3. Setelah project siap, buka **Dashboard** → **Connection string**.
4. Pilih **Pooled connection** (ada kata `pooler` di host).
5. Copy URL yang diawali `postgresql://...`

Contoh bentuknya (bukan nilai asli):

```text
postgresql://neondb_owner:xxxx@ep-xxxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
```

## 2. Hubungkan di komputer (lokal)

1. Buka file `.env.local`.
2. Tempel URL Neon ke `DATABASE_URL`:

```env
DATABASE_URL=postgresql://neondb_owner:xxxx@ep-xxxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
```

3. Simpan file, lalu di terminal:

```bash
npm install
npm run db:check
npm run dev
```

`npm run db:check` harus menampilkan `Koneksi PostgreSQL berhasil.`

4. Buka [http://localhost:3000](http://localhost:3000), daftar akun baru.
5. Cek datanya di Neon: project → **Tables** → `users`.

Kalau `DATABASE_URL` masih kosong di lokal, aplikasi sementara memakai `data/users.json`. Di **Vercel** JSON tidak dipakai; database wajib.

## 3. Hubungkan di Vercel

File `.env.local` **tidak ikut ter-upload**. Semua variabel harus diisi di dashboard Vercel.

1. Buka [https://vercel.com](https://vercel.com) → project aplikasi ini.
2. **Settings** → **Environment Variables**.
3. Tambahkan (centang Production, Preview, Development):

| Nama | Nilai |
|---|---|
| `DATABASE_URL` | Connection string Neon yang sama dengan lokal |
| `NEXTAUTH_SECRET` | string acak panjang (boleh sama dengan `.env.local`) |
| `NEXTAUTH_URL` | URL produksi Vercel, contoh `https://NAMA-PROYEK.vercel.app` (tanpa `/` di akhir) |
| `GOOGLE_CLIENT_ID` | dari Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | dari Google Cloud Console |

4. **Deployments** → **...** pada deploy terbaru → **Redeploy**.
5. Setelah live, buka `https://DOMAIN-ANDA.vercel.app/api/health`.
   - Berhasil: `{ "ok": true, "storage": "postgres", "users": ... }`
6. Daftar di situs Vercel, lalu cek lagi tabel `users` di Neon. Baris baru harus muncul.

## 4. Login Gmail di Vercel

Di Google Cloud Console → OAuth client, isi:

- Origin: `https://DOMAIN-ANDA.vercel.app`
- Redirect: `https://DOMAIN-ANDA.vercel.app/api/auth/callback/google`

Pakai domain yang sama dengan `NEXTAUTH_URL`, bukan URL deploy unik (`xxx-xxx.vercel.app`).

## Akun uji (otomatis masuk ke tabel `users`)

| Username | Kata sandi | Peran |
|---|---|---|
| demo | demo123 | Peserta |
| admin | admin123 | Admin |
| fajrunsh | 12345678 | Peserta |

## Perintah lokal

```bash
npm install
npm run db:check
npm run dev
```
