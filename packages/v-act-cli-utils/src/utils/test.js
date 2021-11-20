var childProcess = require("child_process");

module.exports = function(){
    var proc = childProcess.exec("react-app-rewired test",{cwd:process.cwd()},function(err,stdout,stderr){
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
}