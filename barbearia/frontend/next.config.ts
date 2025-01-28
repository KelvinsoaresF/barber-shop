import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async headers() {
      return [
          {
              source: '/api/:path*',
              headers: [
                  { key: 'Access-Control-Allow-Credentials', value: 'true' },
                  { key: 'Access-Control-Allow-Origin', value: 'http://localhost:3000' },
                  { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
                  { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, Authorization' },
              ],
          },
      ];
  },
};

export default nextConfig;
