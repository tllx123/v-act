import { FileUtil as fileUtil } from '@v-act/vjs.framework.extension.platform.services.native.mobile.fileoperation'
import { DialogUtil as dialogUtil } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.dialog'
import { ProgressBarUtil as progressbar } from '@v-act/vjs.framework.extension.ui.common.plugin.services.progressbar'

let flag = false
let count = 1

export function initModule(sb) {
  let FileTransferService = sb.getService(
    'vjs.framework.extension.platform.services.native.mobile.FileTransfer'
  )
  FileTransferService.putInstance(exports)
}

/**
 * 初始化cordova的文件传输插件，注为全局对象
 * @param {Object} new FileTransfer() 全局调用对象
 */
if (window.VJSBridge) {
  window.VJSBridge.plugins.vplatform.FileTransfer = new FileTransfer()
}

const filetransferUpload = function (fileUrl, callback) {
  let serverPath =
    GlobalVariables.getServerUrl() +
    '/module-operation!executeOperation?operation=FileUpload'
  let resultFileIDs = []
  let fileInfos = []
  let result = {}
  let win = function (r) {
    count++
    if (1 == fileUrl.length) {
      if (flag) {
        progressbar.hideProgress()
      }
      if (isFunction(callback)) {
        let obj = jQuery.parseJSON(r.response)
        //上传完最后一个文件时进行回调
        fileInfos.push(obj)
        if (resultFileIDs.length == fileUrl.length - 1) {
          if (obj.data && typeof obj.data == Array) {
            resultFileIDs.push(obj.data[0].id)
          } else {
            resultFileIDs.push(obj.id)
          }
          result.success = true
          result.fileIds = resultFileIDs
          callback(resultFileIDs, fileInfos)
        } else {
          if (obj.data && typeof obj.data == Array) {
            resultFileIDs.push(obj.data[0].id)
          } else {
            resultFileIDs.push(obj.id)
          }
        }
      }
    } else {
      progressbar.showProgress('正在上传' + count + '/' + fileUrl.length)
      if (isFunction(callback)) {
        let obj = jQuery.parseJSON(r.response)
        fileInfos.push(obj)
        //上传完最后一个文件时进行回调
        if (resultFileIDs.length == fileUrl.length - 1) {
          if (flag) {
            progressbar.hideProgress()
          }
          if (obj.data && typeof obj.data == Array) {
            resultFileIDs.push(obj.data[0].id)
          } else {
            resultFileIDs.push(obj.id)
          }
          result.success = true
          result.fileIds = resultFileIDs
          callback(resultFileIDs, fileInfos)
        } else {
          if (obj.data && typeof obj.data == Array) {
            resultFileIDs.push(obj.data[0].id)
          } else {
            resultFileIDs.push(obj.id)
          }
        }
      }
    }
  }
  let isPrompted = false
  let fail = function (error) {
    if (flag) {
      progressbar.hideProgress()
    }
    if (isFunction(callback)) {
      console.log(JSON.stringify(error))
      if (isPrompted == false) {
        if (error.code == 1) {
          dialogUtil.propmtDialog('文件上传失败,不合法的URL！', null, false)
        } else if (error.code == 3) {
          dialogUtil.propmtDialog(
            '文件上传失败,服务器或网络异常，请稍后再试！',
            null,
            false
          )
        } else {
          dialogUtil.propmtDialog('文件上传失败,请稍后再试！', null, false)
        }
        isPrompted = true
        result.success = false
        result.errorCode = error.code
        callback(result)
        return
      }
    }
  }
  count = 1
  for (let i = 0; i < fileUrl.length; i++) {
    if (fileUrl.length == 1) {
      progressbar.showProgress('正在上传...')
    } else {
      if (i == 1) {
        progressbar.showProgress('正在上传 1/' + fileUrl.length)
      }
    }
    if (i == fileUrl.length - 1) {
      flag = true
    }
    let localFilePath = fileUrl[i]
    let options = new FileUploadOptions()
    options.fileKey = localFilePath
    options.fileName = localFilePath.substr(localFilePath.lastIndexOf('/') + 1)
    //			options.mimeType = "text/plain";
    //			options.params = {};
    let ft = new FileTransfer()
    ft.upload(localFilePath, encodeURI(serverPath), win, fail, options)
  }
}

const filetransferDownload = function (
  fileID,
  fileName,
  success,
  error,
  onProgress
) {
  if (!fileName) {
    dialogUtil.propmtDialog(
      '文件下载失败！文件名不存在，请检查文件名是否正确！',
      null,
      false
    )
  }
  let fileTransfer = new FileTransfer()
  fileTransfer.onprogress = onProgress

  let serverPath =
    'module-operation!executeOperation?operation=FileDown&token=%7B%22data%22%3A%7B%22dataId%22%3A%22' +
    fileID +
    '%22%7D%7D'
  if (window.GlobalVariables) {
    let host = GlobalVariables.getServerPath() + '/'
    serverPath = host + serverPath
    let uri = encodeURI(serverPath) //服务端下载地址
    if (cordova.platformId == 'android') {
      let fileURL =
        cordova.file.externalRootDirectory +
        'path/to/downloads/' +
        fileID +
        fileName.substring(fileName.lastIndexOf('.'), fileName.length) //Android版本地存放地址
    } else {
      let fileURL =
        'cdvfile://localhost/persistent/path/to/downloads/' +
        fileID +
        fileName.substring(fileName.lastIndexOf('.'), fileName.length) //iOS版本地存放地址
    }

    fileTransfer.download(
      uri,
      fileURL,
      function (entry) {
        if (isFunction(success)) {
          fileUtil.setLocalFlag(fileID)
          success(entry.toURL())
        }
      },
      function (errorObJ) {
        if (isFunction(error)) {
          let back = {}
          back.errorSource = errorObJ.source
          back.errorTarget = errorObJ.target
          back.errorCode = errorObJ.code
          error(back)
        }
      },
      false,
      {
        headers: {
          Authorization: 'Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=='
        }
      }
    )
  } else {
    dialogUtil.propmtDialog('目前暂不支持PC端访问下载！', null, false)
  }
}

exports.supportOnProgress = window.VJSBridge
  ? window.VJSBridge.plugins.vplatform.FileTransfer.supportOnProgress
  : null

function isFunction(arg) {
  if (typeof arg == 'function') {
    return true
  }
  return false
}
export { filetransferDownload, filetransferUpload }
