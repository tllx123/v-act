import * as fs from "fs";
import * as p from "path";
import * as rimraf from "rimraf";

/**
 * 创建文件夹
 * @param dir 文件夹路径
 */
const mkDir = function(dir: string): void{
    if(!fs.existsSync(dir)){
        mkDir(p.resolve(dir,".."));
        fs.mkdirSync(dir);
    }
}

const _rmDir = function(dir: string, listener?: (file: string)=> void): Promise<void>{
    return new Promise((resolve,reject)=>{
        fs.readdir(dir,(err,files)=>{
            if(err){
                return reject(err);
            }
            const promises: Array<Promise<void>> = [];
            files.forEach(file => {
                const absPath = p.resolve(dir,file);
                const stat = fs.statSync(absPath);
                if(stat.isDirectory()){
                    promises.push(_rmDir(absPath));
                }else{
                    promises.push(new Promise((reso,rej)=>{
                        rimraf(absPath,(err)=>{
                            if(err){
                                return rej(err);
                            }
                            listener&&listener(absPath);
                            reso();
                        });
                    }));
                }
            });
            Promise.all(promises).then(()=>{
                rimraf(dir,()=>{
                    listener&&listener(dir);
                    resolve();
                })
            }).catch(err=>{
                resolve();
            })
        })
    });
}

/**
 * 删除文件夹
 * @param dir 文件夹路径
 * @param listener 删除监听
 * @returns Promise
 */
const rmDir = function(dir: string,listener?: (file: string)=>void): Promise<void>{
    return new Promise((resolve,reject)=>{
        _rmDir(dir,listener).then(()=>{
            resolve();
        }).catch(err=>{
            reject(err);
        });
    });
}

/**
 * 获取指定路径父目录
 * @param absPath 路径
 * @returns 
 */
const dir = function(absPath: string): string{
    return p.resolve(absPath,"..");
}

export {
    mkDir,
    rmDir,
    dir
}