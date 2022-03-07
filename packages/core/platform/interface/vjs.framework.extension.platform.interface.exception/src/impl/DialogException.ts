import { platform as i18n } from '@v-act/vjs.framework.extension.platform.interface.i18n'
import { Log as log } from '@v-act/vjs.framework.extension.util.logutil'

import * as ExpectedException from './impl/ExpectedException'
import * as callCommandService from './util/CallCommand'

let DialogException = function (message, e) {
  ExpectedException.call(this, message, e)
}

export function initModule(sandbox) {}

DialogException.prototype = {
  initModule: function (sandbox) {
    var Extend = require('vjs/framework/extension/platform/interface/exception/util/Extend')
    Extend.extend(DialogException, ExpectedException, sandbox)
  },

  getClassName: function () {
    return 'DialogException'
  },

  handling: function () {
    if (this.isInApp()) {
      alert(this.message)
      log.error('DialogException:' + this.message)
      log.error(this.getStackTrace())
    } else {
      try {
        let params = {
          title: i18n.get('错误', '弹框异常的标题'),
          msgHeader: this.message,
          msg: '',
          detail: this.getStackTrace()
        }
        callCommandService.showDialog(params)
        callCommandService.callCommand(params)
      } catch (e) {}
      throw this
    }
  }
}

return DialogException
export {
  _getHandler,
  create,
  getExceptionHtml,
  handle,
  isException,
  onBeforeHandler,
  onHandleFunction
}
