import { getVActBaseTmpDir } from "./Path";
import { rmDir } from "./File";
import { write } from "./IO";
import { resolve } from "path";
import { existsSync } from "fs";

interface CacheType {

    //账号
    account?: string,

    //密码，加盐后
    pwd?: string,

    recentTaskNo?: string

}

let MEMERY_CACHE:{}|null = null;

const getCacheTmpPath = function () {
    const tmpDir = getVActBaseTmpDir();
    return resolve(tmpDir, "cache.json");
}

const put = function (cache: CacheType): Promise<void> {
    return new Promise((resl, reject) => {
        MEMERY_CACHE = null;
        cache = cache || {};
        const content = JSON.stringify(cache, null, "\t");
        const cachePath = getCacheTmpPath();
        write(cachePath, content).then(() => {
            resl();
        }).catch(err => {
            reject(err);
        });
    });
}

const get = function (): Promise<CacheType|null> {
    return new Promise((resl, reject) => {
        try {
            if(MEMERY_CACHE != null){
                resl(MEMERY_CACHE);
            }else{
                const cachePath = getCacheTmpPath();
                if (existsSync(cachePath)) {
                    MEMERY_CACHE = require(cachePath);
                }
                resl(MEMERY_CACHE);
            }
        } catch (err) {
            reject(err);
        }
    });
}

const clear = function (listener?: (file: string) => void): Promise<void> {
    const dir = getVActBaseTmpDir();
    return new Promise((resl, reject) => {
        MEMERY_CACHE = null;
        rmDir(dir, listener).then(() => {
            resl();
        }).catch(err => {
            reject(err);
        });
    });
}

export {
    CacheType,
    put,
    get,
    clear
}