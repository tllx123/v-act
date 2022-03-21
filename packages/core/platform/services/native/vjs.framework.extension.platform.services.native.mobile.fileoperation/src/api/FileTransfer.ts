let instance: any

const putInstance = function (ins: unknown) {
  instance = ins
}

const filetransferUpload = function (fileUrl: string, callback: any) {
  if (instance) {
    instance.filetransferUpload(fileUrl, callback)
  }
}

const filetransferDownload = function (
  fileID: string,
  fileName: string,
  success: any,
  error: any,
  onProgress: any
) {
  if (instance) {
    instance.filetransferDownload(fileID, fileName, success, error, onProgress)
  }
}

const supportOnProgress = function () {
  if (instance) {
    return instance.supportOnProgress
  }
  return false
}

export {
  filetransferDownload,
  filetransferUpload,
  putInstance,
  supportOnProgress
}
