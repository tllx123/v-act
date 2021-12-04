import {tmpdir} from "os";
import {resolve} from "path";

/**
 * 获取vact插件基础临时目录
 * @returns string
 */
const getVActBaseTmpDir = function(){
    return resolve(tmpdir(),"v-act");
}

/**
 * 获取临时随机目录
 * @returns string
 */
const getVActRandomDir = function(): string{
    return resolve(getVActBaseTmpDir(),"Temp",new Date().getTime()+"");
}

/**
 * 获取VAct组件临时目录
 * @param code vact组件编码
 * @returns 
 */
const getVActComponentDir = function(code: string): string{
    return resolve(getVActBaseTmpDir(),"component",code);
}

/**
 * 获取VAct项目临时目录
 * @param code vact项目编号
 * @returns 
 */
const getVActProjectDir = function(code: string): string{
    return resolve(getVActBaseTmpDir(),"window",code);
}

export {
    getVActBaseTmpDir,
    getVActRandomDir,
    getVActComponentDir,
    getVActProjectDir
}