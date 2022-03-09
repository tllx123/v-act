import { ObjectUtil as objUtils } from '@v-act/vjs.framework.extension.util.object'

let WINDOW_I18N = {}

let WIDGET_I18N = {}

let EXP_I18N = {}

export function initModule(sb) {}

const initWindow = function (params) {
  let componentCode = params.componentCode,
    windowCode = params.windowCode
  let componentPool = WINDOW_I18N[componentCode]
  if (!componentPool) {
    componentPool = {}
    WINDOW_I18N[componentCode] = componentPool
  }
  componentPool[windowCode] = params.items
}

const initWidget = function (params) {
  let componentCode = params.componentCode,
    windowCode = params.windowCode,
    widgetCode = params.widgetCode
  let componentPool = WIDGET_I18N[componentCode]
  if (!componentPool) {
    componentPool = {}
    WIDGET_I18N[componentCode] = componentPool
  }
  let windowPool = componentPool[windowCode]
  if (!windowPool) {
    windowPool = {}
    componentPool[windowCode] = windowPool
  }
  windowPool[widgetCode] = params.items
}

const initExp = function (params) {
  let componentPool = EXP_I18N[params.componentCode]
  if (!componentPool) {
    EXP_I18N[params.componentCode] = componentPool = {}
  }
  componentPool[params.windowCode] = params.items
}

const get = function (params) {
  let componentPool = WINDOW_I18N[params.componentCode]
  if (componentPool) {
    let windowPool = componentPool[params.windowCode]
    if (windowPool) {
      return windowPool[params.code] || params.defaultVal
    }
  }
  return params.defaultVal
}

const getExpLanguage = function (params) {
  let componentPool = EXP_I18N[params.componentCode]
  if (componentPool) {
    let items = componentPool[params.windowCode]
    if (items) {
      return items[params.code] || params.defaultVal
    }
  }
  return params.defaultVal
}

const getWidgetInfo = function (params) {
  let hasCode = params.hasOwnProperty('code')
  let defaultVal = params.defaultVal ? params.defaultVal : hasCode ? '' : {}
  let componentPool = WIDGET_I18N[params.componentCode]
  if (componentPool) {
    let windowPool = componentPool[params.windowCode]
    if (windowPool) {
      let widgetPool = windowPool[params.widgetCode]
      if (widgetPool) {
        let result = hasCode
          ? widgetPool[params.code] || params.defaultVal
          : objUtils.clone(widgetPool)
        for (let key in defaultVal) {
          if (defaultVal.hasOwnProperty(key) && !result.hasOwnProperty(key)) {
            result[key] = defaultVal[key]
          }
        }
        return result
      }
    }
  }
  return defaultVal
}

/**
 * 是否存在多语言数据
 * @params	obj		Object	多语言数据
 * @params	params	Object	参数信息
 * {
 * 		componentCode	:	String	构件编号，
 * 		code			:	String	多语言项编号
 * }
 * */
function exist(obj, params) {
  let componentCode = params.componentCode
  let code = params.code
  let items = obj[componentCode]
  if (items && items.hasOwnProperty(code)) {
    return true
  }
  return false
}

const has = function (params) {
  let componentPool = WINDOW_I18N[params.componentCode]
  if (componentPool) {
    let windowPool = componentPool[params.windowCode]
    if (windowPool && windowPool.hasOwnProperty(params.code)) {
      return true
    }
  }
  return false
}

const hasExpLanguage = function (params) {
  let componentPool = EXP_I18N[params.componentCode]
  if (componentPool) {
    let items = componentPool[params.windowCode]
    if (items && items.hasOwnProperty(params.code)) {
      return true
    }
  }
  return false
}

const hasWidgetInfo = function (params) {
  let componentPool = WIDGET_I18N[params.componentCode]
  if (componentPool) {
    let windowPool = componentPool[params.windowCode]
    if (windowPool) {
      let widgetPool = windowPool[params.widgetCode]
      if (widgetPool && widgetPool.hasOwnProperty[params.code]) {
        return true
      }
    }
  }
  return false
}

export {
  get,
  getAll,
  getExpLanguage,
  getResourcePackage,
  getWidgetInfo,
  has,
  hasExpLanguage,
  hasResourcePackage,
  hasWidgetInfo,
  init,
  initExp,
  initResourcePackage,
  initWidget,
  initWindow
}
