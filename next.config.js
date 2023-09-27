/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
  },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  async headers() {
    const origin = process.env.FRONTEND_STORE_URL || "http://localhost:3001";
    console.log("origin", origin);

    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "*",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
