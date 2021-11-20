/** @type {import('next').NextConfig} */
const overrides = require("./config/v-act/v-act-config-overrides");

module.exports = {
  reactStrictMode: true,
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    return overrides(config, { buildId, dev, isServer, defaultLoaders, webpack });
  },
  basePath: '/v-act-project-template'
}