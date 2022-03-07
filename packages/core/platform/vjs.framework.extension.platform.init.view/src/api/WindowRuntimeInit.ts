import { datasource as datasourceBind } from '@v-act/vjs.framework.extension.platform.binding.data'
import { WindowDatasource as windowDatasource } from '@v-act/vjs.framework.extension.platform.data.manager.runtime.datasource'
import { WindowParam as windowParam } from '@v-act/vjs.framework.extension.platform.data.storage.runtime.param'
import {
  ScopeTask,
  TaskManager as taskManager
} from '@v-act/vjs.framework.extension.platform.global.task'
import { Environment as environment } from '@v-act/vjs.framework.extension.platform.interface.environment'
import {
  ExceptionFactory as exceptionFactory,
  ExceptionHandler as exceptionHandler
} from '@v-act/vjs.framework.extension.platform.interface.exception'
import {
  Operation,
  Request as vrequest
} from '@v-act/vjs.framework.extension.platform.interface.rpc.operation'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { StorageManager as storageManager } from '@v-act/vjs.framework.extension.platform.interface.storage'
import { WaterMark as waterMark } from '@v-act/vjs.framework.extension.platform.interface.watermark'
import { WindowInit as windowInit } from '@v-act/vjs.framework.extension.platform.services.init'
import { RemoteOperation as remoteOperation } from '@v-act/vjs.framework.extension.platform.services.operation.remote'
import { ComponentParam as componentParam } from '@v-act/vjs.framework.extension.platform.services.param.manager'
import { WindowRuntimeManager as runtimeManager } from '@v-act/vjs.framework.extension.platform.services.runtime.manager'
import { EventManager as eventManagerService } from '@v-act/vjs.framework.extension.platform.services.view.event'
import { WindowContainerManager as windowContainerManager } from '@v-act/vjs.framework.extension.platform.services.view.relation'
import { RPC as rpc } from '@v-act/vjs.framework.extension.system'
import { EventEmitterManager as eventManager } from '@v-act/vjs.framework.extension.system.event'
import { uuid } from '@v-act/vjs.framework.extension.util.uuid'

let token = 'WINDOW_VIEW_INIT_EVENT',
  storage

export function initModule(sb) {
  storage = storageManager.get(storageManager.TYPES.MAP, token)
}
let _fire = function (componentCode, windowCode, eventName, args) {
  _fireSchemaHandler(componentCode, windowCode, eventName, args)
  _fireInstanceHandler(componentCode, windowCode, eventName, args)
}

let _fireSchemaHandler = function (componentCode, windowCode, eventName, args) {
  let storage = getSchemaStorage([componentCode, windowCode], true)
  _fireHandler(storage, eventName, args)
}

let _fireInstanceHandler = function (
  componentCode,
  windowCode,
  eventName,
  args
) {
  let storage = getInstanceStorage()
  _fireHandler(storage, eventName, args)
}

let _fireHandler = function (storage, eventName, args) {
  if (storage.containsKey(eventName)) {
    let even = eventManager.getInstance(token)
    let ids = storage.get(eventName)
    for (let i = 0, len = ids.length; i < len; i++) {
      let id = ids[i]
      even.emit(id, args)
    }
  }
}
function _fireSourceWindowEvent(scopeId, handler, _this) {
  let sId = scopeId ? scopeId : scopeManager.getCurrentScopeId()
  //初始化默认数据
  let initDefaultDatasFun = function (scopeId) {
    let _scope = scopeManager.getScope(scopeId)
    let _extendId = _scope.getExtendId()
    if (_extendId) {
      initDefaultDatasFun(_extendId)
    }
    scopeManager.createScopeHandler({
      scopeId: scopeId,
      handler: handler,
      callObject: _this
    })(_scope)
  }
  initDefaultDatasFun(sId)
}
/**
 * 添加水印操作
 * @param	{}
 * */
