import { RemoteOperation as remoteRequest } from '@v-act/vjs.framework.extension.platform.services.domain.operation'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { JsonUtil as jsonUtil } from '@v-act/vjs.framework.extension.util'
import { Environment as environment } from '@v-act/vjs.framework.extension.platform.interface.environment'

let aop, objUtils

let Request = function (data) {
  this.componentCode = scopeManager.getScope().getComponentCode()
  this.data = data
  this.intervalIndex = null
  //状态
  this.status = 'init' //init:初始化,requesting:请求中
  //循环间隔
  this.intervalStep = 300
}

Request.prototype = {
  initModule: function (sb) {
    objUtils = sb.util.object
  },

  _putAop: function (a) {
    aop = a
  },

  setId: function (id) {
    this.id = id
  },

  getId: function () {
    return this.id
  },

  start: function () {
    let _this = this
    this.intervalIndex = setInterval(function () {
      _this.exe()
    }, this.intervalStep)
  },

  stop: function () {
    if (this.intervalIndex != null) {
      clearInterval(this.intervalIndex)
    }
  },

  requestDev: function (rs) {
    let type = rs.data.type
    if (this.dispatcher[type]) {
      this.stop()
      this.dispatcher[type].call(this, rs.data)
    }
  },

  requestRuntime: function () {
    let _this = this
    return function (rs) {
      //var result = jsonUtil.json2obj(rs);
      let type = rs.type
      if (_this.request[type]) {
        _this.request[type].call(_this, rs)
      }
    }
  },

  devRpcError: function () {
    //请求dev报错回调
    let _this = this
    return function (rs) {
      //开发系统出现错误，中断调试
      _this.request.interrupt.call(_this, rs)
    }
  },

  errorHandler: function () {
    //请求执行系统报错回调
    let _this = this
    return function (rs) {
      _this.stop()
      _this.dispatcher.handleException.call(_this, rs.data)
    }
  },

  exe: function () {
    let _this = this
    this.rpc(null, this.requestDev, this.errorHandler)
  },

  rpc: function (data, success, error) {
    let _this = this
    let params = {
      debuggerId: this.id,
      devId: environment.getDevId()
    }
    if (data) objUtils.extend(params, data)
    let param = {
      componentCode: this.componentCode,
      windowCode: null,
      operation: 'ExecuteRuleDebugger',
      randomId: Math.random(),
      isAsync: false,
      params: params,
      success: function (rs) {
        if (success) success.call(_this, rs)
      },
      error: function (rs) {
        if (error) error.call(_this, rs)
      }
    }
    /*if(this.data&&this.data.hasOwnProperty("transactionId")){
            param["transactionId"] = this.data["transactionId"];
        }不能传递事务id，否则引起后台多个线程跑同一个事务，抛出异常*/
    remoteRequest.request(param)
  },

  dispatcher: {
    //执行系统返回值，发送给开发系统
    //规则执行前
    beforeRuleExecute: function (data) {
      var hook = aop.getDevHook(),
        _this = this
      hook.beforeRuleExecute(
        data.componentCode,
        null,
        data.ruleSetCode,
        data.ruleCode,
        jsonUtil.obj2json(data.businessData),
        'server',
        this.requestRuntime(),
        this.devRpcError()
      )
    },
    //规则执行后
    ruleExecuted: function (data) {
      var hook = aop.getDevHook(),
        _this = this
      hook.ruleExecuted(
        data.componentCode,
        null,
        data.ruleSetCode,
        data.ruleCode,
        jsonUtil.obj2json(data.businessData),
        'server',
        this.requestRuntime(),
        this.devRpcError()
      )
    },
    //异常处理
    handleException: function (data) {
      var hook = aop.getDevHook()
      hook.request(data)
    },
    //表达式执行后
    exeExpAfter: function (data) {
      var hook = aop.getDevHook()
      data.businessData = jsonUtil.obj2json(data.businessData)
      hook.request(data, this.requestRuntime(), this.devRpcError())
    },
    //数据更新后
    updateAfter: function (data) {
      var hook = aop.getDevHook()
      data.businessData = jsonUtil.obj2json(data.businessData)
      hook.request(data, this.requestRuntime(), this.devRpcError())
    }
  },

  request: {
    //开发系统返回值,发送给执行系统
    interrupt: function (rs) {
      //中断整个调试功能
      this.rpc({ type: 'interrupt' })
      aop.markDebugDisable()
    },
    continue: function (rs) {
      this.rpc({ type: 'continue' })
      //继续执行后台规则后,发起轮训请求
      this.start()
    },
    update: function (rs) {
      this.rpc(
        { type: 'update', data: jsonUtil.json2obj(rs.data) },
        this.requestDev,
        this.errorHandler
      )
    },
    exeExp: function (rs) {
      this.rpc(
        { type: 'exeExp', data: rs.data },
        this.requestDev,
        this.errorHandler
      )
    }
  }
}

return Request

export { _putAop, getHook, isInited, init, isDebugger, update, clear }
