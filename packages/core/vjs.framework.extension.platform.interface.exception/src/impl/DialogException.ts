import { platform as i18n } from '@v-act/vjs.framework.extension.platform.interface.i18n'
import * as ExpectedException from './impl/ExpectedException'
import { log as log } from '@v-act/vjs.framework.extension.util'
import * as callCommandService from './util/CallCommand'
import { platform as i18n } from '@v-act/vjs.framework.extension.platform.interface.i18n'

let undefined
let undefined

let DialogException = function (message, e) {
  ExpectedException.call(this, message, e)
}

exports.initModule = function (sandbox) {}

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
  create,
  isException,
  handle,
  getExceptionHtml,
  onBeforeHandler,
  onHandleFunction,
  _getHandler
}
