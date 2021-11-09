const installer = require("@v-act/install");
const utils = require("@v-act/utils");

const vactName = process.argv.length == 3 ? process.argv[2]:null;

installer.install(vactName).then(()=>{
    utils.Console.log("安装完成");
}).catch(err=>{
    utils.Console.error(err);
});