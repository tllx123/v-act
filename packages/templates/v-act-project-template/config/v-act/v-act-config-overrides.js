const requireAll = require("require-all");
const extraOverride = require("../v-act-project-config-overrides");

function addVactLoader(config){
  const {rules} = config.module;
  if(!rules){
    rules = [];
  }
  config.module.rules = [{
      test:/index\.[t|j]s[x]?/,
      use:"@v-act/loader"
  }].concat(rules);
}

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
  // addVactLoader(config);
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
  config = extraOverride(config, {
    buildId,
    dev,
    isServer,
    defaultLoaders,
    webpack
  });
  return config;
}