function withHttps(hostOrUrl) {
  const value = String(hostOrUrl || "").trim().replace(/\/$/, "");
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return `https://${value}`;
}

function isLocalhost(url) {
  return /localhost|127\.0\.0\.1/i.test(url || "");
}

export function getAuthUrl() {
  const production = withHttps(process.env.VERCEL_PROJECT_PRODUCTION_URL);
  const unique = withHttps(process.env.VERCEL_URL);
  const explicit = process.env.NEXTAUTH_URL ? withHttps(process.env.NEXTAUTH_URL) : "";

  if (process.env.VERCEL) {
    if (process.env.VERCEL_ENV === "production" && production) {
      if (!explicit || isLocalhost(explicit) || explicit === unique) {
        return production;
      }
      return explicit;
    }

    if (explicit && !isLocalhost(explicit)) return explicit;
    return unique || production || "http://localhost:3000";
  }

  return explicit || "http://localhost:3000";
}

export function ensureAuthEnv() {
  if (!process.env.NEXTAUTH_SECRET) {
    process.env.NEXTAUTH_SECRET =
      process.env.AUTH_SECRET || "tixora-skripsi-fallback-ganti-di-vercel";
  }

  process.env.NEXTAUTH_URL = getAuthUrl();
}
