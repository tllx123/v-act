import { ScopeManager as ScopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { ScopeTask as ScopeTask } from '@v-act/vjs.framework.extension.platform.global.task'
import { TaskManager as TaskManager } from '@v-act/vjs.framework.extension.platform.global.task'
import { ComponentData as ComponentData } from '@v-act/vjs.framework.extension.platform.global.data'
import { AppData as AppData } from '@v-act/vjs.framework.extension.platform.global.data'
import { ApplicationParam as ApplicationParam } from '@v-act/vjs.framework.extension.platform.data.storage.schema.param'
import { ComponentPackData as componentPackData } from '@v-act/vjs.framework.extension.platform.global.data'
import { ExceptionFactory as exceptionFactory } from '@v-act/vjs.framework.extension.platform.interface.exception'
import { WindowRuntimeManager as runtimeManager } from '@v-act/vjs.framework.extension.platform.services.runtime.manager'
import { EventManager as eventManager } from '@v-act/vjs.framework.extension.platform.interface.event'
import { UUID as uuidUtil } from '@v-act/vjs.framework.extension.util'
import { WidgetRenderer as widgetRenderer } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'

let sandbox

exports.initModule = function (sb) {
  sandbox = sb
}

let _allRight = function (pool) {
  let flag = true
  for (let key in pool) {
    if (!pool[key]) {
      flag = false
      break
    }
  }
  return flag
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
    refComponentCfg,
    errorFunc,
    contextPath,
    runningMode,
    debug
  if (cfg) {
    renderedCallback = cfg.rendered
    initedCallback = cfg.inited
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
        // TODO 临时修改：处理vbase在BS控件打开SC页面报错问题，待确认
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
                  'vjs.framework.extension.ui.adapter.dependency.smartclient':
                    null
                }
              ]
            )
            let progressbar = sandbox.getService(
              'vjs.framework.extension.ui.common.plugin.services.progressbar.ProgressBarUtil'
            )
            progressbar.hideProgress()
          }
        )
      }
      setTimeout(initComponent, 10)
    },
    refComponentCfg,
    errorFunc
  )
}

/**
 * 批量渲染窗体
 * @param windowsCfg 窗体配置信息
 * [{
 * 	componentCode:String 构件code
 *  windowCode:String 窗体code
 *  scopeId:String 域
 *  inputParam:Object 输入参数
 * }]
 * @param {Object} cfg 配置信息
 * 		  {
 * 		"refComponents":{},
 * 		"rendered":Function,组件渲染后回调
 * 		"inited" : Function, 组件初始化完成回调
 * 		"scopeId" : String 执行域id
 * 		"contextPath": String 上下文路径
 * 		"runningMode": String 运行模式
 * 		"debug" : boolean debug模式
 * 		"error" : Function 出错回调
 * 		"success" : Function 批量渲染完成回调
 * }
 */
