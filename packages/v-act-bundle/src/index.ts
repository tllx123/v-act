import VActBundle from "./model/VActBundle";
import VActComponentBundle from "./model/VActComponentBundle";
import VActProjectBundle from "./model/VActProjectBundle";
import {create} from "archiver";
import {createWriteStream,readdir,existsSync,rm} from 'fs'
import * as decompress from "decompress";
import { getExportPath } from "./utils/Utils";
import FileJarResource from "./model/jar/resources/FileJarResource";
const decompressFile = require('decompress');
import * as p from "path";

import * as childProcess from "child_process";
import {VActCfg, Dependency, DependencyType } from "./types/VActCfg";
import {Path,File,String} from "@v-act/utils";

export default VActBundle;
// const decompressFile = require('decompress');
const persistence = function (bundle: VActBundle, distDir: string): Promise<string> {
    return new Promise((resolve, reject) => {
        try {
            const jar = bundle.toJar()
            const resources = jar.getResources()
            const dist = p.resolve(distDir, `${bundle.getSymblicName()}-${bundle.getVersion()}.jar`)
            File.mkDir(distDir)
            const output = createWriteStream(dist)
            const archive = create('zip', {
                zlib: {
                    level: 9
                }
            });
            output.on('close', () => {
                resolve(dist)
            });
            archive.on('error', reject)
            archive.pipe(output)
            const promises:Array<Promise<void>> = [];
            resources.forEach(resource => {
                const entryPath = resource.getEntryPath();
                const pro = new Promise<void>((reso, rej) => {
                    resource.getContent().then((content) => {
                        archive.append(content, { name: entryPath });
                        reso()
                    }).catch(err => {
                        rej(err)
                    })
                })
                promises.push(pro)
            })
            Promise.all(promises).then(() => {
                archive.finalize()
            }).catch(err => {
                reject(err)
            })
        } catch (err) {
            reject(err)
        }
    });
}


const pickNodejsPlugin = function (bundlePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
        try {
            const tmpDir = Path.getVActRandomDir();
            File.mkDir(tmpDir);
           

            decompressFile(bundlePath, tmpDir).then((files: Array<decompress.File>) => {
                files  =  files.filter((item)=>{
                      return  p.extname(item.path) === '.tgz'
                })
                const relativePath = files[0].path;
                resolve(p.resolve(tmpDir,relativePath));
            }).catch((e:Error) => {
                reject(e);
            });
        } catch (e) {
            reject(e);
        }
    });
}

/**
 * 清除当前vact插件tgz压缩包
 */
const clearPluginTgz = function (pluginPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        try {
            const packagePath = p.resolve(p.resolve(pluginPath, "package.json"));
            if (existsSync(packagePath)) {
                const packageJson = require(packagePath);
                const packageName = packageJson.name;
                if (packageName) {
                    readdir(pluginPath, (err, files) => {
                        if (err) {
                            return reject(err);
                        }
                        const tgzPaths:Array<string> = [];
                        files.forEach(fileName => {
                            if (fileName.startsWith(packageName) && fileName.endsWith(".tgz")) {
                                tgzPaths.push(p.resolve(pluginPath, fileName));
                            }
                        });
                        if (tgzPaths.length > 0) {
                            const allPromises:Array<Promise<void>> = [];
                            tgzPaths.forEach(tgzPath => {
                                const promise = new Promise<void>((reso, rej) => {
                                    rm(tgzPath, (err) => {
                                        if (err) {
                                            return rej(err);
                                        }
                                        reso();
                                    })
                                });
                                allPromises.push(promise);
                            });
                            Promise.all(allPromises).then(() => {
                                resolve();
                            }).catch(err => {
                                reject(err);
                            });
                        } else {
                            resolve();
                        }
                    });
                } else {
                    reject(Error("当前插件未设置name，请检查！path:" + packagePath));
                }
            } else {
                reject(Error("当前文件夹下不存在package.json，请检查！path:" + pluginPath));
            }
        } catch (err) {
            reject(err);
        }
    });
}

/**
 * 清除V平台应用服务构件
 * @param pluginPath 插件路径
 */
