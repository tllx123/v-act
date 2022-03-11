let sb
let seriesService

export function initModule(sandbox) {
  sb = sandbox
  if (sandbox) {
    seriesService = sb.getService(
      'vjs.framework.extension.ui.common.plugin.services.series.Series'
    )
  }
}

// var widgetLib = {};
let set = function (type, widget) {
  // widgetLib[type] = widget;
}

/**
 * 获取控件的渲染服务
 */
let get = function (type) {
  let seriesType = seriesService.getSeries()
  let serviceName =
    'vjs.framework.extension.ui.plugin.' + type + '.render.' + type
  return sb.getService(serviceName, {
    type: seriesType
  })
}

/**
 * 获取控件的action服务
 */
let getAction = function (type) {
  let seriesType = seriesService.getSeries()
  let serviceName =
    'vjs.framework.extension.ui.plugin.' + type + '.action.' + type + 'Action'
  return sb.getService(serviceName, {
    type: seriesType
  })
}

let getInit = function (type) {
  let seriesType = seriesService.getSeries()
  let serviceName =
    'vjs.framework.extension.ui.plugin.' + type + '.init.' + type + 'Init'
  return sb.getService(serviceName, {
    type: seriesType
  })
}

export {
  addEventHandler,
  fireDynamicWidgetEvent,
  fireEvent,
  get,
  getAction,
  getAll,
  getInit,
  Hide,
  put,
  putAll,
  removeAllEventHandler,
  set,
  Show
}
