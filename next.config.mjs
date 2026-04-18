/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ["http://10.10.20.38:3000", "http://10.10.20.38:3001", "http://10.10.20.38:3002", "http://10.10.20.38:3003", "http://10.10.20.38:3004"],
}

export default nextConfig