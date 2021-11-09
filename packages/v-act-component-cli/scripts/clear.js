const utils = require("@v-act/utils");

utils.Console.log("开始清除缓存信息");
utils.Cache.clear(function(file){
    utils.Console.debug(file);
}).then(()=>{
    utils.Console.log("缓存信息清除完成");
}).catch(err=>{
    utils.Console.error(err);
});