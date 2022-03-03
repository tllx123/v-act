import { platform as i18n } from '@v-act/vjs.framework.extension.platform.interface.i18n'
import * as ExpectedException from './impl/ExpectedException'
import { log as log } from '@v-act/vjs.framework.extension.util'
import * as callCommandService from './util/CallCommand'
import { platform as i18n } from '@v-act/vjs.framework.extension.platform.interface.i18n'

let undefined
let undefined
let sandbox

let BusinessException = function (message, e) {
  ExpectedException.call(this, message, e)
}

exports.initModule = function (sandbox) {}

BusinessException.prototype = {
  initModule: function (sandbox) {
    var Extend = require('vjs/framework/extension/platform/interface/exception/util/Extend')
    Extend.extend(BusinessException, ExpectedException, sandbox)
  },

  getClassName: function () {
    return 'BusinessException'
  },

  handling: function () {
    if (this.isInApp()) {
      alert(this.message)
      log.error('BusinessException:' + this.message)
      log.error(this.getStackTrace())
    } else {
      let title = i18n.get('错误', '业务异常弹框的标题')
      let msgHeader = i18n.get('业务异常', '业务异常弹框的顶部描述信息')
      let params = {
        title: title,
        msgHeader: msgHeader,
        msg: this.message,
        detail: this.getStackTrace()
      }
      callCommandService.showDialog(params)
      callCommandService.callCommand(params)
    }
  }
}
return BusinessException

export {
  create,
  isException,
  handle,
  getExceptionHtml,
  onBeforeHandler,
  onHandleFunction,
  _getHandler
}
