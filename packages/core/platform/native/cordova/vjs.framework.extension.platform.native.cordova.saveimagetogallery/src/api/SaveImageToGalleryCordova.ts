import { SaveImageToGallery as SaveImageToGalleryService } from '@v-act/vjs.framework.extension.platform.services.native.mobile.saveimagetogallery'
import { ProgressBarUtil as progressbar } from '@v-act/vjs.framework.extension.ui.common.plugin.services.progressbar'

export function initModule(sb: any) {
  SaveImageToGalleryService.putInstance(exports)
}

/**
 * 初始化cordova的保存照片到相册插件，注为全局对象
 *@param {Object}  window.imagePicker 保存照片全局调用
 *
 */
//@ts-ignore
if (window.VJSBridge) {
  //@ts-ignore
  window.VJSBridge.plugins.vplatform.SaveImageToGallery = window.imagePicker
}

const saveimagetogallery = function (
  successCallback: Function,
  failCallback: Function,
  options: Record<string, any>
) {
  progressbar.showProgress('正在保存...')
  let fileUrl = options.fileUrl
  let fileName = options.fileName
  if (fileUrl.indexOf('file') > -1) {
    saveToGallery(fileUrl, fileName, successCallback, failCallback)
  } else if (fileUrl.indexOf('http') > -1 || fileUrl.indexOf('https') > -1) {
    downloadFile(fileUrl, fileName, successCallback, failCallback)
  } else {
    //@ts-ignore
    let host = GlobalVariables.getServerPath() + '/'
    fileUrl = host + fileUrl
    downloadFile(fileUrl, fileName, successCallback, failCallback)
  }
}

/**
 * 下载文件
 */
let downloadFile = function (
  fileUrl: string,
  fileName: string,
  successCallback: Function,
  failCallback: Function
) {
  let fileTransfer = new FileTransfer()
  //@ts-ignore
  if (window.GlobalVariables) {
    let uri = encodeURI(fileUrl) //服务端下载地址
    let filePath // 本地存储地址
    //@ts-ignore
    if (window.device.platform == 'iOS') {
      //@ts-ignore
      filePath = cordova.file.tempDirectory + fileName
    } else {
      //@ts-ignore
      filePath = cordova.file.externalRootDirectory + 'DCIM/Camera/' + fileName
    }

    fileTransfer.download(
      uri,
      filePath,
      function (entry: any) {
        //@ts-ignore
        if (window.device.platform == 'iOS') {
          let nativePath = entry.toURL()
          saveToGallery(nativePath, fileName, successCallback, failCallback)
        } else {
          //@ts-ignore
          cordova.plugins.system.config.flushFile(fileName)
          progressbar.hideProgress()
          alert('保存成功')
        }
      },
      function (error: any) {
        progressbar.hideProgress()
        alert('保存失败')
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

/**
 * 保存至相册
 */
let saveToGallery = function (
  filePath: string,
  fileName: string,
  successCallback: Function,
  failCallback: Function
) {
  let params = { filePath: filePath, fileName: fileName }
  //@ts-ignore
  window.imageSaver.saveBase64Image(
    params,
    function (filePath: string) {
      progressbar.hideProgress()
      alert('保存成功')
      successCallback('success')
    },
    function (msg: any) {
      progressbar.hideProgress()
      alert('保存失败')
      failCallback('fail')
    }
  )
}

export { saveimagetogallery }
