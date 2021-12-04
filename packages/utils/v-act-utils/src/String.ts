import {MD5,SHA1} from "crypto-js";

/**
 * 转换成md5
 * @param content 字符串内容
 * @returns String
 */
const toMD5 = function(content: string): string{
    return MD5(content).toString();
}

/**
 * 生成0~9指定长度的随机数
 * @param len 长度
 * @returns String
 */
const getRandomCode = function (len: number): string {
    const chr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    Math.random();
    const buffer:string[] = [];
    for (let i = 0; i < len; i++) {
        buffer.push(chr[Math.floor(Math.random() * 10)]);
    }
    return buffer.join('');
}

const toSHA1 = function (content: string): string {
    return SHA1(content).toString()
}

const toBASE64 = function(content: string,charset?: BufferEncoding): string{
    charset = charset||"utf-8";
    return Buffer.from(content,charset).toString('base64')
}

const genSignature = function (args: Array<string>, needSort: boolean): string {
    const srcSignature:string[] = [];
    if (typeof (needSort) != 'boolean' || needSort) {
        args = args.sort();
    }
    for (let i = 0, l = args.length; i < l; i++) {
        srcSignature.push(args[i]);
    }
    return toSHA1(srcSignature.join(''));
}
/**
 * 处理nodejs插件名称
 * @param name nodejs插件名称
 * @returns 
 */
const enhancePluginName = function(name: string): string{
    return name.replace('@','').replace('/','-');
}

export {
    toMD5,
    toSHA1,
    toBASE64,
    getRandomCode,
    genSignature,
    enhancePluginName
}