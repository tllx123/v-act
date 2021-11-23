const requireAll = require("require-all");
const fs = require("fs");
const extraOverride = require("../v-act-project-config-overrides");

/**
 * 添加webpack额外配置
 * 注意：请不要调整此代码，如需添加webpack配置，请在v3-project-config-overrides.js中添加
 * */
module.exports = function (config, {
  buildId,
  dev,
  isServer,
  defaultLoaders,
  webpack
}) {
  if (fs.existsSync(__dirname + "/overrides")) {
    let overrides = requireAll({
      dirname: __dirname + "/overrides",
      recursive: true
    });
    if (overrides) {
      Object.values(overrides).forEach(function (handlers) {
        handlers = Array.isArray(handlers) ? handlers : [handlers];
        if (handlers && handlers.length > 0) {
          handlers.forEach(handler => {
            config = handler(config, env);
          });
        }
      });
    }
  }
  config = extraOverride(config, {
    buildId,
    dev,
    isServer,
    defaultLoaders,
    webpack
  });
  return config;
}