let renderWindows = function (windowsCfg, config) {
  let renderVJSCfgs = []
  let initVJSCfgs = []
  let renderedPool = {} //viewLib中用headjs加载js与css，当第二次执行这个接口时，会造成init在前，render在后
  let parentScopeId = ScopeManager.getCurrentScopeId()
  for (let i = 0, len = windowsCfg.length; i < len; i++) {
    let windowCfg = windowsCfg[i]
    let componentCode = windowCfg.componentCode
    let windowCode = windowCfg.windowCode
    let scopeId =
      windowCfg.scopeId ||
      ScopeManager.createWindowScope({
        parentScopeId: parentScopeId,
        componentCode: componentCode,
        windowCode: windowCode
      })
    windowCfg.scopeId = scopeId
    renderedPool[scopeId] = false
    let bundleName =
      'vjs.framework.extension.publish.' +
      componentCode +
      '.' +
      windowCode +
      '.viewLib'
    let cfg = {}
    cfg[bundleName] = null
    renderVJSCfgs.push(cfg)
    //var skinType = isc.WidgetContext.getSkinType();
    //var skinBundleName = "vjs.framework.extension.publish." + componentCode + "." + windowCode + ".skin." + skinType;
    //var cfg = {};
    //cfg[skinBundleName] = null;
    //renderVJSCfgs.push(cfg);
    let componentServiceName =
      'vjs.framework.extension.platform.init.view.schema.component.' +
      componentCode
    let componentCfg = {}
    componentCfg[componentServiceName] = null
    initVJSCfgs.push(componentCfg)
    bundleName =
      'vjs.framework.extension.platform.init.view.schema.window.' +
      componentCode +
      '.' +
      windowCode
    cfg = {}
    cfg[bundleName] = null
    initVJSCfgs.push(cfg)
  }
  let sandBox = sandbox.create()
  sandBox.use(renderVJSCfgs)
  let renderedCallback, errorFunc, initedFunc, success
  if (config) {
    renderedCallback = config.rendered
    errorFunc = config.error
    initedFunc = config.inited
    success = config.success
  }
  let initWindowsFunc = function () {
    let isAllRendered = _allRight(renderedPool)
    if (isAllRendered) {
      //等全部窗体已渲染完成，才初始化窗体
      let sb = sandbox.create()
      sb.use(initVJSCfgs)
      sb.active().done(function () {
        seajs.use(
          'itop/v3/publish/smartclient/allforsmartclientext',
          function () {
            for (let i = 0, len = windowsCfg.length; i < len; i++) {
              let config = windowsCfg[i]
              let func = (function (cfg, initCb, eCb) {
                return function () {
                  let componentCode = cfg.componentCode
                  let windowCode = cfg.windowCode
                  let inputParam = cfg.inputParam
                  let scopeId = cfg.scopeId
                  prepareComponent(
                    componentCode,
                    windowCode,
                    scopeId,
                    inputParam,
                    function () {
                      //var skinLib = sb.getService("vjs.framework.extension.publish." + componentCode + "." + windowCode + ".skin");
                      //skinLib.init();
                      let viewLib = sb.getService(
                        'vjs.framework.extension.publish.' +
                          componentCode +
                          '.' +
                          windowCode +
                          '.viewLib'
                      )
                      viewLib.fireCallback()
                      _fireFunc(initCb, this, [
                        arguments[0],
                        arguments[1],
                        componentCode,
                        windowCode
                      ])
                    },
                    null,
                    eCb
                  )
                }
              })(config, initedFunc, errorFunc)
              setTimeout(func, 1) //异步化，防止多个窗体同时渲染造成执行脚本过多，引发ie报脚本缓慢
            }
            _fireFunc(success, this, [])
          }
        )
      })
    }
  }
  let renderedCk = function (component, scopeId, componentCode, windowCode) {
    _fireFunc(renderedCallback, this, arguments)
    renderedPool[scopeId] = true
    initWindowsFunc()
  }
  sandBox
    .active()
    .done(function () {
      for (var i = 0, len = windowsCfg.length; i < len; i++) {
        var cfg = windowsCfg[i]
        var componentCode = cfg.componentCode
        var windowCode = cfg.windowCode
        var scopeId = cfg.scopeId
        ScopeManager.openScope(scopeId)
        ScopeManager.setProperty('type', 'smartclient')
        ScopeManager.setProperty('componentCode', componentCode)
        ScopeManager.setProperty('windowCode', windowCode)
        ScopeManager.closeScope()
        var func = (function (cCode, wCode, sId, rCb, eCb) {
          return function () {
            renderComponent(cCode, wCode, sId, rCb, null, eCb)
          }
        })(componentCode, windowCode, scopeId, renderedCk, errorFunc)
        setTimeout(func, 1) //异步化，防止多个窗体同时渲染造成执行脚本过多，引发ie报脚本缓慢
      }
    })
    .fail(function (dependencyLib) {
      let exception = exceptionFactory.create({
        message: dependencyLib.message,
        type: dependencyLib.type,
        exceptionLib: dependencyLib.exceptionLib
      })
      if (errorFunc) errorFunc(exception)
    })
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
  errorFunc,
  fromPage
) {
  let tmpUUID = 'WINLOAD_' + uuidUtil.generate()
  let successback = function () {
    if (!fromPage) {
      let hasPerm = runtimeManager.hasWindowPermission({
        componentCode: componentCode,
        windowCode: windowCode
      })
      if (!hasPerm) {
        let msg = '对不起，您没有该窗体的浏览权限。'
        let exception = exceptionFactory.create({
          message: msg,
          type: exceptionFactory.TYPES.ModuleScriptException
        })
        if (errorFunc) errorFunc(exception, scopeId)
        return
      }
    }
    let scopeTask = new ScopeTask(
      scopeId,
      false,
      _genRenderComponentCallback({
        componentCode: componentCode,
        windowCode: windowCode,
        scopeId: scopeId,
        func: func,
        uuid: tmpUUID,
        errorFunc: errorFunc
      })
    )
    let taskId = TaskManager.addTask(scopeTask)
    //var taskId = AsyncManager.addHandler(_genRenderComponentCallback(componentCode,windowCode,scopeId,func,AsyncManager,error),false,scopeId);
    let bundleName =
      'vjs.framework.extension.publish.' +
      componentCode +
      '.' +
      windowCode +
      '.viewLib'
    let serviceName = bundleName
    let sandBox = sandbox.create()
    let extensionCfgs = ['vjs.framework.extension.platform.interface.skin']
    extensionCfgs.push(bundleName)
    /*var skinType = isc.WidgetContext.getSkinType();
        var skinBundleName = "vjs.framework.extension.publish." + componentCode + "." + windowCode + ".skin." + skinType;
        extensionCfgs.push(skinBundleName);*/

    let resourcePackage = sandbox.getService(
      'vjs.framework.extension.ui.adapter.resourcepackage'
    )
    let lang = resourcePackage.getWindowCurrentResourceCode(scopeId)
    if (lang && lang != '') {
      extensionCfgs.push(
        'vjs.framework.extension.publish.' +
          componentCode +
          '.' +
          lang +
          '.languageLib'
      )
    }

    sandBox.use(extensionCfgs)
    sandBox
      .active()
      .done(function () {
        var viewLib = sandBox.getService(serviceName)
        TaskManager.execTaskById(taskId, [viewLib])
      })
      .fail(function (dependencyLib) {
        let exception = exceptionFactory.create({
          message: dependencyLib.message,
          type: dependencyLib.type,
          exceptionLib: dependencyLib.exceptionLib
        })
        if (errorFunc) errorFunc(exception)
      })
  }
  ScopeManager.openScope(scopeId) //防止请求回调用需要用到窗体域信息
  eventManager.fire({
    event: eventManager.Events.BeforeWindowLoad,
    args: [scopeId, tmpUUID]
  })
  runtimeManager.initWindow({
    windows: {
      componentCode: componentCode,
      windowCode: windowCode,
      validWindow: !fromPage
    },
    success: successback,
    error: errorFunc
  })
  ScopeManager.closeScope()
}
let _genRenderComponentCallback = function (params) {
  let componentCode = params.componentCode,
    windowCode = params.windowCode,
    scopeId = params.scopeId,
    func = params.func,
    uuid = params.uuid,
    error = params.error
  return function (viewLib) {
    eventManager.fire({
      event: eventManager.Events.AfterWindowLoad,
      args: [scopeId, uuid]
    })
    let flag = _handleError(
      viewLib,
      componentCode,
      windowCode,
      'viewLib',
      error
    )
    if (!flag) {
      //渲染组件
      /*var skinType = isc.WidgetContext.getSkinType();
            var skinLib = sandbox.getService("vjs.framework.extension.publish." + componentCode + "." + windowCode + ".skin");
            skinLib.init();*/
      let tmpUUID = 'WINRENDER_' + uuidUtil.generate()
      eventManager.fire({
        event: eventManager.Events.BeforeWindowRender,
        args: [scopeId, tmpUUID]
      })
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
          eventManager.fire({
            event: eventManager.Events.AfterWindowRender,
            args: [scopeId, tmpUUID]
          })
          //触发跨域事件
          ScopeManager.createScopeHandler({
            scopeId: scopeId,
            handler: function () {
              fireCrossDomainEvent(windowCode)
            }
          })
          _fireFunc(func, this, [component, scopeId, componentCode, windowCode])
        }
      })
    }
  }
}
/**
 * 触发跨域事件
 * @param {String} newWindowCode 窗体编码
 * */
