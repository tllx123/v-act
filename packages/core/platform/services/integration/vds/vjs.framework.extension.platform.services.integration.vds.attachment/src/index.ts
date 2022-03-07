/**
 * 附件相关的方法
 * @desc 提供与附件相关的一系列接口，使用前请先import：vds.import("vds.attachment.*")
 * @namespace vds/attachment
 * @module attachment
 * @catalog 工具方法/附件
 * @example
 * vds.import("vds.attachment.*");
 * vds.attachment.preview("7b88f8aff9fb47d48e1b555201963dc9");
 */

var vds = window.vds
if (!vds) {
  vds = {}
  window.vds = vds
}
var attachment = vds.attachment
if (!attachment) {
  attachment = {}
  vds.attachment = attachment
}

exports = attachment

var sandbox, dcs

export function initModule(sBox) {
  sandbox = sBox
  dcs = sBox.getService('vjs.framework.extension.platform.services.Dcs')
}
/**
 * 根据文件id预览文件
 * @param {String} fileId 文件id
 * @returns {Promise}
 * @example
 * var promise = vds.attachment.preview("7b88f8aff9fb47d48e1b555201963dc9");
 * promise.then(function(){
 * 	console.log("预览成功");
 * }).catch(function(){
 * 	console.log("预览失败");
 * })
 * */
export function preview(fileId) {
  return new Promise(function (resolve, reject) {
    try {
      if (!fileId) {
        reject(vds.exception.newConfigException('预览的文件id不能为空'))
        return
      }
      dcs.previewByFileId(fileId, resolve, reject)
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * 转换文件id
 * @param {String} fileId 文件id
 * @returns {Promise}
 * @example
 * var promise = vds.attachment.convert("7b88f8aff9fb47d48e1b555201963dc9");
 * promise.then(function(datas){
 * 	console.log("转换成功，返回数据：" + JSON.stringify(datas));
 * }).catch(function(err){
 * 	console.log("转换失败");
 * })
 * */
export function convert(fileId) {
  return new Promise(function (resolve, reject) {
    try {
      if (!fileId) {
        reject(vds.exception.newConfigException('转换的文件id不能为空'))
        return
      }
      dcs.conversionByFileId(fileId, resolve, reject)
    } catch (e) {
      reject(e)
    }
  })
}

module.exports = exports
