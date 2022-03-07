import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { EventManager as eventManager } from '@v-act/vjs.framework.extension.platform.interface.event'
let sandbox

export function initModule(sb) {
  sandbox = sb
}

/**
 * 关闭窗口
 */
let closeWindow = function () {
  let windowUtil = _getWindowService()
  windowUtil.closeWindowTab()
  //模态方式打开链接地址监听这个
  eventManager.fireCrossDomainEvent({
    eventName: eventManager.CrossDomainEvents.ModalWindowClose,
    params: {
      href: window.location.href
    }
  })
  //窗体容器打开链接地址时注册这个事件
  eventManager.fireCrossDomainEvent({
    eventName: eventManager.CrossDomainEvents.ContainerWindowClose,
    params: {
      href: window.location.href
    }
  })
}

let _getWindowService = function () {
  return _getService(
    'vjs.framework.extension.platform.services.domain.browser.Window'
  )
}

/**
 * 根据体系获取对应服务
 * 未指定体系则获取未定义体系的vjs
 */
let _getService = function (serviceName) {
  let mobileSerType = 'bootstrap_mobile',
    widgetSeries = scopeManager.getProperty('type'),
    widgetSeriesType = {
      type: widgetSeries
    }

  // bootstrap 和 smartclient 体系下的 vjs.framework.extension.platform.services.domain.browser.Window 未在pom文件指定体系
  if (widgetSeries !== mobileSerType) widgetSeriesType = ''

  let service = sandbox.getService(serviceName, widgetSeriesType)

  if (service == null)
    throw Error(
      '\u672a\u80fd\u627e\u5230\u670d\u52a1\uff0c\u539f\u56e0\uff1a\u672a\u627e\u5230\uff0c\u4f53\u7cfb\u4e3a' +
        widgetSeries +
        '\u7684\u670d\u52a1\u540d\u79f0\uff1a' +
        serviceName
    )

  return service
}

export {
  setWindowTitle,
  callModuleEx,
  getWindowUrl,
  redirectLocation,
  currentPageOpen,
  closeModalWindow,
  redirectModule,
  callBrowserWindow,
  callBrowserModalWindow,
  showModalModule,
  showModelessDialogEx,
  showModelessDialogExNewTab,
  showModalDialogEx,
  openWindowToDiv,
  closeWindow
}
