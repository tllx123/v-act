
import { Console, IO } from "@v-act/utils";
import { exec } from "child_process";
import {  resolve } from "path";
import { chooseInstallType, inputInstallType } from './PromptInstallType'
import * as p from "path";
import * as fs from "fs";

/**
 * 批量安装
 */
class TGZPlugUninsInstaller {
    actNames: Array<string> = [];
    constructor(actNames: Array<string>) {
        this.actNames = actNames;
    }

    uninstall(): Promise<void> {
        return new Promise((resolve, reject) => {
            this._uninstallNodejsPlugins().then(() => {
                resolve();
            }).catch(err => {
                reject(err);
            });
        });
    }


     _uninstallNodejsPlugins(): Promise<void> {
        return new Promise(async(resolve, reject) => {

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
            } if (isYarnPath) {
                installType = "yarn"
            } else if (isNpmPath) {
                installType = "npm"
            } else if (!(isYarnPath && isNpmPath)) {
                installType = await inputInstallType()
            }

            installType = installType.toLowerCase().replace(/\s*/g,"")

            let scripts: Array<string> = [];
            if (installType == "yarn" || installType == "yarnremove" ) {
                scripts= ["yarn", "remove"]
            }else{
                scripts= ["npm", "uninstall"]
            }
          
            this.actNames.forEach(actNames => {
                scripts.push(actNames)
            })

            const proc = exec(scripts.join(' ')+' -',(err, stdout, stderr) => {
                if (err) {
                    return reject(err)
                }
                resolve()
            });
            // console.log(proc)
            if (proc && proc.stdout) {
                proc.stdout.on('data', (data) => {
                    Console.log(data)
                })
            }
            if (proc && proc.stderr) {
                proc.stderr.on('data', (data) => {
                    Console.error(data)
                })
            }
        })
    }

}

export default TGZPlugUninsInstaller;