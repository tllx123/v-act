import * as p from "path";
import * as fs from "fs";
import FileVActBundleSearcher from "./model/searcher/FileVActBundleSearcher";
import SearcherContext from "./model/SearcherContext";
import TGZPluginsInstaller from "./model/TGZPluginsInstaller";
import {create} from "./VActBundleSearcherFactory";
import { VStore } from "@v-act/api";
import { Cache, Console } from "@v-act/utils";
import {prompt} from 'inquirer';
import VActBundleSearcher from "./model/VActBundleSearcher";


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
            cache = cache||{};
            const account = cache.account, pwd = cache.pwd;
            if (!account || !pwd) {
                const questions = [{
                    type: 'input',
                    message: '请输入VStore账号：',
                    name: 'account',
                    validate: function (input: any) {
                        //var done = this.async();
                        if (!input || !input.trim()) {
                            //done('请输入VStore账号：');
                            //return;
                            return '请输入VStore账号：';
                        } else {
                            //done(null, true);
                            return true;
                        }
                    }
                }, {
                    type: 'password',
                    message: '请输入VStore密码：',
                    name: 'pwd',
                    validate: function (input: any) {
                        //var done = this.async();
                        if (!input || !input.trim()) {
                            //done('请输入VStore密码：');
                            //return;
                            return '请输入VStore密码：';
                        } else {
                            //done(null, true);
                            return true;
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
                        cache = cache||{};
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
                    const actNames:Array<string> = [];
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
        const context = new SearcherContext();
        const searcher = new FileVActBundleSearcher(context,absPath);
        searcher.getLocalVActNames().then((deps)=>{
            const tgzPaths: Array<string> = [];
            deps.forEach(dep=>{
                tgzPaths.push(dep.path);
            });
            const installer = new TGZPluginsInstaller(tgzPaths);
            installer.install().then(()=>{
                resolve();
            }).catch(err=>{
                reject(err);
            });
        }).catch(err=>{
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
                            const searchers:Array<VActBundleSearcher> = [];
                            const context = new SearcherContext();
                            dependencies.forEach((dep: any) => {
                                searchers.push(create(context,dep));
                            });
                            const promises:Array<Promise<void>> = [];
                            const tgzPaths:Array<string> = [];
                            searchers.forEach(searcher =>{
                                promises.push(new Promise((reso,rej)=>{
                                    searcher.getLocalVActNames().then((res: any)=>{
                                        tgzPaths.push(res.path);
                                    }).catch(err=>{
                                        rej(err);
                                    });
                                }));
                            });
                            Promise.all(promises).then(()=>{
                                const installer = new TGZPluginsInstaller(tgzPaths);
                                installer.install().then(()=>{
                                    resolve();
                                }).catch(err=>{
                                    reject(err);
                                });
                            }).catch(err=>{
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