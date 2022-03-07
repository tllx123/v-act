import { Platform as i18n } from '@v-act/vjs.framework.extension.platform.interface.i18n'
import { Log as log } from '@v-act/vjs.framework.extension.util.logutil'

import * as ExpectedException from './ExpectedException'
import * as callCommandService from '../util/CallCommand'

let sandbox

let BusinessException = function (message, e) {
  ExpectedException.call(this, message, e)
}

export function initModule(sandbox) {}

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
  _getHandler,
  create,
  getExceptionHtml,
  handle,
  isException,
  onBeforeHandler,
  onHandleFunction
}
