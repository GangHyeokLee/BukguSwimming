import type { NextConfig } from 'next'

// Next.js embeds NEXT_PUBLIC_* and rewrite destinations at build time.
// Keep the same origin for browser rewrites and server-side Axios requests.
const backend = process.env.NEXT_PUBLIC_BACKEND_URL

if (!backend) {
  throw new Error('NEXT_PUBLIC_BACKEND_URL is required (for example http://localhost:8000)')
}

const backendUrl = new URL(backend)
if (
  !['http:', 'https:'].includes(backendUrl.protocol) ||
  backendUrl.username || backendUrl.password ||
  backend !== backendUrl.origin
) {
  throw new Error('NEXT_PUBLIC_BACKEND_URL must be an HTTP(S) origin without credentials, path, query, or trailing slash')
}

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    'api-bgswim.bnecloud.co.kr',
    'bgswim.bnecloud.co.kr',
  ],
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/api/bukguswim/v1/:path*',
        destination: `${backend}/api/v1/:path*`,
      },
      {
        source: '/api/bukguswim/v2/:path*',
        destination: `${backend}/api/v2/:path*`,
      },
    ]
  },
}

export default nextConfig
