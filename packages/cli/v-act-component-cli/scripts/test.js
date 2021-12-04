var path = require("path");
var childProcess = require("child_process");

var proc = childProcess.exec("react-app-rewired test --config-overrides "+path.resolve(__dirname,"../build/v-act/v-act-config-overrides.js"),{cwd:process.cwd()},function(err,stdout,stderr){
    if(err){
        throw err;
    }
    console.log(stdout.on); 
    console.log(stderr.on); 
});

proc.stdout.on('data', (data) => {
    console.log(data);
});

proc.stderr.on('data', (data) => {
    console.log(data);
});