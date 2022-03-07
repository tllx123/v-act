import { platform as i18n } from '@v-act/vjs.framework.extension.platform.interface.i18n'
import { Log as log } from '@v-act/vjs.framework.extension.util.logutil'

import * as Exception from './impl/Exception'
import * as callCommandService from './util/CallCommand'

let jsonUtil, sandbox

let ServiceException = function (message, e) {
  Exception.apply(this, arguments)
}

export function initModule(sandbox) {}

ServiceException.prototype = {
  initModule: function (sandbox) {
    sb = sandbox
    var Extend = require('vjs/framework/extension/platform/interface/exception/util/Extend')
    Extend.extend(ServiceException, Exception, sb)
  },

  getClassName: function () {
    return 'ServiceException'
  },

  handling: function () {
    if (this.isInApp()) {
      alert(this.showMessage, false)
      log.error('ServiceException:' + this.message)
      log.error(this.getStackTrace())
      throw this
    } else {
      let params = {
        title: i18n.get('错误', '服务端异常弹框提示的标题'),
        msgHeader: i18n.get('服务端异常', '服务端异常弹框头部的信息'),
        msg: this.message,
        detail: this.getStackTrace()
      }
      callCommandService.showDialog(params)
      callCommandService.callCommand(params)
      throw this
    }
  }
}

return ServiceException

export {
  _getHandler,
  create,
  getExceptionHtml,
  handle,
  isException,
  onBeforeHandler,
  onHandleFunction
}
