let instance

const putInstance = function (ins) {
  instance = ins
}

const openVideoPlayer = function (
  videoPath,
  fileName,
  successCallback,
  failCallback
) {
  instance.openVideoPlayer(videoPath, fileName, successCallback, failCallback)
}

const openVideoPlayerByFileId = function (
  fileId,
  fileName,
  successCallback,
  failCallback
) {
  instance.openVideoPlayerByFileId(
    fileId,
    fileName,
    successCallback,
    failCallback
  )
}

const getMediaObj = function () {
  return instance.getMediaObj()
}

const getFileLocalPathById = function (fileID, fileName) {
  let filePath = ''
  if (window.GlobalVariables) {
    let localFiles = window.localStorage.getItem('download_file_' + fileID)
    if (localFiles) {
      if (cordova.platformId == 'android') {
        filePath =
          cordova.file.externalRootDirectory +
          'path/to/downloads/' +
          fileID +
          fileName.substring(fileName.lastIndexOf('.'), fileName.length) //Android版本地存放地址
      } else {
        filePath =
          cordova.file.documentsDirectory +
          '/path/to/downloads/' +
          fileID +
          fileName.substring(fileName.lastIndexOf('.'), fileName.length)
        if (filePath.indexOf('file://') != -1) {
          filePath = filePath.substring(7, filePath.length)
        }
      }
    }
  }
  return filePath
}

export {
  putInstance,
  openVideoPlayer,
  openVideoPlayerByFileId,
  getMediaObj,
  getFileLocalPathById
}
