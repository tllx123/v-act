let environment

export function initModule(sb) {}

const main = function (param) {
  let args = param.getArgs()
  let fileId = args[0]
  let url = getImageSrc(fileId)
  return url
}
let getImageSrc = function (fileId) {
  if (fileId != null) {
    let result =
      'module-operation!executeOperation?operation=FileDown&token=%7B%22data%22%3A%7B%22dataId%22%3A%22' +
      fileId +
      '%22%2C%22ImageObj%22%3A%22' +
      fileId +
      '%22%7D%7D'
    return _handleImageValueRel(result)
  } else {
    return ''
  }
}
/*
 * 如果是在移动端需要加上前面的服务地址
 */
let _handleImageValueRel = function (imageValueRel) {
  if (window.GlobalVariables) {
    imageValueRel = GlobalVariables.getServerUrl() + '/' + imageValueRel
  }
  return imageValueRel
}

export { main }
