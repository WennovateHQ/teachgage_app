/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost', 'teachgage.com'],
    unoptimized: true
  },
  env: {
    // Next-Auth Configuration
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'your-secret-key',
    
    // API Configuration
    // NEXT_PUBLIC_API_URL is automatically exposed to client-side but included here for clarity
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
    BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:5000'
  }
}

module.exports = nextConfig
