/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingIncludes: {
      '/api/admin/products/import': ['./public/catalog-2026-10/**/*']
    }
  },
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