function fireCrossDomainEvent(newWindowCode) {
  let info = {
    title: widgetRenderer.executeComponentRenderAction(
      'getWindowTitle',
      newWindowCode
    )
  }
  eventManager.fireCrossDomainEvent({
    eventName: eventManager.CrossDomainEvents.SetModalWindowTitle,
    params: info
  })
}
/**
 * 获取来源窗体信息，递归查找
 * @param {String} comCode 构件编码
 * @param {String} winCode 窗体编码
 * @param {String} comCode 来源窗体信息列表
 * recurssion
 * */
function getSource(comCode, winCode, infos) {
  infos.push({
    componentCode: comCode,
    windowCode: winCode
  })
  let windowMappingInfo = ApplicationParam.getWindowMapping({
    componentCode: comCode,
    windowCode: winCode,
    isTarget: true
  })
  if (windowMappingInfo != null) {
    infos = getSource(
      windowMappingInfo.componentCode,
      windowMappingInfo.windowCode,
      infos
    )
  }
  return infos
}
/**
 * 替换构件包信息
 * */
let replaceComponentPackInfo = function (componentCode, windowCode) {
  let result = null
  let info = {
    componentCode: componentCode,
    code: windowCode
  }
  if (componentPackData.existMapping(info)) {
    let newInfo = componentPackData.getMapping(info)
    if (newInfo) {
      result = {
        componentCode: newInfo.componentCode,
        windowCode: newInfo.windowCode
      }
    }
  }
  return result
}
/**
 * 初始化组件
 * @param componentCode<String> 组件编码
 * @param windowCode<String> 窗体编码
 * @param {String} scopeId
 * @param {Object} inputParam 输入变量
 * @param {Function} func 初始化回调函数
 *@param {Object} variables 变量
 * @param {Function} 错误回调
 */
