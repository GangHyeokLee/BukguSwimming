/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/auth/:path*',
        destination: 'http://127.0.0.1:3000/auth/:path*', // Flask API 프록시
      },
    ];
  },
};

module.exports = nextConfig;