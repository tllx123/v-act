import { ProcessorUtils as desigerUtils } from '@v-act/vjs.framework.extension.platform.application.window.web.designer.utils'
import { Environment as environment } from '@v-act/vjs.framework.extension.platform.interface.environment'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import {
  WindowContainer,
  WindowContainerManager as windowRelation
} from '@v-act/vjs.framework.extension.platform.services.view.relation'
import { widgetRenderer } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { Log as logUtil } from '@v-act/vjs.framework.extension.util.log'

const _renderWinsPool = {}

const _getKey = function (params: { target: { type: string; code: string } }) {
  const target = params.target
  return target.type + '_$_' + target.code
}

/**
 * 是否需要渲染，如果页面已打开，则忽略渲染
 */
const _needToRender = function (params: {
  target: { isBody: boolean; code: string }
}) {
  //   const target = params.target
  //   if (target.isBody) {
  //     //渲染到body就不判断
  //     return true
  //   }
  //   const elCode = target.code
  //   return (
  //     $('#' + elCode)
  //       .children("[eventproxy!='']")
  //       .size() == 0
  //   )
  return true
}

/**
 * 兼容sc窗体
 * */
const compatibleScWindow = function (params) {
  if (params.scParamConfig) {
    const paramCfg = params.scParamConfig
    const runningMode = paramCfg.runningMode,
      debug = paramCfg.debug,
      contextPath = paramCfg.contextPath
    environment.setRunningMode(runningMode)
    environment.setDebug(debug)
    environment.setContextPath(contextPath)
    environment.setPlatformType('RuntimeSchema')
    environment.setDebugPort(paramCfg.debugPort)
    environment.setDevId(paramCfg.devId)
    params['sc_languageCode'] = paramCfg.languageCode
  }
}

/**
 * 窗体渲染
 * @param Object params 渲染参数
 * {
 * 		source : {
 * 			componentCode : 构件编号
 * 			windowCode ： 窗体编号
 * 			title : 标题
 * 			inputs ： {
 * 				variable ：{
 * 					窗体入参编号 ： 窗体入参值
 * 				}
 * 			}
 * 		} 源信息
 * 		target : {
 * 			type : 目标容器类型，枚举值：1、DOM html元素2、widget 控件,
 * 			code : 编号
 * 		}
 * 		aops : {
 * 			rendered : Function 渲染后回调
 * 			inited : Function 窗体初始化回调,加载事件前
 * 			loaded : Function 窗体加载事件执行后
 * 			completed:Function 窗体渲染、初始化完成回调
 * 		}
 * 		context : {
 * 			domain : 域信息，默认为null
 * 			scopeId : 当前窗体实例id
 * 			domain: 项目ID
 * 		},
 * 		extData: { 额外数据信息，为预处理器提供额外判断信息
 * 		},
 *
 * 		fail : Function 打开失败回调
 * }
 */
export function render(params) {
  if (_needToRender(params)) {
    if (params.scParamConfig) {
      //sc窗体模板调用
      compatibleScWindow(params)
    }
    const services = sb.getAllServices(
      'vjs.framework.extension.platform.services.view.window.render.preprocessor'
    )
    if (services && services.length > 0) {
      const task = []
      for (let i = 0, l = services.length; i < l; i++) {
        const service = services[i]
        task.push(service.process(params))
      }
      $.when.apply($.when, task).done(function () {
        _render(params)
      })
    } else {
      _render(params)
    }
  }
}
/**
 * 直接渲染窗体的接口
 * */
export function renderDirectly(params) {
  if (_needToRender(params)) {
    _render(params)
  }
}

