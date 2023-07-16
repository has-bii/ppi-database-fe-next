/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ui-avatars.com",
        port: "",
        pathname: "/api/**",
      },
      {
        protocol: process.env.NEXT_API_URL_PROTOCOL,
        hostname: process.env.NEXT_API_HOSTNAME,
        port: "",
        pathname: "/storage/photos/**",
      },
    ],
  },
};

module.exports = nextConfig;
