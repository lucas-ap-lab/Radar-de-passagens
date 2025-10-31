/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    AMADEUS_API_KEY: process.env.AMADEUS_API_KEY,
    AMADEUS_API_SECRET: process.env.AMADEUS_API_SECRET,
  },
};

module.exports = nextConfig;
