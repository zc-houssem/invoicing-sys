/** @type {import('next').NextConfig} */

const { i18n } = require('./next-i18next.config.js');
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  i18n,
  turbopack: {},
  typescript: {
    ignoreBuildErrors: true,
  },

};

module.exports = nextConfig;
