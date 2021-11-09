import VActBundle from "./VActBundle";
import {toProjectSymbolicName} from "../utils/Utils";

class VActProjectBundle extends VActBundle{

    getSymblicName(): string{
        return toProjectSymbolicName(this.getGroupId(),this.getCode());
    }
}

export default VActProjectBundle;