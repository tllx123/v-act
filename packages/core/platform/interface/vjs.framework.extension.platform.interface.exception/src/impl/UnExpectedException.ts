import { platform as i18n } from '@v-act/vjs.framework.extension.platform.interface.i18n'
import * as Exception from './impl/Exception'
import { log as log } from '@v-act/vjs.framework.extension.util'
import * as callCommandService from './util/CallCommand'
import { platform as i18n } from '@v-act/vjs.framework.extension.platform.interface.i18n'

let undefined
let jsonUtil, sandbox
let undefined

let UnExpectedException = function (message, e) {
  this.showMessage = i18n.get(
    '系统内部错误，请联系系统管理员处理。',
    '未识别异常显示的信息'
  )
  Exception.apply(this, arguments)
}

exports.initModule = function (sandbox) {}

UnExpectedException.prototype = {
  initModule: function (sandbox) {
    sb = sandbox
    var Extend = require('vjs/framework/extension/platform/interface/exception/util/Extend')
    Extend.extend(UnExpectedException, Exception, sb)
  },

  getClassName: function () {
    return 'UnExpectedException'
  },

  handling: function () {
    if (this.isInApp()) {
      alert(this.showMessage, false)
      log.error('UnExpectedException:' + this.message)
      log.error(this.getStackTrace())
      throw this
    } else {
      let params = {
        title: i18n.get('错误', '未识别异常弹框提示的标题'),
        msgHeader: i18n.get('未识别异常', '未识别异常弹框头部的信息'),
        msg: this.message,
        detail: this.getStackTrace()
      }
      callCommandService.showDialog(params)
      callCommandService.callCommand(params)
      throw this
    }
  }
}
/**
 * desc 调用后台Command
 * value {String} 传到后台的值.
 * vjs
 * 		"vjs.framework.extension.util.log":null,
 * 		"vjs.framework.extension.platform.interface.scope":null
 * services
 * 		scopeManager = sb.getService("vjs.framework.extension.platform.interface.scope.ScopeManager");
 * 		remoteMethodAccessor = sandbox.getService("vjs.framework.extension.platform.services.operation.remote.RemoteMethodAccessor");
 * */
let callCommand = function (value, callback) {
  let scope = scopeManager.getScope()
  let sConfig = {
    isAsyn: false,
    componentCode: scope.getComponentCode(),
    windowCode: scope.getWindowCode(),
    ruleSetCode: 'FrontEndException',
    isRuleSetCode: false,
    commitParams: [
      {
        paramName: 'InParams',
        paramType: 'char',
        paramValue: value
      }
    ],
    afterResponse: callback
  }
  remoteMethodAccessor.invoke(sConfig)
}
/**
 * desc Json字符串转Json对象
 * inParams
 * vjs:
 * 		"vjs.framework.extension.util.json":null,
 * services:
 * 		jsonUtil = sandbox.getService("vjs.framework.extension.util.JsonUtil");
 * */
let convertJson = function (inParams) {
  let result = {}
  if (undefined != inParams) {
    result = jsonUtil.json2obj(inParams)
  }
  return result
}

return UnExpectedException

export {
  create,
  isException,
  handle,
  getExceptionHtml,
  onBeforeHandler,
  onHandleFunction,
  _getHandler
}
