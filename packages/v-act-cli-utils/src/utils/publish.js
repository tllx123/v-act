const p = require("path");
const program = require('commander');
const inquirer = require('inquirer');
const vActApi = require('@v-act/api');
const vActBundle = require("@v-act/bundle");
const utils = require("@v-act/utils");
const pack = require("../pack");

/**
 * 获取账号、密码，如未设置或缓存中不存在，将以向导的方式要求输入
 * @param {Object} options 
 * @returns Promise
 */
const getAccountAndPwd = function (context, options) {
    return new Promise((resolve, reject) => {
        utils.Cache.get().then((cache) => {
            const questions = [];
            const account = options.account || (cache ? cache.account: null);
            //vteam账号
            if (!account) {
                questions.push({
                    type: 'input',
                    message: '请输入VStore账号：',
                    name: 'account',
                    validate: function (input) {
                        var done = this.async();
                        if (!input || !input.trim()) {
                            done('请输入VStore账号：');
                            return;
                        } else {
                            done(null, true);
                        }
                    }
                });
            }
            //vteam密码
            let pwd = options.pwd;
            if (!pwd) {
                pwd = cache ? cache.pwd:null;
                if (!pwd) {
                    questions.push({
                        type: 'password',
                        message: '请输入VStore密码：',
                        name: 'pwd',
                        validate: function (input) {
                            var done = this.async();
                            if (!input || !input.trim()) {
                                done('请输入VStore密码：');
                                return;
                            } else {
                                done(null, true);
                            }
                        }
                    });
                }
            } else {
                context.extractPwd = pwd;
                pwd = vActApi.VStore.enhancePwd(pwd);
            }
            if (questions.length > 0) {
                inquirer.prompt(questions).then((answer) => {
                    utils.Console.log("正在进VStore账号、密码校验");
                    context.extractPwd = answer.pwd;
                    //对密码进行加盐处理
                    answer.pwd = vActApi.VStore.enhancePwd(answer.pwd);
                    const promise = vActApi.VStore.checkAccountAndPwd(answer.account, answer.pwd);
                    promise.then(() => {
                        utils.Console.log("VStore账号、密码校验完成");
                        context.account = answer.account;
                        context.pwd = answer.pwd;
                        resolve();
                    }).then(err => {
                        reject(err);
                    });
                }).catch(err => {
                    reject(err);
                });
            } else {
                context.account = account;
                context.pwd = pwd;
                resolve();
            }
        }).catch(err => {
            reject(err);
        });
    });
}

/**
 * 获取vteam单号
 * @param {Object} context 
 * @returns 
 */
const getVTeamTaskNo = function (context) {
    return new Promise((resolve, reject) => {
        try {
            utils.Cache.get().then((cache) => {
                //vteam单号
                let taskNo = options.taskNo || "";
                taskNo = taskNo.trim();
                if (!taskNo) {
                    const questions = [{
                        type: 'input',
                        message: '请输入VTeam单号：',
                        name: 'taskNo',
                        validate: function (input) {
                            var done = this.async();
                            if (!input || !input.trim()) {
                                done('请输入VTeam单号：');
                                return;
                            } else {
                                done(null, true);
                            }
                        }
                    }];
                    const recentTaskNo = cache ? cache.recentTaskNo:null;
                    if (recentTaskNo) {
                        questions[0].default = recentTaskNo;
                    }
                    inquirer.prompt(questions).then((answer) => {
                        context.taskNo = answer.taskNo;
                        resolve();
                    }).catch(err => {
                        reject(err);
                    });
                } else {
                    context.taskNo = taskNo;
                    resolve();
                }
            }).catch(err => {
                reject(err);
            });
        } catch (err) {
            reject(err);
        }
    });
}

/**
 * 获取VTeam单信息
 * @param {Object} context 
 * @returns 
 */
const getVTeamTask = function (context) {
    return new Promise((resolve, reject) => {
        utils.Console.log("开始校验VTeam单号");
        vActApi.VTeam.checkTaskNo(context.account, context.pwd, context.taskNo).then((task) => {
            utils.Console.log("VTeam单号校验完成");
            context.task = task;
            resolve();
        }).catch(err => {
            reject(err);
        });
    });
}

/**
 * 缓存信息
 * @param {Object} cfg 
 * @returns 
 */
