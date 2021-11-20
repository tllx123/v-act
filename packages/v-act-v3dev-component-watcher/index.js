const chokidar = require('chokidar');
const path = require("path");
const fs = require("fs");
const juicer = require("juicer");
const xml2js = require("xml2js");
const os = require("os");
let currentWindow = null;
let watcherReady = false;

exports.watch = function(v3devCmpDir){
    if(!v3devCmpDir){
        throw Error("未传递开发系统业务构件目录，监听失败!");
    }
    if(fs.existsSync(v3devCmpDir)){
        const cmpDir = path.resolve(v3devCmpDir,"Component");
        if(fs.existsSync(cmpDir)){
            const watcher = chokidar.watch(cmpDir,{
                awaitWriteFinish : true
            });
            watcher.on("ready",()=>{
                watcherReady = true;
            });
            watcher.on("unlink",(p)=>{
                if(isWindowConfigChanged(p)){
                    const info = getPreWinodw();
                    const params = {
                        componentCode: info ? info.componentCode:null,
                        windowCode: info ? info.windowCode:null
                    };
                    const tempateDir = path.resolve(__dirname,"template");
                    const indexPath = path.resolve(tempateDir,"index.tsx");
                    fileTemplateToString(indexPath,params).then((content)=>{
                        const parentDir = getVActPagesPath();
                        const absPath = path.resolve(parentDir,"index.tsx");
                        mkdir(path.resolve(absPath,".."));
                        fs.writeFileSync(absPath,content);
                        const cache = getCache();
                        if(cache){
                            for (const key in cache) {
                                if (Object.hasOwnProperty.call(cache, key)) {
                                    const ph = cache[key];
                                    if(ph == p){
                                        const [componentCode,windowCode] = key.split(".");
                                        rm(path.resolve(parentDir,componentCode,windowCode));
                                        const componentDir = path.resolve(parentDir,componentCode);
                                        const children = fs.readdirSync(componentDir);
                                        if(!children || children.length == 0){
                                            rm(componentDir);
                                        }
                                        try{
                                            delete cache[key];
                                            saveCache(cache);
                                        }catch(e){}
                                        break;
                                    }
                                }
                            }
                        }
                        markCurrentWindow(info.windowCode);
                    }).catch(err=>{
                        console.error(err);
                    });
                }
            });
            watcher.on("add",(p)=>{
                handleV3WindowChanged(p,v3devCmpDir);
            });
            watcher.on("change",(p)=>{
                handleV3WindowChanged(p,v3devCmpDir);
            });
        }
    }
}

const getPreWinodw = function(){
    const pagesPath = getVActPagesPath();
    if(fs.existsSync(pagesPath)){
        const componentCodes = fs.readdirSync(pagesPath);
        if(componentCodes && componentCodes.length>0){
            for (let index = 0; index < componentCodes.length; index++) {
                const componentCode = componentCodes[index];
                const componentCodePath = path.resolve(pagesPath,componentCode);
                const stat = fs.statSync(componentCodePath);
                if(stat.isDirectory()){
                    const windowCodes = fs.readdirSync(componentCodePath);
                    for (let i = 0; i < windowCodes.length; i++) {
                        const windowCode = windowCodes[i];
                        if(isWindowDir(path.resolve(componentCodePath,windowCode))){
                            return {
                                componentCode: componentCode,
                                windowCode: windowCode
                            }
                        }
                    }
                }
                
            }
        }
    }
    return null;
}

const rm = function(p){
    if(fs.existsSync(p)){
        const stat = fs.statSync(p);
        if(stat.isDirectory()){
            const children = fs.readdirSync(p);
            children.forEach(child => {
                rm(path.resolve(p,child));
            });
            fs.rmdirSync(p);
        }else{
            fs.unlinkSync(p);
        }
    }
}

const isWindowDir = function(dir){
    return fs.existsSync(path.resolve(dir,"index.tsx"));
}