let addWaterMarkOperation = function (scopeId, componentCode, windowCode) {
  //移动窗体不支持水印
  if (scopeManager.getScope(scopeId).getSeries() == 'bootstrap_mobile') {
    return
  }
  //如果当前窗体是在容器内，而且父窗体已经有水印，则不用加水印
  if (
    windowContainerManager.getOpenType(scopeId) ==
    windowContainerManager.OPENTYPE.CONTAINER
  ) {
    let tmpScopeId = scopeId
    let isContinue = true
    while (isContinue) {
      let parentScopeId = scopeManager.getParentScopeId(tmpScopeId)
      if (parentScopeId) {
        //如果父窗体是模态，则不继续往上找
        if (
          windowContainerManager.getOpenType(parentScopeId) ==
          windowContainerManager.OPENTYPE.MODAL
        ) {
          isContinue = false
        }
        let parentScope = scopeManager.getScope(parentScopeId)
        if (parentScope.getWaterMark()) {
          return
        } else {
          tmpScopeId = parentScopeId
        }
      } else {
        isContinue = false
      }
    }
  }
  let operationName = 'WaterMark'
  let operation = new Operation()
  operation.setComponentCode(componentCode)
  operation.setWindowCode(windowCode)
  operation.setOperation(operationName)
  operation.setAfterResponse(function (datas) {
    if (datas.success && datas.data.hasWaterMark) {
      let nowScope = scopeManager.getScope(scopeId)
      nowScope.setWaterMark(true)
      let data = datas.data
      let title = data.title
      let content = data.content
      waterMark.draw({
        scopeId: scopeId,
        title: title,
        content: content
      })
    }
  })
  runtimeManager.addRequestOperation({ operation: operation })
  //
  //      //请求是否需要加水印
  //		windowInit.registerHandler({
  //			"eventName": exports.Events.onMultiRequest,
  //			"handler": (function(comCode,winCode){
  //				return function(){
  //					//移动窗体不支持水印
  //					if(scopeManager.getScope(scopeId).getSeries() == "bootstrap_mobile"){
  //						return;
  //					}
  //					//如果当前窗体是在容器内，而且父窗体已经有水印，则不用加水印
  //					if(windowContainerManager.getOpenType(scopeId) == windowContainerManager.OPENTYPE.CONTAINER){
  //						var tmpScopeId = scopeId;
  //						var isContinue = true;
  //						while(isContinue){
  //							var parentScopeId = scopeManager.getParentScopeId(tmpScopeId);
  //							if(parentScopeId){
  //								//如果父窗体是模态，则不继续往上找
  //								if(windowContainerManager.getOpenType(parentScopeId) == windowContainerManager.OPENTYPE.MODAL){
  //									isContinue = false;
  //								}
  //								var parentScope = scopeManager.getScope(parentScopeId);
  //								if(parentScope.getWaterMark()){
  //									return;
  //								}else{
  //									tmpScopeId = parentScopeId;
  //								}
  //							}else{
  //								isContinue = false;
  //							}
  //						}
  //					}
  //					rpc.invokeOperation({
  //						"componentCode":comCode,
  //						"windowCode":winCode,
  //						"operationName":"WaterMark",
  //						"isAsync":false,
  //						"afterResponse":function(datas){
  //							if(datas.success && datas.data.hasWaterMark){
  //								var nowScope = scopeManager.getScope(scopeId);
  //								nowScope.setWaterMark(true);
  //								var data = datas.data;
  //								var title = data.title;
  //								var content = data.content;
  //								waterMark.draw({
  //									scopeId : scopeId,
  //									title : title,
  //									content : content
  //								});
  //							}
  //						}
  //					});
  //				}
  //			})(componentCode,windowCode)
  //		});
  //
}

