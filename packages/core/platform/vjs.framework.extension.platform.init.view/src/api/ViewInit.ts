import {
  AppInfo as appInfo,
  ComponentInfo as componentInfo,
  WindowInfo as windowInfo
} from '@v-act/vjs.framework.extension.platform.data.manager.runtime.info'
import {
  ScopeTask,
  TaskManager as taskManager
} from '@v-act/vjs.framework.extension.platform.global'
import { EventManager as eventManager } from '@v-act/vjs.framework.extension.platform.interface.event'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { uuid } from '@v-act/vjs.framework.extension.util.uuid'

import * as windowRuntime from './WindowRuntimeInit'

let taskPool = {}

let _initSchema = function (vjsName, errorFn, scopeTaskId) {
  //modify by xiedh 2015-11-30   cause:当批量去初始化同一个schema信息时，造成信息重复
  let taskIds = taskPool[vjsName]
  if (!taskIds) {
    taskIds = []
    taskPool[vjsName] = taskIds
  }
  taskIds.push(scopeTaskId)
  if (taskIds.length < 2) {
    sandbox.use([vjsName])
    sandbox
      .active()
      .done(function () {
        try {
          var service = sandbox.getService(vjsName)
          service.init()
          if (taskIds) {
            for (var i = 0, len = taskIds.length; i < len; i++) {
              var taskId = taskIds[i]
              taskManager.execTaskById(taskId)
            }
          }
          taskPool[vjsName] = null
          try {
            delete taskPool[vjsName]
          } catch (e) {}
        } catch (e) {
          if (typeof errorFn == 'function') errorFn(e)
        }
      })
      .fail(function (e) {
        taskPool[vjsName] = null
        if (typeof errorFn == 'function') errorFn(e)
      })
  }
}

let _fireCallbackwithAsyn = function (params) {
  setTimeout(function () {
    if (params.scopeTaskId) {
      taskManager.execTaskById(params.scopeTaskId)
    } else {
      let cb = params.success
      if (typeof cb == 'function') {
        cb()
      }
    }
  }, 1)
}

var _createScopeTask = function (scopeId, isAutoExe, handler) {
  var scopeTask = new ScopeTask(scopeId, isAutoExe, handler)
  return taskManager.addTask(scopeTask)
}

/**
 * 应用信息初始化
 * @param {Object} params 参数信息
 * {
 * 		"success" : {Function} 初始化成功回调,
 * 		"error" ： {Function} 初始化失败回调
 * }
 */
const initAppSchema = function (params) {
  var parentScopeId = params.scopeId || scopeManager.getCurrentScopeId()
  var scopeId = scopeManager.createScope(parentScopeId)
  scopeManager.openScope(scopeId)
  var scopeTaskId = _createScopeTask(scopeId, false, params.success)
  scopeManager.closeScope()
  params.scopeTaskId = scopeTaskId
  if (appInfo.isAppSchemaInited()) {
    _fireCallbackwithAsyn(params)
  } else {
    //			var vjsName = "vjs.framework.extension.platform.init.view.schema.Application";
    //			_initSchema(vjsName, params.error, scopeTaskId);
    taskManager.execTaskById(scopeTaskId)
  }
}

