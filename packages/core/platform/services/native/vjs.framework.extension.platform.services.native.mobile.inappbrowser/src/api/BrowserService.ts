let instance: any

const putInstance = function (ins: unknown) {
  instance = ins
}

const BROWERTYPE = {
  InAppBrowser: '_blank', //APP内置浏览器
  SystemBrowser: '_system' //系统浏览器
}

const open = function (url: string, browerType: string) {
  instance.open(url, browerType)
}

export { BROWERTYPE, open, putInstance }