let prepareComponent = function (
  newComponentCode,
  newWindowCode,
  scopeId,
  inputParam,
  func,
  variables,
  errorFunc,
  deps
) {
  //此信息已被后台替换成目标窗体
  let componentCode = newComponentCode
  let windowCode = newWindowCode
  let tmpUUID = 'WININIT_' + uuidUtil.generate()
  //替换构件包映射信息
  let newInfo = replaceComponentPackInfo(componentCode, windowCode)
  if (newInfo) {
    componentCode = newInfo.componentCode
    windowCode = newInfo.windowCode
  }
  //获取来源窗体的信息
  let sourceWinInfos = getSource(componentCode, windowCode, [])
  eventManager.fire({
    event: eventManager.Events.BeforeWindowInit,
    args: [scopeId, tmpUUID]
  })
  let scopeTask = new ScopeTask(
    scopeId,
    false,
    _genPrepareComponentCallback({
      componentCode: componentCode,
      windowCode: windowCode,
      scopeId: scopeId,
      func: func,
      inputParam: inputParam,
      errorFunc: errorFunc,
      uuid: tmpUUID,
      sourceWinInfos: [] //sourceWinInfos
    })
  )
  let taskId = TaskManager.addTask(scopeTask)
  //1、当前窗体是否替换其他窗体
  //2、如果存在替换其他窗体（B）,vjsNames添加B窗体所在的构件vjs以及B窗体的schema.window vjs
  let vjsNames = [
    'vjs.framework.extension.platform.init.view.schema.Application'
  ]
  for (let i = 0, len = sourceWinInfos.length; i < len; i++) {
    let info = sourceWinInfos[i]
    let comVjs =
      'vjs.framework.extension.platform.init.view.schema.component.' +
      info.componentCode
    if (vjsNames.indexOf(comVjs) == -1) {
      vjsNames.push(comVjs)
    }
    let winVjs =
      'vjs.framework.extension.platform.init.view.schema.window.' +
      info.componentCode +
      '.' +
      info.windowCode
    if (vjsNames.indexOf(winVjs) == -1) {
      vjsNames.push(winVjs)
    }
  }
  let sandBox = sandbox.create()
  sandBox.use(vjsNames)
  sandBox
    .active()
    .done(function () {
      TaskManager.execTaskById(taskId, [])
    })
    .fail(function (dependencyLib) {
      let exception = exceptionFactory.create({
        message: dependencyLib.message,
        type: dependencyLib.type,
        exceptionLib: dependencyLib.exceptionLib
      })
      if (errorFunc) errorFunc(exception)
    })
}
let _genPrepareComponentCallback = function (params) {
  let componentCode = params.componentCode,
    windowCode = params.windowCode,
    scopeId = params.scopeId,
    func = params.func,
    uuid = params.uuid,
    sourceWinInfos = params.sourceWinInfos,
    inputParam = params.inputParam
  return function () {
    let viewInit = sandbox.getService(
      'vjs.framework.extension.platform.init.view.ViewInit'
    )
    let successBack = function () {
      eventManager.fire({
        event: eventManager.Events.AfterWindowInit,
        args: [scopeId, uuid]
      })
      _fireFunc(func, this, arguments)
    }
    viewInit.init({
      componentCode: componentCode,
      windowCode: windowCode,
      scopeId: scopeId,
      inputParam: inputParam,
      success: successBack
    })
    //        	var baseCB = ScopeManager.createScopeHandler({
    //        		scopeId:scopeId,
    //        		handler: function(){
    //            		var viewInit = sandbox.getService("vjs.framework.extension.platform.init.view.ViewInit");
    //                    var successBack = function(){
    //                    	eventManager.fire({
    //                    		event:eventManager.Events.AfterWindowInit,
    //                    		args : [scopeId,uuid]
    //                    	});
    //                    	 _fireFunc(func, this, arguments);
    //                    }
    //                    viewInit.init({ "componentCode": componentCode, "windowCode": windowCode, "scopeId": scopeId, "inputParam": inputParam, "success": successBack });
    //            	}
    //        	});
    //        	var cbs = [baseCB];
    //        	var currentScope = ScopeManager.getWindowScope();
    //        	var series = currentScope.getSeries();
    //        	if(sourceWinInfos.length > 0){
    //        		for(var i = 1, len = sourceWinInfos.length - 1;i <= len; i++){
    //        			var info = sourceWinInfos[i];
    //        			var comCode = info.componentCode;
    //        			var winCode = info.windowCode;
    //        			var sId = ScopeManager.createWindowScope({
    //        				componentCode: comCode,
    //        				windowCode: winCode,
    //        				series : series
    //        			});
    //        			currentScope.setExtendId(sId);
    //        			currentScope = ScopeManager.getScope(sId);
    //        			var handler = (function(cCode, wCode, _sId,cb){
    //        				return function(){
    //        					var viewInit = sandbox.getService("vjs.framework.extension.platform.init.view.ViewInit");
    //        					viewInit.init({
    //        						"componentCode": cCode,
    //        						"windowCode": wCode,
    //        						"scopeId": _sId,
    //        						"inputParam": inputParam,
    //        						"success": cb,
    //        						"initView":false
    //        					});
    //        				}
    //        			})(comCode, winCode, sId, cbs[cbs.length-1]);
    //        			var cb = ScopeManager.createScopeHandler({
    //        				scopeId:sId,
    //        				handler:handler
    //        			});
    //        			cbs.push(cb);
    //        		}
    //        	}
    //        	cbs[cbs.length - 1]();
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
let renderAsElement = function (params) {
  let rendered = function (component) {
    component.setParentContainer(_canvas)
    let _canvas = isc.Canvas.create({
      width: component.Width,
      canFocus: true,
      height: component.Height,
      htmlElement: params.el,
      children: [component],
      contents: ''
    })
    _canvas.close = function () {
      this.destroy()
    }
    _canvas.show()
  }
  renderComponentById(
    params.componentCode,
    params.windowCode,
    params.inputParam,
    {
      rendered: rendered,
      inited: params.success
    }
  )
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
        _fireFunc(callback, this, [])
      } else {
        _fireFunc(errorCallback, this, [])
      }
      ScopeManager.closeScope()
    }
  })
}

const preLoad = function (params) {
  let componentCode = params.componentCode,
    windowCode = params.windowCode
  let skinType = isc.WidgetContext.getSkinType()
  let vjsList = [
    'vjs.framework.extension.platform.services.runtime.manager',
    'vjs.framework.extension.publish.' +
      componentCode +
      '.' +
      windowCode +
      '.viewLib',
    'vjs.framework.extension.publish.' +
      componentCode +
      '.' +
      windowCode +
      '.skin.' +
      skinType,
    'vjs.framework.extension.platform.init.view.schema.Application',
    'vjs.framework.extension.platform.init.view.schema.component.' +
      componentCode,
    'vjs.framework.extension.platform.init.view.schema.window.' +
      componentCode +
      '.' +
      windowCode
  ]
  let sandBox = sandbox.create()
  sandBox.use(vjsList)
  sandBox.active().done(function () {
    seajs.use(
      '/itop/v3/publish/smartclient/allforsmartclientext',
      function () {}
    )
  })
}

export {
  execute,
  preLoad,
  getComponentByCode,
  renderComponentById,
  renderAsElement,
  renderComponent,
  prepareComponent,
  setRunningMode,
  renderWindows
}
