let sandbox
let formulaUtil
let viewModel
exports.initModule = function (sb) {
  sandbox = sb
}

const getPath = function (src) {
  if (!src || src == '') {
    console.trace()
    console.info('控件的图片src为空!!')
    return
  }
  if (src.indexOf('itop/') > -1) {
    return _handleImageValueRel(src)
  } else if (src.indexOf('/') == 0) {
    return _handleImageValueRel(src.substring(1))
  } else if (src.indexOf('http') === 0 || src.indexOf('https') === 0) {
    return src
  } else {
    let result =
      'module-operation!executeOperation?operation=FileDown&token=%7B%22data%22%3A%7B%22dataId%22%3A%22' +
      src +
      '%22%2C%22ImageObj%22%3A%22' +
      src +
      '%22%7D%7D'
    return _handleImageValueRel(result)
  }
}

/**
 * 在手机APP中图片路径另外处理
 */
let _handleImageValueRel = function (imageValueRel) {
  if (window.GlobalVariables) {
    imageValueRel = GlobalVariables.getServerUrl() + '/' + imageValueRel
  }
  return imageValueRel
}

export { getPath }
