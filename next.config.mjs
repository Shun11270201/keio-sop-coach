/** @type {import('next').NextConfig} */
const nextConfig = {
  // Export to static HTML so it can be hosted anywhere
  output: 'export',
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['lucide-react']
  }
};

export default nextConfig;