const cacheInfo = function (context) {
    return new Promise((resolve, reject) => {
        try {
            const cache = {
                account : context.account,
                extractPwd: context.extractPwd,
                pwd : context.pwd,
                recentTaskNo : context.taskNo
            };
            utils.Cache.put(cache).then(() => {
                resolve();
            }).catch(err => {
                reject(err);
            });
        } catch (err) {
            reject(err);
        }
    });
}
/**
 * 将插件打包成tgz
 * @returns Promise
 */
const packPlugin = function (context) {
    return new Promise((resolve, reject) => {
        try {
            pack.packToNodejsPlugin().then((tgzPath) => {
                context.tgzPath = tgzPath;
                resolve();
            }).catch(err => {
                reject(err);
            });
        } catch (err) {
            reject(err);
        }
    });
}

/**
 * 生成v3执行系统构件
 * @param {String}} tgzPath 
 */
const toV3ExEBundle = function (context) {
    return new Promise((resolve, reject) => {
        const pluginPath = process.cwd();
        const packageJson = require(p.resolve(pluginPath, "package.json"));
        const pluginCode = utils.String.enhancePluginName(packageJson.name);
        const handle = (res) => {
            context.pluginCode = res.pluginCode;
            context.pluginVersion = res.pluginVersion;
            context.symbolicName = res.symbolicName;
            context.jarPath = res.jarPath;
            context.version = packageJson.version;
            vActBundle.clearV3ExEBundle(pluginPath).then(() => {
                resolve();
            }).catch(err => {
                reject(err);
            });
        }
        pack.packToV3ExEBundle(context.account, context.tgzPath, utils.Path.getVActComponentDir(pluginCode), context.isProject === true).then(handle).catch(err => {
            reject(err);
        });
    });
}

/**
 * 获取vteam项目信息
 * @param {Object} context 
 * @returns 
 */
const getProjectInfo = function (context) {
    return new Promise((resolve, reject) => {
        utils.Console.log("开始获取项目信息");
        const task = context.task;
        vActApi.VTeam.getProjectInfo(task.projectId).then((project) => {
            utils.Console.log("项目信息获取完成");
            context.project = project;
            resolve();
        }).catch(err => {
            reject(err);
        });
    });
}

/**
 * 上传构件到VStore
 */
const uploadToVStore = function (context) {
    return new Promise((resolve, reject) => {
        utils.Console.log("开始上传构件到VStore");
        vActApi.VStore.uploadToVStore(
            context.account,
            context.pwd,
            context.pluginCode,
            "component",
            context.project.libCode,
            context.jarPath,
            context.symbolicName,
            context.version
        ).then(() => {
            utils.Console.log("构件上传完成");
            resolve();
        }).catch(err => {
            reject(err);
        });
    });
}

const appendInfoToVTeamTask = function (context) {
    return new Promise((resolve, reject) => {
        utils.Console.log("开始添加信息VTeam任务单");
        vActApi.VTeam.addInfoToVteam(context.account, {
            symbolicName: context.symbolicName,
            version: context.pluginVersion,
            taskIds: [context.task.id]
        }).then(() => {
            utils.Console.log("VTeam任务单信息添加完成");
            resolve();
        }).catch(err => {
            reject(err);
        });
    });
}

const publish =  function(type){

    program.option('-a, --account <account>', '账号名')
    .option('-p, --pwd <pwd>', '密码')
    .option('-n, --no <no>', 'VTeam单号');

    program.parse(process.argv);

    const options = program.opts();

    const context = {
        isProject: type === "project"
    };
    
    //组装车间
    getAccountAndPwd(context, options)
        .then(() => {
            return getVTeamTaskNo(context);
        })
        .then(() => {
            return getVTeamTask(context);
        })
        .then(() => {
            return cacheInfo(context);
        })
        .then(() => {
            return packPlugin(context);
        })
        .then(() => {
            return toV3ExEBundle(context);
        })
        .then(() => {
            return getProjectInfo(context);
        })
        .then(() => {
            return uploadToVStore(context);
        })
        .then(() => {
            return appendInfoToVTeamTask(context);
        })
        .then(() => {
            utils.Console.log("VAct构件提交完成！");
        })
        .catch(err => {
            utils.Console.error(err);
        });
}


module.exports = {
    publishComponent:function(){
        publish("component");
    },
    publishProject:function(){
        publish("project");
    }
}