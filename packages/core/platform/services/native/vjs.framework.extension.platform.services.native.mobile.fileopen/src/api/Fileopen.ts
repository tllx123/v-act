let instance

const putInstance = function (ins) {
  instance = ins
}

let mimeType = {
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  mp3: 'audio/mpeg',
  mp4: 'video/mp4',
  mkv: 'video/x-matroska',
  rmvb: 'application/vnd.rn-realmedia-vbr',
  wma: 'audio/x-ms-wma',
  flac: 'audio/x-flac',
  gif: 'image/gif',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  jpe: 'image/jpeg',
  bmp: 'image/bmp',
  txt: 'text/plain',
  log: 'text/plain',
  html: 'text/html',
  htm: 'text/html',
  css: 'text/css',
  js: 'application/javascript',
  apk: 'application/vnd.android.package-archive',
  wps: 'application/vnd.ms-works',
  ttf: 'application/x-font-ttf',
  ttc: 'application/x-font-ttf',
  zip: 'application/zip'
}

const fileopen = function (fileID, fileName) {
  let file = fileName.split('.')
  let fileType = file[1]
  if (window.GlobalVariables) {
    if (window.device && window.device.platform == 'iOS') {
      url =
        cordova.file.documentsDirectory +
        '/path/to/downloads/' +
        fileID +
        '.' +
        fileType
    } else {
      url =
        cordova.file.externalRootDirectory +
        'path/to/downloads/' +
        fileID +
        '.' +
        fileType
    }
  }
  let mime = mimeType[fileType]
  instance.fileopen(url, mime)
}

export { putInstance, fileopen }
