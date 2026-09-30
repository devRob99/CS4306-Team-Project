/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js 16 otherwise writes AGENTS.md / CLAUDE.md on `npm run dev`.
  agentRules: false,
};

export default nextConfig;
