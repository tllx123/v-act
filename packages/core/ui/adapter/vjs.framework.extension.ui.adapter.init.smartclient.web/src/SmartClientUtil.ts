import { ScopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

import { ScopeTask } from '@v-act/vjs.framework.extension.platform.global'

import { TaskManager } from '@v-act/vjs.framework.extension.platform.global'

import { ComponentData } from '@v-act/vjs.framework.extension.platform.global'

import { AppData } from '@v-act/vjs.framework.extension.platform.global'

import { ApplicationParam } from '@v-act/vjs.framework.extension.platform.data.storage.schema.param'

import { ComponentPackData as componentPackData } from '@v-act/vjs.framework.extension.platform.global'

import { ExceptionFactory as exceptionFactory } from '@v-act/vjs.framework.extension.platform.interface.exception'

import { WindowRuntimeManager as runtimeManager } from '@v-act/vjs.framework.extension.platform.services.runtime.manager'

import { EventManager as eventManager } from '@v-act/vjs.framework.extension.platform.interface.event'

import { uuid as uuidUtil } from '@v-act/vjs.framework.extension.util.uuid'
import { WidgetRenderer as widgetRenderer } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'

import { ProcessorManager as processorManager } from '@v-act/vjs.framework.extension.platform.services.view.window.property'

var _allRight = function (pool) {
  var flag = true
  for (var key in pool) {
    if (!pool[key]) {
      flag = false
      break
    }
  }
  return flag
}

var _fireFunc = function (func, self, args) {
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
var renderComponentById = function (
  componentCode,
  windowCode,
  inputParam,
  cfg
) {
  var parentScopeId = ScopeManager.getCurrentScopeId()
  var scopeId =
    cfg && cfg.scopeId
      ? cfg.scopeId
      : ScopeManager.createWindowScope({
          parentScopeId: parentScopeId,
          componentCode: componentCode,
          windowCode: windowCode,
          series: 'smartclient'
        })
  var renderedCallback,
    initedCallback,
    completeCallback,
    refComponentCfg,
    errorFunc,
    contextPath,
    runningMode,
    debug
  if (cfg) {
    renderedCallback = cfg.rendered
    initedCallback = cfg.inited
    completeCallback = cfg.completed
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
  var _this = this
  //属性处理器里面会使用到窗体输入
  processorManager.addDatas(
    'WindowInputParams',
    inputParam.variable ? inputParam.variable : inputParam
  )
  renderComponent.call(
    _this,
    componentCode,
    windowCode,
    scopeId,
    function (component, scopeId) {
      //component.showModal("组件正在初始化，请稍候...");
      //全局渲染事件
      //        	ScopeManager.fireEvent(ScopeManager.EVENTS.RENDERED, ScopeManager.getScope(scopeId));
      _fireFunc(renderedCallback, this, [
        component,
        scopeId,
        componentCode,
        windowCode
      ])
      var viewLib = this
      var initComponent = function () {
        // TODO 临时修改：处理vbase在BS控件打开SC页面报错问题，待确认
        //                seajs.use("itop/v3/publish/smartclient/allforsmartclientext", function() {
        //
        //                });
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
            //触发窗体加载完成回调
            var scope = ScopeManager.getScope(scopeId)
            var dtdList = scope.get('completeDTDList') || []
            $.when.apply($, dtdList).done(function () {
              if (typeof completeCallback == 'function') {
                _fireFunc(completeCallback, this, [
                  component,
                  scopeId,
                  componentCode,
                  windowCode
                ])
              }
            })
          },
          refComponentCfg,
          function (exception) {
            exception.handle()
          },
          [
            {
              'vjs.framework.extension.ui.adapter.dependency.smartclient': null
            }
          ]
        )
        var progressbar = sandbox.getService(
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
var renderWindows = function (windowsCfg, config) {
  var renderVJSCfgs = []
  var initVJSCfgs = []
  var renderedPool = {} //viewLib中用headjs加载js与css，当第二次执行这个接口时，会造成init在前，render在后
  var parentScopeId = ScopeManager.getCurrentScopeId()
  for (var i = 0, len = windowsCfg.length; i < len; i++) {
    var windowCfg = windowsCfg[i]
    var componentCode = windowCfg.componentCode
    var windowCode = windowCfg.windowCode
    var scopeId =
      windowCfg.scopeId ||
      ScopeManager.createWindowScope({
        parentScopeId: parentScopeId,
        componentCode: componentCode,
        windowCode: windowCode
      })
    windowCfg.scopeId = scopeId
    renderedPool[scopeId] = false
    var bundleName =
      'vjs.framework.extension.publish.' +
      componentCode +
      '.' +
      windowCode +
      '.viewLib'
    var cfg = {}
    cfg[bundleName] = null
    renderVJSCfgs.push(cfg)
    //var skinType = isc.WidgetContext.getSkinType();
    //var skinBundleName = "vjs.framework.extension.publish." + componentCode + "." + windowCode + ".skin." + skinType;
    //var cfg = {};
    //cfg[skinBundleName] = null;
    //renderVJSCfgs.push(cfg);
    var componentServiceName =
      'vjs.framework.extension.platform.init.view.schema.component.' +
      componentCode
    var componentCfg = {}
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
  var sandBox = sandbox.create()
  sandBox.use(renderVJSCfgs)
  var renderedCallback, errorFunc, initedFunc, success
  if (config) {
    renderedCallback = config.rendered
    errorFunc = config.error
    initedFunc = config.inited
    success = config.success
  }
  var initWindowsFunc = function () {
    var isAllRendered = _allRight(renderedPool)
    if (isAllRendered) {
      //等全部窗体已渲染完成，才初始化窗体
      var sb = sandbox.create()
      sb.use(initVJSCfgs)
      sb.active().done(function () {
        for (var i = 0, len = windowsCfg.length; i < len; i++) {
          var config = windowsCfg[i]
          var func = (function (cfg, initCb, eCb) {
            return function () {
              var componentCode = cfg.componentCode
              var windowCode = cfg.windowCode
              var inputParam = cfg.inputParam
              var scopeId = cfg.scopeId
              prepareComponent(
                componentCode,
                windowCode,
                scopeId,
                inputParam,
                function () {
                  //var import { skinLib} from "vjs.framework.extension.publish." + componentCode + "." + windowCode + ".skin");
                  //skinLib.init();
                  var viewLib = sb.getService(
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
      })
    }
  }
  var renderedCk = function (component, scopeId, componentCode, windowCode) {
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
      var exception = exceptionFactory.create({
        message:
          typeof dependencyLib.getMessage == 'function'
            ? dependencyLib.getMessage()
            : dependencyLib.message,
        type:
          typeof dependencyLib.getType == 'function'
            ? dependencyLib.getType()
            : dependencyLib.type,
        exceptionLib: dependencyLib.exceptionLib
      })
      if (dependencyLib.__$isNetwork === true && exception.markNetwork) {
        exception.markNetwork()
      }
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
var renderComponent = function (
  componentCode,
  windowCode,
  scopeId,
  func,
  variables,
  errorFunc,
  fromPage
) {
  var key = componentCode + '$_$' + windowCode
  var tmpUUID = 'WINLOAD_' + uuidUtil.generate()
  var scopeTask = new ScopeTask(
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
  var taskId = TaskManager.addTask(scopeTask)
  var callback = (function (tId) {
    return function (viewlib) {
      TaskManager.execTaskById(tId, [viewlib])
    }
  })(taskId)
  var error = (function (eFunc, iden) {
    return function (dependencyLib) {
      //重置之前请求的缓存信息，避免后续无法再次打开
      try {
        delete viewLibMapping[iden]
        delete viewLibMappingError[iden]
      } catch (e) {}
      if (eFunc) {
        if (exceptionFactory.isException(dependencyLib)) {
          eFunc(dependencyLib)
        } else {
          var exception = exceptionFactory.create({
            message:
              typeof dependencyLib.getMessage == 'function'
                ? dependencyLib.getMessage()
                : dependencyLib.message,
            type:
              typeof dependencyLib.getType == 'function'
                ? dependencyLib.getType()
                : dependencyLib.type,
            exceptionLib: dependencyLib.exceptionLib
          })
          if (dependencyLib.__$isNetwork === true && exception.markNetwork) {
            exception.markNetwork()
          }
          eFunc(exception)
        }
      }
    }
  })(errorFunc, key)
  if (!viewLibMapping[key]) {
    viewLibMapping[key] = [callback]
    viewLibMappingError[key] = [error]
  } else {
    viewLibMapping[key].push(callback)
    viewLibMappingError[key].push(error)
    return
  }
  var successback = function () {
    if (!fromPage) {
      var hasPerm = runtimeManager.hasWindowPermission({
        componentCode: componentCode,
        windowCode: windowCode
      })
      if (!hasPerm) {
        var msg = '对不起，您没有该窗体的浏览权限。'
        var exception = exceptionFactory.create({
          message: msg,
          type: exceptionFactory.TYPES.ModuleScriptException
        })
        if (errorFunc) errorFunc(exception, scopeId)
        return
      }
    }
    //        	var scopeTask = new ScopeTask(scopeId, false, _genRenderComponentCallback({
    //        		'componentCode':componentCode,
    //        		'windowCode':windowCode,
    //        		'scopeId':scopeId,
    //        		'func':func,
    //        		'uuid':tmpUUID,
    //        		'errorFunc':errorFunc
    //        	}));
    //        	var taskId = TaskManager.addTask(scopeTask);
    //var taskId = AsyncManager.addHandler(_genRenderComponentCallback(componentCode,windowCode,scopeId,func,AsyncManager,error),false,scopeId);
    var bundleName =
      'vjs.framework.extension.publish.' +
      componentCode +
      '.' +
      windowCode +
      '.viewLib'
    var serviceName = bundleName
    var exrtaParams = {}
    var windowScope = ScopeManager.getScope(scopeId)
    if (windowScope && windowScope.getVjsContext) {
      var vjsContext = windowScope.getVjsContext()
      if (vjsContext) {
        exrtaParams.vjsContext = vjsContext
      }
    }
    var sandBox = sandbox.create(exrtaParams)
    var extensionCfgs = ['vjs.framework.extension.platform.interface.skin']
    extensionCfgs.push(bundleName)
    /*var skinType = isc.WidgetContext.getSkinType();
        	var skinBundleName = "vjs.framework.extension.publish." + componentCode + "." + windowCode + ".skin." + skinType;
        	extensionCfgs.push(skinBundleName);*/

    var resourcePackage = sandbox.getService(
      'vjs.framework.extension.ui.adapter.resourcepackage'
    )
    var lang = resourcePackage.getWindowCurrentResourceCode(scopeId)
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
        //        		TaskManager.execTaskById(taskId, [viewLib]);
        exeFunArr(viewLibMapping, key, [viewLib])
      })
      .fail(function (dependencyLib) {
        exeFunArr(viewLibMappingError, key, [dependencyLib])
        //        		var exception = exceptionFactory.create({
        //        			"message": dependencyLib.message,
        //        			"type": dependencyLib.type,
        //        			"exceptionLib": dependencyLib.exceptionLib
        //        		});
        //        		if (errorFunc) errorFunc(exception);
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
    error: error
  })
  ScopeManager.closeScope()
}
var _genRenderComponentCallback = function (params) {
  var componentCode = params.componentCode,
    windowCode = params.windowCode,
    scopeId = params.scopeId,
    func = params.func,
    uuid = params.uuid,
    error = params.error || params.errorFunc
  return function (viewLib) {
    eventManager.fire({
      event: eventManager.Events.AfterWindowLoad,
      args: [scopeId, uuid]
    })
    var flag = _handleError(
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
      var tmpUUID = 'WINRENDER_' + uuidUtil.generate()
      eventManager.fire({
        event: eventManager.Events.BeforeWindowRender,
        args: [scopeId, tmpUUID]
      })
      if (typeof viewLib.getSeries) {
        //普通窗体打开移动窗体兼容逻辑
        ScopeManager.getScope(scopeId).set('type', viewLib.getSeries())
      }
      var _callback = function (component, scopeId) {
        ScopeManager.openScope(scopeId)
        var windowScope = ScopeManager.getWindowScope()
        windowScope.on(ScopeManager.EVENTS.DESTROY, function () {
          var widgetAction = sandbox.getService(
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
      viewLib.execute(
        {
          scopeId: scopeId,
          componentId: windowCode,
          skinType: skinType,
          callback: _callback
        },
        scopeId,
        _callback
      ) //存在普通窗体打开移动窗体，两个viewlib入参不相同
    }
  }
}
/**
 * 触发跨域事件
 * @param {String} newWindowCode 窗体编码
 * */
function fireCrossDomainEvent(newWindowCode) {
  var info = {
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
  var windowMappingInfo = ApplicationParam.getWindowMapping({
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
var replaceComponentPackInfo = function (componentCode, windowCode) {
  var result = null
  var info = {
    componentCode: componentCode,
    code: windowCode
  }
  if (componentPackData.existMapping(info)) {
    var newInfo = componentPackData.getMapping(info)
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
var prepareComponent = function (
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
  var componentCode = newComponentCode
  var windowCode = newWindowCode
  var key = componentCode + '$_$' + windowCode
  var tmpUUID = 'WININIT_' + uuidUtil.generate()
  //替换构件包映射信息
  var newInfo = replaceComponentPackInfo(componentCode, windowCode)
  if (newInfo) {
    componentCode = newInfo.componentCode
    windowCode = newInfo.windowCode
  }
  //获取来源窗体的信息
  var sourceWinInfos = getSource(componentCode, windowCode, [])
  eventManager.fire({
    event: eventManager.Events.BeforeWindowInit,
    args: [scopeId, tmpUUID]
  })
  var scopeTask = new ScopeTask(
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
  var taskId = TaskManager.addTask(scopeTask)
  var callback = (function (tId) {
    return function () {
      TaskManager.execTaskById(tId, [])
    }
  })(taskId)
  var error = (function (eFunc) {
    return function (dependencyLib) {
      if (eFunc && dependencyLib) {
        var exception = exceptionFactory.create({
          message:
            typeof dependencyLib.getMessage == 'function'
              ? dependencyLib.getMessage()
              : dependencyLib.message,
          type:
            typeof dependencyLib.getType == 'function'
              ? dependencyLib.getType()
              : dependencyLib.type,
          exceptionLib: dependencyLib.exceptionLib
        })
        if (dependencyLib.__$isNetwork === true && exception.markNetwork) {
          exception.markNetwork()
        }
        eFunc(exception)
      }
    }
  })(errorFunc)
  if (!schemaMapping[key]) {
    schemaMapping[key] = [callback]
    schemaMappingError[key] = [error]
  } else {
    schemaMapping[key].push(callback)
    if (!schemaMappingError[key]) {
      schemaMappingError[key] = [error]
    } else {
      schemaMappingError[key].push(error)
    }
    return
  }
  //1、当前窗体是否替换其他窗体
  //2、如果存在替换其他窗体（B）,vjsNames添加B窗体所在的构件vjs以及B窗体的schema.window vjs
  var vjsNames = []
  for (var i = 0, len = sourceWinInfos.length; i < len; i++) {
    var info = sourceWinInfos[i]
    var comVjs =
      'vjs.framework.extension.platform.init.view.schema.component.' +
      info.componentCode
    if (vjsNames.indexOf(comVjs) == -1) {
      vjsNames.push(comVjs)
    }
    var winVjs =
      'vjs.framework.extension.platform.init.view.schema.window.' +
      info.componentCode +
      '.' +
      info.windowCode
    if (vjsNames.indexOf(winVjs) == -1) {
      vjsNames.push(winVjs)
    }
  }
  var sandBox = sandbox.create()
  sandBox.use(vjsNames)
  sandBox
    .active()
    .done(function () {
      //            TaskManager.execTaskById(taskId, []);
      exeFunArr(schemaMapping, key, [])
    })
    .fail(function (dependencyLib) {
      //            var exception = exceptionFactory.create({
      //                "message": dependencyLib.message,
      //                "type": dependencyLib.type,
      //                "exceptionLib": dependencyLib.exceptionLib
      //            });
      //            if (errorFunc) errorFunc(exception);
      //发生异常时，需要把正常的回调清掉，否则重新打开不生效
      try {
        delete schemaMapping[key]
      } catch (e) {}
      exeFunArr(schemaMappingError, key, [dependencyLib])
    })
}
var exeFunArr = function (arrs, key, args) {
  var arr = arrs[key]
  try {
    delete arrs[key]
  } catch (e) {}
  if (arr) {
    for (var i = 0, len = arr.length; i < len; i++) {
      arr[i].apply(this, args)
    }
  }
}
var _genPrepareComponentCallback = function (params) {
  var componentCode = params.componentCode,
    windowCode = params.windowCode,
    scopeId = params.scopeId,
    func = params.func,
    uuid = params.uuid,
    sourceWinInfos = params.sourceWinInfos,
    inputParam = params.inputParam
  return function () {
    var viewInit = sandbox.getService(
      'vjs.framework.extension.platform.init.view.ViewInit'
    )
    var successBack = function () {
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
var _handleError = function (
  resultJson,
  componentCode,
  windowCode,
  moduleName,
  error
) {
  var hasError = _hasError(resultJson)
  if (hasError) {
    var handler = function () {
      var exception,
        msg = ''
      if (resultJson) {
        var needLogin =
          (resultJson.data &&
            resultJson.data.extendProps &&
            resultJson.data.extendProps.needLogin) ||
          resultJson.needLogin
        msg = resultJson['message']
        exception = needLogin
          ? exceptionFactory.create({
              type: 'UnloginException',
              message: '当前页面已过期，需要重新登录'
            })
          : ExceptionFactory.create({
              type: 'BusinessException',
              message: msg
            })
      } else {
        exception = exceptionFactory.create({
          type: 'BusinessException',
          message: '加载页面数据失败,请刷新页面重试！'
        })
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

var _hasError = function (resultJson) {
  return (
    !resultJson ||
    (resultJson.hasOwnProperty('__$isErrorModule') &&
      resultJson.__$isErrorModule)
  )
}

var _printError = function (msg) {
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
var renderAsElement = function (params) {
  var rendered = function (component) {
    component.setParentContainer(_canvas)
    var _canvas = isc.Canvas.create({
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
var setRunningMode = function (mode) {
  this.runningMode = mode
}

/**
 * 根据componentCode请求构件信息
 * @param componentCode<String> 构件code
 * @param callback<Function> 错误回调
 * @param errorCallback<Function> 错误回调
 */
var getComponentByCode = function (componentCode, callback, errorCallback) {
  var sandBox = sandbox.create()
  var extensionCfg = {}
  var isComponentLoaded = ComponentData.componentIsLoaded(componentCode)
  var componentServiceName =
    'vjs.framework.extension.publish.componentInfo.Component_' + componentCode
  if (!isComponentLoaded) {
    extensionCfg[componentServiceName] = null
  }
  extensionCfg[componentServiceName] = null
  sandBox.use(extensionCfg)
  var scopeId = ScopeManager.getCurrentScopeId()
  sandBox.active().done(function () {
    if (!isComponentLoaded) {
      var componentModule = sandBox.getService(componentServiceName)
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

export function preLoad(params) {
  var componentCode = params.componentCode,
    windowCode = params.windowCode
  var skinType = isc.WidgetContext.getSkinType()
  var vjsList = [
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
    'vjs.framework.extension.platform.init.view.schema.component.' +
      componentCode,
    'vjs.framework.extension.platform.init.view.schema.window.' +
      componentCode +
      '.' +
      windowCode
  ]
  var sandBox = sandbox.create()
  sandBox.use(vjsList)
  sandBox.active().done(function () {
    seajs.use(
      '/itop/v3/publish/smartclient/allforsmartclientext',
      function () {}
    )
  })
}

exports.getComponentByCode = getComponentByCode
exports.renderComponentById = renderComponentById
exports.renderAsElement = renderAsElement
exports.renderComponent = renderComponent
exports.prepareComponent = prepareComponent
exports.setRunningMode = setRunningMode
exports.renderWindows = renderWindows
