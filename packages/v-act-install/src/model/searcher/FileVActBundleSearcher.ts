import VActBundleSearcher from "../VActBundleSearcher";
import SearcherContext from "../SearcherContext";
import {Dependency} from "v-act-bundle";

class FileVActBundleSearcher extends VActBundleSearcher{

    jarPath: string;

    tgzPath: string;

    constructor(searcherContext: SearcherContext, jarPath: string){
        super(searcherContext)
        this.jarPath = jarPath;
    }

    getLocalVActNames(): Promise<Array<Dependency>>{
        return new Promise((resolve,reject)=>{
            const vacts = [];
            resolve(vacts);
        });
    }


}

export default FileVActBundleSearcher;