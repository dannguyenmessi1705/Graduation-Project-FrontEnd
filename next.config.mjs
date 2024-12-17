/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "minio.forum.didan.id.vn",
        pathname: "/*/*",
      },
    ],
  },
};

export default nextConfig;
