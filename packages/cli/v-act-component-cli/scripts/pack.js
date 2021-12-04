const pack = require("../src/pack");
const utils = require("@v-act/utils");

/**
 * 将插件打包成tgz
 * @returns Promise
 */
 const packPlugin = function (context) {
    return new Promise((resolve, reject) => {
        try {
            pack.packToNodejsPlugin().then((tgzPath)=>{
                context.tgzPath = tgzPath;
                resolve();
            }).catch(err=>{
                reject(err);
            });
        } catch (err) {
            reject(err);
        }
    });
}

/**
 * 生成v3执行系统构件
 * @param {String}} tgzPath 
 */
const toV3ExEBundle = function (context) {
    return new Promise((resolve, reject) => {
        const pluginPath = process.cwd();
        pack.packToV3ExEBundle(null,context.tgzPath,pluginPath).then(()=>{
            resolve();
        }).catch(err=>{
            reject(err);
        });
    });
}

const context = {};

packPlugin(context)
.then(()=>{
    return toV3ExEBundle(context);
}).catch(err=>{
    utils.Console.error(err);
});