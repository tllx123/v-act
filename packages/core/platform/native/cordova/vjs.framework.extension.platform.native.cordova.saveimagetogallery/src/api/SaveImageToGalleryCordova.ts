import { ProgressBarUtil as progressbar } from '@v-act/vjs.framework.extension.ui.common.plugin.services.progressbar'
let undefined
exports.initModule = function (sb) {
  let SaveImageToGalleryService = sb.getService(
    'vjs.framework.extension.platform.services.native.mobile.SaveImageToGallery'
  )
  SaveImageToGalleryService.putInstance(exports)
}

/**
 * 初始化cordova的保存照片到相册插件，注为全局对象
 *@param {Object}  window.imagePicker 保存照片全局调用
 *
 */
if (window.VJSBridge) {
  window.VJSBridge.plugins.vplatform.SaveImageToGallery = window.imagePicker
}

const saveimagetogallery = function (successCallback, failCallback, options) {
  progressbar.showProgress('正在保存...')
  let fileUrl = options.fileUrl
  let fileName = options.fileName
  if (fileUrl.indexOf('file') > -1) {
    saveToGallery(fileUrl, fileName, successCallback, failCallback)
  } else if (fileUrl.indexOf('http') > -1 || fileUrl.indexOf('https') > -1) {
    downloadFile(fileUrl, fileName, successCallback, failCallback)
  } else {
    let host = GlobalVariables.getServerPath() + '/'
    fileUrl = host + fileUrl
    downloadFile(fileUrl, fileName, successCallback, failCallback)
  }
}

/**
 * 下载文件
 */
let downloadFile = function (fileUrl, fileName, successCallback, failCallback) {
  let fileTransfer = new FileTransfer()
  if (window.GlobalVariables) {
    let uri = encodeURI(fileUrl) //服务端下载地址
    let filePath // 本地存储地址
    if (window.device.platform == 'iOS') {
      filePath = cordova.file.tempDirectory + fileName
    } else {
      filePath = cordova.file.externalRootDirectory + 'DCIM/Camera/' + fileName
    }

    fileTransfer.download(
      uri,
      filePath,
      function (entry) {
        if (window.device.platform == 'iOS') {
          let nativePath = entry.toURL()
          saveToGallery(nativePath, fileName, successCallback, failCallback)
        } else {
          cordova.plugins.system.config.flushFile(fileName)
          progressbar.hideProgress()
          alert('保存成功')
        }
      },
      function (error) {
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
  filePath,
  fileName,
  successCallback,
  failCallback
) {
  let params = { filePath: filePath, fileName: fileName }
  window.imageSaver.saveBase64Image(
    params,
    function (filePath) {
      progressbar.hideProgress()
      alert('保存成功')
      successCallback('success')
    },
    function (msg) {
      progressbar.hideProgress()
      alert('保存失败')
      failCallback('fail')
    }
  )
}

export { saveimagetogallery }
