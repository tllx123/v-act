import { FileUtil as fileUtil } from '@v-act/vjs.framework.extension.platform.services.native.mobile.fileoperation'
import * as FileTransferService from '@v-act/vjs.framework.extension.platform.services.native.mobile.FileTransfer'
import { DialogUtil as dialogUtil } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.dialog'
import { ProgressBarUtil as progressbar } from '@v-act/vjs.framework.extension.ui.common.plugin.services.progressbar'
import { $ } from '@v-act/vjs.framework.extension.vendor.jquery'

let flag = false
let count = 1

export function initModule(sb: any) {
  FileTransferService.putInstance(exports)
}

/**
 * 初始化cordova的文件传输插件，注为全局对象
 * @param {Object} new FileTransfer() 全局调用对象
 */
//@ts-ignore
if (window.VJSBridge) {
  window.VJSBridge.plugins.vplatform.FileTransfer = new FileTransfer()
}

const filetransferUpload = function (fileUrl: string, callback: Function) {
  //@ts-ignore
  const url: string = GlobalVariables.getServerUrl()
  let serverPath = `${url}/module-operation!executeOperation?operation=FileUpload`

  let resultFileIDs: Array<string> = []
  let fileInfos: Array<Record<string, any>> = []
  let result: Record<string, any> = {}
  let win = function (r: any) {
    count++
    if (1 == fileUrl.length) {
      if (flag) {
        progressbar.hideProgress()
      }
      if (isFunction(callback)) {
        //let obj = jQuery.parseJSON(r.response)
        let obj = $.parseJSON(r.response)
        //上传完最后一个文件时进行回调
        fileInfos.push(obj)
        if (resultFileIDs.length == fileUrl.length - 1) {
          if (obj.data && Array.isArray(obj.data)) {
            resultFileIDs.push(obj.data[0].id)
          } else {
            resultFileIDs.push(obj.id)
          }
          result.success = true
          result.fileIds = resultFileIDs
          callback(resultFileIDs, fileInfos)
        } else {
          if (obj.data && Array.isArray(obj.data)) {
            resultFileIDs.push(obj.data[0].id)
          } else {
            resultFileIDs.push(obj.id)
          }
        }
      }
    } else {
      progressbar.showProgress('正在上传' + count + '/' + fileUrl.length)
      if (isFunction(callback)) {
        let obj = $.parseJSON(r.response)
        fileInfos.push(obj)
        //上传完最后一个文件时进行回调
        if (resultFileIDs.length == fileUrl.length - 1) {
          if (flag) {
            progressbar.hideProgress()
          }
          if (obj.data && Array.isArray(obj.data)) {
            resultFileIDs.push(obj.data[0].id)
          } else {
            resultFileIDs.push(obj.id)
          }
          result.success = true
          result.fileIds = resultFileIDs
          callback(resultFileIDs, fileInfos)
        } else {
          if (obj.data && Array.isArray(obj.data)) {
            resultFileIDs.push(obj.data[0].id)
          } else {
            resultFileIDs.push(obj.id)
          }
        }
      }
    }
  }
  let isPrompted = false
  let fail = function (error: any) {
    if (flag) {
      progressbar.hideProgress()
    }
    if (isFunction(callback)) {
      console.log(JSON.stringify(error))
      if (isPrompted == false) {
        if (error.code == 1) {
          dialogUtil.propmtDialog(
            '文件上传失败,不合法的URL！',
            null,
            false,
            undefined
          )
        } else if (error.code == 3) {
          dialogUtil.propmtDialog(
            '文件上传失败,服务器或网络异常，请稍后再试！',
            null,
            false,
            undefined
          )
        } else {
          dialogUtil.propmtDialog(
            '文件上传失败,请稍后再试！',
            null,
            false,
            undefined
          )
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
  fileID: string,
  fileName: string,
  success: Function,
  error: Function,
  onProgress: any
) {
  if (!fileName) {
    dialogUtil.propmtDialog(
      '文件下载失败！文件名不存在，请检查文件名是否正确！',
      null,
      false,
      undefined
    )
  }
  let fileTransfer = new FileTransfer()
  fileTransfer.onprogress = onProgress

  let serverPath =
    'module-operation!executeOperation?operation=FileDown&token=%7B%22data%22%3A%7B%22dataId%22%3A%22' +
    fileID +
    '%22%7D%7D'
  let fileURL
  //@ts-ignore
  if (window.GlobalVariables) {
    //@ts-ignore
    let host = GlobalVariables.getServerPath() + '/'
    serverPath = host + serverPath
    let uri = encodeURI(serverPath) //服务端下载地址
    //@ts-ignore
    if (cordova.platformId == 'android') {
      fileURL =
        //@ts-ignore
        cordova.file.externalRootDirectory +
        'path/to/downloads/' +
        fileID +
        fileName.substring(fileName.lastIndexOf('.'), fileName.length) //Android版本地存放地址
    } else {
      fileURL =
        'cdvfile://localhost/persistent/path/to/downloads/' +
        fileID +
        fileName.substring(fileName.lastIndexOf('.'), fileName.length) //iOS版本地存放地址
    }

    fileTransfer.download(
      uri,
      fileURL,
      function (entry: any) {
        if (isFunction(success)) {
          fileUtil.setLocalFlag(fileID)
          success(entry.toURL())
        }
      },
      function (errorObJ: Record<string, any>) {
        if (isFunction(error)) {
          error({
            errorSource: errorObJ.source,
            errorTarget: errorObJ.target,
            errorCode: errorObJ.code
          })
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
    dialogUtil.propmtDialog(
      '目前暂不支持PC端访问下载！',
      null,
      false,
      undefined
    )
  }
}
//@ts-ignore
const supportOnProgress = window.VJSBridge
  ? //@ts-ignore
    window.VJSBridge.plugins.vplatform.FileTransfer.supportOnProgress
  : null

function isFunction(arg: any) {
  if (typeof arg == 'function') {
    return true
  }
  return false
}
export { filetransferDownload, filetransferUpload, supportOnProgress }
