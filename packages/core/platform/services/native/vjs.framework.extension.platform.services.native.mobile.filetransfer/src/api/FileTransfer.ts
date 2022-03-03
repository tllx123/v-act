let instance

const putInstance = function (ins) {
  instance = ins
}

const filetransferUpload = function (fileUrl, platformType, callback) {
  instance.filetransferUpload(fileUrl, serverUrl, callback)
}

const wxUpload = function (params) {
  instance.wxUpload(params)
}

const filetransferDownload = function (fileID, fileName, successCB, errorCB) {
  instance.filetransferDownload(fileUrl, serverUrl, callback)
}

export { putInstance, filetransferUpload, wxUpload, filetransferDownload }
