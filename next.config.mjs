import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const projectRoot = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Pin tracing to this project (a stray lockfile in $HOME otherwise confuses Next).
  outputFileTracingRoot: projectRoot,
};

export default nextConfig;
