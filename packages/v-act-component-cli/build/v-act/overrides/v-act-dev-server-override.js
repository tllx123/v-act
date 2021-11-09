const path = require("path");

/**
 * 生产环境打包排除react和react-dom插件
 * 开发环境将打包入口由src/index.tsx调整为src/runtime.tsx
 * @param {Object} config webpack配置信息
 * @param {String} env 环境信息，枚举值：development(开发环境)、production（生产环境）
 * @returns 
 */
module.exports = function (config, env) {
    if (env == "production") {
        config.externals = {
            "react": "React",
            "react-dom": "ReactDOM"
        };
    } else {
        let entries = config.entry;
        entries = Array.isArray(entries) ? entries : [entries];
        let rootPath = process.cwd();
        let srcIndexPath = path.resolve(rootPath, "src/index.tsx");
        for (let i = 0, l = entries.length; i < l; i++) {
            let entry = entries[i];
            if (entry == srcIndexPath) {
                entries[i] = path.resolve(rootPath, "src/dev/index.tsx");
                break;
            }
        }
        config.entry = entries;
    }
    return config;
}