import VActBundle from "./model/VActBundle";
import VActComponentBundle from "./model/VActComponentBundle";
import VActProjectBundle from "./model/VActProjectBundle";
import {create} from "archiver";
import * as fs from 'fs'
import * as decompress from "decompress";
import * as p from "path";
import * as childProcess from "child_process";
import {VActCfg, Dependency, DependencyType } from "./types/VActCfg";
import {Path,File,String} from "@v-act/utils";

export default VActBundle;

const persistence = function (bundle: VActBundle, distDir: string): Promise<string> {
    return new Promise((resolve, reject) => {
        try {
            const jar = bundle.toJar();
            const resources = jar.getResources();
            const dist = p.resolve(distDir, `${bundle.getSymblicName()}-${bundle.getVersion()}.jar`);
            File.mkDir(distDir);
            const output = fs.createWriteStream(dist);
            const archive = create('zip', {
                zlib: {
                    level: 9
                }
            });
            output.on('close', () => {
                resolve(dist);
            });
            archive.on('error', reject);
            archive.pipe(output);
            const promises:Array<Promise<void>> = [];
            resources.forEach(resource => {
                const entryPath = resource.getEntryPath();
                const pro = new Promise<void>((reso, rej) => {
                    resource.getContent().then((content) => {
                        archive.append(content, { name: entryPath });
                        reso();
                    }).catch(err => {
                        rej(err);
                    });
                });
                promises.push(pro);
            });
            Promise.all(promises).then(() => {
                archive.finalize();
            }).catch(err => {
                reject(err);
            });
        } catch (err) {
            reject(err);
        }
    });
}

const pickNodejsPlugin = function (bundlePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
        try {
            const tmpDir = Path.getVActRandomDir();
            File.mkDir(tmpDir);
            decompress(bundlePath, tmpDir, {
                filter: file => {
                    return p.extname(file.path) === '.tgz'
                }
            }).then(files => {
                const relativePath = files[0].path;
                resolve(p.resolve(tmpDir,relativePath));
            }).catch(e => {
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
            if (fs.existsSync(packagePath)) {
                const packageJson = require(packagePath);
                const packageName = packageJson.name;
                if (packageName) {
                    fs.readdir(pluginPath, (err, files) => {
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
                                    fs.rm(tgzPath, (err) => {
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
            if (fs.existsSync(packagePath)) {
                const packageJson = require(packagePath);
                const packageName = packageJson.name;
                if (packageName) {
                    fs.readdir(pluginPath, (err, files) => {
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
                                    fs.rm(tgzPath, (err) => {
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
            if (fs.existsSync(packagePath)) {
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

export {
    persistence,
    VActComponentBundle,
    VActProjectBundle,
    pickNodejsPlugin,
    clearPluginTgz,
    clearV3ExEBundle,
    packPluginTgz,
    VActCfg,
    Dependency,
    DependencyType
}