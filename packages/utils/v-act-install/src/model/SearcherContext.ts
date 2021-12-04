
import {Dependency} from "@v-act/bundle";

class SearcherContext{

    searched: Array<Dependency> = [];

    append(dependency: Dependency){
        if(!this.exists(dependency.vactName)){
            this.searched.push(dependency);
        }
    }

    exists(actName: string): boolean{
        for (let index = 0; index < this.searched.length; index++) {
            const search = this.searched[index];
            if(search.vactName === actName){
                return true;
            }
        }
        return false;
    }

}

export default SearcherContext;