export function ensureAuthEnv() {
  if (!process.env.NEXTAUTH_SECRET) {
    process.env.NEXTAUTH_SECRET =
      process.env.AUTH_SECRET || "tixora-skripsi-fallback-ganti-di-vercel";
  }

  if (!process.env.NEXTAUTH_URL) {
    if (process.env.VERCEL_URL) {
      process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`;
    } else {
      process.env.NEXTAUTH_URL = "http://localhost:3000";
    }
  }
}
