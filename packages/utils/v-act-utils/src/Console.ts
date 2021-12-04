import {gray,green,redBright} from "chalk";

/**
 * 打印调试信息
 * @param msg 消息
 */
const debug = function(msg: string): void{
    console.log(gray(msg));
}

/**
 * 打印错误信息
 * @param err 错误实例
 */
const error = function(err: Error|string): void{
    if(typeof err == "string"){
        console.log(redBright(err));
    }else{
        console.log(redBright(err.message));
        if (err.stack) {
            if (Array.isArray(err.stack)) {
                err.stack.forEach(stack => {
                    console.log(redBright(stack));
                });
            } else if (typeof (err.stack) == 'string') {
                console.log(redBright(err.stack));
            }
        }
    }
    
}

/**
 * 打印日志信息
 * @param msg 日志信息
 */
const log = function(msg: string): void{
    console.log(green(msg));
}

export {
    debug,
    log,
    error
}