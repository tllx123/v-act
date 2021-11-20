import VActBundle from "./VActBundle";
import {toProjectSymbolicName} from "../utils/Utils";
import FileJarResource from "./jar/resources/FileJarResource";

class VActProjectBundle extends VActBundle{

    /**
     * 导出的资源路径列表
     */
    resouces: FileJarResource[]

    constructor(groupId: string,code: string,version: string,author: string,tgzPath: string, resouces: FileJarResource[]){
        super(groupId,code,version,author,tgzPath);
        this.resouces = resouces;
    }

    getSymblicName(): string{
        return toProjectSymbolicName(this.getGroupId(),this.getCode());
    }

    toJar(){
        const jar = super.toJar();
        const resources = this.resouces;
        if(resources){
            for (let index = 0; index < resources.length; index++) {
                const resource = resources[index];
                jar.appendResource(resource);
            }
        }
        return jar;
    }


}

export default VActProjectBundle;