const init = function (params) {
  //TODO
  //注册log
  scopeManager.openScope(params.scopeId)
  let isInitView = params.initView === false ? false : true
  let componentCode = params.componentCode,
    windowCode = params.windowCode
  let scopeId = params.scopeId
  try {
    let even = eventManager.getInstance(token)
    _fire(componentCode, windowCode, exports.Events.onContextLoad)
    _fireSourceWindowEvent(scopeId, function (currentScope) {
      _fire(
        currentScope.getComponentCode(),
        currentScope.getWindowCode(),
        exports.Events.initWindowContext
      )
    })
    //			_fire(componentCode,windowCode,exports.Events.initWindowContext);
    if (isInitView) {
      _fire(componentCode, windowCode, exports.Events.initWidgetContext)
      _fire(componentCode, windowCode, exports.Events.bindWidgetEvent)
    }
    //初始化窗体入參
    //			windowParam.initInputs(params.inputParam);
    _fireSourceWindowEvent(
      scopeId,
      (function (_inputParam) {
        return function () {
          windowParam.initInputs(_inputParam)
        }
      })(params.inputParam)
    )
    //实例化数据源
    _fireSourceWindowEvent(scopeId, windowDatasource.init, windowDatasource)
    //			windowDatasource.init();
    //数据绑定
    _fireSourceWindowEvent(scopeId, datasourceBind.bind, datasourceBind)
    //			datasourceBind.bind();
    if (isInitView) {
      _fire(componentCode, windowCode, exports.Events.initWindowData)
      _fire(componentCode, windowCode, exports.Events.initWidgetData)
      _fire(componentCode, windowCode, exports.Events.onBindData)
    }
    _fireSourceWindowEvent(scopeId, function (currentScope) {
      let currentComponentCode = currentScope.getComponentCode()
      let currentWindowCode = currentScope.getWindowCode()
      let formLoadedHandler = eventManagerService.fireEvent(
        currentWindowCode,
        'FormLoadedAction'
      )
      // 窗体加载事件(加入窗体加载完成后事件)
      let _this = this
      windowInit.registerHandler({
        eventName: windowInit.Events.WindowLoaded,
        handler: eventManagerService.fireEvent(
          currentWindowCode,
          'FormLoadAction',
          (function (handler, winScope) {
            return function () {
              if (typeof handler == 'function') {
                handler()
              }
              var componentCode = winScope.getComponentCode()
              var windowScope = winScope.getWindowCode()
              _fire(
                componentCode,
                windowScope,
                windowInit.Events.WindowInited,
                winScope
              )
            }
          })(formLoadedHandler, currentScope)
        )
      })
    })
    _fire(componentCode, windowCode, exports.Events.initWindowEvent)
    if (isInitView)
      _fire(componentCode, windowCode, exports.Events.initWidgetEvent)
    if (isInitView)
      _fire(componentCode, windowCode, exports.Events.bindWidgetDatasource)
    //			_fireSourceWindowEvent(params.scopeId,function(currentScope){
    //				_fire(currentScope.getComponentCode(),currentScope.getWindowCode(),exports.Events.bindWidgetDatasource);
    //			});
    _fire(componentCode, windowCode, exports.Events.onBindRule)
    //添加水印操作
    addWaterMarkOperation(scopeId, componentCode, windowCode)
    _fire(componentCode, windowCode, exports.Events.onMultiRequest)
    componentParam.initVariant()
    applyMultRequest(
      (function () {
        return function () {
          //TODO后续逻辑作为applyMultRequest成功回掉
          _fire(componentCode, windowCode, exports.Events.dataInitLoad)
          _fire(componentCode, windowCode, exports.Events.beforeDataLoad)
          //初始化默认数据
          _fireSourceWindowEvent(
            params.scopeId,
            windowDatasource.initDefaultDatas,
            windowDatasource
          )
          _fire(componentCode, windowCode, exports.Events.onDataLoad)
          runtimeManager.cleanWindowInfo(componentCode, windowCode)
          //窗体加载事件前,先触发成功回调
          _callFunction(params.beforeFormLoad, [])
          //把成功回调注册进windowInit
          var successCB = params.success
          // 窗体加载事件(加入窗体加载完成后事件)
          windowInit.registerHandler({
            eventName: windowInit.Events.WindowInited,
            handler: (function (cb) {
              return function () {
                if (typeof cb == 'function') {
                  cb()
                }
              }
            })(successCB)
          })
          var task = new ScopeTask(
            params.scopeId,
            true,
            function () {
              //1、將子窗体的逻辑包装成回调cb1
              //2、将cb1回调注册到父窗体的WindowInited切面中
              //3、触发父窗体的逻辑
              var sId = params.scopeId
                ? params.scopeId
                : scopeManager.getCurrentScopeId()
              //初始化默认数据
              var initDefaultDatasFun = function (scopeId, handler) {
                var _scope = scopeManager.getScope(scopeId)
                var _extendId = _scope.getExtendId()
                var func = scopeManager.createScopeHandler({
                  scopeId: scopeId,
                  handler: handler
                })
                if (_extendId) {
                  initDefaultDatasFun(_extendId, function (scope) {
                    windowInit.registerHandler({
                      eventName: windowInit.Events.WindowInited,
                      handler: func
                    })
                    var cCode = scope.getComponentCode()
                    var wCode = scope.getWindowCode()
                    _fire(cCode, wCode, exports.Events.afterDataLoad)
                    // 为了保证触发窗体加载事件的时候，窗体内的控件都渲染完成，所以窗体的加载事件由windowInited来触发
                    _fire(cCode, wCode, exports.Events.windowLoaded)
                  })
                } else {
                  func(_scope)
                }
              }

              var cb1 = function () {
                var scope = scopeManager.getScope()
                var cCode = scope.getComponentCode()
                var wCode = scope.getWindowCode()
                _fire(cCode, wCode, exports.Events.afterDataLoad)
                // 为了保证触发窗体加载事件的时候，窗体内的控件都渲染完成，所以窗体的加载事件由windowInited来触发
                _fire(cCode, wCode, exports.Events.windowLoaded)
                //							_fire(cCode,wCode,exports.Events.windowInited);
              }
              initDefaultDatasFun(sId, cb1)
            },
            { componentCode: componentCode, windowCode: windowCode }
          )
          taskManager.addTask(task)
        }
      })(),
      function (e) {
        _callFunction(params.error || exceptionHandler.handle, [e])
      }
    )
  } catch (e) {
    let ee = exceptionFactory.create({
      error: e
    })
    _callFunction(params.error || exceptionHandler.handle, [ee])
  } finally {
    scopeManager.closeScope()
  }
}

