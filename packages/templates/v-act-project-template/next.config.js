/** @type {import('next').NextConfig} */
const overrides = require("./config/v-act/v-act-config-overrides");
//基础配置
const config = {
  reactStrictMode: true,
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    return overrides(config, { buildId, dev, isServer, defaultLoaders, webpack });
  }
}
//判断当前执行的命令 start 暂不加basepath
const action = process.argv && process.argv[2];
if(action === "export"){//如果是导出，则添加项目名称作为根路径
  const packageJson = require('./package.json');
  const projectName = (packageJson.name || "").replace("@","").replace(/\//g, "-");
  config.basePath = "/" + projectName;
}
module.exports = config;