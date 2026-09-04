# Prototipe Ticketing Event — Halaman Login

Aplikasi Next.js (Node.js) untuk prototipe ticketing event. Tahap ini hanya mencakup autentikasi: masuk, daftar, beranda, dan keluar.

## Menjalankan di komputer

1. Salin file lingkungan:

```bash
copy .env.example .env.local
```

2. Isi `NEXTAUTH_SECRET` dengan string acak.
3. Instal dan jalankan:

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

Akun uji: **demo** / **demo123**

## Login Gmail (opsional)

1. Buat kredensial OAuth di [Google Cloud Console](https://console.cloud.google.com/).
2. Authorized redirect URI:

- Lokal: `http://localhost:3000/api/auth/callback/google`
- Vercel: `https://NAMA-PROYEK.vercel.app/api/auth/callback/google`

3. Isi `GOOGLE_CLIENT_ID` dan `GOOGLE_CLIENT_SECRET` di `.env.local` (dan di pengaturan Environment Variables Vercel).

## Deploy Vercel

Set variabel:

- `NEXTAUTH_URL` = URL Vercel, contoh `https://NAMA-PROYEK.vercel.app`
- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID` dan `GOOGLE_CLIENT_SECRET` (jika memakai Gmail)

Catatan: pendaftaran username/password disimpan di `data/users.json`. Di Vercel filesystem tidak persisten, jadi login Gmail lebih andal untuk demo online. Lokal, pendaftaran berfungsi penuh.
