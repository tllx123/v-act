import { Path, String, IO } from "@v-act/utils";
import URL from "./const/Const";
import * as needle from "needle";
import * as fs from "fs";
import * as p from "path";
import { create } from "archiver";
import vTeam from "./VTeam";
import Bundle from "./types/Bundle";

/**
 * 对账号密码进行加盐处理
 */
const enhancePwd = function (pwd: string): string {
    return String.toMD5(pwd);
}

/**
 * 检查账号密码
 * @param account string 账号
 * @param pwd String 密码(加盐后)
 * @returns Promise
 */
const checkAccountAndPwd = function (account: string, pwd: string): Promise<void> {
    return new Promise((resolve, reject) => {
        if (account !== null && account !== "" && pwd !== null && pwd !== "") {
            try {
                const url = URL.VSTORE_LOGIN_HOST.substring(URL.VSTORE_LOGIN_HOST.length - 1) == '/' ? URL.VSTORE_LOGIN_HOST + URL.VSTORE_LOGIN_URL : URL.VSTORE_LOGIN_HOST + '/' + URL.VSTORE_LOGIN_URL;
                const timestamp = new Date().getTime() + '';
                const random = String.getRandomCode(4);
                const platform = "nodejs";
                const signatureArray = [account, pwd, timestamp, random, platform];
                const signature = String.genSignature(signatureArray, false);
                const tokenObj = {
                    data: {
                        signature: signature,
                        accountId: account,
                        timestamp: timestamp,
                        random: random,
                        platform: platform
                    }
                };
                const token = 'token=' + encodeURIComponent(JSON.stringify(tokenObj));
                needle.post(url.indexOf('?') != -1 ? url + '&' + token : url + '?' + token, {}, {
                    timeout: 10000
                }, (err, resp, body) => {
                    if (err) {
                        reject(err);
                    }
                    try {
                        if (!body.success) {
                            reject(new Error(body.msg));
                        } else {
                            const data = body.data;
                            if (data.errorCode == '0') {
                                resolve();
                            } else if (data.errorCode == '40002' || data.errorCode == '40003') {
                                reject(Error("用户或密码错误！"));
                            } else {
                                reject(Error(data.errorMsg));
                            }
                        }
                    } catch (e) {
                        reject(Error("登录遇到未知问题，请联系管理员。"));
                    }
                })
            } catch (e) {
                reject(e);
            }
        } else {
            reject(Error(`未输入账号或密码！账号：${account}，密码：${pwd}`));
        }
    });
}

const getAuthCode = function (account: string, password: string, libCode: string): string {
    password = password == null ? "" : password;
    const timestamp = new Date().getTime() + '';
    const nonce = String.getRandomCode(4);
    const signatureArray = [account, password, timestamp, nonce, libCode, "dev"];
    const signature = String.genSignature(signatureArray, true);
    const authCodeStr = account + "&&" + timestamp + "&&" + nonce + "&&" + signature;
    const authCode = String.toBASE64(authCodeStr);
    return authCode;
}

const getExtendAttr = function (pluginCode: string, pluginType: string) {
    const attributeExtend = [{
        "key": "pluginType",
        "value": pluginType
    }, {
        "key": "devType",
        "value": "v-act"
    }, {
        "key": "devEnv",
        "value": "nodejs"
    }];
    attributeExtend.push({
        "key": "pluginCode",
        "value": pluginCode
    });
    const packageJsonPath = p.resolve(process.cwd(), 'package.json');
    const packageJson = module.require(packageJsonPath);
    const keywords = packageJson.keywords;
    if (keywords) {
        if (Array.isArray(keywords)) {
            keywords.forEach(keyword => {
                attributeExtend.push({
                    "key": "keyword",
                    "value": keyword
                });
            });
        } else {
            attributeExtend.push({
                "key": "keyword",
                "value": keywords
            });
        }
    }
    return JSON.stringify(attributeExtend);
}

/**
 * 上传构件到vstore
 * @returns 
 */
const uploadToVStore = function (account: string, pwd: string, pluginCode: string, pluginType: string, libCode: string, jarPath: string, symbolicName: string, version: string): Promise<void> {
    return new Promise((resolve, reject) => {
        try {
            if (!libCode) {
                return reject(Error('请输入仓库编号！'));
            }
            const url = URL.VSTORE_HOST.substring(URL.VSTORE_HOST.length - 1) == '/' ? URL.VSTORE_HOST + URL.VSTORE_DEPLOY_URL : URL.VSTORE_HOST + '/' + URL.VSTORE_DEPLOY_URL;
            const zipPath = p.resolve(jarPath, "..", "publishFiles.zip");
            const output = fs.createWriteStream(zipPath);
            const archive = create('zip', {
                zlib: { level: 9 } // Sets the compression level.
            });
            output.on('close', function () {
                needle.post(url, {
                    "compCodeVer": symbolicName + '-' + version + '.SNAPSHOT',
                    "libCode": libCode,
                    "stageCode": "dev",
                    "compType": "RuntimeJava",
                    "authCode": getAuthCode(account, pwd, libCode),
                    "compAdditionalPropJson": getExtendAttr(pluginCode, pluginType),
                    "publishFiles": fs.readFileSync(zipPath)
                }, {
                    timeout: 180000,
                    multipart: true
                }, (err, resp, body) => {
                    if (err) {
                        return reject(err);
                    }
                    const result = JSON.parse(body);
                    if (!result.success) {
                        return reject({
                            message: result.errmsg
                        });
                    }
                    return resolve();
                });
            });
            archive.on('error', reject);
            archive.pipe(output);
            archive.append(fs.createReadStream(jarPath), { name: p.basename(jarPath) });
            archive.finalize();
        } catch (err) {
            reject(err);
        }
    });
}

