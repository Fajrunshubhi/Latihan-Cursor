import { ensureAuthEnv } from "./lib/env.js";

ensureAuthEnv();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