const initComponentSchema = function (params) {
  //		var componentCode = params.componentCode;
  //		var scopeId = scopeManager.createComponentScope({
  //			parentScopeId : params.scopeId || scopeManager.getCurrentScopeId(),
  //			componentCode : componentCode
  //		});
  //		var tmpUUID = "COM_"+uuid.generate();
  //		eventManager.fire({
  //			event:eventManager.Events.BeforeComponentInit,
  //			args : [scopeId,tmpUUID]
  //		});
  //		var source_success = params.success;
  //		params.success = function(){
  //			eventManager.fire({
  //				event:eventManager.Events.AfterComponentInit,
  //				args : [scopeId,tmpUUID]
  //			});
  //			if(typeof(source_success)=="function"){
  //				source_success.apply(this,arguments);
  //			}
  //		}
  //		scopeManager.openScope(scopeId);
  //		var scopeTaskId = _createScopeTask(scopeId, false, params.success);
  //		scopeManager.closeScope();
  //		params.scopeTaskId = scopeTaskId;
  //		if(componentInfo.isComponentSchemaInited(componentCode)){
  //			_fireCallbackwithAsyn(params);
  //		}else{
  //			var vjsName = "vjs.framework.extension.platform.init.view.schema.component."+componentCode;
  //			_initSchema(vjsName, params.error, scopeTaskId);
  //		}

  let cbs = [params.success]
  let currentScope = scopeManager.getWindowScope()
  let exist = true
  //调用api时会初始化指定构件
  let componentCode = params.componentCode
  while (exist) {
    let comCode = componentCode
      ? componentCode
      : currentScope.getComponentCode()
    let scopeId = scopeManager.createComponentScope({
      parentScopeId: currentScope.getInstanceId(),
      componentCode: comCode
    })
    let tmpUUID = 'COM_' + uuid.generate()
    eventManager.fire({
      event: eventManager.Events.BeforeComponentInit,
      args: [scopeId, tmpUUID]
    })
    let source_success = cbs[cbs.length - 1] //params.success;
    let success = (function (_c) {
      return function () {
        eventManager.fire({
          event: eventManager.Events.AfterComponentInit,
          args: [scopeId, tmpUUID]
        })
        if (typeof _c == 'function') {
          _c.apply(this, arguments)
        }
      }
    })(source_success)
    let scopeTaskId = scopeManager.createScopeHandler({
      scopeId: scopeId,
      handler: function (_success) {
        return _createScopeTask(
          scopeManager.getCurrentScopeId(),
          false,
          _success
        )
      }
    })(success)
    let cb = (function (tId, _params, comCode) {
      return function () {
        _params.scopeTaskId = tId
        if (componentInfo.isComponentSchemaInited(comCode)) {
          _fireCallbackwithAsyn(_params)
        } else {
          let vjsName =
            'vjs.framework.extension.platform.init.view.schema.component.' +
            comCode
          _initSchema(vjsName, _params.error, tId)
        }
      }
    })(scopeTaskId, params, comCode)
    cbs.push(cb)
    var extendId = currentScope ? currentScope.getExtendId() : null
    if (extendId != null) {
      currentScope = scopeManager.getScope(extendId)
      componentCode = null
    } else {
      exist = false
    }
  }
  cbs[cbs.length - 1]()
}
//	/**
//     * 获取来源窗体信息，递归查找
//     * @param {String} comCode 构件编码
//     * @param {String} winCode 窗体编码
//     * @param {String} comCode 来源窗体信息列表
//     * recurssion
//     * */
//	function getSource(comCode, winCode, infos){
//		infos.push({
//    		componentCode: comCode,
//    		windowCode: winCode
//    	});
//		var windowMappingInfo = ApplicationParam.getWindowMapping({
//            componentCode: comCode,
//            windowCode: winCode,
//            isTarget : true
//        });
//        if (windowMappingInfo != null) {
//        	infos = getSource(windowMappingInfo.componentCode, windowMappingInfo.windowCode, infos);
//        }
//        return infos;
//	}
/**
 * 初始化窗体schema信息
 * @param {Object} params 参数信息
 * {
 * 		"componentCode" : {String} 构件编号
 * 		"windowCode" : {String} 窗体编号
 * 		"success" : {Function} 初始化成功回调,
 * 		"error" ： {Function} 初始化失败回调
 * }
 */
