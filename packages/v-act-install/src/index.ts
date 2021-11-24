import * as p from "path";
import * as fs from "fs";
import TGZPluginsInstaller from "./model/TGZPluginsInstaller";
import { VStore, VTeam } from "@v-act/api";
import { Cache, Console } from "@v-act/utils";
import { prompt } from 'inquirer';
import { Path, File } from "@v-act/utils";
import decompress from "decompress";
const decompressFile = require('decompress');
import {Bundle,Dependency} from "@v-act/bundle";
const utils = require("@v-act/utils");




const install = async function (vactName?: string) {
    vactName ? installVActPlugins(vactName) : installAll()
}


const installVActPlugins = function (vactName: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
        const exists = fs.existsSync(vactName);
        if (exists) {

            let params = await decompressByJarPath(vactName)
            let res:string = ""
            if (params.dependencies.length > 0) {
                  installLibLine(params.dependencies,params.relativePath)
            } else {
                let libList = [params.relativePath]
                  installLib(libList)
            }
        } else {
            _getAccountAndPwd().then((result) => {
                //从vstore查找
                VStore.searchVActComponent(result.account, result.pwd, vactName).then((components) => {
                    const actNames: Array<string> = [];
                    components.forEach(item => {
                        actNames.push(item.compName + "（" + item.compCode + "）");
                    });
                    if(components.length==0){
                        utils.Console.log("没检索到构件，已退出安装")
                    }else{
                    prompt([{
                        type: 'list',
                        message: '共检索到 ' + components.length + ' 个构件,请选择要安装的构件:',
                        choices: actNames,
                        name: 'selected'
                    }]).then( answers => {
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
                        VStore.downloadBundle(component.fileDownUrl).then(async(componentPath) => {
                            let params = await decompressByJarPath(componentPath)
                            if (params.dependencies.length > 0) {
                                installLibLine(params.dependencies,params.relativePath)
                            } else {
                                let libList = [params.relativePath]
                                installLib(libList)
                            }
                        })
                    });
                  }

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





//安装所有
const installAll = async function () {
    const pluginPath = process.cwd()
    const vactCfgPath = p.resolve(pluginPath, ".vactCfg");
    if (fs.existsSync(vactCfgPath)) {
        let data = await readFile(vactCfgPath)
        const vactCfg = JSON.parse(data.toString())
        const dependencies = vactCfg.dependencies 
        if (dependencies && dependencies.length > 0) {
            //获取所有依赖
            installLibLine(dependencies)
        }
    }
}


const installLibLine = async function (dependencies: Dependency[],path?:string) {
    return new Promise(async(resolve,reject)=>{
        let params = await getAllDepByJarPath(dependencies)
        let hasVStoreDep = params.deps.filter((item: Dependency) => { return item.type == "vstore" })
        if (hasVStoreDep.length > 0) {
            let login = await _getAccountAndPwd()
            let libCode = await VTeam.getProjectsByAccount(login.account, login.pwd)
            // console.log("libCode------------")
            // console.log(libCode)
            let libCodeList: Array<string> = []
            libCode.some((item) => {
                libCodeList.push(item.libCode)
            })
            let libNameList: string[] =[]
            for (const item of params.deps) {
                if (libCodeList.indexOf(item.libCode) < 0) {
                    libNameList.push(item.vactName)
                } 
            }
    
            if(libNameList.length==0){
                if(path){
                    params.tgzPath.push(path)
                }
                installLib(params.tgzPath)
              
            }else{
                utils.Console.log("安装失败")
                utils.Console.log("你没权限安装构件：" + libNameList.toString())
                utils.Console.log("安装已终止")
            }
        }
    })
}



const installLib = function (arr: Array<string>): Promise<string> {
    return new Promise((resolve, reject) => {
        const installer = new TGZPluginsInstaller(arr)
        installer.install().then(() => {
            utils.Console.log("安装成功")  
        }).catch(err => {
            reject(err)
        })
    })
}


//根绝路径获取其所有依赖信息
const getAllDepByJarPath = function (dependencies: Array<Dependency>): Promise<any> {
    return new Promise(async (resolve, reject) => {
        let deps: Array<Dependency> = []
        let depsArray: Array<string> = []
        let tgzPath: Array<string> = []
        let params = {
            deps: deps, //依赖信息
            depsArray: depsArray,  //用于校验用户是否有权限安装
            tgzPath: tgzPath      //用于安装
        }
        const getPath = async function (dependencies: Array<Dependency>): Promise<void> {
            return new Promise(async (resolve, reject) => {
                for (const dep of dependencies) {
                    if (dep.type === "local") {
                        if (fs.existsSync(<string>dep.path)) {

                            let isRepeat = false
                            for(const item of deps){
                                 if(item.vactName == dep.vactName && item.path == dep.path){
                                    isRepeat = true
                                 }
                            }
                            if(!isRepeat){
                                deps.push(dep)
                                resolve(await decompressFileByJarPath(<string>dep.path))
                            }else{
                                resolve()
                            }
                        }
                    } else {
                        let componentInfo = await VStore.getVActComponent(<string>dep.libCode, dep.vactName)
                        let componentPath = await VStore.downloadBundle(componentInfo.fileDownUrl)
                        if (fs.existsSync(componentPath)) {
                            let isRepeat = false
                            for(const item of deps){
                                 if(item.vactName == dep.vactName && item.libCode == dep.libCode &&item.symbolicName == dep.symbolicName){
                                    isRepeat = true
                                 }
                            }
                            if(!isRepeat){
                                deps.push(dep) 
                                depsArray.push(<string>dep.libCode)
                                resolve(await decompressFileByJarPath(componentPath))
                            }else{
                                resolve()
                            }
     
                        }
                    }
                    resolve()
                }
                resolve()
            })
        }


        //解压文件获取插件信息
        const decompressFileByJarPath = async function (jarPath: string): Promise<void> {
            return new Promise(async (resolve, reject) => {
                const tmpDir = Path.getVActRandomDir()
                File.mkDir(tmpDir)
                //解压jar
                let files: Array<decompress.File> = await decompressFile(jarPath, tmpDir)
                files = files.filter((item) => { return p.extname(item.path) === '.tgz' })
                const relativePath = p.resolve(tmpDir, files[0].path)
                 if(tgzPath.indexOf(relativePath) > 0){
                    resolve()
                 }else{
                    tgzPath.push(relativePath)
                 }
               

                const DepTmpDir = Path.getVActRandomDir();
                File.mkDir(DepTmpDir);
                //解压tgz

                let filesDep: Array<decompress.File> = await decompressFile(relativePath, DepTmpDir)
                filesDep = filesDep.filter((item) => { return (item.path.indexOf('.vactCfg') > -1) })
                if (filesDep.length == 0) {
                    resolve()
                } else {
                    const DepPath = filesDep[0].path;
                    const DepPathTemp = p.resolve(DepTmpDir, DepPath)
                    if (fs.existsSync(DepPathTemp)) {
                        let data = await readFile(DepPathTemp)
                        const DepObj = JSON.parse(data.toString())
                        const dependencies: Array<Dependency> = DepObj.dependencies
                        if (dependencies && dependencies.length > 0) {
                            resolve(await getPath(dependencies))
                        } else {
                            resolve()
                        }
                    }
                }
            })
        }


        await getPath(dependencies)

        resolve(params)
    })
}



const readFile = async function (DepPathTemp: string): Promise<any> {
    return new Promise((resolve, reject) => {
        fs.readFile(DepPathTemp, (err, data) => {
            resolve(data)
        })
    })
}



//解压文件获取插件信息
const decompressByJarPath = async function (jarPath: string): Promise<{ relativePath: string, dependencies: Array<Dependency>, }> {
    return new Promise(async (resolve, reject) => {
        

        const tmpDir = Path.getVActRandomDir()
        File.mkDir(tmpDir)
        //解压jar
        let files: Array<decompress.File> = await decompressFile(jarPath, tmpDir)
        files = files.filter((item) => { return p.extname(item.path) === '.tgz' })
        const relativePath = p.resolve(tmpDir, files[0].path)
        const DepTmpDir = Path.getVActRandomDir();
        File.mkDir(DepTmpDir);
        //解压tgz
        let filesDep: Array<decompress.File> = await decompressFile(relativePath, DepTmpDir)
        filesDep = filesDep.filter((item) => { return (item.path.indexOf('.vactCfg') > -1) })
        if (filesDep.length == 0) {
            let dependencies: Array<Dependency> = []
            resolve({
                relativePath: relativePath,
                dependencies: dependencies
            })
        } else {
            const DepPath = filesDep[0].path;
            const DepPathTemp = p.resolve(DepTmpDir, DepPath)
            if (fs.existsSync(DepPathTemp)) {
                let data = await readFile(DepPathTemp)
                const DepObj = JSON.parse(data.toString())
                const dependencies: Array<Dependency> = DepObj.dependencies
                resolve({
                    relativePath: relativePath,
                    dependencies: dependencies
                })
            }
        }
    })
}





export {
    install,
    // uninstall
}