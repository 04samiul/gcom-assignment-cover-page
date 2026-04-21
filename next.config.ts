import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Required for @react-pdf/renderer (canvas dependency)
  webpack: (config) => {
    config.resolve.alias.canvas = false
    return config
  },
  // Transpile react-pdf packages for Next.js compatibility
  transpilePackages: ['@react-pdf/renderer'],
}

export default nextConfig
