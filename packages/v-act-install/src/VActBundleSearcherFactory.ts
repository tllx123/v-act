import {DependencyType,Dependency} from "@v-act/bundle"
import FileVActBundleSearcher from "./model/searcher/FileVActBundleSearcher";
import VStoreVActBundleSearcher from "./model/searcher/VStoreVActBundleSearcher";
import VActBundleSearcher from "./model/VActBundleSearcher";
import SearcherContext from "./model/SearcherContext";

const create = function(context: SearcherContext,dep: Dependency): VActBundleSearcher{
    const type = dep.type;
    switch(type){
        case DependencyType.local: 
            if(!dep.path){
                throw Error(".vactCfg文件中依赖信息不正确，path为空！");
            }
            return new FileVActBundleSearcher(context,dep.path);
        case DependencyType.vstore:
            if(dep.libCode&&dep.symbolicName&&dep.vactName){
                return new VStoreVActBundleSearcher(context,dep.libCode,dep.symbolicName,dep.vactName);
            }else{
                throw Error(".vactCfg文件中依赖信息不正确，libCode、symbolicName、vactName中有空值！");
            }
        default: 
            throw Error("未设别VAct插件依赖类型：" + type);
    }
}

export {
    create
}