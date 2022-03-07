import { designerProcessor } from '@v-act/vjs.framework.extension.platform.application.window.web.designer'
import { WindowDatasource as windowDatasource } from '@v-act/vjs.framework.extension.platform.data.manager.runtime.datasource'
import { ComponentResourceManager as componentResourceManager } from '@v-act/vjs.framework.extension.platform.data.storage.schema.param'
import { WindowVMMapping as windowVMMapping } from '@v-act/vjs.framework.extension.platform.data.storage.schema.vmmapping'
import {
  componentPackData,
  componetData
} from '@v-act/vjs.framework.extension.platform.global.data'
import { frontendAlerterUtil } from '@v-act/vjs.framework.extension.platform.interface.alerter'
import { Environment } from '@v-act/vjs.framework.extension.platform.interface.environment'
import { windowI18n } from '@v-act/vjs.framework.extension.platform.interface.i18n'
import { scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { elementManager } from '@v-act/vjs.framework.extension.platform.services.browser'
import { windowInit } from '@v-act/vjs.framework.extension.platform.services.init'
import { windowContainerManager } from '@v-act/vjs.framework.extension.platform.services.view.relation'
import { widgetRenderer } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { widgetContext } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'
import { widgetRelation } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.relation'
import { widgetProcessor } from '@v-act/vjs.framework.extension.platform.services.view.window.property'
import { windowRenderer } from '@v-act/vjs.framework.extension.platform.services.view.window.renderer'
import {
  Resource,
  windowResource
} from '@v-act/vjs.framework.extension.platform.services.view.window.resources'
import { mediator } from '@v-act/vjs.framework.extension.system.mediator'
import { widgetModule } from '@v-act/vjs.framework.extension.widget.manager' //未依赖

/**
 * 窗体模板初始化
 * */
export function init(params) {
  let domain = params.domain,
    componentPackMappingDatas = params.componentPackMappingDatas,
    componentCode = params.componentCode,
    windowCode = params.windowCode,
    inputParam = params.inputParam,
    languageCode = params.languageCode,
    vjsInitFunc = params.vjsInitFunc,
    paramCfg = params.paramCfg

  //设置领域信息
  //		Environment.setDomain(domain);
  //初始化环境变量信息
  Environment.init(params.envirmentContext)
  componetData.setComponentType('RuntimeSchema')
  //窗体映射数据初始化
  mediator.init()
  //初始化构件包数据
  componentPackData.init(componentPackMappingDatas)
  //切面函数
  vjsInitFunc(sandbox)
  //渲染窗体

  let rootID = $('body').attr('id')
  if (!rootID) {
    rootID = 'root_' + new Date().getTime()
    $('body').attr('id', rootID)
  }
  //导致扩展点实现执行多次的问题，所以先屏蔽
  //		//此处创建域，兼容逻辑最小
  //		let scopeId = scopeManager.createWindowScope({
  //			"parentScopeId":null,
  //			"componentCode":componentCode,
  //			"windowCode":windowCode,
  //			"series":"smartclient"
  //		});
  windowRenderer.render({
    source: {
      componentCode: componentCode,
      windowCode: windowCode,
      inputs: inputParam
    },
    target: {
      type: 'DOM',
      code: rootID,
      isBody: true
    },
    //			"context" : {
    //				"scopeId" : scopeId
    //			},
    aops: {
      rendered: function (component, scopeId) {
        let setTitle = function (newTitle) {
          if (newTitle) {
            document.title = newTitle
          }
        }
        let windowTitle
        let containerId = windowContainerManager.getByScopeId(scopeId)
        if (containerId) {
          let container = windowContainerManager.get(containerId)
          windowTitle = container.get('title') //指定的入参标题
          windowContainerManager.updateWindowInfo(containerId, {
            titleFunc: setTitle
          })
        }
        if (!windowTitle) {
          let windowScope = scopeManager.getWindowScope()
          //处理窗体设计器修改窗体标题后不生效的问题Task20201028027
          if (windowScope && typeof windowScope.getTitle == 'function') {
            windowTitle = windowScope.getTitle()
          }
        }
        if (windowTitle && windowTitle != document.title) {
          document.title = windowTitle
        }
        let listenerWindowSize = {
          start: true //是否启动监听
        }
        if (
          !component.isOldWindowLayoutConfig ||
          !component.isOldWindowLayoutConfig()
        ) {
          let newWidth = widgetRenderer.executeComponentRenderAction(
            'getWindowMultiWidth',
            windowCode
          )
          newWidth = parseInt(newWidth)
          let fixWidth = false
          let fixHeight = false
          if (!isNaN(newWidth)) {
            listenerWindowSize.width = newWidth
            fixWidth = true
          }
          let newHeight = widgetRenderer.executeComponentRenderAction(
            'getWindowMultiHeight',
            windowCode
          )
          newHeight = parseInt(newHeight)
          if (!isNaN(newHeight)) {
            listenerWindowSize.height = newHeight
            fixHeight = true
          }
          if (fixWidth && fixHeight) {
            //固定宽高不用监听
            listenerWindowSize.start = false
          }
        }
        if (listenerWindowSize.start) {
          component._$ResizeConfig = listenerWindowSize
          elementManager.bindEleResize({
            eleId: rootID,
            listener: function (params) {
              if (params) {
                let width = params.width
                let height = params.height
                let resizeConfig = component._$ResizeConfig
                if (resizeConfig) {
                  if (resizeConfig.width) {
                    width = resizeConfig.width
                  }
                  if (resizeConfig.height) {
                    height = resizeConfig.height
                  }
                }
                component.resizeTo(width, height)
              }
            }
          })
        }
      }
    },
    sc_languageCode: languageCode,
    scParamConfig: paramCfg,
    fail: function (exception) {
      /* 页面打开发生网络异常，并且没有指定容器id，直接指定body为容器，统一生成网络异常的提示, 场景：打开链接地址打开到组件容器 */
      if (
        typeof exception.isNetwork &&
        exception.isNetwork &&
        exception.isNetwork() == true &&
        !exception.getContainerId()
      ) {
        exception.setContainerId('_$body') //全局捕抓异常的地方对此id值特殊处理
      }
      throw exception
    }
  })
}

let _oldLayoutWidgetTypes = ['JGPanel', 'JGFlowLayoutPanel', 'JGGroupBox']
/**
 * 是否为旧布局窗体
 */
let isOldLayoutWindow = function (properties) {
  if (properties) {
    for (let widgetCode in properties) {
      if (properties.hasOwnProperty(widgetCode)) {
        let pros = properties[widgetCode]
        if (
          pros.LayoutType == 'BorderLayout' ||
          _oldLayoutWidgetTypes.indexOf(pros._$WidgetType) != -1
        ) {
          return true
        }
      }
    }
  }
  return false
}

let createWidget = function (widgetCode, widgetType, properties) {
  let constructor = isc[widgetType]
  if (constructor) {
    let widget
    if (isc.isA.FormItem(constructor)) {
      widget = createFormItemWidget(widgetCode, widgetType, properties)
    } else {
      widget = createCommonWidget(widgetCode, widgetType, properties)
    }
    if (isc.isA && isc.isA.IWindowAop && isc.isA.IWindowAop(constructor)) {
      windowInit.registerHandler({
        eventName: windowInit.Events['AfterDataLoad'],
        handler: (function (widget) {
          return function () {
            widget.dataLoaded && widget.dataLoaded()
          }
        })(widget)
      })
      windowInit.registerHandler({
        eventName: windowInit.Events.WindowInited,
        handler: (function (widget) {
          return function () {
            widget.windowInited && widget.windowInited()
          }
        })(widget)
      })
      windowInit.registerHandler({
        eventName: windowInit.Events.BeforeDataLoad,
        handler: (function (widget) {
          return function () {
            widget.beforeDataLoad && widget.beforeDataLoad()
          }
        })(widget)
      })
      windowInit.registerHandler({
        eventName: windowInit.Events.AfterDataLoad,
        handler: (function (widget) {
          return function () {
            widget.afterDataLoad && widget.afterDataLoad()
          }
        })(widget)
      })
      windowInit.registerHandler({
        eventName: windowInit.Events.WindowLoaded,
        handler: (function (widget) {
          return function () {
            widget.windowLoaded && widget.windowLoaded()
          }
        })(widget)
      })
      windowInit.registerHandler({
        eventName: windowInit.Events.OnDataLoad,
        handler: (function (widget) {
          return function () {
            widget.dataLoad && widget.dataLoad()
          }
        })(widget)
      })
      windowInit.registerHandler({
        eventName: windowInit.Events.OnBindRule,
        handler: (function (widget) {
          return function () {
            widget.v3InitEvent && widget.v3InitEvent()
          }
        })(widget)
      })
    }
    let scopeId = scopeManager.getCurrentScopeId()
    widgetContext.put(widgetCode, 'widgetObj', widget)
    widgetContext.put(widgetCode, 'scopeId', scopeId)
    let id = isc.WidgetUtils.genWidgetRefId(scopeId, widgetCode)
    isc.JGWidgetManager.putWidget(id, widget)
  } else {
    throw Error('控件定义为找到，请检查！ 控件类型：' + widgetType)
  }
}

let createFormItemWidget = function (widgetCode, widgetType, properties) {
  properties.type = widgetType
  let dynamicFormProps = {
    items: [properties]
  }
  const metadataService = sb.getService(
    '@v-act/vjs.framework.extension.ui.plugin.smartclient.metadata.' +
      widgetType
  )
  let metadata = metadataService.getMetadata()
  let propertiesCfg = metadata.properties
  for (let i = 0, l = propertiesCfg.length; i < l; i++) {
    let property = propertiesCfg[i]
    let editor = property.editor
    let code = property.code
    if (editor && editor.type == 'left') {
      dynamicFormProps.left = properties[code]
    } else if (editor && editor.type == 'top') {
      dynamicFormProps.top = properties[code]
    } else if (editor && editor.type == 'entity') {
      dynamicFormProps.valuesManager = isc.ValuesManager.getByDatasource(
        properties[code]
      )
    }
  }
  return isc.DynamicForm.create(dynamicFormProps)
}

let createCommonWidget = function (widgetCode, widgetType, properties) {
  return isc[widgetType].create(properties)
}
/**
 * 父级域中执行指定的函数
 * */
let _exeHandleInParentScope = function (scopeId, handle) {
  let scope = scopeManager.getScope(scopeId)
  let currentScope = scope
  while (true) {
    let parentScopeId = currentScope.getExtendId()
    if (!parentScopeId) {
      break
    }
    currentScope = scopeManager.getScope(parentScopeId)
    scopeManager.createScopeHandler({
      scopeId: parentScopeId,
      handler: handle
    })()
  }
}
/**
 * 初始化窗体域内实体信息 调用的地方需要确保域正确
 * */
let _initDsInfo = function () {
  let currentScope = scopeManager.getWindowScope()
  let componentCode = currentScope.getComponentCode()
  let windowCode = currentScope.getWindowCode()
  let serverName1 =
    'vjs.framework.extension.publish.' +
    componentCode +
    '.' +
    windowCode +
    '.widget.property'
  let domain = Environment.getDomain()
  let props
  if (domain) {
    let serverName2 = serverName1 + '.' + domain
    props = sandbox.getService(serverName2)
  }
  if (!props) {
    props = sandbox.getService(serverName1)
  }
  let vmmapping = {}
  if (props && props.getDatasourceMapping) {
    //如果不存在此方法，表示该构件在新的数据源下没有重新发布过，则不需要处理
    vmmapping.dataSources = props.getDatasourceMapping()
    vmmapping.widgets = props.getWidgetDSMapping()
    windowVMMapping.addVMMapping(componentCode, windowCode, vmmapping)
    windowDatasource.init()
    //标记数据源已经初始化
    currentScope.markInitedDatasource && currentScope.markInitedDatasource()
  }
}

/**
 * 执行viewlib
 * */
export function execute(params) {
  let sourceParams = params.params
  let param = sourceParams.param //源方法入参
  let scopeId = sourceParams.scopeId
  let callback = sourceParams.callback
  let viewlibObj = sourceParams.viewlib

  let reloadVjsList = params.getReloadVjsList()
  if (!reloadVjsList || !(reloadVjsList instanceof Array)) {
    reloadVjsList = []
  }
  _exeHandleInParentScope(scopeId, function () {
    let scope = scopeManager.getWindowScope()
    let _comCode = scope.getComponentCode()
    let _winCode = scope.getWindowCode()
    reloadVjsList.push(
      'vjs.framework.extension.publish.' +
        _comCode +
        '.' +
        _winCode +
        '.viewLib'
    ) //不能使用widget.property,网页窗体不存在这个vjs：普通窗体继承网页窗体
  })
  let success = function () {
    let loadThirdUriSuccess = function () {
      let loadSuccess = function () {
        let scopeId = param.scopeId,
          componentId = param.componentId,
          callback = param.callback,
          skinType = param.skinType
        try {
          scopeManager.openScope(scopeId)
          let windowScope = scopeManager.getWindowScope()
          let componentCode = windowScope.getComponentCode()
          let windowCode = windowScope.getWindowCode()
          try {
            //初始化父级的实体定义信息
            _exeHandleInParentScope(scopeId, _initDsInfo)
            //初始化窗体的实体定义信息
            _initDsInfo()
          } catch (e) {
            throw Error('窗体数据源初始化错误，错误原因：' + e.message)
          }
          /*控件关联关系BEGIN*/
          let widgetRelationInfo = params.getWidgetRelation()
          if (widgetRelationInfo) {
            for (let widgetCode in widgetRelationInfo) {
              let childWidgetCode = widgetRelationInfo[widgetCode]
              isc.WidgetContext.putWidgetRelation(
                scopeId,
                widgetCode,
                childWidgetCode
              )
              widgetRelation.put(
                widgetCode,
                childWidgetCode,
                widgetRelation.WIDGET_RELATION
              )
            }
          }
          /**
           * 1.获取修改后的属性，替换viewlib的属性
           * 2.获取默认属性，viewlib没有的话，就添加，viewlib已有就忽略
           * */
          designerProcessor.render({
            viewlib: viewlibObj,
            scopeId: scopeId
          })
          //修改后
          let mappings = viewlibObj.getWidgetPropertys(scopeId)
          if (mappings.WidgetProperty) {
            mappings = mappings.WidgetProperty
          }
          let widgetPropertyRelation = params.getWidgetPropertys(scopeId)
          if (mappings) {
            let allRelations = widgetPropertyRelation.Relations
            if (allRelations) {
              let aRs = {}
              if (allRelations) {
                for (let pId in allRelations) {
                  if (!allRelations.hasOwnProperty(pId)) continue
                  let childInfos = allRelations[pId]
                  if (!childInfos || childInfos.length < 1) continue
                  for (let i = 0; i < childInfos.length; i++) {
                    let childInfo = childInfos[i]
                    let type = childInfo.type
                    let code = childInfo.code
                    widgetContext.put(
                      code,
                      'ProxyWidgetId',
                      childInfo.proxyWidgetId
                    )
                    widgetContext.put(code, 'WidgetType', childInfo.type)
                    aRs[code] = pId
                  }
                }
              }
            }
            let isOldLayout = isOldLayoutWindow(mappings)
            for (let widgetId in mappings) {
              if (mappings.hasOwnProperty(widgetId)) {
                let pros = mappings[widgetId]
                if (isOldLayout) {
                  pros._$windowVersion = null
                }
                widgetContext.putAll(widgetId, pros)
              }
            }
            /*控件属性END*/
            let renderedCB = scopeManager.createScopeHandler({
              handler: function () {
                let scope = scopeManager.getScope()
                //									let skin = sandbox.getService("vjs.framework.extension.publish."+scope.getComponentCode() + "." + scope.getWindowCode() + ".skin");
                //									if(skin){
                //										skin.render();
                //									}

                let initWidget = function (code) {
                  let pros = widgetContext.getAll(code)
                  let childrenIds = isc.WidgetContext.getChildrenIds(
                    scopeId,
                    code
                  )
                  if (childrenIds && childrenIds.length > 0) {
                    for (let childId, i = 0; (childId = childrenIds[i]); i++) {
                      initWidget(childId)
                    }
                  }
                  let initor = widgetModule.get(pros.type)
                  if (initor) {
                    /*多语言升级后，兼容未标记多语言的属性 后续有全部重新发布之后，可删除此处的兼容逻辑*/
                    if (pros.Placeholder) {
                      let componentCode = scope.getComponentCode()
                      let windowCode = scope.getWindowCode()
                      if (pros.Placeholder) {
                        pros.Placeholder = windowI18n.getWidgetInfo({
                          code: 'Placeholder',
                          componentCode: componentCode,
                          windowCode: windowCode,
                          widgetCode: pros.Code,
                          defaultVal: pros.Placeholder
                        })
                      }
                    }
                    if (initor.isNewDevelopMode && initor.isNewDevelopMode()) {
                      createWidget(code, pros.type, pros)
                    } else {
                      initor.init(pros)
                    }
                  }
                }
                initWidget(componentId)
                if (typeof param.callback == 'function')
                  param.callback.call(
                    viewlibObj,
                    isc.WidgetUtils.getWidget(param.scopeId, param.componentId),
                    param.scopeId
                  )
              }
            })
            if (widgetProcessor) {
              widgetProcessor.process({
                callback: renderedCB
              })
            } else {
              renderedCB()
            }
          }
        } finally {
          scopeManager.closeScope()
        }
      }
      let windowRefResource = params.getWindowRefResource()
      let error = function () {
        let resources = windowRefResource
        let resourceInfos
        if (resources && resources.length > 0) {
          for (let i = 0, l = resources.length; i < l; i++) {
            resourceInfos += resources[i] + '\n'
          }
        }
        frontendAlerterUtil.error({
          title: '资源加载失败',
          msgHeader: '窗体依赖资源加载失败',
          msg: '资源列表：\n' + resourceInfos,
          detail: '暂无详情.'
        })
      }
      if ('' != windowRefResource && '[]' != windowRefResource) {
        windowResource.addResource(
          new Resource({
            resources:
              componentResourceManager.getComponentResourcePaths(
                windowRefResource
              )
          })
        )
      }
      windowResource.loadResources({
        success: loadSuccess,
        error: error
      })
    }
    let widgetThirdUri = params.getWidgetThirdUri()
    if (widgetThirdUri && '' != widgetThirdUri) {
      widgetThirdUri = [widgetThirdUri]
      if (
        widgetThirdUri &&
        widgetThirdUri.length > 0 &&
        window.IsVPlatformPrototypeIden &&
        window.extraBasePathPrefix
      ) {
        for (let i = 0, len = widgetThirdUri.length; i < len; i++) {
          widgetThirdUri[i] = window.extraBasePathPrefix + widgetThirdUri[i]
        }
      }
      vdk.resource.load(widgetThirdUri, loadThirdUriSuccess)
    } else {
      loadThirdUriSuccess()
    }
  }
  if (reloadVjsList && '' != reloadVjsList && '[]' != '' + reloadVjsList) {
    sandbox.use(reloadVjsList)
    sandbox.active().done(success)
  } else {
    success()
  }
}
