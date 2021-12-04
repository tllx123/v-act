import * as decompress from "decompress";
import * as p from "path";
const decompressFile = require('decompress');
import { existsSync } from "fs";
import { Path, Console, IO } from "@v-act/utils";
import { execSync } from "child_process";
import { basename, resolve } from "path";
import { chooseInstallType, inputInstallType } from './PromptInstallType'
import * as fs from "fs";

/**
 * 批量安装
 */
class TGZPluginsInstaller {

    tgzPaths: Array<string> = [];
    actNames: Array<string> = [];
    constructor(tgzPaths: Array<string>) {
        this.tgzPaths = tgzPaths;
    }

    install(): Promise<void> {
        return new Promise((resolve, reject) => {
            this._check().then(() => {
                return this._genActNames();
            }).then(async () => {

                const pluginPath = process.cwd()
                const yarnPath = p.resolve(pluginPath, "yarn.lock");
                const npmPath = p.resolve(pluginPath, "package-lock.json");

                let isYarnPath = false
                let isNpmPath = false

                if (fs.existsSync(yarnPath)) {
                    isYarnPath = true
                }
                if (fs.existsSync(npmPath)) {
                    isNpmPath = true
                }

                let installType: any = ""
                if (isYarnPath && isNpmPath) {
                    installType = await chooseInstallType()
                } else if (isYarnPath) {
                    installType = "yarn"
                } else if (isNpmPath) {
                    installType = "npm"
                } else if (!(isYarnPath && isNpmPath)) {
                    installType = await inputInstallType()
                }


                return this._installNodejsPlugins(installType)
            }).then(() => {
                resolve();
            }).catch(err => {
                reject(err);
            });


        });
    }



    _genActNames(): Promise<void> {
        return new Promise((resolve, reject) => {
            const actNames: Array<string> = [];
            const promises: Array<Promise<void>> = [];
            this.tgzPaths.forEach(tgzPath => {
                promises.push(new Promise<void>((reso, rej) => {
                    this._getVActNameFromTgzPath(tgzPath).then((actName) => {
                        actNames.push(actName);
                        reso();
                    }).catch(err => {
                        rej(err);
                    });
                }));
            });
            Promise.all(promises).then(() => {
                this.actNames = actNames;
                resolve();
            }).catch(err => {
                reject(err);
            });
        });
    }

    _check(): Promise<void> {
        return new Promise((resolve, reject) => {
            for (let index = 0; index < this.tgzPaths.length; index++) {
                const tgzPath = this.tgzPaths[index];
                if (!existsSync(tgzPath)) {
                    return reject(Error("插件不存在！路径：" + tgzPath));
                }
            }
            resolve();
        });
    }

    /**
    * 从本地文件安装
    * @param absPath 绝对路径
    * @returns 
    */
    _installNodejsPlugins(installType: string): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                let scripts: Array<string> = [];
                installType = installType.toLowerCase().replace(/\s*/g,"")
               if (installType == "yarn" || installType=="yarnadd") {
                    if (this.tgzPaths.length == 0) {
                        scripts = ["yarn"]
                    } else {
                        scripts = ["yarn", "add"]
                    }
                }else{
                      scripts = ["npm", "install"]
                }
                this.tgzPaths.forEach(tgzPath => {
                    scripts.push(tgzPath)
                })
                const pluginPath = process.cwd()
                execSync(scripts.join(' '), { 
                    cwd: pluginPath, 
                    stdio: 'inherit' 
                });
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    }



    _clearDependencies(): Promise<void> {
        return new Promise((reso, reject) => {
            try {
                const pluginPath = process.cwd();
                const packageJsonPath = resolve(pluginPath, "package.json");
                const packageJson = require(packageJsonPath);
                const dependencies = packageJson.dependencies;
                if (dependencies) {
                    this.actNames.forEach((actName) => {
                        delete dependencies[actName];
                    });
                    IO.write(packageJsonPath, JSON.stringify(packageJson, null, "\t")).then(() => {
                        reso();
                    }).catch(err => {
                        reject(err);
                    });
                } else {
                    reso();
                }
            } catch (err) {
                reject(err);
            }
        });
    }

    _getVActNameFromTgzPath(tgzPath: string): Promise<string> {
        return new Promise((resolve, reject) => {
            decompressFile(tgzPath, {
                filter: (file: decompress.File) => {
                    return basename(file.path) === "package.json";
                }
            }).then((files: Array<decompress.File>) => {
                try {
                    const packageJson = JSON.parse(files[0].data.toString());
                    resolve(packageJson.name);
                } catch (err) {
                    reject(err);
                }
            }).catch((err: Error) => {
                reject(err);
            });
        });
    }

}

export default TGZPluginsInstaller;