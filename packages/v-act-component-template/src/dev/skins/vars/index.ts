import defaultSkin from "./default";
import customSkin from "./custom";

export default {

    getSkins: function():{[proName:string]:object}{
        return {
            default : defaultSkin,
            custom : customSkin
        };
    }
}