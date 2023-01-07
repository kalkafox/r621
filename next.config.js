/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // optimizations
  future: {
    webpack5: true,
  },
  experimental: {
    optimizeFonts: true,
    optimizeImages: true,
    optimizeCss: true,
    scrollRestoration: true,
    sprFlushToDisk: false,
  },

  // images

  images: {
    domains: ["static1.e621.net"],
    unoptimized: true,
  }
}

module.exports = nextConfig
