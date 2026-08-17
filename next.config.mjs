/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.argv.includes('dev') ? '.next/dev' : '.next',
};

export default nextConfig;
