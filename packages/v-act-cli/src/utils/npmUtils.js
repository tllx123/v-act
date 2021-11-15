/**
 * npm相关的工具方法
 */
 const commandUtils = require("./commandUtils");

 function getNpmPackageInfo(packageName){
     const prose = new Promise((resolve, reject) => {
         const promise = commandUtils.execute(`npm view ${packageName} --json`);
         promise.then((json) => {
             let infoObj;
             if (json) {
                 infoObj = JSON.parse(json);
             }
             resolve(infoObj);
         }).catch(err => {
             reject(err);
         });
     });
     return prose;
 }
 /**
  * 获取包版本
  * @param {String} packageName npm包名
  */
 function getVersion(packageName){
     const prose = new Promise((resolve, reject)=>{
         const promise = getNpmPackageInfo(packageName);
         promise.then((infoObj)=>{
             let version;
             if(infoObj && infoObj.version){
                 version = infoObj.version;
             }
             resolve(version);
         }).catch(reject);
     });
     return prose;
 }
 /**
  * 获取下载路径
  * @param {String} packageName npm包名
  */
 function getDownloadUrl(packageName) {
     const prose = new Promise((resolve, reject)=>{
         const promise = getNpmPackageInfo(packageName);
         promise.then((infoObj)=>{
             let url;
             if(infoObj && infoObj.dist){
                 url = infoObj.dist.tarball;
             }
             resolve(url);
         }).catch(reject);
     });
     return prose;
 }
 module.exports = {
     getDownloadUrl,
     getVersion
 }