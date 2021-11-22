import Manifest from "./jar/Manifest";
import JarResource from "./jar/JarResource";
import {getManifestEntryPath} from "../utils/Utils";
import StringJarResource from "./jar/resources/StringJarResource";
import Jar from "./jar/Jar";
import * as fs from "fs";
import * as p from "path";
import FileJarResource from "./jar/resources/FileJarResource";

/**
 * VAct构件
 */
 abstract class VActBundle{
    //组织id
    groupId: string = 'com.yindangu.vact';
    //项目编号
    projectCode: string = '';
    //构件编号
    code: string = '';
    //构件版本
    version: string;
    //构件作者
    author: string;
    //nodejs插件路径
    tgzPath: string;

    constructor(groupId: string,code: string,version: string,author: string,tgzPath: string){
        if(groupId){
            this.groupId = groupId;
        }
        this.code = code;
        this.version = version;
        this.author = author;
        this.tgzPath = tgzPath;
    }
    
    setGroupId(groupId: string): void{
        this.groupId = groupId;
    }

    getGroupId(): string{
        return this.groupId;
    }

    setCode(code: string): void{
        this.code = code;
    }

    getCode(): string{
        return this.code;
    }

    setVersion(version: string): void{
        this.version = version;
    }

    getVersion(): string{
        return this.version;
    }

    setAuthor(author: string): void{
        this.author = author;
    }

    getAuthor(): string{
        return this.author;
    }

    toJar(): Jar{
        const jar = new Jar();
        const manifest = jar.getManifest();
        const manifestRes = this.manifestToResource(manifest);
        jar.appendResource(manifestRes);
        const tgzRes = this.tgzToResource();
        jar.appendResource(tgzRes);
        return jar;
    }

    abstract getSymblicName(): string;

    /**
     * @private
     */
    appendDefaultManifestHeaders(manifest: Manifest): void{
        manifest.setHeader("Manifest-Version","1.0");
        manifest.setHeader("Bundle-Version",this.version);
        manifest.setHeader("Bundle-Name",this.code);
        manifest.setHeader("Built-By",this.author);
        manifest.setHeader("Bnd-LastModified",new Date().getTime()+"");
        manifest.setHeader("Created-By", "Nodejs Plugin & v-act-bundle 1.0.0");
    }

    /**
     * @private
     */
    manifestToResource(manifest: Manifest): JarResource{
        this.appendDefaultManifestHeaders(manifest);
        manifest.setHeader("Bundle-SymbolicName",this.getSymblicName());
        const headers = manifest.getHeaders();
        const buff:string[] = [];
        for (const name in headers) {
            if (Object.prototype.hasOwnProperty.call(headers, name)) {
                const value = headers[name];
				let str = name +': ' + value;
				if(str.length>70){
					do{
						let line = str.substring(0,70);
						buff.push(line);
						buff.push('\n');
						str = ' '+str.substring(70);
					}while(str.length>70);
					if(str.length>0){
						buff.push(str);
					}
				}else{
					buff.push(str);
				}
				buff.push('\n');
            }
        }
        return new StringJarResource(getManifestEntryPath(),buff.join(''));
    }

    tgzToResource(): JarResource{
        const exists = fs.existsSync(this.tgzPath);
        if(exists){
            const filename = p.basename(this.tgzPath);
            const res = new FileJarResource(`nodejs/plugin/${filename}`,this.tgzPath);
            return res;
        }else{
            throw Error("插件路径不存在！path:"+this.tgzPath);
        }
    }

}

export default VActBundle;