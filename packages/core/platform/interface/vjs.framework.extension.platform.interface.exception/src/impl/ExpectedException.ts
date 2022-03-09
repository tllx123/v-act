import { Platform as i18n } from '@v-act/vjs.framework.extension.platform.interface.i18n'
import { Log as log } from '@v-act/vjs.framework.extension.util.logutil'

import * as Exception from './Exception'
import * as callCommandService from '../util/CallCommand'

let ExpectedException = function (message, e) {
  Exception.apply(this, arguments)
}

export function initModule(sandbox) {}

ExpectedException.prototype = {
  initModule: function (sandbox) {
    var Extend = require('vjs/framework/extension/platform/interface/exception/util/Extend')
    Extend.extend(ExpectedException, Exception, sandbox)
  },

  getClassName: function () {
    return 'ExpectedException'
  },

  handling: function () {
    if (this.isInApp()) {
      log.error('ExpectedException:' + this.message)
      log.error(this.getStackTrace())
    } else {
      let params = {
        title: i18n.get('错误', '异常提示标题'),
        msgHeader: 'ExpectedException',
        msg: this.message,
        detail: this.getStackTrace()
      }
      callCommandService.showDialog(params)
      callCommandService.callCommand(params)
    }
  }
}

return ExpectedException

export {
  _getHandler,
  create,
  getExceptionHtml,
  handle,
  isException,
  onBeforeHandler,
  onHandleFunction
}
