let getDataBindingWithType = function (type) {
  let databindingService = sb.getService(
    'vjs.framework.extension.ui.plugin.databinding',
    { type: type }
  )

  return databindingService
}
let getDataBinding = function () {
  let viewContext = require('system/view/viewContext')
  let widgetSeries = viewContext.getWidgetSeriesFromContext()
  let databindingService = getDataBindingWithType(widgetSeries)
  return databindingService
}
export { getDataBindingWithType, getDataBinding }
