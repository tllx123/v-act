let instance: any

const putInstance = function (ins: unknown) {
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

const fileopen = function (fileID: string, fileName: string) {
  let file = fileName.split('.')
  let fileType = file[1]
  //@ts-ignore
  if (window.GlobalVariables) {
    //@ts-ignore
    if (window.device && window.device.platform == 'iOS') {
      //@ts-ignore
      url =
        cordova.file.documentsDirectory +
        '/path/to/downloads/' +
        fileID +
        '.' +
        fileType
    } else {
      //@ts-ignore
      url =
        cordova.file.externalRootDirectory +
        'path/to/downloads/' +
        fileID +
        '.' +
        fileType
    }
  }
  let mime = mimeType[fileType]
  //@ts-ignore
  instance.fileopen(url, mime)
}

export { fileopen, putInstance }
