let instance

const putInstance = function (ins) {
  instance = ins
}

exports.BROWERTYPE = {
  InAppBrowser: '_blank', //APP内置浏览器
  SystemBrowser: '_system' //系统浏览器
}

const open = function (url, browerType) {
  instance.open(url, browerType)
}

export { putInstance, open }
