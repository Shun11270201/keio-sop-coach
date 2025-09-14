/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use default serverless output to support API Routes (GPT scoring)
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['lucide-react']
  }
};

export default nextConfig;
