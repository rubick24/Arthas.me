const stylexPlugin = require('@stylexjs/nextjs-plugin')
// const { fileURLToPath } = require('url')

/** @type {import('next').NextConfig} */
let nextConfig = {
  output: 'export',
  pageExtensions: ['tsx', 'ts', 'jsx', 'js']
}

// const __dirname = fileURLToPath(new URL('.', import.meta.url))
module.exports = stylexPlugin({
  rootDir: __dirname,
  useCSSLayers: true
})(nextConfig)