const _render = function (params) {
  const parentScopeId = params.context ? params.context.scopeId || null : null
  const inputParams = params.source.inputs ? params.source.inputs : {}
  const targetDomCode = params.target.code
  const componentCode = params.source.componentCode
  const windowCode = params.source.windowCode
  if (params.context && params.context.hasOwnProperty('domain')) {
    environment.setDomain(params.context['domain'])
  }
  const assignScopeId = params.source.assignScopeId
  let newScopeId
  if (assignScopeId) {
    const tmpScope = scopeManager.getScope(assignScopeId)
    if (null != tmpScope) {
      //如果域已存在，就不用创建了，避免属性重置
      newScopeId = assignScopeId
    } else {
      newScopeId = scopeManager.createWindowScope({
        scopeId: params.source.assignScopeId,
        parentScopeId: parentScopeId,
        componentCode: componentCode,
        windowCode: windowCode
      })
    }
  } else {
    newScopeId = scopeManager.createWindowScope({
      parentScopeId: parentScopeId,
      componentCode: componentCode,
      windowCode: windowCode
    })
  }
  const _$windowScope = scopeManager.getScope(newScopeId)
  const vjsContext = params.vjsContext ? params.vjsContext : null
  if (vjsContext && _$windowScope.putVjsContext) {
    for (const key in vjsContext) {
      if (vjsContext.hasOwnProperty(key)) {
        _$windowScope.putVjsContext(key, vjsContext[key])
      }
    }
  }
  if (_$windowScope) {
    //临时方案，窗体间距调整
    _$windowScope.set('isSpecialRoot', 'true')
  }
  if (params.sc_languageCode) {
    const resourcePackage = sb.getService(
      'vjs.framework.extension.ui.adapter.resourcepackage'
    )
    resourcePackage.setWindowCurrentResourceCode(
      newScopeId,
      null,
      componentCode,
      params.sc_languageCode
    )
  }
  const sandbox = sb.create()
  sandbox.use({ 'vjs.framework.extension.ui.adapter.dependency': null })
  sandbox.active().done(function () {
    const dependency = sb.getService(
      'vjs.framework.extension.ui.adapter.dependency'
    )
    dependency.loadResources(
      componentCode,
      windowCode,
      sandbox,
      newScopeId,
      function () {
        scopeManager.openScope(newScopeId)
        const type = scopeManager.getProperty('type')
        const componentUtil = sb.getService(
          'vjs.framework.extension.ui.adapter.init.' + type + '.web.util'
        )
        componentUtil.renderComponentById(
          componentCode,
          windowCode,
          inputParams,
          {
            scopeId: newScopeId,
            inited: params.aops ? params.aops.inited : null,
            rendered: function (component, scopeId) {
              const container = new WindowContainer({
                scopeId: newScopeId,
                componentCode: componentCode,
                windowCode: windowCode,
                ele: targetDomCode
              })
              const assginWindowTitle =
                inputParams &&
                inputParams.variable &&
                (inputParams.variable.windowTitle ||
                  inputParams.variable.windowName)
              container.set('title', assginWindowTitle)
              windowRelation.put(container)
              widgetRenderer.executeComponentRenderAction(
                'renderWindowToContainer',
                component,
                targetDomCode,
                true
              )
              // 让新窗体记住自己所在的容器
              widgetRenderer.executeComponentRenderAction(
                'setParentContainerInfo',
                windowCode,
                {
                  scopeId: parentScopeId,
                  containerCode: targetDomCode
                }
              )
              if (params.aops && params.aops.closed) {
                scopeManager.openScope(scopeId)
                const windowScope = scopeManager.getWindowScope()
                //处理跳转后把首页页签关闭的问题
                windowScope.set('RemoveModalFunc', params.aops.closed)
                windowScope.on(scopeManager.EVENTS.DESTROY, params.aops.closed)
                scopeManager.closeScope()
              }
              //_addRenderInfo(params);
              if (params.aops && params.aops.rendered) {
                params.aops.rendered(component, scopeId)
              }
            },
            completed: params.aops ? params.aops.completed : null,
            error: genExceptionHandle(params.fail, targetDomCode)
          }
        )
      },
      genExceptionHandle(params.fail, targetDomCode)
    )
  })
}
/**
 * 生成异常处理函数
 * @param {Function} fail 原异常处理函数
 * @param {String} targetDomCode 指定异常渲染的容器
 * */
