import { DatasourceFactory as datasourceFactory } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'

let sandBox
exports.initModule = function (sBox) {
  sandBox = sBox
}
let rebuildUrl = function (
  isRootContainer,
  windowCode,
  componentCode,
  windowInputParams
) {
  if (isRootContainer != undefined && isRootContainer.toString() == 'true') {
    // 重新组装 url 地址上的 hash 值
    let urlWinHash = ''
    let __isOpera =
      navigator.appName == 'Opera' || navigator.userAgent.indexOf('Opera') != -1
    let __isIE =
      (navigator.appName == 'Microsoft Internet Explorer' && !__isOpera) ||
      navigator.userAgent.indexOf('Trident/') != -1
    if (windowInputParams && windowInputParams !== {}) {
      let urlWinHashObj = _inputParam2Obj(windowInputParams)
      urlWinHashObj.windowCode = windowCode
      urlWinHashObj.componentCode = componentCode
      let jsonUtil = sandBox.getService('vjs.framework.extension.util.JsonUtil')
      urlWinHash = encodeURIComponent(jsonUtil.obj2json(urlWinHashObj))
    }

    if (typeof window.history.pushState == 'function') {
      // 利用 html5 的 window.history.pushState 实现页面无刷新的 url 更新
      // 更新 windowCode 和 componentCode 和 inputParam
      let windowLocation = window.location,
        search = windowLocation.search,
        pathname = windowLocation.pathname,
        // 处理浏览器不支持 origin
        origin = windowLocation.origin
          ? windowLocation.origin
          : windowLocation.protocol + '//' + windowLocation.host,
        searchs = search.split('&'),
        targetUrl = origin + pathname

      for (let i = 0, len = searchs.length; i < len; i++) {
        let tempSearch = searchs[i]
        if (
          tempSearch.indexOf('componentCode') === 0 ||
          tempSearch.indexOf('componentCode') === 1
        )
          targetUrl +=
            tempSearch.substring(0, tempSearch.indexOf('=') + 1) + componentCode
        else if (
          tempSearch.indexOf('windowCode') === 0 ||
          tempSearch.indexOf('windowCode') === 1
        )
          targetUrl +=
            tempSearch.substring(0, tempSearch.indexOf('=') + 1) + windowCode
        else targetUrl += tempSearch
        if (i !== len - 1) targetUrl += '&'
      }
      try {
        //原型工具下会报错  2018-01-16 xiedh
        window.history.pushState({}, '', targetUrl)
      } catch (e) {}
      /* IE下修改hash会导致页面空白，不修改hash为临时方案 */
      if (!__isIE) {
        window.location.hash = urlWinHash
      }
    } else {
      // 浏览器不支持 window.history.pushState，则使用 window.location.hash 存储页面信息
      // 包含 windowCode、componentCode、inputParam
      if (!__isIE) {
        window.location.hash = urlWinHash
      }
    }
  }
}

let _inputParam2Obj = function (inputParam) {
  if (inputParam && inputParam.variable) {
    let variable = inputParam.variable
    let obj = {}
    for (let attr in variable) {
      let val = variable[attr]
      obj[attr] = datasourceFactory.isDatasource(val) ? val.serialize() : val
    }
    return {
      variable: obj
    }
  }
  return null
}

export { rebuildUrl }