const clearV3ExEBundle = function (pluginPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        try {
            const packagePath = p.resolve(p.resolve(pluginPath, "package.json"));
            if (existsSync(packagePath)) {
                const packageJson = require(packagePath);
                const packageName = packageJson.name;
                if (packageName) {
                    readdir(pluginPath, (err, files) => {
                        if (err) {
                            return reject(err);
                        }
                        const jarPaths:Array<string> = [];
                        files.forEach(fileName => {
                            if (fileName.indexOf(packageName) != -1 && fileName.endsWith(".jar")) {
                                jarPaths.push(p.resolve(pluginPath, fileName));
                            }
                        });
                        if (jarPaths.length > 0) {
                            const allPromises:Array<Promise<void>> = [];
                            jarPaths.forEach(tgzPath => {
                                const promise = new Promise<void>((reso, rej) => {
                                    rm(tgzPath, (err) => {
                                        if (err) {
                                            return rej(err);
                                        }
                                        reso();
                                    })
                                });
                                allPromises.push(promise);
                            });
                            Promise.all(allPromises).then(() => {
                                resolve();
                            }).catch(err => {
                                reject(err);
                            });
                        } else {
                            resolve();
                        }
                    });
                } else {
                    reject(Error("当前插件未设置name，请检查！path:" + packagePath));
                }
            }
        } catch (err) {
            reject(err);
        }
    });
}

const validatePackageJson = function (packageJson: { [propName: string]: any }): Promise<void> {
    return new Promise((resolve, reject) => {
        try {
            const packageName = packageJson.name;
            if (packageName) {
                const version = packageJson.version;
                if (version) {
                    const dependencies = packageJson.dependencies;
                    if (dependencies) {
                        for (const key in dependencies) {
                            if (Object.prototype.hasOwnProperty.call(dependencies, key)) {
                                const element = dependencies[key];
                                if (element.startsWith && element.startsWith("file:")) {
                                    return reject(Error(`当前VAct插件依赖了本地插件，插件名称：${key},本地路径：${element}`));
                                }
                            }
                        }
                        resolve();
                    } else {
                        resolve();
                    }
                } else {
                    reject(Error("当前插件未设置version，请检查！"));
                }
            } else {
                reject(Error("当前插件未设置name，请检查！"));
            }
        } catch (err) {
            reject(err);
        };
    });
}

/**
 * 将当前vact插件打包成tgz
 */
const packPluginTgz = function (pluginPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
        try {
            const packagePath = p.resolve(p.resolve(pluginPath, "package.json"));
            if (existsSync(packagePath)) {
                const packageJson = require(packagePath);
                validatePackageJson(packageJson).then(() => {
                    const proc = childProcess.exec("npm pack", { cwd: pluginPath }, (err, stdout, stderr) => {
                        if (err) {
                            return reject(err);
                        }
                        resolve(p.resolve(pluginPath, `${String.enhancePluginName(packageJson.name)}-${packageJson.version}.tgz`));
                    });
                    if(proc.stdout){
                        proc.stdout.on('data', (data) => {
                            console.log(data);
                        });
                    }
                    if(proc.stderr){
                        proc.stderr.on('data', (data) => {
                            console.log(data);
                        });
                    }
                }).catch(err => {
                    reject(err);
                });
            } else {
                reject(Error("当前文件夹下不存在package.json，请检查！path:" + pluginPath));
            }

        } catch (err) {
            reject(err);
        }
    });
}
/**
 * 获取导出文件的绝对路径
 * @param pluginPath 插件路径
 * @returns 
 */
const getExportFiles = function (pluginPath: string): string[] {
    let filePaths:string[] = [];
    try {
        //获取导出路径
        const exportPath = getExportPath(pluginPath);
        //获取导出文件路径
        filePaths = File.getFiles(exportPath);
    } catch (error) {
        throw Error(`无法获取项目导出资源：` + error);
    }
    return filePaths;
}
/**
 * 清除导出文件夹
 * @param pluginPath 插件路径
 * @returns 
 */
const clearExportFile = function (pluginPath: string): Promise<void> {
    return new Promise((resolve, reject)=>{
        try {
            //获取导出路径
            const exportPath = getExportPath(pluginPath);
            File.rmDirSync(exportPath);
            resolve();
        } catch (error) {
            reject(Error(`无法清除项目导出资源：` + error))
        }
    });
}

/**
 * 创建文件资源
 * @param entryPath 目标路径
 * @param srcPath 来源路径
 * @returns 
 */
const createFileResource = function(entryPath:string, srcPath:string):FileJarResource{
    return new FileJarResource(entryPath, srcPath)
}

/**
 * 生成资源相对jar的路径
 * @param pluginPath 插件路径
 * @param srcPath 资源的绝对路径
 */
const genEntryPath = function(pluginCode:string, pluginPath:string, srcPath:string){
    //获取导出目录
    const exportPath = getExportPath(pluginPath);
    const relPath = p.relative(exportPath, srcPath);
    return `resources/page/${pluginCode}/${relPath}`;
}

export {
    persistence,
    VActComponentBundle,
    VActProjectBundle,
    pickNodejsPlugin,
    clearPluginTgz,
    clearV3ExEBundle,
    packPluginTgz,
    createFileResource,
    getExportPath,
    getExportFiles,
    genEntryPath,
    clearExportFile,
    VActCfg,
    Dependency,
    DependencyType
}