/**
 * 获取远程图片GetImageUrlByFileId()
 */

var getImageSrc = function (fileId: string) {
  if (fileId != null) {
    var result =
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
var _handleImageValueRel = function (imageValueRel: string) {
  //@ts-ignore
  if (window.GlobalVariables) {
    //@ts-ignore
    imageValueRel = GlobalVariables.getServerUrl() + '/' + imageValueRel
  }
  return imageValueRel
}

const main = function (fileId: string) {
  var url = getImageSrc(fileId)
  return url
}
export { main }
