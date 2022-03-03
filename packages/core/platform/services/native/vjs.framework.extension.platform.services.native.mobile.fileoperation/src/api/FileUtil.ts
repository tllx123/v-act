const checkFileIsExist = function (fileID) {
  let localFiles = window.localStorage.getItem('download_file_' + fileID)
  if (localFiles) {
    return true
  }
  return false
}

const setLocalFlag = function (fileID) {
  let localFiles = window.localStorage.getItem('download_file_' + fileID)
  if (!localFiles) {
    window.localStorage.setItem('download_file_' + fileID, true)
  }
}

function unique(arr) {
  let n = []
  for (let i = 0; i < arr.length; i++) {
    if (n.indexOf(arr[i]) == -1) n.push(arr[i])
  }
  return n
}

export {
  fileOpen,
  putInstance,
  filetransferUpload,
  filetransferDownload,
  supportOnProgress,
  checkFileIsExist,
  setLocalFlag
}
