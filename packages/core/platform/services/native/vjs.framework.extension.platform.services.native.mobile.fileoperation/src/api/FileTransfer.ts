let instance

const putInstance = function (ins) {
  instance = ins
}

const filetransferUpload = function (fileUrl, callback) {
  if (instance) {
    instance.filetransferUpload(fileUrl, callback)
  }
}

const filetransferDownload = function (
  fileID,
  fileName,
  success,
  error,
  onProgress
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
  fileOpen,
  putInstance,
  filetransferUpload,
  filetransferDownload,
  supportOnProgress
}
