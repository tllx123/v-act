/**
 * 命令行相关的工具类
 */

const childProcess = require('child_process');
// const iconv = require('iconv-lite');
// const binaryEncoding = 'binary';
// const encoding = 'cp936';
// const formatOutput = function (value) {
//     if (value) {
//         let result = iconv.decode(new Buffer.from(value, binaryEncoding), encoding)
//         return result;
//     }
//     return value;
// }
function execute(command) {
    const promise = new Promise((resolve, reject)=>{
        const proc = childProcess.exec(command, {
            // encoding: binaryEncoding
        }, function (err, stdout, stderr) {
            if (err) {
                reject(err);
                return;
            }
            resolve(stdout);
        });
        // proc.stdout.setEncoding('utf8');
        // proc.stdout.on('data', function (data) {
        //     console.log(data);
        // });
        // proc.stderr.on('data', (data) => {
        //     console.log(data);
        // });
    });
    return promise;
}
module.exports = {
    execute
}