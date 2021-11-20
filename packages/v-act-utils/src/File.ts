import * as fs from "fs";
import * as p from "path";


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
                        fs.rm(absPath,(err)=>{
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
                fs.rm(dir,()=>{
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
 * 删除文件夹
 * @param dir 文件夹目录
 */
const rmDirSync = function(dir: string){
    let files = [];
    if( fs.existsSync(dir) ) {
        files = fs.readdirSync(dir);
        files.forEach(function(file){
            let curPath = dir + "/" + file;
            if(fs.statSync(curPath).isDirectory()) {
                rmDirSync(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(dir);
    }
}

/**
 * 获取执行路径下的所有文件
 * @param nowDir 当前路径
 * @returns 所有文件的相对路径
 */
const getFiles = function(nowDir:string):string[] {
    let paths:string[] = [];
    let filePaths = fs.readdirSync(nowDir);
    if (filePaths) {
        filePaths.forEach(fileName => {
            const filePath = `${nowDir}/${fileName}`;
            const state = fs.statSync(filePath);
            if (state.isFile()) {
                paths.push(filePath);
            } else {
                paths = paths.concat(getFiles(filePath));
            }
        });
    }
    return paths;
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
    rmDirSync,
    getFiles,
    dir
}