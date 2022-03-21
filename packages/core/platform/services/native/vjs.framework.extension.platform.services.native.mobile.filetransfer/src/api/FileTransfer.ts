let instance: any

const putInstance = function (ins: unknown) {
  instance = ins
}

const filetransferUpload = function (
  fileUrl: string,
  platformType: string,
  callback: any
) {
  instance.filetransferUpload(fileUrl, platformType, callback)
}

const wxUpload = function (params: any) {
  instance.wxUpload(params)
}

const filetransferDownload = function (
  fileID: string,
  fileName: string,
  successCB: any,
  errorCB: any
) {
  instance.filetransferDownload(fileID, fileName, successCB, errorCB)
}

export { filetransferDownload, filetransferUpload, putInstance, wxUpload }
