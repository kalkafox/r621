/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // optimizations
  future: {
    webpack5: true,
  },
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
    workerThreads: true,
    nextScriptWorkers: true,
  },

  // images

  images: {
    domains: ["static1.e621.net"],
    unoptimized: true,
  }
}

module.exports = nextConfig
