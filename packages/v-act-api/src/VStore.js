"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@v-act/utils");
var Const_1 = require("./const/Const");
var needle = require("needle");
var fs = require("fs");
var p = require("path");
var archiver_1 = require("archiver");
var VTeam_1 = require("./VTeam");
/**
 * 对账号密码进行加盐处理
 */
var enhancePwd = function (pwd) {
    return utils_1.String.toMD5(pwd);
};
/**
 * 检查账号密码
 * @param account string 账号
 * @param pwd String 密码(加盐后)
 * @returns Promise
 */
var checkAccountAndPwd = function (account, pwd) {
    return new Promise(function (resolve, reject) {
        if (account !== null && account !== "" && pwd !== null && pwd !== "") {
            try {
                var url = Const_1.default.VSTORE_LOGIN_HOST.substring(Const_1.default.VSTORE_LOGIN_HOST.length - 1) == '/' ? Const_1.default.VSTORE_LOGIN_HOST + Const_1.default.VSTORE_LOGIN_URL : Const_1.default.VSTORE_LOGIN_HOST + '/' + Const_1.default.VSTORE_LOGIN_URL;
                var timestamp = new Date().getTime() + '';
                var random = utils_1.String.getRandomCode(4);
                var platform = "nodejs";
                var signatureArray = [account, pwd, timestamp, random, platform];
                var signature = utils_1.String.genSignature(signatureArray, false);
                var tokenObj = {
                    data: {
                        signature: signature,
                        accountId: account,
                        timestamp: timestamp,
                        random: random,
                        platform: platform
                    }
                };
                var token = 'token=' + encodeURIComponent(JSON.stringify(tokenObj));
                needle.post(url.indexOf('?') != -1 ? url + '&' + token : url + '?' + token, {}, {
                    timeout: 10000
                }, function (err, resp, body) {
                    if (err) {
                        reject(err);
                    }
                    try {
                        if (!body.success) {
                            reject(new Error(body.msg));
                        }
                        else {
                            var data = body.data;
                            if (data.errorCode == '0') {
                                resolve();
                            }
                            else if (data.errorCode == '40002' || data.errorCode == '40003') {
                                reject(Error("用户或密码错误！"));
                            }
                            else {
                                reject(Error(data.errorMsg));
                            }
                        }
                    }
                    catch (e) {
                        reject(Error("登录遇到未知问题，请联系管理员。"));
                    }
                });
            }
            catch (e) {
                reject(e);
            }
        }
        else {
            reject(Error("\u672A\u8F93\u5165\u8D26\u53F7\u6216\u5BC6\u7801\uFF01\u8D26\u53F7\uFF1A" + account + "\uFF0C\u5BC6\u7801\uFF1A" + pwd));
        }
    });
};
var getAuthCode = function (account, password, libCode) {
    password = password == null ? "" : password;
    var timestamp = new Date().getTime() + '';
    var nonce = utils_1.String.getRandomCode(4);
    var signatureArray = [account, password, timestamp, nonce, libCode, "dev"];
    var signature = utils_1.String.genSignature(signatureArray, true);
    var authCodeStr = account + "&&" + timestamp + "&&" + nonce + "&&" + signature;
    var authCode = utils_1.String.toBASE64(authCodeStr);
    return authCode;
};
var getExtendAttr = function (pluginCode, pluginType) {
    var attributeExtend = [{
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
    var packageJsonPath = p.resolve(process.cwd(), 'package.json');
    var packageJson = module.require(packageJsonPath);
    var keywords = packageJson.keywords;
    if (keywords) {
        if (Array.isArray(keywords)) {
            keywords.forEach(function (keyword) {
                attributeExtend.push({
                    "key": "keyword",
                    "value": keyword
                });
            });
        }
        else {
            attributeExtend.push({
                "key": "keyword",
                "value": keywords
            });
        }
    }
    return JSON.stringify(attributeExtend);
};
/**
 * 上传构件到vstore
 * @returns
 */
var uploadToVStore = function (account, pwd, pluginCode, pluginType, libCode, jarPath, symbolicName, version) {
    return new Promise(function (resolve, reject) {
        try {
            if (!libCode) {
                return reject(Error('请输入仓库编号！'));
            }
            var url_1 = Const_1.default.VSTORE_HOST.substring(Const_1.default.VSTORE_HOST.length - 1) == '/' ? Const_1.default.VSTORE_HOST + Const_1.default.VSTORE_DEPLOY_URL : Const_1.default.VSTORE_HOST + '/' + Const_1.default.VSTORE_DEPLOY_URL;
            var zipPath_1 = p.resolve(jarPath, "..", "publishFiles.zip");
            var output = fs.createWriteStream(zipPath_1);
            var archive = (0, archiver_1.create)('zip', {
                zlib: { level: 9 } // Sets the compression level.
            });
            output.on('close', function () {
                needle.post(url_1, {
                    "compCodeVer": symbolicName + '-' + version + '.SNAPSHOT',
                    "libCode": libCode,
                    "stageCode": "dev",
                    "compType": "RuntimeJava",
                    "authCode": getAuthCode(account, pwd, libCode),
                    "compAdditionalPropJson": getExtendAttr(pluginCode, pluginType),
                    "publishFiles": fs.readFileSync(zipPath_1)
                }, {
                    timeout: 180000,
                    multipart: true
                }, function (err, resp, body) {
                    if (err) {
                        return reject(err);
                    }
                    var result = JSON.parse(body);
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
        }
        catch (err) {
            reject(err);
        }
    });
};
var _toBundleObj = function (comp) {
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
};
var searchVActComponent = function (account, pwd, code) {
    return new Promise(function (resolve, reject) {
        try {
            VTeam_1.default.getProjectsByAccount(account, pwd).then(function (projects) {
                try {
                    var libCodes_1 = [];
                    projects.forEach(function (project) {
                        libCodes_1.push(project.libCode);
                    });
                    var params = [{
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
                        }];
                    var url = Const_1.default.VSTORE_HOST.substring(Const_1.default.VSTORE_HOST.length - 1) == '/' ? Const_1.default.VSTORE_HOST + Const_1.default.VSTORE_GET_COMPONENTS : Const_1.default.VSTORE_HOST + '/' + Const_1.default.VSTORE_GET_COMPONENTS;
                    url += '?';
                    url += "stageCodes=dev&compTypes=RuntimeJava&isLastVer=true";
                    url += "&libCodes=" + libCodes_1.join(',');
                    url += "&attributeExtendEntity=" + JSON.stringify(params);
                    needle.post(url, {}, { timeout: 10000 }, function (err, resp, body) {
                        if (err) {
                            reject(err);
                            return;
                        }
                        if (!body.success) {
                            return reject(Error(body.msg));
                        }
                        /* 请求成功 */
                        var data = body.data;
                        if (data.isSuccess) {
                            var bundles_1 = [];
                            data.compInstEntity.forEach(function (comp) {
                                bundles_1.push(_toBundleObj(comp));
                            });
                            resolve(data.compInstEntity);
                        }
                        else {
                            return reject(Error(data.errorMsg));
                        }
                    });
                }
                catch (err) {
                    reject(err);
                }
            }).catch(function (err) {
                reject(err);
            });
        }
        catch (err) {
            reject(err);
        }
    });
};
var getVActComponent = function (libCode, vActName) {
    return new Promise(function (resolve, reject) {
        try {
            var params = [{
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
                    attributeValue: vActName
                }];
            var url = Const_1.default.VSTORE_HOST.substring(Const_1.default.VSTORE_HOST.length - 1) == '/' ? Const_1.default.VSTORE_HOST + Const_1.default.VSTORE_GET_COMPONENTS : Const_1.default.VSTORE_HOST + '/' + Const_1.default.VSTORE_GET_COMPONENTS;
            url += '?';
            url += "stageCodes=dev&compTypes=RuntimeJava&isLastVer=true";
            url += "&libCodes=" + libCode;
            url += "&attributeExtendEntity=" + JSON.stringify(params);
            console.log("url");
            console.log(url);
            needle.post(url, {}, { timeout: 10000 }, function (err, resp, body) {
                if (err) {
                    reject(err);
                    return;
                }
                if (!body.success) {
                    return reject(Error(body.msg));
                }
                /* 请求成功 */
                var data = body.data;
                if (data.isSuccess) {
                    if (data.compInstEntity.length == 0) {
                        reject(Error("\u672A\u627E\u5230v-act\u7EC4\u4EF6\uFF0C\u8BF7\u68C0\u67E5\uFF01\u4ED3\u5E93\u7F16\u7801\uFF1A" + libCode + "\uFF0C\u63D2\u4EF6\u6807\u8BC6\u540D\u79F0\uFF1A" + vActName));
                    }
                    resolve(_toBundleObj(data.compInstEntity[0]));
                }
                else {
                    return reject(Error(data.errorMsg));
                }
            });
        }
        catch (err) {
            reject(err);
        }
    });
};
/**
 * 下载构件
 * @param url 文件路径
 * @returns Promise
 */
var downloadBundle = function (url) {
    return new Promise(function (resolve, reject) {
        try {
            needle.get(url, function (error, response, body) {
                if (error) {
                    return reject(error);
                }
                var headers = response.headers;
                var filename = "tmp.jar";
                if (headers && headers["content-disposition"]) {
                    var contentDisposition = headers["content-disposition"];
                    var list = contentDisposition.split(';');
                    if (list[0] == "attachment") {
                        var pair = list[1];
                        try {
                            filename = pair.split('=')[1];
                        }
                        catch (err) { }
                        var tmpDir = utils_1.Path.getVActRandomDir();
                        var absPath_1 = p.resolve(tmpDir, filename);
                        utils_1.IO.write(absPath_1, body).then(function () {
                            console.log("absPath");
                            console.log(absPath_1);
                            resolve(absPath_1);
                        }).catch(function (err) {
                            reject(err);
                        });
                    }
                    else {
                        reject(Error("当前请求未下载任何文件！url：" + url));
                    }
                }
            });
        }
        catch (err) {
            reject(err);
        }
    });
};
exports.default = {
    enhancePwd: enhancePwd,
    checkAccountAndPwd: checkAccountAndPwd,
    uploadToVStore: uploadToVStore,
    searchVActComponent: searchVActComponent,
    downloadBundle: downloadBundle,
    getVActComponent: getVActComponent
};
//# sourceMappingURL=VStore.js.map