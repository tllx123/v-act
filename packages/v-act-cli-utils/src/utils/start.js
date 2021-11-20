const childProcess = require("child_process");
const path = require("path");
module.exports = function(){
    var proc = childProcess.exec("react-app-rewired start --config-overrides "+path.resolve(__dirname,"../../build/v-act/v-act-config-overrides.js"),{cwd:process.cwd()},function(err,stdout,stderr){
        if(err){
            throw err;
        }
    });
    
    proc.stdout.on('data', (data) => {
        console.log(data);
    });
    
    proc.stderr.on('data', (data) => {
        console.log(data);
    });
}