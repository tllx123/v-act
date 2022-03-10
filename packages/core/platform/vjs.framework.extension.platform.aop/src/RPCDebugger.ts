import { Environment as environment } from '@v-act/vjs.framework.extension.platform.interface.environment'
import { RPC as rpc } from '@v-act/vjs.framework.extension.system.rpc'
import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'

import * as DebugInfoManager from './DebugInfoManager'
import * as DevRPC from './DevRPC'

let aop, objUtils

let testUrl = '/WebDebugRest/GetConnection'

let requestUrl = '/WebDebugRest/PostWebDebugData'

let responseHandler = {}

let responseHandlerAOP

let request = {}

//当前服务的标识id
let NowServerUUID

let utils = {
  /**
   * 错误处理
   */
  errorHandler: function (res) {
    var e = new Error(res)
    aop.markDebugDisable()
    //throw exceptionFatory.create({error:e,message:"与远程调试服务联调出现错误！",type:exceptionFatory.TYPES.Business});
  },
  /**
   * 获取调用url
   */
  getHost: function () {
    return 'module-operation!executeOperation'
  },
  /**
   * 获取远程调试rurl
   */
  getRemoteHost: function () {
    return aop._getRemoteDebugHost() + requestUrl
  },
  /**
   * 响应分发
   */
  responseDispatcher: function (res) {
    //var obj = eval("("+res+")");
    var type = res.type
    //判断res返回字段中有没有含有debugInfo字段，
    if (res.debugInfo != null) {
      //如果含有debug信息字段，那么就更新浏览器端保存的调试信息数据
      //   拿到更新数据后，要调用DebugInfoManager.update接口，进行调试信息更新
      DebugInfoManager.update(res.debugInfo)
    }
    if (responseHandler[type]) {
      responseHandler[type](res)
    }
  },
  /**
   * 发起请求
   */
  request: function (data, success, error) {
    var params = {
      url: utils.getRemoteHost(),
      param: data,
      success: function (res, status) {
        if (success) {
          success(res)
        } else {
          utils.responseDispatcher(res)
        }
      },
      error: function (res, status) {
        if (error) {
          error(res)
        } else {
          utils.errorHandler(res)
        }
      }
    }
    var devRPC = new DevRPC(params)
    devRPC.request()
    /*
            var param = {
                    "remoteHost":utils.getRemoteHost()	
            };
            objUtils.extend(param,data);
            var body = {
                    "param" : param,
                    "componentCode":param.componentCode,
                    "windowCode":param.windowCode,
                    "operationName":"remoteRequest",
                    "isAsync":false,
                    "afterResponse":function(res,status){
                        if(success){
                            success(res);
                        }else{
                            utils.responseDispatcher(res);
                        }
                    },
                    "error":function(res,status){
                        if(error){
                            error(res);
                        }else{
                            utils.errorHandler(res);
                        }
                    }
            };
            rpc.invokeOperation(body);*/
  },
  //测试远程服务
  testRemote: function (callback) {
    var rnum = Math.random(10) * 10000
    var ntime = new Date().getTime()
    console.log('开始:' + new Date().getTime() + ',iden: ' + rnum)
    rpc.crossDomainRequest({
      host: aop._getRemoteDebugHost() + testUrl,
      type: 'GET',
      isAsync: false,
      timeout: 3000,
      afterResponse: function (res, status) {
        console.log(
          '耗时afterResponse：' +
            (new Date().getTime() - ntime) +
            ',iden: ' +
            rnum
        )
        callback(true)
      },
      error: function (res, status) {
        console.log(
          '耗时error：' + (new Date().getTime() - ntime) + ',iden: ' + rnum
        )
        callback(false)
      }
    })
  }
}

/**
 * 终止调试
 */
responseHandler.interrupt = function (result) {
  if (result.msg) {
    alert(result.msg)
  }
  aop.markDebugDisable()
}
/**
 * 更新执行系统数据
 */