const genExceptionHandle = function (fail, targetDomCode) {
  return function (exception) {
    /* 通过render接口渲染窗体的，统一设置网络异常的容器 */
    if (
      typeof exception.isNetwork &&
      exception.isNetwork &&
      exception.isNetwork() == true &&
      !exception.getContainerId() &&
      targetDomCode
    ) {
      exception.setContainerId(targetDomCode)
    }
    if (typeof fail == 'function') {
      fail(exception)
    } else {
      throw exception
    }
  }
}

/**
 * 默认回调
 * */
const defaultDtdCallback = function (dtd, value) {
  setTimeout(
    (function (_dtd, _value) {
      return function () {
        _dtd.resolve(_value)
      }
    })(dtd, value),
    1
  )
}

const getViewlib = function (callback, componentCode, windowCode, dtd) {
  const vjsName =
    'vjs.framework.extension.publish.' +
    componentCode +
    '.' +
    windowCode +
    '.viewLib'
  const services = sb.getAllServices(vjsName)
  const handler = function (services) {
    if (services) {
      let exist = false
      const seriesArr = []
      for (let i = 0, len = services.length; i < len; i++) {
        const service = services[i]
        const tmpSeries = service.getSeries()
        if ('smartclient' == tmpSeries) {
          callback(service)
          exist = true
          break
        } else {
          if (seriesArr.indexOf(tmpSeries) == -1) {
            seriesArr.push(tmpSeries)
          }
        }
      }
      if (!exist) {
        logUtil.warn(
          '窗体的类型不匹配,已忽略处理. [' +
            componentCode +
            '][' +
            windowCode +
            ']的窗体类型是: [' +
            seriesArr.join(',') +
            ']'
        )
        callback(null)
      }
    } else {
      logUtil.warn(
        '无法获取窗体[' +
          componentCode +
          '][' +
          windowCode +
          ']的信息, 已忽略处理.'
      )
      callback(null)
    }
  }
  if (null == services || services.length == 0) {
    //还没加载
    const vjsNames = [vjsName]
    const loadCB = function () {
      const services = sb.getAllServices(vjsName)
      handler(services)
    }
    sb.use(vjsNames)
    sb.active()
      .done(loadCB)
      .fail(function (e) {
        if (dtd) {
          dtd.rejectWith(dtd, [e])
        }
        throw e
      })
  } else {
    handler(services)
  }
}
const getMappings = function (viewlib) {
  let mappings = viewlib.getWidgetPropertys()
  if (mappings.WidgetProperty) {
    mappings = mappings.WidgetProperty
  }
  return mappings
}
/**
 * 查找控件的默认属性
 * @param	{Object}	viewlib			窗体viewlib对象
 * @param	{String}	widgetCode		控件编码
 * @param	{String}	propetyName		属性编码
 * */
const findWidgetProperty = function (viewlib, widgetCode, propertyName) {
  let value
  const mappings = getMappings(viewlib)
  const widgetProperty = mappings[widgetCode]
  if (widgetProperty) {
    if (widgetProperty.hasOwnProperty(propertyName)) {
      return widgetProperty[propertyName]
    }
    value = desigerUtils.getDefaultDesignProps({
      series: 'smartclient',
      type: widgetProperty.type,
      propertyCode: propertyName
    })
  }
  return value
}
/**
 * 获取设计期的属性
 * @param	{String}	componentCode	构件编码
 * @param	{String}	windowCode		窗体编码
 * @param	{String}	propertyName	属性名称
 * @param	{String}	defaultValue	默认返回值
 * @param	{Function}	valueHandler	值处理
 * @param	{String}	componentCode
 * */
