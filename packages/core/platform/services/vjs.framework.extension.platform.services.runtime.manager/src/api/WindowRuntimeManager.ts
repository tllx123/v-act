import { Initor as dataInitor } from '@v-act/vjs.framework.extension.platform.data.adapter'
import { WindowInfo as windowInfo } from '@v-act/vjs.framework.extension.platform.data.manager.runtime.info'
import { VPlatfromIframeManager as iframeManager } from '@v-act/vjs.framework.extension.platform.data.manager.runtime.window.iframe'
import { ComponentParam as componentParam } from '@v-act/vjs.framework.extension.platform.data.storage.runtime.param'
import { WindowRuntimeInit as windowRuntime } from '@v-act/vjs.framework.extension.platform.init.view'
import { EventManager as eventManager } from '@v-act/vjs.framework.extension.platform.interface.event'
import {
  Operation,
  Request
} from '@v-act/vjs.framework.extension.platform.interface.rpc.operation'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { RemoteOperation as remoteOperation } from '@v-act/vjs.framework.extension.platform.services.operation.remote.base'
import { Permission as permission } from '@v-act/vjs.framework.extension.platform.services.view.permission'
import { ArrayUtil as arrayUtil } from '@v-act/vjs.framework.extension.util.array'
import { Log as logUtil } from '@v-act/vjs.framework.extension.util.logutil'

const addRequestOperation = function (params) {
  windowRuntime.registerVariableHandler(params)
}

const hasPermission = function (params) {
  return windowRuntime.hasPermission(params)
}

let _createOperation = function (
  componentCode,
  windowCode,
  operationName,
  args,
  handler
) {
  /*let operation = new Operation()
  operation.setComponentCode(componentCode)
  operation.setWindowCode(windowCode)
  operation.setOperation(operationName)
  if (args) {
    for (let attr in args) {
      operation.addParam(attr, args[attr])
    }
  }
  operation.setAfterResponse(handler)
  return operation*/
  return null
}

let _winPermOperation = function (componentCode, windowCode) {
  let inited = windowInfo.isWindowPermissionInited(componentCode, windowCode)
  if (!inited) {
    return _createOperation(
      componentCode,
      windowCode,
      'WinPerm',
      null,
      (function (cCode, wCode) {
        return function (rs) {
          windowInfo.markWindowPermission(cCode, wCode, rs.data.hasPermis)
        }
      })(componentCode, windowCode)
    )
  }
  return null
}

let _componentVarOperation = function (componentCode) {
  let inited = componentParam.isVariantInited(componentCode)
  if (!inited) {
    return _createOperation(
      componentCode,
      null,
      'ComponentVariables',
      null,
      (function (cCode) {
        return function (result) {
          for (var i = 0; i < result.data.length; i++) {
            var v = result.data[i]
            var code = v.code
            var val = dataInitor.init({
              code: code,
              type: v.type.toLowerCase(),
              value: v.value,
              configs: v.configs
            })
            componentParam.setVariant(cCode, code, val)
          }
          componentParam.markVariantInited(cCode)
        }
      })(componentCode)
    )
  }
  return null
}

let _widgetPermOperation = function (componentCode, windowCode) {
  let inited = windowInfo.isWidgetPermissionInited(componentCode, windowCode)
  if (!inited) {
    return _createOperation(
      componentCode,
      windowCode,
      'Permission',
      { isAllWidget: true },
      (function (cCode, wCode) {
        return function (result) {
          if (result.success == true) {
            windowInfo.markWidgetPermission(cCode, wCode, result.data)
            windowInfo.markWidgetPermissionInited(cCode, wCode)
          }
        }
      })(componentCode, windowCode)
    )
  }
  return null
}

let _windowSeriesOperation = function (componentCode, windowCode) {
  let inited = windowInfo.isWindowSeriesIntied(componentCode, windowCode)
  if (!inited) {
    return _createOperation(
      componentCode,
      windowCode,
      'WinSeries',
      null,
      (function (cCode, wCode) {
        return function (result) {
          windowInfo.setWindowSeries(cCode, wCode, result.data.series)
        }
      })(componentCode, windowCode)
    )
  }
  return null
}

let _getParam = function (param, key, def) {
  if (param.hasOwnProperty(key)) {
    return param[key]
  }
  return def
}

/**
 * 临时兼容，等iframe管理模块的版本后发布后，测试本场景ok后即可删除
 * 处理参数
 * */
