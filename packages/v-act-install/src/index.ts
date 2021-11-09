import * as p from "path";
import * as fs from "fs";
import FileVActBundleInstaller from "./model/searcher/FileVActBundleSearcher";
import { create } from "./VActBundleInstallerFactory";
import BatchVActBundleInstaller from "./model/BatchVActBundleInstaller";
import { VStore } from "v-act-api";
import { Cache, Console } from "v-act-utils";
import {prompt} from 'inquirer';


const install = function (vactName?: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const promise = vactName ? installVActPlugins(vactName) : installAll();
        promise.then(() => {
            resolve();
        }).catch(err => {
            reject(err);
        });
    });
}

const _getAccountAndPwd = function (): Promise<{ account: string, pwd: string, }> {
    return new Promise((resolve, reject) => {
        Cache.get().then((cache) => {
            const account = cache.account, pwd = cache.pwd;
            if (!account || !pwd) {
                const questions = [{
                    type: 'input',
                    message: '请输入VStore账号：',
                    name: 'account',
                    validate: function (input) {
                        var done = this.async();
                        if (!input || !input.trim()) {
                            done('请输入VStore账号：');
                            return;
                        } else {
                            done(null, true);
                        }
                    }
                }, {
                    type: 'password',
                    message: '请输入VStore密码：',
                    name: 'pwd',
                    validate: function (input) {
                        var done = this.async();
                        if (!input || !input.trim()) {
                            done('请输入VStore密码：');
                            return;
                        } else {
                            done(null, true);
                        }
                    }
                }];
                prompt(questions).then((answer) => {
                    Console.log("正在进VStore账号、密码校验");
                    //对密码进行加盐处理
                    answer.pwd = VStore.enhancePwd(answer.pwd);
                    const promise = VStore.checkAccountAndPwd(answer.account, answer.pwd);
                    promise.then(() => {
                        Console.log("VStore账号、密码校验完成");
                        cache.account = answer.account;
                        cache.pwd = answer.pwd;
                        Cache.put(cache).then(() => {
                            resolve({
                                account: answer.account,
                                pwd: answer.pwd
                            });
                        }).catch(err => {
                            reject(err);
                        });
                    }).catch(err => {
                        reject(err);
                    });
                }).catch(err => {
                    reject(err);
                });
            } else {
                resolve({
                    account,
                    pwd
                });
            }
        }).catch(err => {
            reject(err);
        });
    });
}

const installVActPlugins = function (vactName: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const exists = fs.existsSync(vactName);
        if (exists) {
            //本地vact插件
            installLocalVAct(vactName).then(() => {
                resolve();
            }).catch(err => {
                reject(err);
            });
        } else {
            _getAccountAndPwd().then((result) => {
                //从vstore查找
                VStore.searchVActComponent(result.account,result.pwd,vactName).then((components) => {
                    const actNames = [];
                    components.forEach(component => {
                        actNames.push(component.compName+"（"+component.compCode+"）");
                    });
                    prompt([{
                        type: 'list',
                        message: '共检索到 ' + components.length + '个构件,请选择要安装的构件:',
                        choices: actNames,
                        name: 'selected'
                    }]).then(answers => {
                        const selected = answers.selected;
                        let componentCode = selected.split("（")[1];
                        componentCode = componentCode.substring(0,componentCode.length-1);
                        let component = null;
                        for(let i=0,l=components.length;i<l;i++){
                            const comp = components[i];
                            if(comp.componentCode === componentCode){
                                component = comp;
                                break;
                            }
                        }
                        resolve(component);
                    });
                }).catch(err => {
                    reject(err);
                });
            }).catch(err => {
                reject(err);
            });
        }
    });
}

const installLocalVAct = function (absPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const installer = new FileVActBundleInstaller(absPath);
        installer.install().then(() => {
            resolve();
        }).catch(err => {
            reject(err);
        });
    });
}

const installAll = function (): Promise<void> {
    return new Promise((resolve, reject) => {
        try {
            const pluginPath = process.cwd();
            const vactCfgPath = p.resolve(pluginPath, ".vactCfg");
            if (fs.existsSync(vactCfgPath)) {
                fs.readFile(vactCfgPath, (err, data) => {
                    if (err) {
                        return reject(err);
                    }
                    try {
                        const vactCfg = JSON.parse(data.toString());
                        const dependencies = vactCfg.dependencies;
                        if (dependencies && dependencies.length > 0) {
                            const installers = [];
                            dependencies.forEach(dep => {
                                installers.push(create(dep));
                            });
                            const installer = new BatchVActBundleInstaller(installers);
                            installer.install().then(() => {
                                resolve();
                            }).catch(err => {
                                reject(err);
                            });
                        } else {
                            resolve();
                        }
                    } catch (err) {
                        reject(err);
                    }
                })
            } else {
                resolve();
            }
        } catch (err) {
            reject(err);
        }
    });
}

const uninstall = function (vactName?: string): Promise<void> {
    return new Promise((resolve, reject) => {

    });
}

export {

    install,

    uninstall

}