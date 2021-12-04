import VActBundle from "./VActBundle";
import {toComponentSymbolicName} from "../utils/Utils";

class VActComponentBundle extends VActBundle{

    getSymblicName(): string{
        return toComponentSymbolicName(this.getGroupId(),this.getCode());
    }
}

export default VActComponentBundle;