let handleScope = function (scopeId) {
  //		var url = window.location.href
  //		if(url.indexOf("/module-operation!executeOperation?")!=-1 && url.indexOf("vplatform_tmp_open_mode") !=-1){
  //			var scope = scopeManager.getWindowScope();
  //			if(null != scope){
  //				//标记当前域是
  //				scope.set("VPlatformTmpOpenMode","modal_url");
  //			}
  //		}
  if (!window.vdk) {
    window.vdk = {}
  }
  let vdk = window.vdk
  let nowPageIden = 'iden_' + new Date().getTime()
  vdk.tmpStorage = {
    iden: nowPageIden
  }
  //注册跨域事件：设置窗体域由模态链接打开
  eventManager.onCrossDomainEvent({
    eventName: eventManager.CrossDomainEvents.CustomEvent,
    eventInfo: {
      condition: "type=='SetModalUrlIden'&&nowPM=='" + nowPageIden + "'",
      isDelete: true
    },
    handler: (function (sId) {
      return function () {
        let scope = scopeManager.getScope(sId)
        scope.set('VPlatformTmpOpenMode', 'modal_url')
        scope.setOpenMode(scopeManager.OpenMode.ModalContaniner)
        let removeModalFunc = function () {
          //模态方式打开链接地址监听这个
          eventManager.fireCrossDomainEvent({
            eventName: eventManager.CrossDomainEvents.ModalWindowClose,
            params: {
              href: window.location.href
            }
          })
        }
        scope.set('RemoveModalFunc', removeModalFunc)
        scope.on(scopeManager.EVENTS.DESTROY, removeModalFunc)
      }
    })(scopeId)
  })
  //注册跨域事件：设置窗体域由模态链接打开
  eventManager.fireCrossDomainEvent({
    eventName: eventManager.CrossDomainEvents.CustomEvent,
    eventInfo: {
      type: 'GetChildMsg'
    },
    params: {
      childPM: nowPageIden
    }
  })
}

const initWindow = function (params) {
  //开始监听message
  let scopeId = scopeManager.getCurrentScopeId()
  let scope = scopeManager.getWindowScope()
  let openMode = scope.getOpenMode()
  if (
    typeof vdk != 'undefined' &&
    vdk.postMsg &&
    openMode != scopeManager.OpenMode.ModalCommon &&
    openMode != scopeManager.OpenMode.ModalContaniner &&
    scope.getSeries() != 'bootstrap_mobile'
  ) {
    vdk.postMsg.init({
      scope: scope,
      url: window.location.href,
      sandbox: sandbox
    })
  }
  if (scope) {
    let scopeId = scope.getInstanceId()
    //还原代码
    //handleScope(scopeId);
    scopeManager.createScopeHandler({
      scopeId: scope.getInstanceId(),
      handler: eventManager.startCrossDomainListener
    })()
  } else {
    logUtil.warn(
      '无法执行监听跨域事件的方法, 原因: 无法获取当前域, 已忽略域处理. '
    )
    eventManager.startCrossDomainListener()
  }
  if (
    iframeManager &&
    openMode != scopeManager.OpenMode.ModalCommon &&
    openMode != scopeManager.OpenMode.ModalContaniner &&
    scope.getSeries() != 'bootstrap_mobile'
  ) {
    iframeManager.handleScope({
      //处理窗体域
      url: window.location.href,
      scope: scope
    })
  }
  let windows = params.windows
  if (!arrayUtil.isArray(windows)) {
    windows = [windows]
  }
  let operations = []
  let componentCodes = {}
  for (let i = 0, l = windows.length; i < l; i++) {
    let cfg = windows[i]
    let componentCode = cfg.componentCode,
      windowCode = cfg.windowCode
    if (_getParam(cfg, 'validWindow', true)) {
      let o = _winPermOperation(componentCode, windowCode)
      if (o) {
        operations.push(o)
      }
    }
    if (_getParam(cfg, 'validWidget', true) && permission) {
      let o = _widgetPermOperation(componentCode, windowCode)
      if (o) {
        operations.push(o)
      }
    }
    let o = _windowSeriesOperation(componentCode, windowCode)
    if (o) {
      operations.push(o)
    }
    componentCodes[componentCode] = true
  }
  for (let code in componentCodes) {
    let o = _componentVarOperation(code)
    if (o) {
      operations.push(o)
    }
  }
  if (operations && operations.length > 0) {
    let success =
      params.success && typeof params.success == 'function'
        ? params.success
        : null
    let request = new Request(false, operations, success, params.error)
    //调用批量请求后台接口
    remoteOperation.request({ request: request })
  } else {
    if (typeof params.success == 'function') {
      params.success()
    }
  }
}

const cleanWindowInfo = function (componentCode, windowCode) {
  windowInfo.clearWidgetPermission(componentCode, windowCode)
  windowInfo.clearWindowPermission(componentCode, windowCode)
}

const hasWindowPermission = function (params) {
  return windowInfo.hasPermission(params.componentCode, params.windowCode)
}

const isWidgetPermissionInited = function (params) {
  return windowInfo.isWidgetPermissionInited(
    params.componentCode,
    params.windowCode
  )
}

const getWidgetPermission = function (params) {
  return windowInfo.getWidgetPermission(params.componentCode, params.windowCode)
}

const getWindowSeries = function (params) {
  return windowInfo.getWindowSeries(params.componentCode, params.windowCode)
}

const setWindowSeries = function (params) {
  let componentCode = params.componentCode
  let windowCode = params.windowCode
  if (!windowInfo.isWindowSeriesIntied(componentCode, windowCode)) {
    windowInfo.setWindowSeries(componentCode, windowCode, params.series)
  }
}

export {
  addRequestOperation,
  cleanWindowInfo,
  getWidgetPermission,
  getWindowSeries,
  hasPermission,
  hasWindowPermission,
  initWindow,
  isWidgetPermissionInited,
  setWindowSeries
}
