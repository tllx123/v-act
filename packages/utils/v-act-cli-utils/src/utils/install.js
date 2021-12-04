const installer = require("@v-act/install");
const utils = require("@v-act/utils");

module.exports = function(){
    const len = process.argv.length;
    let vactName;
    switch(len){
        case 3:
            vactName = process.argv[2];
            break;
        case 2:
            vactName = process.argv[1];
            break;
        default:
            console.error("无法获取install命令的参数，args：", process.argv);
            return;
    }
    installer.install(vactName).then(()=>{
        // utils.Console.log("安装完成");
    }).catch(err=>{
        utils.Console.error(err);
    });
}
