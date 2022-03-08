import { Platform as i18n } from '@v-act/vjs.framework.extension.platform.interface.i18n'
import { Log as log } from '@v-act/vjs.framework.extension.util.logutil'

import * as ExpectedException from './ExpectedException'
import * as callCommandService from '../util/CallCommand'

let RequestException = function (message, e) {
  ExpectedException.apply(this, arguments)
}

export function initModule(sandbox) {}

RequestException.prototype = {
  initModule: function (sandbox) {
    sb = sandbox
    var Extend = require('vjs/framework/extension/platform/interface/exception/util/Extend')
    Extend.extend(RequestException, ExpectedException, sb)
  },

  getClassName: function () {
    return 'RequestException'
  },

  handling: function () {
    if (this.isInApp()) {
      alert(this.message)
      log.error('RequestException:' + this.message)
      log.error(this.getStackTrace())
    } else {
      let params = {
        title: i18n.get('错误', '请求异常弹框的标题'),
        msgHeader: i18n.get('请求异常', '请求异常弹框的头部信息'),
        msg: this.message,
        detail: this.getStackTrace()
      }
      callCommand.showDialog(params)
      callCommandService.callCommand(params)
    }
  }
}

return RequestException
export {
  _getHandler,
  create,
  getExceptionHtml,
  handle,
  isException,
  onBeforeHandler,
  onHandleFunction
}
