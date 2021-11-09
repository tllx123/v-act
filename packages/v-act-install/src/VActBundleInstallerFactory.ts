import {DependencyType,Dependency} from "v-act-bundle"
import FileVActBundleInstaller from "./model/searcher/FileVActBundleSearcher";
import VStoreVActBundleInstaller from "./model/searcher/VStoreVActBundleInstaller";
import VActBundleInstaller from "./model/VActBundleSearcher"

const create = function(dep: Dependency): VActBundleInstaller{
    const type = dep.type;
    switch(type){
        case DependencyType.local: 
            return new FileVActBundleInstaller(dep.path);
        case DependencyType.vstore:
            return new VStoreVActBundleInstaller(dep.libCode,dep.symbolicName,dep.vactName);
        default: 
            throw Error("未设别VAct插件依赖类型：" + type);
    }
}

export {
    create
}