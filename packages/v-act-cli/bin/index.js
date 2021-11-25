#!/usr/bin/env node


const childProcess = require('child_process');
const path = require('path');
const fs = require("fs");
const {init} = require("../src/questions");
const configUtils = require("../src/utils/configUtils");

//执行创建项目的基础路径
const baseDir = path.resolve('./');
//耗时记录
const startTime = new Date().getTime();
//项目类型对应的模板
const templates = configUtils.get("Templates");
const run = async ()=>{
    //项目编码
    let projectName = "demo";
    //项目类型
    let projectType = "win";
    let isError = false;
    //项目初始化的引导问题
    const promise = init();
    promise.then((quesResults)=>{
        projectType = quesResults.projectType;
        projectName = quesResults.projectName;
    }).catch((error)=>{
        console.error(`未能正常获取项目基础信息，原因： ${error}`);
        isError = true;
    })
    await Promise.all([promise]);
    if(isError){
        return;
    }
    const tempalteName = templates[projectType];
    if(!tempalteName){
        const info = configUtils.get("ProjectTypes");
        const typeName = info && info[projectType] || projectType;
        console.log(`暂不支持构建此类型【${typeName}】的项目`);
        process.exit(1);
        return;
    }
    //创建项目命令的基础路径
    const projectPath = path.join(baseDir, projectName);
    if(fs.existsSync(projectPath)){
        console.warn(`当前目录下已有同名的文件夹${projectName}！`);
        process.exit(1);
        return;
    }
    //实际执行的命令
    // const cmd = `npm create react-v3-app ${projectName} --template ${tempalteName}`;
    // const cmd = `npm run vact-app ${projectName} --template ${tempalteName}`;
    console.log("开始构建项目，请耐心等候几分钟....");
    // let child_pro = childProcess.exec(cmd,{
    //     encoding: "binary"
    // }, function(error, stdout, stderr) {//命令执行完成的回调
    let child_pro = childProcess.fork(path.join(__dirname,"../index.js"),[`${projectName}`,'--template',`${tempalteName}`],{
        cwd: process.cwd(),
        silent: false
    });
    child_pro.on("close",()=>{
        // const templatePath = path.join(process.cwd(), `${projectName}/node_modules/${tempalteName}`)
        // console.log("项目路径："+templatePath);
        console.log("项目创建完成，总耗时(毫秒)：" + ((new Date()).getTime() - startTime));
        process.exit(1);
    });
    
    // //监听子进程输出数据
    // child_pro.stdout.on("data",(data)=>{
    //     console.log(`${data}`);
    // })
    // child_pro.stderr.on("data",(err)=>{
    //     console.log(`${err}`);
    // })
}
run();