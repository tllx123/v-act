import { platform as i18n } from '@v-act/vjs.framework.extension.platform.interface.i18n'
import * as Exception from './impl/Exception'
import { log as log } from '@v-act/vjs.framework.extension.util'
import * as callCommandService from './util/CallCommand'
import { platform as i18n } from '@v-act/vjs.framework.extension.platform.interface.i18n'

let undefined
let undefined

let ExpectedException = function (message, e) {
  Exception.apply(this, arguments)
}

exports.initModule = function (sandbox) {}

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
  create,
  isException,
  handle,
  getExceptionHtml,
  onBeforeHandler,
  onHandleFunction,
  _getHandler
}
