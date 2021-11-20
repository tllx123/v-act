const utils = require("@v-act/utils");
const vActBundle = require("@v-act/bundle");
const p = require("path");

/**
 * 将插件打包成tgz
 * @returns Promise
 */
 const packToNodejsPlugin = function () {
    return new Promise((resolve, reject) => {
        try {
            utils.Console.log("开始打包VAct插件");
            const pluginPath = process.cwd();
            vActBundle.clearPluginTgz(pluginPath).then(() => {
                vActBundle.clearV3ExEBundle(pluginPath).then(()=>{
                    vActBundle.packPluginTgz(pluginPath).then((tgzPath) => {
                        utils.Console.log("VAct插件打包完成");
                        resolve(tgzPath);
                    }).catch(err => {
                        reject(err);
                    });
                }).catch(err=>{
                    reject(err);
                });
            }).catch(err => {
                reject(err);
            });
        } catch (err) {
            reject(err);
        }
    });
}

/**
 * 生成v3执行系统构件
 * @param {String} tgzPath 
 * @param {Boolean} isProject 是否打包项目
 */
const packToV3ExEBundle = function(account,tgzPath,distDir, isProject){
    return new Promise((resolve, reject) => {
        utils.Console.log("开始生成平台应用服务构件");
        const pluginPath = process.cwd();
        const packageJson = require(p.resolve(pluginPath, "package.json"));
        const pluginCode = utils.String.enhancePluginName(packageJson.name);
        const pluginVersion = packageJson.version;
        let vactComponent;
        let resources;
        if(isProject === true){
            resources = vActBundle.getExportFiles(distDir);
            const resourceObjs = resources.map((resource)=>{
                const entryPath = vActBundle.genEntryPath(pluginCode, pluginPath, resource);
                return vActBundle.createFileResource(entryPath, resource);
            })
            vactComponent = new vActBundle.VActProjectBundle(null, pluginCode, pluginVersion, account, tgzPath, resourceObjs);
        }else{
            vactComponent = new vActBundle.VActComponentBundle(null, pluginCode, pluginVersion, account, tgzPath);
        }
        const symbolicName = vactComponent.getSymblicName();
        const promise = vActBundle.persistence(vactComponent, distDir);
        promise.then((jarPath) => {
            vActBundle.clearPluginTgz(pluginPath).then(() => {
                const handle = ()=>{
                    utils.Console.log("平台应用服务构件生成完成");
                    resolve({
                        jarPath,
                        pluginCode,
                        symbolicName,
                        pluginVersion
                    });
                }
                if(resources && resources.length > 0){
                    vActBundle.clearExportFile(distDir).then(resolve).catch(reject);
                }else{
                    handle();
                }
            }).catch(err => {
                reject(err);
            });
        }).catch(err => {
            reject(err);
        });
    });
}

module.exports = {
    packToNodejsPlugin,
    packToV3ExEBundle
};