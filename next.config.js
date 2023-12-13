const stylexPlugin = require('@stylexjs/nextjs-plugin')
// const { fileURLToPath } = require('url')

/** @type {import('next').NextConfig} */
let nextConfig = {
  pageExtensions: ['tsx', 'ts', 'jsx', 'js']
}

const babelrc = require('./.babelrc.js')
const plugins = babelrc.plugins
const [_name, options] = plugins.find(plugin => Array.isArray(plugin) && plugin[0] === '@stylexjs/babel-plugin')
// const __dirname = fileURLToPath(new URL('.', import.meta.url))
const rootDir = options.unstable_moduleResolution.rootDir ?? __dirname
module.exports = stylexPlugin({
  rootDir,
  useCSSLayers: true
})(nextConfig)
