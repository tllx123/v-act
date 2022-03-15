import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { cookieUtil as cookieUtil } from '@v-act/vjs.framework.extension.platform.services.domain.cookie'
import {$} from '@v-act/vjs.framework.extension.vendor.jquery'

let sandBox:any
export function initModule(sb:any) {
  sandBox = sb
  let dependency = sb.getService(
    'vjs.framework.extension.ui.adapter.resourcepackage'
  )
  //@ts-ignore
  dependency.putInstance(this)
}

/**
 * <b>资源池</b>
 */
let resourcePackagePool:{[code:string]:any} = {}

let resourceWindowPool:{[code:string]:any} = {}

let getLanguageCode = function (componentCode:string, languageCode:string, callFun:any) {
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

let getValidLanguage = function (componentCode:string, resourceCode:string) {
  let backLang = ''
  if (!resourceCode) {
    return resourceCode
  }
  let jsonUtil = sandBox.getService('vjs.framework.extension.util.JsonUtil')
  getLanguageCode(componentCode, resourceCode, function (inputParams:any) {
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
  newScopeId:string,
  preScopeId:string,
  componentCode:string,
  languageCode:string
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
      let options:{[code:string]:any} = {}
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
let getWindowCurrentResourceCode = function (scopeId:string) {
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
let getResourceItem = function (resourceCode:string, componentCode:string, resourceType:string) {
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
let getResourceItems = function (componentCode:string, resourceType:string) {
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

let getLanguageItem = function (resourceCode:string, componentCode:string) {
  return getResourceItem(resourceCode, componentCode, 'language')
}

let getLanguageItems = function (componentCode:string) {
  return getResourceItems(componentCode, 'language')
}

let getResItem = function (resourceCode:string) {
  return getResourceItem('res', resourceCode,'')
}
/**
 * <b>获取资源</b>
 *
 * @pool 资源标识
 */
let setResourcePool = function (pool:any, type:any) {
  //if (undefined == pool || undefined == pool.resources)
  //throw new Error("资源池格式错误请检查");
  resourcePackagePool = $.extend(true, {}, resourcePackagePool, pool)
}

export {
  getResItem,
  setResourcePool,
  getLanguageItem,
  getLanguageItems,
  setWindowCurrentResourceCode,
  getWindowCurrentResourceCode,
  getValidLanguage
}