const getDesignerProperty = function (
  componentCode,
  windowCode,
  propertyName,
  defaultValue,
  valueHandler
) {
  const dtd = $.Deferred()
  if (componentCode && windowCode) {
    const callback = function (viewlib) {
      if (viewlib && viewlib.getWidgetPropertys) {
        let _value = findWidgetProperty(viewlib, windowCode, propertyName)
        if (typeof valueHandler == 'function') {
          _value = valueHandler(_value, viewlib)
        }
        dtd.resolve(_value)
      } else {
        defaultDtdCallback(dtd, defaultValue)
      }
    }
    getViewlib(callback, componentCode, windowCode, dtd)
  } else {
    defaultDtdCallback(dtd, defaultValue)
  }
  return dtd
}
export function calHeight(value: null, viewlib: any) {
  if (value != -1) {
    const mappings = getMappings(viewlib)
    if (mappings) {
      let sum = 0
      let fix = 0
      let hasformLayout = false
      let hasOtherLayout = false
      let formatLayoutWidgetCount = 0
      let otherLayoutWidgetCount = 0
      for (const widgetCode in mappings) {
        const widget = mappings[widgetCode]
        if (widget.type == 'JGFormLayout' || widget.type == 'JGGroupPanel') {
          if (widget.type == 'JGFormLayout') {
            hasformLayout = true
          }
          if (widget.type == 'JGGroupPanel') {
            hasOtherLayout = true
          }
          if (widget.GroupTitle) {
            formatLayoutWidgetCount++
          } else {
            if (widget.Dock == 'Fill') {
              fix = 8
            }
            otherLayoutWidgetCount++
          }
        }
      }
      //计算公式不一定完全准确，目前验证场景是vbase_prd_org
      if (formatLayoutWidgetCount > 0) {
        sum += formatLayoutWidgetCount * 2 * 8
      }
      if (otherLayoutWidgetCount > 0) {
        sum += (otherLayoutWidgetCount - 1) * 8
      }
      if (hasformLayout && hasOtherLayout) {
        //特殊场景
        sum += 18
      }
      value += sum
    }
  }
  return value
}

/**
 * 获取窗体宽度
 * @params	{Object}	params
 * {
 * 	componentCode:"构件编码",
 *  windowCode:"窗体编码"
 * }
 * @returns dtd 使用样例：dtd.then(function(value){ //todo... }) Integer	窗体宽度 若value为-1，表示未查询到指定窗体信息
 * */
export function getDesignerWidth(params: {
  componentCode: string
  windowCode: string
}) {
  return getDesignerProperty(
    params.componentCode,
    params.windowCode,
    'Width',
    -1,
    function (value: number) {
      if (value != -1) {
        value += 12
      }
      return value
    }
  )
}
/**
 * 获取窗体高度
 * @params	{Object}	params
 * {
 * 	componentCode:"构件编码",
 *  windowCode:"窗体编码"
 * }
 * @returns dtd 使用样例：dtd.then(function(value){ //todo... }) Integer	窗体高度 若value为-1，表示未查询到指定窗体信息
 * */
export function getDesignerHeight(params: {
  componentCode: string
  windowCode: string
}) {
  return getDesignerProperty(
    params.componentCode,
    params.windowCode,
    'Height',
    -1,
    exports.calHeight
  )
}
/**
 * 判断窗体是否默认最大化
 * @params	{Object}	params
 * {
 * 	componentCode:"构件编码",
 *  windowCode:"窗体编码"
 * }
 * @returns dtd 使用样例：dtd.then(function(value){ //todo... }) Boolean	窗体是否最大化 若value为null，表示未查询到指定窗体信息
 * */
export function isDefaultMaximize(params: {
  componentCode: string
  windowCode: string
}) {
  return getDesignerProperty(
    params.componentCode,
    params.windowCode,
    'WindowState',
    false,
    function (val: string) {
      return val == 'Maximized'
    }
  )
}
