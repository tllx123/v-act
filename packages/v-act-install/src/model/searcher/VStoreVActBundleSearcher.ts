import VActBundleSearcher from "../VActBundleSearcher";
import SearcherContext from "../SearcherContext";
import {Dependency} from "v-act-bundle";

class VStoreVActBundleSearcher extends VActBundleSearcher{

    vactName: string;

    libCode: string;

    symbolicName: string;

    constructor(searcherContext: SearcherContext,libCode: string,symbolicName: string,vactName: string){
        super(searcherContext);
        this.libCode = libCode;
        this.symbolicName = symbolicName;
        this.vactName = vactName;
    }

    getLocalVActNames(): Promise<Array<Dependency>>{
        return new Promise((resolve,reject)=>{
            const vacts = [];
            resolve(vacts);
        });
    }

}

export default VStoreVActBundleSearcher;