const handleV3WindowChanged = function(p, v3devCmpDir){
    if(isWindowConfigChanged(p)){
        const promise = parseV3DevWindow(p);
        promise.then((win)=>{
            const form = win.form;
            const windowCode = form.$.code;
            const componentCode = path.basename(v3devCmpDir);
            const windowScript = v3WindowToScript(form);
            const params = {
                componentCode,
                windowCode,
                windowScript
            };
            const tempateDir = path.resolve(__dirname,"template");
            const windowTemplatePath = path.resolve(tempateDir,"${componentCode}","${windowCode}","index.tsx");
            let windowPath;
            const files = [];
            templateToString(windowTemplatePath,windowTemplatePath,params).then((wPath)=>{
                windowPath = wPath;
                return fileTemplateToString(windowTemplatePath,params);
            }).then(res=>{
                const windowRelativePath = path.relative(tempateDir,windowPath);
                files.push({
                    path: windowRelativePath,
                    content: res
                });
                if(currentWindowChanged(windowCode)){
                    const indexPath = path.resolve(tempateDir,"index.tsx");
                    return new Promise((resolve,reject)=>{
                        fileTemplateToString(indexPath,params).then((content)=>{
                            files.push({
                                path: "index.tsx",
                                content
                            });
                            markCurrentWindow(windowCode);
                            let cache = getCache()||{};
                            cache[componentCode+"."+windowCode] = p;
                            saveCache(cache);
                            resolve();
                        }).catch(err=>{
                            reject(err);
                        });
                    });
                }else{
                    return Promise.resolve();
                }
            }).then(()=>{
                const parentDir = getVActPagesPath();
                files.forEach(file=>{
                    const absPath = path.resolve(parentDir,file.path);
                    mkdir(path.resolve(absPath,".."));
                    fs.writeFileSync(absPath,file.content);
                });
            }).catch(err=>{
                console.error(err);
            });
        }).catch(err=>{
            console.error(err);
        });
    }
}

const mkdir = function(dir){
    const parent = path.resolve(dir,'..');
    if(!fs.existsSync(parent)){
        mkdir(parent);
    }
    if(!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
}

const v3WindowToScript = function(form){
    const controls = form.controls;
    const script = [];
    if(controls){
        for (const type in controls) {
            if (Object.hasOwnProperty.call(controls, type) && ["JGTextBox","JGButton"].indexOf(type) != -1) {
                const widget = controls[type];
                const attrs = widget.$;
                script.push("<");
                script.push(type);
                script.push(" ");
                for (const attr in attrs) {
                    if (Object.hasOwnProperty.call(attrs, attr)) {
                        const attrVal = attrs[attr];
                        script.push(attr);
                        script.push("=\"");
                        script.push(attrVal);
                        script.push("\" ");
                    }
                }
                script.push("></");
                script.push(type);
                script.push(">");
            }
        }
    }
    return script.join("");
}

const parseV3DevWindow = function(windowPath){
    return new Promise((resolve,reject)=>{
        if(fs.existsSync(windowPath)){
            fs.readFile(windowPath,(err,data)=>{
                if(err){
                    return reject(err);
                }
                var parser = new xml2js.Parser({
                    explicitArray : false
                });
                parser.parseStringPromise(data).then(res=>{
                    resolve(res);
                }).catch(e=>{
                    reject(e);
                });
            });
        }else{
            reject(Error("文件不存在！path:"+windowPath));
        }
    });
}
const getCachePath = function(){
    return path.resolve(os.tmpdir(),"v-act-watcher","metadata.json");
}

const saveCache = function(cache){
    const cachePath = getCachePath();
    mkdir(path.resolve(cachePath,".."));
    fs.writeFileSync(cachePath,JSON.stringify(cache,null,"\t"));
}

const getCache = function(){
    const cachePath = getCachePath();
    if(fs.existsSync(cachePath)){
        try{
            const cache = require(cachePath);
            return cache;
        }catch(e){}
    }
    return null;
}

const getVActPagesPath = function(){
    return path.resolve(process.cwd(),"pages");
}

const isWindowConfigChanged = function(p){
    return path.extname(p) == ".ui" && watcherReady;
}

const currentWindowChanged = function(windowCode){
    return currentWindow !== windowCode;
}

const markCurrentWindow = function(windowCode){
    currentWindow = windowCode;
}

const TEMPLATE_CACHE = {};

const FILE_TEMPLATE_CACHE = {};

const fileTemplateToString = function(absPath,params){
    return new Promise(function(resolve,reject){
        let template = FILE_TEMPLATE_CACHE[absPath];
        if(!template){
            if(fs.existsSync(absPath)){
                fs.readFile(absPath,(err,data)=>{
                    if(err){
                        return reject(err);
                    }
                    template = juicer(new String(data));
                    FILE_TEMPLATE_CACHE[absPath] = template;
                    resolve(template.render(params));
                });
            }
        }else{
            resolve(template.render(params));
        }
    });
}

const templateToString = function(id,content,params){
    return new Promise(function(resolve,reject){
        try{
            let template = TEMPLATE_CACHE[id];
            if(!template){
                template = juicer(content);
                TEMPLATE_CACHE[id] = template;
            }
            resolve(template.render(params));
        }catch(err){
            reject(err);
        }
    });
    
}


