import { platform as i18n } from '@v-act/vjs.framework.extension.platform.interface.i18n'
import * as Exception from './impl/Exception'
import { log as log } from '@v-act/vjs.framework.extension.util'
import * as callCommandService from './util/CallCommand'
import { platform as i18n } from '@v-act/vjs.framework.extension.platform.interface.i18n'

let undefined
let undefined

let RuleBreakException = function (message, e) {
  Exception.apply(this, arguments)
}

exports.initModule = function (sandbox) {}

RuleBreakException.prototype = {
  initModule: function (sandbox) {
    sb = sandbox
    var Extend = require('vjs/framework/extension/platform/interface/exception/util/Extend')
    Extend.extend(RuleBreakException, Exception, sb)
  },

  getClassName: function () {
    return 'RuleBreakException'
  },

  handling: function () {
    if (this.isInApp()) {
      log.error('RuleBreakException:' + this.message)
      log.error(this.getStackTrace())
    } else {
      let params = {
        title: i18n.get('错误', '规则异常弹框的标题信息'),
        msgHeader: 'RuleBreakException',
        msg: this.message,
        detail: this.getStackTrace()
      }
      callCommand.showDialog(params)
      callCommandService.callCommand(params)
    }
  }
}

return RuleBreakException

export {
  create,
  isException,
  handle,
  getExceptionHtml,
  onBeforeHandler,
  onHandleFunction,
  _getHandler
}