const initWindowSchema = function (params) {
  let componentCode = params.componentCode,
    windowCode = params.windowCode
  let scopeId = params.scopeId
  if (undefined == scopeId || null == scopeId)
    scopeId = scopeManager.getCurrentScopeId()
  let cbs = [params.success]
  let currentScope = scopeManager.getWindowScope()
  let series = currentScope.getSeries()

  let exist = true
  while (exist) {
    let _comCode = currentScope.getComponentCode()
    let _winCode = currentScope.getWindowCode()
    let sId = currentScope.getInstanceId()
    let tId = _createScopeTask(sId, false, cbs[cbs.length - 1])
    let cb = (function (comCode, winCode, tId, cb, _params) {
      return function () {
        _params.scopeTaskId = tId
        if (windowInfo.isWindowSchemaInited(comCode, winCode)) {
          _fireCallbackwithAsyn(_params)
        } else {
          let winVjs =
            'vjs.framework.extension.platform.init.view.schema.window.' +
            comCode +
            '.' +
            winCode
          _initSchema(winVjs, _params.error, tId)
        }
      }
    })(_comCode, _winCode, tId, cbs[cbs.length - 1], params)
    cbs.push(cb)
    let extendId = currentScope.getExtendId()
    if (extendId != null) {
      currentScope = scopeManager.getScope(extendId)
    } else {
      exist = false
    }
  }
  //判断是否有替换的窗体
  //
  //获取来源窗体信息
  //		var sourceWindowInfos = getSource(componentCode, windowCode, []);
  //		if(sourceWindowInfos.length > 0){
  //			var sId = scopeId;
  //			for(var i = 0,len = sourceWindowInfos.length;i<len;i++){
  //				var info = sourceWindowInfos[i];
  //				var _comCode = info.componentCode;
  //				var _winCode = info.windowCode;
  //				if(sId == null){
  //					sId = scopeManager.createWindowScope({
  //	        			componentCode: _comCode,
  //	        			windowCode: _winCode,
  //	        			series : series
  //	        		});
  //				}
  //				var tId = _createScopeTask(sId, false, cbs[cbs.length - 1]);
  //	        	var cb = (function(comCode, winCode, tId, cb, _params){
  //	        		return function(){
  //	    	        	_params.scopeTaskId = tId;
  //	    	    		if (windowInfo.isWindowSchemaInited(comCode, winCode)) {
  //	    	    			_fireCallbackwithAsyn(_params);
  //	    	    		} else {
  //	    	    			var winVjs = "vjs.framework.extension.platform.init.view.schema.window." + comCode + "." + winCode;
  //	    	    			_initSchema(winVjs, _params.error, tId);
  //	    	    		}
  //	        		}
  //	        	})(_comCode, _winCode, tId, cbs[cbs.length - 1], params);
  //	        	cbs.push(cb);
  //	        	sId = null;
  //			}
  //		}
  cbs[cbs.length - 1]()

  //		var scopeTaskId = _createScopeTask(scopeId, false, params.success);
  //		params.scopeTaskId = scopeTaskId;
  //		if (windowInfo.isWindowSchemaInited(componentCode, windowCode)) {
  //			_fireCallbackwithAsyn(params);
  //		} else {
  //			var vjsName = "vjs.framework.extension.platform.init.view.schema.window." + componentCode + "." + windowCode;
  //			_initSchema(vjsName, params.error, scopeTaskId);
  //		}
}

const initWindowRuntime = function (params) {
  windowRuntime.init(params)
}

const init = function (params) {
  let winCb = function () {
    initWindowRuntime(params)
  }
  let compCb = function () {
    initWindowSchema({
      componentCode: params.componentCode,
      windowCode: params.windowCode,
      success: winCb,
      error: params.error
    })
  }
  let appCb = function () {
    initComponentSchema({
      componentCode: params.componentCode,
      windowCode: params.windowCode,
      success: compCb,
      error: params.error
    })
  }
  //appCb();
  initAppSchema({ success: appCb, error: params.error })
}

export {
  init,
  initAppSchema,
  initComponentSchema,
  initWindowRuntime,
  initWindowSchema
}