responseHandler.update = function (result) {
  try {
    aop.update(
      result.componentCode,
      (windowCode = result.windowCode),
      result.ruleSetCode,
      (ruleCode = result.ruleCode),
      result.data
    )
    request.updateAfter(result)
  } catch (e) {
    let msg = typeof e.getMessage == 'function' ? e.getMessage() : e.message
    request.handleException(msg, result)
  }
}
/**
 * 执行系统数据更新后
 */
request.updateAfter = function (datas) {
  let businessData = aop.getBusinessData()
  datas.type = 'updateAfter'
  datas.businessData = jsonUtil.obj2json(businessData)
  datas.data = ''
  utils.request(datas)
}
/**
 * 更新执行系统数据出错后回调
 */
request.handleException = function (msg, datas) {
  datas.type = 'handleException'
  datas.data = msg
  utils.request(datas)
}
/**
 * 执行表达式
 */
responseHandler.exeExp = function (result) {
  let rs = aop.exeExp(result.data)
  request.exeExpAfter(rs, result)
}
/**
 * 表达式执行结果
 */
request.exeExpAfter = function (rs, datas) {
  datas.data = rs
  datas.type = 'exeExpAfter'
  utils.request(datas)
}
/**
 * 执行系统更新调试信息
 */
//	responseHandler.debugInfoUpdate = function(result){
//		try{
//		//   拿到更新数据后，要调用DebugInfoManager.update接口，进行调试信息更新
//		DebugInfoManager.update(result);
//
//		}catch(e){
//			var msg = typeof(e.getMessage)=='function' ? e.getMessage():e.message;
//			request.handleException(msg,result);
//		}
//	}

let api = {
  request: utils.request,

  /**
   * 规则执行前，往服务器发送初始的基本数据
   * 对外
   */
  beforeRuleExecute: function (
    componentCode,
    windowCode,
    ruleSetCode,
    ruleCode,
    data,
    scope,
    success,
    error
  ) {
    NowServerUUID = environment.getDevId()
    var datas = {
      type: 'beforeRuleExecute',
      scope: !scope ? 'frontend' : scope,
      componentCode: componentCode,
      windowCode: windowCode,
      ruleSetCode: ruleSetCode,
      ruleCode: ruleCode,
      businessData: data,
      data: '',
      NowServerUUID: NowServerUUID
    }
    var flag = DebugInfoManager.isDebugger(
      componentCode,
      windowCode,
      ruleSetCode,
      ruleCode
    )
    utils.request(datas, success, error)
  },
  /**
   * 规则执行后
   */
  ruleExecuted: function (
    componentCode,
    windowCode,
    ruleSetCode,
    ruleCode,
    data,
    scope,
    success,
    error
  ) {
    var datas = {
      type: 'ruleExecuted',
      scope: !scope ? 'frontend' : scope,
      componentCode: componentCode,
      windowCode: windowCode,
      ruleSetCode: ruleSetCode,
      ruleCode: ruleCode,
      businessData: data,
      data: '',
      NowServerUUID: NowServerUUID
    }
    utils.request(datas, success, error)
  },

  /**
   * 测试远程地址
   */
  testRemote: function (remoteUrl, callback) {
    rpc.crossDomainRequest({
      host: remoteUrl + testUrl,
      type: 'GET',
      isAsync: true,
      timeout: 3000,
      afterResponse: function (res, status) {
        callback(true)
      },
      error: function (res, status) {
        callback(false)
      }
    })
    /*rpc.invokeOperation({
                param : {
                    "remoteHost":remoteUrl + testUrl,
                    "requestType":"GET"
                },
                operationName:"remoteRequest",
                "isAsync":true,
                "timeout":3000,
                "afterResponse":function(res,status){
                    callback(true);
                },
                "error":function(res,status){
                    callback(false);
                }
            });*/
  }
}

export function initModule(sb) {
  objUtils = sb.util.object
}

const _putAop = function (a) {
  aop = a
  let devRPC = require('vjs/framework/extension/platform/aop/DevRPC')
  devRPC.prototype._putAop(a)
}

const getHook = function () {
  return api
}

export {
  _putAop,
  addRequest,
  clear,
  genParams,
  getHook,
  init,
  isDebugger,
  isInited,
  remove,
  update
}
