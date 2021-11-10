import {Dependency} from "@v-act/bundle";
import SearcherContext from "./SearcherContext";

abstract class VActBundleSearcher {

    searcherContext: SearcherContext;

    constructor(searcherContext: SearcherContext){
        this.searcherContext = searcherContext;
    }

    getSearcherContext(): SearcherContext{
        return this.searcherContext;
    }

    abstract getLocalVActNames(): Promise<Array<Dependency>>;

}

export default VActBundleSearcher;