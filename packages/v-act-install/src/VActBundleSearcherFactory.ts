import {DependencyType,Dependency} from "@v-act/bundle"
import FileVActBundleSearcher from "./model/searcher/FileVActBundleSearcher";
import VStoreVActBundleSearcher from "./model/searcher/VStoreVActBundleSearcher";
import VActBundleSearcher from "./model/VActBundleSearcher";
import SearcherContext from "./model/SearcherContext";

const create = function(context: SearcherContext,dep: Dependency): VActBundleSearcher{
    const type = dep.type;
    switch(type){
        case DependencyType.local: 
            return new FileVActBundleSearcher(context,dep.path);
        case DependencyType.vstore:
            return new VStoreVActBundleSearcher(context,dep.libCode,dep.symbolicName,dep.vactName);
        default: 
            throw Error("未设别VAct插件依赖类型：" + type);
    }
}

export {
    create
}