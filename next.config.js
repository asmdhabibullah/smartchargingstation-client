/** @type {import('next').NextConfig} */
require("dotenv");

const nextConfig = {
  reactStrictMode: true,
  env: {
    ENDPOINT: process.env.URI || "http://localhost:4500"
  },
  future: {
    webpack5: true,
  }
}

module.exports = nextConfig
