import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { cookieUtil as cookieUtil } from '@v-act/vjs.framework.extension.platform.services.domain.cookie'

let sandBox
exports.initModule = function (sb) {
  sandBox = sb
  let dependency = sb.getService(
    'vjs.framework.extension.ui.adapter.resourcepackage'
  )
  dependency.putInstance(exports)
}

/**
 * <b>资源池</b>
 */
let resourcePackagePool = {}

let resourceWindowPool = {}

let getLanguageCode = function (componentCode, languageCode, callFun) {
  let inputParams = {
    ruleSetCode: 'CommonRule_ResourceOperation',
    componentCode: componentCode,
    isAsyn: false,
    commitParams: [
      {
        paramName: 'InParams',
        paramType: 'char',
        paramValue:
          '{"language":"' +
          languageCode +
          '", "componentCode":"' +
          componentCode +
          '"}'
      }
    ],
    afterResponse: callFun
  }
  let serverRuleSetAccessor = sandBox.getService(
    'vjs.framework.extension.platform.services.operation.remote.RemoteMethodAccessor'
  )
  // 设置当前默认语言
  serverRuleSetAccessor.invoke(inputParams)
}

let getValidLanguage = function (componentCode, resourceCode) {
  let backLang = ''
  if (!resourceCode) {
    return resourceCode
  }
  let jsonUtil = sandBox.getService('vjs.framework.extension.util.JsonUtil')
  getLanguageCode(componentCode, resourceCode, function (inputParams) {
    if (inputParams && inputParams.OutputJson) {
      let parsms = jsonUtil.json2obj(inputParams.OutputJson)
      if (parsms && parsms.language) {
        backLang = parsms.language
      }
    }
  })
  return backLang
}

/**
 * 设置当前窗体使用的默认语言
 */
let setWindowCurrentResourceCode = function (
  newScopeId,
  preScopeId,
  componentCode,
  languageCode
) {
  if (!newScopeId) {
    newScopeId = scopeManager.getWindowScope().getInstanceId()
  }

  if (languageCode) {
    resourceWindowPool[newScopeId] = languageCode
  } else {
    let curLanguage = ''
    //获取cookie
    if (cookieUtil && cookieUtil.vcookie) {
      let options = {}
      options.expires = new Date(2500, 0, 1)
      let value
      curLanguage = cookieUtil.vcookie({
        name: 'langCookie',
        value: value,
        options: options,
        isNotEncrypt: true
      })
      curLanguage = getValidLanguage(componentCode, curLanguage)
    }

    // 如果参数没有传递语言，则取父容器语言
    if (!(curLanguage && curLanguage !== '')) {
      curLanguage = getWindowCurrentResourceCode(preScopeId)
      //语言无效，则设置为默认语言
      curLanguage = getValidLanguage(componentCode, curLanguage)
    }
    if (curLanguage) {
      resourceWindowPool[newScopeId] = curLanguage
    }
  }
}

/**
 * 获取当前窗体使用的默认语言
 */
let getWindowCurrentResourceCode = function (scopeId) {
  if (!scopeId) {
    scopeId = scopeManager.getWindowScope().getInstanceId()
  }
  return resourceWindowPool[scopeId]
}
/**
 * <b>当前资源包编码</b>
 */
let curResourcePackageCode

/**
 * <b>获取资源项</b>
 *
 * @key 资源标识
 * @return Object 资源值，如果找不到资源则返回null
 */
let getResourceItem = function (resourceCode, componentCode, resourceType) {
  let _windowPool =
    resourceWindowPool[scopeManager.getWindowScope().getInstanceId()]
  let _component = componentCode
  if (!_component) {
    _component = getComponentCode()
  }
  if (
    resourcePackagePool &&
    resourcePackagePool[_component] &&
    resourcePackagePool[_component][resourceType] &&
    resourcePackagePool[_component][resourceType][_windowPool]
  ) {
    return resourcePackagePool[_component][resourceType][_windowPool][
      resourceCode
    ]
  } else {
    return ''
  }
}

/**
 * <b>获取资源项</b>
 *
 * @key 资源标识
 * @return Object 资源值，如果找不到资源则返回null
 */
let getResourceItems = function (componentCode, resourceType) {
  let _windowPool =
    resourceWindowPool[scopeManager.getWindowScope().getInstanceId()]
  if (
    resourcePackagePool &&
    resourcePackagePool[componentCode] &&
    resourcePackagePool[componentCode][resourceType]
  ) {
    return resourcePackagePool[componentCode][resourceType][_windowPool]
  } else {
    return {}
  }
}

//获取当前构建
let getComponentCode = function () {
  let renderer = sandBox.getService(
    'vjs.framework.extension.ui.common.plugin.services.Renderer'
  )
  let info = renderer.executeComponentAction('getParentContainerInfo')
  scopeManager.openScope(info.scopeId)
  let widgetContext = sandBox.getService(
    'vjs.framework.extension.widget.manager.widgetContext'
  )
  let code = widgetContext.get(info.containerCode, 'ComponentCode')
  scopeManager.closeScope()
  return code
}

//获取当前窗体
let getWindowCode = function () {
  let renderer = sandBox.getService(
    'vjs.framework.extension.ui.common.plugin.services.Renderer'
  )
  let info = renderer.executeComponentAction('getParentContainerInfo')
  scopeManager.openScope(info.scopeId)
  let widgetContext = sandBox.getService(
    'vjs.framework.extension.widget.manager.widgetContext'
  )
  let code = widgetContext.get(info.containerCode, 'WindowCode')
  scopeManager.closeScope()
  return code
}

let getLanguageItem = function (resourceCode, componentCode) {
  return getResourceItem(resourceCode, componentCode, 'language')
}

let getLanguageItems = function (componentCode) {
  return getResourceItems(componentCode, 'language')
}

let getResItem = function (resourceCode) {
  return getResourceItem('res', resourceCode)
}
/**
 * <b>获取资源</b>
 *
 * @pool 资源标识
 */
let setResourcePool = function (pool, type) {
  //if (undefined == pool || undefined == pool.resources)
  //throw new Error("资源池格式错误请检查");
  resourcePackagePool = $.extend(true, {}, resourcePackagePool, pool)
}

export {
  getResItem,
  getLanguageItem,
  setResourcePool,
  getLanguageItem,
  getLanguageItems,
  setWindowCurrentResourceCode,
  getWindowCurrentResourceCode,
  getValidLanguage
}
