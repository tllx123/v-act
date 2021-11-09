import JarResource from "../JarResource";
import {Buffer} from "buffer";

class StringJarResource implements JarResource{

    entryPath: string;

    content: Buffer;

    constructor(entryPath: string,content: string){
        this.entryPath = entryPath;
        if(content&&content.length>0){
            this.content = Buffer.from(content,"utf-8");
        }else{
            throw Error("字符串为空！");
        }
    }

    getEntryPath(): string{
        return this.entryPath;
    }

    getContent(): Promise<Buffer>{
        return new Promise((resolve,reject)=>{
            resolve(this.content);
        });
    }

}

export default StringJarResource;