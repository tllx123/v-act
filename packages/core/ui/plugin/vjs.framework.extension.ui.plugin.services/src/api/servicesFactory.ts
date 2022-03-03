let sandbox, seriesService

exports.initModule = function (sb) {
  sandbox = sb
  if (sb) {
    seriesService = sb.getService(
      'vjs.framework.extension.ui.common.plugin.services.series.Series'
    )
  }
}

let getService = function (serviceName) {
  let widgetSeries = seriesService.getSeries()
  let service = sandbox.getService(serviceName, { type: widgetSeries })
  if (service == null) {
    throw Error(
      '未能找到服务，原因：未找到，体系为' +
        widgetSeries +
        '的服务名称：' +
        serviceName
    )
  }

  return service
}

export { getService }
