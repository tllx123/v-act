var path = require("path");
var fs = require("fs");
/**
 * 创建不存在的文件目录
 * @param {String} filepath 文件路径
 */
function mkdir(filepath) {
    let dirCache = {};
    const arr = filepath.replace(/\\/g, "/").split('/');
    let dir = arr[0];
    for (let i = 1; i <= arr.length; i++) {
        if (!dirCache[dir] && !fs.existsSync(dir)) {
            dirCache[dir] = true;
            fs.mkdirSync(dir);
        }
        dir = dir + '/' + arr[i];
    }
}
function getFile(baseDir, nowDir, excludeDirNames) {
    let allFilePaths = [];
    let filePaths = fs.readdirSync(nowDir);
    if (filePaths) {
        filePaths.forEach(fileName => {
            if (!excludeDirNames || excludeDirNames.indexOf(fileName) == -1) {
                const _p = path.join(nowDir, fileName);
                const state = fs.statSync(_p);
                if (state.isFile()) {
                    const rePath = path.relative(baseDir, _p);
                    if(allFilePaths.indexOf(rePath) == -1 && rePath != "" && rePath!=null ){
                        allFilePaths.push(rePath);
                    }else{
                        console.warn(nowDir);
                    }
                } else {
                    allFilePaths = allFilePaths.concat(getFile(baseDir, _p, excludeDirNames));
                }
            }
        });
    }
    return allFilePaths;
}
/**
 * 获取当前目录下的所有文件
 * @param {String} dir 文件夹的绝对路径
 * @param {Array<excludeDirNames>} excludeDirs 排除的目录名称
 * @returns {Array<String>} 所有文件的相对路径
 */
function getFiles(dir, excludeDirNames) {
    let allFilePaths = getFile(dir, dir, excludeDirNames);
    return allFilePaths;
}
/**
 * 复制文件夹所有文件到指定文件夹
 * @param {String} sourceDir 来源文件夹
 * @param {String} targetDir 目标文件夹
 * @param {Function} handle 文件处理回调
 * @returns 
 */
function copy(sourceDir, targetDir, handle) {
    if(typeof(handle) != "function"){//如果不需要指定处理函数，则直接使用node fs的复制接口
        return fs.copySync(templateDir, appPath);
    }
    if (!fs.existsSync(sourceDir)) {//来源目录不存在则抛错
        throw new Error("source dir misss：" + sourceDir);
    }
    if (!targetDir) {//目标目录未空则抛错
        throw new Error("target dir misss：" + targetDir);
    }
    if (!fs.existsSync(targetDir)) {//目标目录不存在时自动创建
        mkdir(targetDir);
    }
    let filePaths = getFiles(sourceDir);//获取全部文件列表
    filePaths.forEach((relPath)=>{
        let tarPath = path.join(targetDir, relPath);
        if(!tarPath){
            return;
        }
        const index = tarPath.replace(/\\/g, "/").lastIndexOf("/");
        const temPath = tarPath.substring(0,index);
        if (!fs.existsSync(temPath)) {//构件目录函数
            mkdir(temPath);
        }
        fs.copyFileSync(path.join(sourceDir, relPath), tarPath);
        handle(tarPath);//由用户自行处理复制后的文件
    })
}
module.exports = {
    getFiles,
    copy
}