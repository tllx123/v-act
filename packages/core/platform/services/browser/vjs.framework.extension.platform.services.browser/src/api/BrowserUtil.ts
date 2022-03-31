import { EventManager as eventManager } from '@v-act/vjs.framework.extension.platform.interface.event'
import { DatasourceFactory as datasourceFactory } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { WindowParam as wParamManager } from '@v-act/vjs.framework.extension.platform.services.param.manager'

/**
 * 关闭窗口
 */
const closeWindow = function (params?: Record<string, any>) {
  //是否确定退出
  let isConfirmExit = params && !!params.isConfirmExit
  let returnValues = {}
  try {
    let values = wParamManager.getOutputs()
    for (var key in values) {
      if (!values.hasOwnProperty(key)) {
        continue
      }
      let value = values[key]
      if (datasourceFactory.isDatasource(value)) {
        returnValues[key] = value.serialize()
      } else {
        returnValues[key] = value
      }
    }
  } catch (e) {}
  let windowUtil: Record<string, any> = _getWindowService()
  windowUtil.closeWindowTab()
  //模态方式打开链接地址监听这个
  eventManager.fireCrossDomainEvent({
    eventName: eventManager.CrossDomainEvents.ModalWindowClose,
    params: {
      href: window.location.href,
      datas: {
        isConfirmExit: isConfirmExit,
        returnValues: returnValues
      }
    }
  })
  //窗体容器打开链接地址或者打开链接地址到首页时注册这个事件
  eventManager.fireCrossDomainEvent({
    eventName: eventManager.CrossDomainEvents.ContainerWindowClose,
    params: {
      href: window.location.href,
      datas: {
        isConfirmExit: isConfirmExit,
        returnValues: returnValues
      }
    }
  })
}

const _getWindowService = function () {
  return _getService(
    'vjs.framework.extension.platform.services.domain.browser.Window'
  )
}

/**
 * 根据体系获取对应服务
 * 未指定体系则获取未定义体系的vjs
 */
const _getService = function (serviceName: string) {
  let mobileSerType = 'bootstrap_mobile',
    widgetSeries = scopeManager.getProperty('type'),
    widgetSeriesType: Record<string, any> = {
      type: widgetSeries
    }

  // bootstrap 和 smartclient 体系下的 vjs.framework.extension.platform.services.domain.browser.Window 未在pom文件指定体系
  if (widgetSeries !== mobileSerType) widgetSeriesType = {}

  //let service = sandbox.getService(serviceName, widgetSeriesType)
  let service = null

  if (service == null)
    throw Error(
      '\u672a\u80fd\u627e\u5230\u670d\u52a1\uff0c\u539f\u56e0\uff1a\u672a\u627e\u5230\uff0c\u4f53\u7cfb\u4e3a' +
        widgetSeries +
        '\u7684\u670d\u52a1\u540d\u79f0\uff1a' +
        serviceName
    )

  return service
}

export { closeWindow }
