import * as p from "path";
import * as fs from "fs";
import FileVActBundleSearcher from "./model/searcher/FileVActBundleSearcher";
import SearcherContext from "./model/SearcherContext";
import TGZPluginsInstaller from "./model/TGZPluginsInstaller";
import { VStore } from "../../v-act-api/dist";
import { Cache, Console } from "@v-act/utils";
import { prompt } from 'inquirer';
import { Path, File } from "@v-act/utils";
import decompress from "decompress";
const decompressFile = require('decompress');
import { Dependency } from "../../v-act-bundle/dist/types/VActCfg";
import Bundle from "../../v-act-api/src/types/Bundle";

const install = function (vactName?: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const promise = vactName ? installVActPlugins(vactName) : installAll()
        promise.then(() => {
            resolve()
        }).catch(err => {
            reject(err)
        })
    })
}



const installVActPlugins = function (vactName: string): Promise<any> {
    return new Promise((resolve, reject) => {
        const exists = fs.existsSync(vactName);
        if (exists) {
              installLocalVAct(vactName)
        } else {
            _getAccountAndPwd().then((result) => {
                //从vstore查找
                VStore.searchVActComponent(result.account, result.pwd, vactName).then((components) => {
                    const actNames: Array<string> = [];
                    components.forEach(item => {
                        actNames.push(item.compName + "（" + item.compCode + "）");
                    });
                    prompt([{
                        type: 'list',
                        message: '共检索到 ' + components.length + ' 个构件,请选择要安装的构件:',
                        choices: actNames,
                        name: 'selected'
                    }]).then(answers => {
                        const selected = answers.selected;
                        let componentCode = selected.split("（")[1];
                        componentCode = componentCode.substring(0, componentCode.length - 1);
                        let component: Bundle = {
                            id: "",
                            compCode: "",
                            compName: "",
                            symbolicName: "",
                            libCode: "",
                            createTime: "",
                            createOwnerCode: "",
                            updateTime: "",
                            updateOwnerCode: "",
                            fileDownUrl: ""
                        }
                        for (let i = 0, l = components.length; i < l; i++) {
                            const comp = components[i];
                            if (comp.compCode === componentCode) {
                                component = comp;
                                break;
                            }
                        }

                        VStore.downloadBundle(component.fileDownUrl).then((componentPath) => {
                            installLocalVAct(componentPath)
                        })


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








//获取用户
const _getAccountAndPwd = function (): Promise<{ account: string, pwd: string, }> {
    return new Promise((resolve, reject) => {
        Cache.get().then((cache) => {
            cache = cache || {};
            const account = cache.account, pwd = cache.pwd;
            if (!account || !pwd) {
                const questions = [{
                    type: 'input',
                    message: '请输入VStore账号：',
                    name: 'account',
                    validate: function (input: any) {
                        if (!input || !input.trim()) {
                            return '请输入VStore账号：';
                        } else {
                            return true;
                        }
                    }
                }, {
                    type: 'password',
                    message: '请输入VStore密码：',
                    name: 'pwd',
                    validate: function (input: any) {
                        if (!input || !input.trim()) {
                            return '请输入VStore密码：';
                        } else {
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
                        cache = cache || {};
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




//安装构建
const installLocalVAct = function (absPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const context = new SearcherContext()
        //根据路径获取构建信息，并将路径加到tgzPaths
        const searcher = new FileVActBundleSearcher(context, absPath)
        searcher.getLocalVActNames().then((deps) => {
            const tgzPaths: Array<string> = []
            deps.forEach((dep: any) => {
                tgzPaths.push(dep.path)
            });
            //获取依赖构建路径数组
            getDependenciesPathByAbsPath(absPath).then((needInstallDep) => {
                needInstallDep.push(tgzPaths[0])
                //批量安装
                console.log("needInstallDep")
                console.log(needInstallDep)
                const installer = new TGZPluginsInstaller(needInstallDep)
                installer.install().then(() => {
                    resolve()
                }).catch(err => {
                    reject(err)
                });
            })
        }).catch(err => {
            reject(err)
        });
    });
}



//递归获取构建依赖路径
const getDependenciesPathByAbsPath =   function (absPath: string): Promise<Array<string>> {

    return new Promise((resolve, reject) => {
        try {
            const needInstallDep: Array<string> = []
            console.log(111111)

    
            const getDependencies = async function(item: Dependency) {
                    console.log(222222)
                    if (item.type === "local") {
                        if (fs.existsSync(<string>item.path)) {
                              getDependenciesByAbsPath(<string>item.path).then((val) => {
                                needInstallDep.push(val.relativePath)
                                if (val.dependencies && val.dependencies.length > 0) {
                                    getDependencies(val.dependencies)
                                }
                            })
                        }
                    } else {
                        item.type === "vstore"
                        VStore.getVActComponent(<string>item.libCode, item.vactName).then((componentInfo) => {
                            if(componentInfo.id !== "none"){
                                VStore.downloadBundle(componentInfo.fileDownUrl).then((componentPath) => {
                                    getDependenciesByAbsPath(componentPath).then((val) => {
                                        needInstallDep.push(val.relativePath)
                                        if (val.dependencies && val.dependencies.length > 0) {
                                            console.log("val.dependencies")  
                                            console.log(val.dependencies)  
                                            getDependencies(val.dependencies)
                                        }
                                    })
                                })
                            }
                        })
                    }
              
            }
           
            getDependenciesByAbsPath(absPath).then(async (val) => {
                if(JSON.stringify(val) !== '{}'){
                    needInstallDep.push(val.relativePath)
                    if (val.dependencies && val.dependencies.length > 0) {
                        val.dependencies.some(async(item: any) => {
                            await getDependencies(item)
                        })
                        console.log(33331)
                        console.log(needInstallDep)
                        resolve(needInstallDep) 
                    }else{
                        console.log(33332)
                        console.log(needInstallDep)
                        resolve(needInstallDep) 
                    }
                }else{
                    console.log(33334)
                    console.log(needInstallDep)
                    resolve([]) 
                }
            })
         
           
        } catch (err) {
            reject(err)
        }
    })
}



//返回当前构建的依赖以及tgz文件路径
const getDependenciesByAbsPath = function (absPath: string): Promise<any> {
    return new Promise((resolve, reject) => {
        const tmpDir = Path.getVActRandomDir()
        File.mkDir(tmpDir)
        decompressFile(absPath, tmpDir).then((files: Array<decompress.File>) => {
            files = files.filter((item) => { return p.extname(item.path) === '.tgz' })
            const relativePath = p.resolve(tmpDir, files[0].path)
            const DepTmpDir = Path.getVActRandomDir();
            File.mkDir(DepTmpDir);
            decompressFile(relativePath, DepTmpDir).then((filesDep: Array<decompress.File>) => {

                filesDep = filesDep.filter((item) => { return (item.path.indexOf('.vactCfg') > -1) })
                if(filesDep.length ==0){
                    resolve({})
                }else{
                    const DepPath = filesDep[0].path;
                    const DepPathTemp = p.resolve(DepTmpDir, DepPath)
                    if (fs.existsSync(DepPathTemp)) {
                        fs.readFile(DepPathTemp, (err, data) => {
                            if (err) {
                                return reject(err);
                            }
                            try {
                                const DepObj = JSON.parse(data.toString())
                                const dependencies: Array<Dependency> = DepObj.dependencies
                                let param = {
                                    dependencies: dependencies,
                                    relativePath: relativePath
                                }
                                resolve(param)
                            } catch (err) {
                                reject(err)
                            }
                        })
                    }
                }
    
            })
        })
    })
}





//安装所有
const installAll = function (): Promise<void> {
    return new Promise((resolve, reject) => {
        try {
            const pluginPath = process.cwd()
            const vactCfgPath = p.resolve(pluginPath, ".vactCfg");
            if (fs.existsSync(vactCfgPath)) {
                fs.readFile(vactCfgPath, (err, data) => {
                    if (err) {
                        return reject(err)
                    }
                    try {
                        const vactCfg = JSON.parse(data.toString())
                        //获取依赖
                        const dependencies = vactCfg.dependencies
                        if (dependencies && dependencies.length > 0) {
                            dependencies.forEach((dep: any) => {
                                if (dep.type === "local") {
                                    installLocalVAct(dep.path)
                                } else {
                                    VStore.getVActComponent(dep.libCode, dep.vactName).then((componentInfo) => {
                                        VStore.downloadBundle(componentInfo.fileDownUrl).then((componentPath) => {
                                            installLocalVAct(componentPath)
                                        })
                                    })
                                }
                            })
                        } else {
                            resolve()
                        }
                    } catch (err) {
                        reject(err)
                    }
                })
            } else {
                resolve()
            }
        } catch (err) {
            reject(err)
        }
    });
}






// const uninstall = function (vactName?: string): Promise<void> {
//     return new Promise((resolve, reject) => {

//         const promise = vactName ? uninstallVActPlugins(vactName) : uninstallAll()
//         promise.then(() => {
//             resolve()
//         }).catch(err => {
//             reject(err)
//         })
 
//     });
// }


// const uninstallVActPlugins = function (vactName: string): Promise<void>{
//     return new Promise((resolve, reject) => {
        
//     })
// }

// const uninstallAll = function (): Promise<void>{
//     return new Promise((resolve, reject) => {})
// }



// //安装构建
// const installLocalVAct = function (absPath: string): Promise<void> {
//     return new Promise((resolve, reject) => {
//         const context = new SearcherContext()
//         //根据路径获取构建信息，并将路径加到tgzPaths
//         const searcher = new FileVActBundleSearcher(context, absPath)
//         searcher.getLocalVActNames().then((deps) => {
//             const tgzPaths: Array<string> = []
//             deps.forEach((dep: any) => {
//                 tgzPaths.push(dep.path)
//             });
//             //获取依赖构建路径数组
//             console.log(0)
//             getDependenciesPathByAbsPath(absPath).then((needInstallDep) => {
//                 console.log(444444)
//                 needInstallDep.push(tgzPaths[0])
//                 //批量安装
//                 const installer = new TGZPluginsInstaller(needInstallDep)
//                 installer.install().then(() => {
//                     resolve()
//                 }).catch(err => {
//                     reject(err)
//                 });
//             })
//         }).catch(err => {
//             reject(err)
//         });
//     });
// }


export {
    install,
    // uninstall
}