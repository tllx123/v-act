const uninstaller = require("@v-act/install");
const utils = require("@v-act/utils");

const vactName = process.argv.length == 3 ? process.argv[2]:null;

uninstaller.uninstall(vactName).then(()=>{

}).catch(err=>{
    utils.Console.error(err);
});