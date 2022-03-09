import { Platform as i18n } from '@v-act/vjs.framework.extension.platform.interface.i18n'
import { Log as log } from '@v-act/vjs.framework.extension.util.logutil'

import * as Exception from './Exception'
import * as callCommandService from '../util/CallCommand'

let NetworkException = function (message, e) {
  Exception.apply(this, arguments)
}

export function initModule(sandbox) {}

NetworkException.prototype = {
  initModule: function (sandbox) {
    sb = sandbox
    var Extend = require('vjs/framework/extension/platform/interface/exception/util/Extend')
    Extend.extend(NetworkException, Exception, sb)
  },

  getClassName: function () {
    return 'NetworkException'
  },

  handling: function () {
    if (this.isInApp()) {
      log.error('NetworkException:' + this.message)
      log.error(this.getStackTrace())
      throw this
    } else {
      let params = {
        title: i18n.get('错误', '网络异常弹框的标题'),
        msgHeader: i18n.get('网络异常', '网络异常弹框的顶部描述信息'),
        msg: this.message,
        detail: this.getStackTrace()
      }
      callCommandService.showDialog(params)
      callCommandService.callCommand(params)
      throw this
    }
  }
}

return NetworkException

export {
  _getHandler,
  create,
  getExceptionHtml,
  handle,
  isException,
  onBeforeHandler,
  onHandleFunction
}