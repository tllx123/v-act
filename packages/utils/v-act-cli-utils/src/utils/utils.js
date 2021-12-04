const childProcess = require("child_process");

/**
 * 执行命令
 * @param {String} command 命令
 * @param {Object} args 命令参数
 * @returns 
 */
function executeCommand(command, args){
    return new Promise((resolve, reject)=>{
        const proc = childProcess.exec(command, args, (err, stdout, stderr) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
        if(proc.stdout){
            proc.stdout.on('data', (data) => {
                console.log(data);
            });
        }
        if(proc.stderr){
            proc.stderr.on('data', (data) => {
                console.log(data);
            });
        }
    });
}

module.exports = {
    executeCommand
}