let _callFunction = function (fun, args) {
  if (typeof fun == 'function') {
    fun.apply(this, args)
  }
}

/**
 * 事件名称集
 */
exports.Events = {
  onContextLoad: 'onContextLoad',
  onBindData: 'onBindData',
  onBindRule: 'onBindRule',
  onMultiRequest: 'onMultiRequest',
  dataInitLoad: 'dataInitLoad',
  beforeDataLoad: 'beforeDataLoad',
  onDataLoad: 'onDataLoad',
  afterDataLoad: 'afterDataLoad',
  windowLoaded: 'windowLoaded',
  windowInited: 'windowInited',

  initWidgetEvent: 'initWidgetEvent', //onBindData后，onBindRule前
  initWidgetData: 'initWidgetData', //onBindData前

  initWindowEvent: 'initWindowEvent', //onBindData后，initWidgetEvent前
  initWindowData: 'initWindowData', //initWidgetData前

  initWindowContext: 'initWindowContext', //onContextLoad后 initWidgetContext前
  initWidgetContext: 'initWidgetContext', //onContextLoad后
  bindWidgetEvent: 'bindWidgetEvent', //initWidgetContext后
  bindWidgetDatasource: 'bindWidgetDatasource' //onBindData后
}

let getSchemaStorage = function (depth, isCreate) {
  let rs,
    s = storage
  for (let i = 0, key; (key = depth[i]); i++) {
    if (s.containsKey(key)) {
      rs = s = s.get(key)
    } else if (isCreate) {
      rs = storageManager.newInstance(storageManager.TYPES.MAP)
      s.put(key, rs)
      s = rs
    }
  }
  return rs
}

let getInstanceStorage = function () {
  let storage
  if (scopeManager.hasProperty(token)) {
    storage = scopeManager.getProperty(token)
  } else {
    storage = storageManager.newInstance(storageManager.TYPES.MAP)
    scopeManager.setProperty(token, storage)
  }
  return storage
}

let _registerToManager = function (storage, eventName, handler) {
  let id = uuid.generate()
  let ids = storage.containsKey(eventName) ? storage.get(eventName) : []
  ids.push(id)
  storage.put(eventName, ids)
  let even = eventManager.getInstance(token)
  even.on(id, handler)
}

const registerSchemaHandler = function (params) {
  let storage = getSchemaStorage(
    [params.componentCode, params.windowCode],
    true
  )
  _registerToManager(storage, params.eventName, params.handler)
}

const registerHandler = function (params) {
  let storage = getInstanceStorage()
  _registerToManager(storage, params.eventName, params.handler)
}

let RUNTIME_OPERATION_KEY = 'RUNTIME_OPERATION_KEY'

let _registerVariableToManager = function (storage, operation) {
  let operations = storage.containsKey(RUNTIME_OPERATION_KEY)
    ? storage.get(RUNTIME_OPERATION_KEY)
    : []
  operations.push(operation)
  storage.put(RUNTIME_OPERATION_KEY, operations)
}

const registerVariableHandler = function (params) {
  let storage = getInstanceStorage()
  _registerVariableToManager(storage, params.operation)
}

let applyMultRequest = function (success, error) {
  let type = environment.getPlatformType()
  let storage = getInstanceStorage()
  //取出所有operation
  let operations = storage.get(RUNTIME_OPERATION_KEY)
  if (type == 'DesignSchema' || !operations || operations.length == 0) {
    try {
      success && success()
    } catch (e) {
      error && error(e)
    }
  } else {
    //组装成Request实例对象,注入success,error回掉
    let request = new vrequest(true, operations, success, error)
    //调用批量请求后台接口
    remoteOperation.request({ request: request })
  }
}

const hasPermission = function (params) {
  let result = { hasPerm: true }
  /*var operation = new Operation();
    operation.setOperation("WinPerm");
    operation.setComponentCode(params.componentCode);
    operation.setWindowCode(params.windowCode);
    operation.setAfterResponse((function(rslt){
        return function(rs){
            rslt.hasPerm = rs.data.hasPermis;
        };
        })(result));
    var request = new vrequest(false,[operation]);
    remoteOperation.request({"request":request})*/
  rpc.invokeOperation({
    componentCode: params.componentCode,
    windowCode: params.windowCode,
    operationName: 'WinPerm',
    isAsync: false,
    afterResponse: (function (rslt) {
      return function (rs) {
        rslt.hasPerm = rs.data.hasPermis
      }
    })(result)
  })
  return result.hasPerm
}

export {
  applyMultRequest,
  fireEventFunc,
  hasPermission,
  init,
  initAppSchema,
  initComponentSchema,
  initWindowRuntime,
  initWindowSchema,
  registerHandler,
  registerSchemaHandler,
  registerVariableHandler
}
