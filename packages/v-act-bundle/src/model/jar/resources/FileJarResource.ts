import JarResource from "../JarResource";
import * as fs from "fs";

class FileJarResource implements JarResource{

    entryPath: string;

    srcPath: string;

    constructor(entryPath: string,srcPath: string){
        this.entryPath = entryPath;
        this.srcPath = srcPath;
    }

    getEntryPath(): string{
        return this.entryPath;
    }

    getContent(): Promise<Buffer>{
        return new Promise((resolve,reject)=>{
            try{
                const exist = fs.existsSync(this.srcPath);
                if(exist){
                    const stat = fs.statSync(this.srcPath);
                    if(stat.isDirectory()){
                        reject(Error("路径错误，不能为文件夹！路径："+this.srcPath));
                    }else{
                        fs.readFile(this.srcPath,(err,data)=>{
                            if(err){
                                return reject(err);
                            }
                            resolve(data);
                        });
                    }
                }else{
                    reject(Error("文件不存在！路径："+this.srcPath));
                }
            }catch(e){
                reject(e);
            }
        });
    }

}

export default FileJarResource;