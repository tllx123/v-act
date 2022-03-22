let instance: any

const putInstance = function (ins: unknown) {
  instance = ins
}

const openVideoPlayer = function (
  videoPath: string,
  fileName: string,
  successCallback: any,
  failCallback: any
) {
  instance.openVideoPlayer(videoPath, fileName, successCallback, failCallback)
}

const openVideoPlayerByFileId = function (
  fileId: string,
  fileName: string,
  successCallback: any,
  failCallback: any
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

const getFileLocalPathById = function (fileID: string, fileName: string) {
  let filePath = ''
  //@ts-ignore
  if (window.GlobalVariables) {
    let localFiles = window.localStorage.getItem('download_file_' + fileID)
    if (localFiles) {
      //@ts-ignore
      if (cordova.platformId == 'android') {
        //@ts-ignore
        filePath =
          cordova.file.externalRootDirectory +
          'path/to/downloads/' +
          fileID +
          fileName.substring(fileName.lastIndexOf('.'), fileName.length) //Android版本地存放地址
      } else {
        //@ts-ignore
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
  getFileLocalPathById,
  getMediaObj,
  openVideoPlayer,
  openVideoPlayerByFileId,
  putInstance
}
