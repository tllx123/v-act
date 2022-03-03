import { ScopeManager as ScopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { ScopeTask as ScopeTask } from '@v-act/vjs.framework.extension.platform.global.task'
import { TaskManager as TaskManager } from '@v-act/vjs.framework.extension.platform.global.task'
import { ComponentData as ComponentData } from '@v-act/vjs.framework.extension.platform.global.data'
import { AppData as AppData } from '@v-act/vjs.framework.extension.platform.global.data'
import { ExceptionFactory as exceptionFactory } from '@v-act/vjs.framework.extension.platform.interface.exception'
import { EventManager as eventManager } from '@v-act/vjs.framework.extension.platform.interface.event'
import { UUID as uuidUtil } from '@v-act/vjs.framework.extension.util'
import { ApplicationParam as ApplicationParam } from '@v-act/vjs.framework.extension.platform.data.storage.schema.param'
import { ComponentPackData as componentPackData } from '@v-act/vjs.framework.extension.platform.global.data'

let scopeManager, sandbox

exports.initModule = function (sb) {
  sandbox = sb
}

let _fireHandler = function (fun, _this, args) {
  if (fun) {
    fun.apply(_this, args)
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
          series: 'bootstrap_mobile'
        })
  let renderedCallback, initedCallback, refComponentCfg, errorFunc
  if (cfg) {
    renderedCallback = cfg.rendered
    initedCallback = cfg.inited
    refComponentCfg = cfg.refComponents
    errorFunc = cfg.error
  }
  let _this = this
  renderComponent.call(
    _this,
    componentCode,
    windowCode,
    scopeId,
    function (component, scopeId) {
      //component.showModal("组件正在初始化，请稍候...");
      if (typeof renderedCallback == 'function') {
        renderedCallback(component, scopeId)
      }
      let viewLib = this
      prepareComponent.call(
        _this,
        componentCode,
        windowCode,
        scopeId,
        inputParam,
        function () {
          viewLib.fireCallback()
          if (typeof initedCallback == 'function') {
            initedCallback(component, scopeId)
          }
        },
        refComponentCfg,
        function (exception) {
          _fireHandler(errorFunc, this, [exception])
          exception.handle()
        }
      )
      let progressbar = sandbox.getService(
        'vjs.framework.extension.ui.common.plugin.services.progressbar.ProgressBarUtil'
      )
      progressbar.hideProgress()
      if (
        'undefined' != typeof JPlaceHolder &&
        typeof JPlaceHolder.init == 'function'
      ) {
        JPlaceHolder.init()
      }
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
  error,
  validatePermission
) {
  validatePermission =
    typeof validatePermission == 'boolean' ? validatePermission : true
  let runtimeManager = sandbox.getService(
    'vjs.framework.extension.platform.services.runtime.manager.WindowRuntimeManager'
  )
  if (false) {
    //移动版暂时去掉权限校验
    let hasPerm = runtimeManager.hasPermission({
      componentCode: componentCode,
      windowCode: windowCode
    })
    if (!hasPerm) {
      let msg = '对不起，您没有该窗体的浏览权限。'
      let exception = exceptionFactory.create({
        message: msg,
        type: exceptionFactory.TYPES.ModuleScriptException
      })
      _fireHandler(errorFunc, this, [exception])
      throw Error(msg)
    }
  }
  let success = ScopeManager.createScopeHandler({
    scopeId: scopeId,
    handler: function () {
      let tmpUUID = 'WINLOAD_' + uuidUtil.generate()
      eventManager.fire({
        event: eventManager.Events.BeforeWindowLoad,
        args: [scopeId, tmpUUID]
      })
      let scopeTask = new ScopeTask(
        scopeId,
        false,
        _genRenderComponentCallback({
          componentCode: componentCode,
          windowCode: windowCode,
          scopeId: scopeId,
          func: func,
          tmoUUID: tmpUUID,
          error: error
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
      let extensionCfg = {}
      extensionCfg[bundleName] = null
      sandBox.use(extensionCfg)
      sandBox
        .active()
        .done(function () {
          var viewLib = sandBox.getService(serviceName)
          TaskManager.execTaskById(taskId, [viewLib])
          //AsyncManager.execTaskById(taskId, [viewLib]);
        })
        .fail(function (e) {
          let exception = exceptionFactory.create(e)
          _fireHandler(error, this, [exception])
        })
    }
  })
  ScopeManager.createScopeHandler({
    scopeId: scopeId,
    handler: function () {
      runtimeManager.initWindow({
        windows: {
          componentCode: componentCode,
          windowCode: windowCode,
          validWindow: validatePermission
        },
        success: success,
        error: error
      })
    }
  })()
}
let _genRenderComponentCallback = function (params) {
  let componentCode = params.componentCode,
    windowCode = params.windowCode,
    scopeId = params.scopeId,
    func = params.func,
    tmpuuid = params.tmpUUID,
    error = params.error
  return function (viewLib) {
    eventManager.fire({
      event: eventManager.Events.AfterWindowLoad,
      args: [scopeId, tmpuuid]
    })
    let flag = _handleError(
      viewLib,
      componentCode,
      windowCode,
      'viewLib',
      error
    )
    if (!flag) {
      let tmpUUID = 'WINRENDER_' + uuidUtil.generate()
      eventManager.fire({
        event: eventManager.Events.BeforeWindowRender,
        args: [scopeId, tmpUUID]
      })
      //渲染组件
      try {
        viewLib.execute(
          {
            scopeId: scopeId,
            componentId: windowCode,
            skinType: null,
            callback: function (component, scopeId) {
              eventManager.fire({
                event: eventManager.Events.AfterWindowRender,
                args: [scopeId, tmpUUID]
              })
              _fireHandler(func, this, [component, scopeId])
            }
          },
          scopeId,
          func
        )
      } catch (e) {
        _fireHandler(error, this, [exceptionFactory.create(e)])
      }
    }
  }
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
 * @param {Object} extraParams
 * {
 * 		beforeFormLoad : Function
 * }
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
  extraParams
) {
  let tmpUUID = 'WININIT_' + uuidUtil.generate()
  let beforeFormLoad = extraParams ? extraParams.beforeFormLoad : null
  eventManager.fire({
    event: eventManager.Events.BeforeWindowInit,
    args: [scopeId, tmpUUID]
  })
  //替换构件包映射信息
  let newInfo = replaceComponentPackInfo(componentCode, windowCode)
  if (newInfo) {
    componentCode = newInfo.componentCode
    windowCode = newInfo.windowCode
  }
  //		获取来源窗体的信息
  let sourceWinInfos = getSource(componentCode, windowCode, [])
  let scopeTask = new ScopeTask(
    scopeId,
    false,
    _genPrepareComponentCallback({
      componentCode: componentCode,
      windowCode: windowCode,
      scopeId: scopeId,
      func: func,
      tmpUUID: tmpUUID,
      inputParam: inputParam,
      beforeFormLoad: beforeFormLoad,
      error: error
    })
  )
  let taskId = TaskManager.addTask(scopeTask)
  //		var vjsNames = ["vjs.framework.extension.platform.init.view.schema.Application","vjs.framework.extension.platform.init.view.schema.component."+componentCode,"vjs.framework.extension.platform.init.view.schema.window."+componentCode+"."+windowCode];
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
    .fail(function (e) {
      let exception = exceptionFactory.create(e)
      _fireHandler(error, this, [exception])
    })
}
let _genPrepareComponentCallback = function (params) {
  let componentCode = params.componentCode,
    windowCode = params.windowCode,
    scopeId = params.scopeId,
    func = params.func,
    inputParam = params.inputParam,
    tmpuuid = params.tmpUUID,
    beforeFormLoad = params.beforeFormLoad,
    error = params.error
  return function () {
    let viewInit = sandbox.getService(
      'vjs.framework.extension.platform.init.view.ViewInit'
    )
    let initFunc = (function (wCode, inited) {
      return function () {
        eventManager.fire({
          event: eventManager.Events.AfterWindowInit,
          args: [scopeId, tmpuuid]
        })
        _fireHandler(inited, this, arguments)
      }
    })(windowCode, func)
    viewInit.init({
      componentCode: componentCode,
      windowCode: windowCode,
      scopeId: scopeId,
      inputParam: inputParam,
      success: initFunc,
      error: error,
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
    /*var _canvas = isc.Canvas.create({
            width : component.Width,
            canFocus : true,
            height : component.Height,
            htmlElement : htmlEle,
            children : [component],
            contents : ''
        });
        _canvas.close = function() {
            this.destroy();
        }
        _canvas.show();
        if ( typeof (renderedFunction) == "function") {
            renderedFunction(component);
        }*/
  }
  renderComponentById(componentCode, windowCode, inputParam, {
    rendered: callBackFunc,
    inited: inited,
    refComponents: refComponents
  })
}
/**
 *设置运行模式
 * @param {Object} mode
 */
let setRunningMode = function (mode) {
  this.runningMode = mode
}

export {
  execute,
  renderComponentById,
  renderComponentToElement,
  renderComponent,
  prepareComponent,
  setRunningMode
}
