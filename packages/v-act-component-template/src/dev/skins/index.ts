import skin from "./vars/index";
import vActSkin from "v-act-skin";

let testSkins:Array<{skin:{code:string,title:string,desc:string},vars:object}> = [];

let skins = skin.getSkins();

let keys = Object.keys(skins);

keys.forEach(key => {
    testSkins.push({
        skin: {
            code: key,
            title: key,
            desc: ""
        },
        vars:skins[key]
    });
});

vActSkin.markTest(testSkins);