const _toBundleObj = function (comp: { [prop: string]: any }): Bundle {
    return {
        id: comp.id,
        compCode: comp.compCode,
        compName: comp.compName,
        symbolicName: comp.compName,
        libCode: comp.belongLib,
        createTime: comp.createTime,
        createOwnerCode: comp.createOwnerCode,
        updateTime: comp.updateTime,
        updateOwnerCode: comp.updateOwnerCode,
        fileDownUrl: comp.fileDownUrl
    };
}

const searchVActComponent = function (account: string, pwd: string, code: string): Promise<Array<Bundle>> {
    return new Promise((resolve, reject) => {
        try {
            vTeam.getProjectsByAccount(account, pwd).then((projects) => {
                try {
                    const libCodes: Array<string> = [];
                    projects.forEach(project => {
                        libCodes.push(project.libCode);
                    });
                    const params = [{
                        attributeKey: "devType",
                        queryFlag: "=",
                        attributeValue: "v-act"
                    }, {
                        attributeKey: "devEnv",
                        queryFlag: "=",
                        attributeValue: "nodejs"
                    }, {
                        attributeKey: 'pluginCode',
                        queryFlag: "like",
                        attributeValue: code
                    }]
                    let url = URL.VSTORE_HOST.substring(URL.VSTORE_HOST.length - 1) == '/' ? URL.VSTORE_HOST + URL.VSTORE_GET_COMPONENTS : URL.VSTORE_HOST + '/' + URL.VSTORE_GET_COMPONENTS;
                    url += '?';
                    url += `stageCodes=dev&compTypes=RuntimeJava&isLastVer=true`;
                    url += `&libCodes=${libCodes.join(',')}`;
                    url += `&attributeExtendEntity=${JSON.stringify(params)}`;
                    needle.post(url, {}, { timeout: 10000 }, (err, resp, body) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        if (!body.success) {
                            return reject(Error(body.msg));
                        }
                        /* 请求成功 */
                        const data = body.data;
                        if (data.isSuccess) {
                            const bundles = [];
                            data.compInstEntity.forEach((comp: { [prop: string]: any }) => {
                                bundles.push(_toBundleObj(comp));
                            });
                            resolve(data.compInstEntity);
                        } else {
                            return reject(Error(data.errorMsg));
                        }
                    });
                } catch (err) {
                    reject(err);
                }
            }).catch(err => {
                reject(err);
            });
        } catch (err) {
            reject(err);
        }
    });
}

const getVActComponent = function (libCode: string, vActName: string): Promise<Bundle> {
    return new Promise((resolve, reject) => {
        try {
            const params = [{
                attributeKey: "devType",
                queryFlag: "=",
                attributeValue: "v-act"
            }, {
                attributeKey: "devEnv",
                queryFlag: "=",
                attributeValue: "nodejs"
            },{
                attributeKey: 'pluginCode',
                queryFlag: "like",
                attributeValue: vActName
            }]
            let url = URL.VSTORE_HOST.substring(URL.VSTORE_HOST.length - 1) == '/' ? URL.VSTORE_HOST + URL.VSTORE_GET_COMPONENTS : URL.VSTORE_HOST + '/' + URL.VSTORE_GET_COMPONENTS;
            url += '?';
            url += `stageCodes=dev&compTypes=RuntimeJava&isLastVer=true`;
            url += `&libCodes=${libCode}`;
            url += `&attributeExtendEntity=${JSON.stringify(params)}`;
            needle.post(url, {}, { timeout: 10000 }, (err, resp, body) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (!body.success) {
                    return reject(Error(body.msg));
                }
                /* 请求成功 */
                const data = body.data;
                if (data.isSuccess) {
                    if (data.compInstEntity.length == 0) {
                        reject(Error(`未找到v-act组件，请检查！仓库编码：${libCode}，插件标识名称：${vActName}`));
                    }
                    resolve(_toBundleObj(data.compInstEntity[0]));
                } else {
                    return reject(Error(data.errorMsg));
                }
            });
        } catch (err) {
            reject(err);
        }
    });
}

/**
 * 下载构件
 * @param url 文件路径
 * @returns Promise
 */
const downloadBundle = function (url: string): Promise<string> {
    return new Promise((resolve, reject) => {
        try {
            needle.get(url, (error, response, body) => {
                if (error) {
                    return reject(error);
                }
                const headers = response.headers;
                let filename = "tmp.jar";
                if (headers && headers["content-disposition"]) {
                    const contentDisposition = headers["content-disposition"];
                    const list = contentDisposition.split(';');
                    if (list[0] == "attachment") {
                        const pair = list[1];
                        try {
                            filename = pair.split('=')[1];
                        } catch (err) { }
                        const tmpDir = Path.getVActRandomDir();
                        const absPath = p.resolve(tmpDir, filename);
                        IO.write(absPath, body).then(() => {
                            resolve(absPath);
                        }).catch(err => {
                            reject(err);
                        });
                    } else {
                        reject(Error("当前请求未下载任何文件！url：" + url));
                    }
                }
            });
        } catch (err) {
            reject(err);
        }
    });
}

export default {
    enhancePwd,
    checkAccountAndPwd,
    uploadToVStore,
    searchVActComponent,
    downloadBundle,
    getVActComponent
}