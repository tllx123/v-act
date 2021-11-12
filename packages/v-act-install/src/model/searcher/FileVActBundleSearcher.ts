import VActBundleSearcher from "../VActBundleSearcher";
import SearcherContext from "../SearcherContext";
import {Dependency,DependencyType,pickNodejsPlugin} from "@v-act/bundle";

class FileVActBundleSearcher extends VActBundleSearcher{
    jarPath: string;
    tgzPath: string = '';

    constructor(searcherContext: SearcherContext, jarPath: string){
        super(searcherContext)
        this.jarPath = jarPath;
    }
    
    getLocalVActNames(): Promise<Array<Dependency>>{
        return new Promise((resolve,reject)=>{
            
            pickNodejsPlugin(this.jarPath).then((tgzPath)=>{
                resolve([{
                    vactName: "",
                    type: DependencyType.local,
                    path: tgzPath
                }]);
            }).catch(err=>{
                reject(err);
            });
        });
    }
}

export default FileVActBundleSearcher;