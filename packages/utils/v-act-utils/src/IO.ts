import {mkDir,dir} from "./File";
import {writeFile} from "fs";

/**
 * 写入文件
 * @param absPath 路径
 * @param content 文件内容
 * @returns Promise
 */
const write = function(absPath: string, content: string|Buffer): Promise<void>{
    return new Promise((resolve,reject)=>{
        const dirPath = dir(absPath);
        mkDir(dirPath);
        writeFile(absPath,content,(err)=>{
            if(err){
                return reject(err);
            }
            resolve();
        });
    });
}

export {
    write
}