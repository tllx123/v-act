import { ScopeManager as ScopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { ScopeTask as ScopeTask } from '@v-act/vjs.framework.extension.platform.global.task'
import { TaskManager as TaskManager } from '@v-act/vjs.framework.extension.platform.global.task'
import { ComponentData as ComponentData } from '@v-act/vjs.framework.extension.platform.global.data'
import { AppData as AppData } from '@v-act/vjs.framework.extension.platform.global.data'

let sandbox

exports.initModule = function (sb) {
  sandbox = sb
}

let _fireFunc = function (func, self, args) {
  if (typeof func == 'function') {
    func.apply(self, args)
  }
}

/**
 * 渲染组件并初始化
 * @param componentCode<String> 组件编码
 * @param windowCode<String> 窗体编码
 * @param {String} componentId 组件Id
 * @param {Object} inputParam 	输入参数
 * @param {Object} cfg 配置信息
 * 		  {
 * 		"refComponents":{},
 * 		"rendered":Function,组件渲染后回调
 * 		"beforeFormLoad":Function,窗体加载事件前回调
 * 		"inited" : Function, 组件初始化完成回调
 * 		"scopeId" : String 执行域id
 * 		"contextPath": String 上下文路径
 * 		"runningMode": String 运行模式
 * 		"debug" : boolean debug模式
 * 		"error" : Function 出错回调
 * }
 */
let renderComponentById = function (
  componentCode,
  windowCode,
  inputParam,
  cfg
) {
  let parentScopeId = ScopeManager.getCurrentScopeId()
  let scopeId =
    cfg && cfg.scopeId
      ? cfg.scopeId
      : ScopeManager.createWindowScope({
          parentScopeId: parentScopeId,
          componentCode: componentCode,
          windowCode: windowCode,
          series: 'smartclient'
        })
  let renderedCallback,
    initedCallback,
    beforeFormLoadCallback,
    refComponentCfg,
    errorFunc,
    contextPath,
    runningMode,
    debug
  if (cfg) {
    renderedCallback = cfg.rendered
    initedCallback = cfg.inited
    beforeFormLoadCallback = cfg.beforeFormLoad
    refComponentCfg = cfg.refComponents
    errorFunc = cfg.error
    contextPath = cfg.contextPath
    runningMode = cfg.runningMode
    debug = cfg.debug
    typeof contextPath != 'undefined' &&
      isc.WidgetContext.setContextPath(contextPath)
    typeof runningMode != 'undefined' &&
      isc.WidgetContext.setRunningMode(runningMode)
  }
  isc.setAutoDraw(false)
  isc.Log.setDefaultPriority(3)
  isc.Log.setLogPriority(isc.Log.getClassName(), 5)
  let _this = this
  renderComponent.call(
    _this,
    componentCode,
    windowCode,
    scopeId,
    function (component, scopeId) {
      //component.showModal("组件正在初始化，请稍候...");
      _fireFunc(renderedCallback, this, [
        component,
        scopeId,
        componentCode,
        windowCode
      ])
      let viewLib = this
      let initComponent = function () {
        seajs.use(
          'itop/v3/publish/smartclient/allforsmartclientext',
          function () {
            prepareComponent.call(
              _this,
              componentCode,
              windowCode,
              scopeId,
              inputParam,
              function () {
                viewLib.fireCallback()
                _fireFunc(initedCallback, this, [
                  component,
                  scopeId,
                  componentCode,
                  windowCode
                ])
              },
              refComponentCfg,
              function (exception) {
                exception.handle()
              },
              [
                {
                  'vjs.framework.extension.ui.adapter.dependency.desktop': null
                },
                {
                  'vjs.framework.extension.platform.rpc.operationLib.desktop':
                    null
                }
              ],
              beforeFormLoadCallback
            )
          }
        )
        let progressbar = sandbox.getService(
          'vjs.framework.extension.ui.common.plugin.services.progressbar.ProgressBarUtil'
        )
        progressbar.hideProgress()
      }
      setTimeout(initComponent, 10)
    },
    refComponentCfg,
    errorFunc
  )
}
/**
 *渲染组件
 * @param componentCode<String> 组件编码
 * @param windowCode<String> 窗体编码
 * @param {String} scopeId
 * @param {Function} func 渲染后回调函数
 * 		  参数列表：[组件实例，域Id]
 * @param {Object} variables 变量
 * @param {Function} 错误回调
 */
let renderComponent = function (
  componentCode,
  windowCode,
  scopeId,
  func,
  variables,
  error
) {
  let scopeTask = new ScopeTask(
    scopeId,
    false,
    _genRenderComponentCallback(componentCode, windowCode, scopeId, func, error)
  )
  let taskId = TaskManager.addTask(scopeTask)
  let bundleName =
    'vjs.framework.extension.publish.' +
    componentCode +
    '.' +
    windowCode +
    '.viewLib'
  let serviceName = bundleName
  let sandBox = sandbox.create()
  let extensionCfg = []
  extensionCfg.push(bundleName)
  let skinType = isc.WidgetContext.getSkinType()
  //var skinBundleName = "vjs.framework.extension.publish."+componentCode+"."+windowCode+".skin." + skinType;
  let skinBundleName =
    'vjs.framework.extension.publish.' +
    componentCode +
    '.' +
    windowCode +
    '.skin.varImpl'
  extensionCfg.push(skinBundleName)
  /*var languageName = "vjs.framework.extension.window.i18n.runtime.property."+componentCode+"."+windowCode+".default";
    extensionCfg.push(languageName);*/
  let componentName =
    'vjs.framework.extension.platform.init.view.schema.component.' +
    componentCode
  extensionCfg.push(componentName)
  /*var componentDefault = "vjs.framework.extension.component.i18n.runtime.property."+componentCode+".default";
    extensionCfg.push(componentDefault);*/
  sandBox.use(extensionCfg)

  sandBox.active().done(function () {
    let viewLib = sandBox.getService(serviceName)
    TaskManager.execTaskById(taskId, [viewLib])
  })
}
let _genRenderComponentCallback = function (
  componentCode,
  windowCode,
  scopeId,
  func,
  error
) {
  return function (viewLib) {
    let flag = _handleError(
      viewLib,
      componentCode,
      windowCode,
      'viewLib',
      error
    )
    if (!flag) {
      //渲染组件
      //var skinType = isc.WidgetContext.getSkinType();
      //var skinLib = sandbox.getService("vjs.framework.extension.publish."+componentCode+"."+windowCode+".skin");
      //skinLib.init();
      viewLib.execute({
        scopeId: scopeId,
        componentId: windowCode,
        skinType: skinType,
        callback: function (component, scopeId) {
          ScopeManager.openScope(scopeId)
          let windowScope = ScopeManager.getWindowScope()
          windowScope.on(ScopeManager.EVENTS.DESTROY, function () {
            let widgetAction = sandbox.getService(
              'vjs.framework.extension.platform.services.view.widget.common.action.WidgetAction'
            )
            widgetAction.executeComponentAction('destroyComponentData', scopeId)
          })
          ScopeManager.closeScope()
          _fireFunc(func, this, [component, scopeId, componentCode, windowCode])
        }
      })
    }
  }
}
/**
 * 初始化组件
 * @param componentCode<String> 组件编码
 * @param windowCode<String> 窗体编码
 * @param {String} scopeId
 * @param {Object} inputParam 输入变量
 * @param {Function} func 初始化回调函数
 * @param {Object} variables 变量
 * @param {Function} 错误回调
 */
let prepareComponent = function (
  componentCode,
  windowCode,
  scopeId,
  inputParam,
  func,
  variables,
  error,
  deps,
  beforeFormLoad
) {
  let scopeTask = new ScopeTask(
    scopeId,
    false,
    _genPrepareComponentCallback(
      componentCode,
      windowCode,
      scopeId,
      func,
      inputParam,
      error,
      beforeFormLoad
    )
  )
  let taskId = TaskManager.addTask(scopeTask)
  let vjsNames = [
    'vjs.framework.extension.platform.init.view.schema.Application',
    'vjs.framework.extension.platform.init.view.schema.component.' +
      componentCode,
    'vjs.framework.extension.platform.init.view.schema.window.' +
      componentCode +
      '.' +
      windowCode
  ]
  //var skinBundleName = "vjs.framework.extension.publish."+componentCode+"."+windowCode+".skin." + skinType;
  //vjsNames.push(skinBundleName);
  let sandBox = sandbox.create()
  sandBox.use(vjsNames)
  sandBox.active().done(function () {
    //var skinLib = sandBox.getService("vjs.framework.extension.publish."+componentCode+"."+windowCode+".skin");
    //skinLib.init();
    TaskManager.execTaskById(taskId, [])
  })
}
let _genPrepareComponentCallback = function (
  componentCode,
  windowCode,
  scopeId,
  func,
  inputParam,
  error,
  beforeFormLoad
) {
  return function () {
    let viewInit = sandbox.getService(
      'vjs.framework.extension.platform.init.view.ViewInit'
    )
    viewInit.init({
      componentCode: componentCode,
      windowCode: windowCode,
      scopeId: scopeId,
      inputParam: inputParam,
      success: func,
      beforeFormLoad: beforeFormLoad
    })
  }
}
/**
 *处理错误，如果有，则处理，否贼跳过
 * return {Boolean} true:有异常错误
 */
let _handleError = function (
  resultJson,
  componentCode,
  windowCode,
  moduleName,
  error
) {
  let hasError = _hasError(resultJson)
  if (hasError) {
    let handler = function () {
      seajs.use(
        ['system/exception/ExceptionFactory'],
        function (ExceptionFactory) {
          let exception,
            msg = ''
          if (resultJson) {
            let needLogin = resultJson.needLogin
            msg = resultJson['message']
            exception = needLogin
              ? ExceptionFactory.create(
                  'UnloginException',
                  '当前页面已过期，需要重新登录'
                )
              : ExceptionFactory.create('BusinessException', msg)
          } else {
            exception = ExceptionFactory.create(
              'BusinessException',
              '加载页面数据失败,请重试！'
            )
          }
          _printError(
            '加载' +
              moduleName +
              '模块失败！组件编号：' +
              componentCode +
              ',窗体编号:' +
              windowCode +
              '\n' +
              msg
          )
          if (error) {
            error(exception)
          }
        }
      )
    }
    if (window.$) {
      handler()
    } else {
      seajs.use('plugin/allforsmartclientext', function (ext) {
        handler()
      })
    }
  }
  return hasError
}

let _hasError = function (resultJson) {
  return (
    !resultJson ||
    (resultJson.hasOwnProperty('__$isErrorModule') &&
      resultJson.__$isErrorModule)
  )
}

let _printError = function (msg) {
  if (window.console && window.console.error) {
    window.console.error(msg)
  }
}
/**
 *将组件渲染到指定的dom元素中
 * @param componentCode<String> 组件编码
 * @param windowCode<String> 窗体编码
 * @param {Object} inputParam 组件输入变量
 * @param {Object} htmlEle dom元素
 * @param {Object} cfg 函数配置
 * {
 * 	"rendered": Function, 渲染完成后事件
 * 	"inited" : Function , 组件初始化完成后
 *  "refComponents" : Object 组件引用其他组件配置
 * }
 */
let renderComponentToElement = function (
  componentCode,
  windowCode,
  inputParam,
  htmlEle,
  cfg
) {
  let renderedFunction = null
  let inited = null
  let refComponents = null
  if (cfg) {
    renderedFunction = cfg.rendered
    initedFunction = cfg.inited
    refComponents = cfg.refComponents
  }
  let callBackFunc = function (component, scopeId) {
    component.setParentContainer(_canvas)
    let _canvas = isc.Canvas.create({
      width: component.Width,
      canFocus: true,
      height: component.Height,
      htmlElement: htmlEle,
      children: [component],
      contents: ''
    })
    _canvas.close = function () {
      this.destroy()
    }
    _canvas.show()
    if (typeof renderedFunction == 'function') {
      renderedFunction(component)
    }
  }
  let sId = ScopeManager.createScope()
  renderComponentById(componentCode, windowCode, inputParam, {
    scopeId: sId,
    rendered: callBackFunc,
    inited: inited,
    refComponents: refComponents
  })
  return sId
}
/**
 *设置运行模式
 * @param {Object} mode
 */
let setRunningMode = function (mode) {
  this.runningMode = mode
}

/**
 * 根据componentCode请求构件信息
 * @param componentCode<String> 构件code
 * @param callback<Function> 错误回调
 * @param errorCallback<Function> 错误回调
 */
let getComponentByCode = function (componentCode, callback, errorCallback) {
  let sandBox = sandbox.create()
  let extensionCfg = {}
  let isComponentLoaded = ComponentData.componentIsLoaded(componentCode)
  let componentServiceName =
    'vjs.framework.extension.publish.componentInfo.Component_' + componentCode
  if (!isComponentLoaded) {
    extensionCfg[componentServiceName] = null
  }
  extensionCfg[componentServiceName] = null
  sandBox.use(extensionCfg)
  let scopeId = ScopeManager.getCurrentScopeId()
  sandBox.active().done(function () {
    if (!isComponentLoaded) {
      let componentModule = sandBox.getService(componentServiceName)
      ScopeManager.openScope(scopeId)
      if (componentModule) {
        componentModule.execute()
        if (typeof callback == 'function') {
          callback()
        }
      } else {
        if (typeof errorCallback == 'function') {
          errorCallback()
        }
      }
      ScopeManager.closeScope()
    }
  })
}

export {
  execute,
  getComponentByCode,
  renderComponentById,
  renderComponentToElement,
  renderComponent,
  prepareComponent,
  setRunningMode
}
