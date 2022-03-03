import { platform as i18n } from '@v-act/vjs.framework.extension.platform.interface.i18n'
import * as ExpectedException from './impl/ExpectedException'
import { log as log } from '@v-act/vjs.framework.extension.util'
import { platform as i18n } from '@v-act/vjs.framework.extension.platform.interface.i18n'
import * as callCommandService from './util/CallCommand'

let undefined
let undefined

let ExpressionException = function (message, e) {
  ExpectedException.apply(this, arguments)
}

exports.initModule = function (sandbox) {}

ExpressionException.prototype = {
  initModule: function (sandbox) {
    var Extend = require('vjs/framework/extension/platform/interface/exception/util/Extend')
    Extend.extend(ExpressionException, ExpectedException, sandbox)
  },

  getClassName: function () {
    return 'ExpressionException'
  },

  handling: function () {
    if (this.isInApp()) {
      alert(
        i18n.get('系统内部错误，请联系系统管理员处理。', '表达式异常提示的信息')
      )
      log.error(
        i18n.get(
          'ExpressionException:表达式执行异常，请检查相关表达式配置。',
          '表达式异常打印的日志信息'
        ) + this.message
      )
      log.error(this.getStackTrace())
    } else {
      let params = {
        title: i18n.get('错误', '表达式异常弹框的标题'),
        msgHeader: i18n.get(
          '系统内部错误，请联系系统管理员处理',
          '表达式异常的顶部提示标题'
        ),
        msg: this.message,
        detail: this.getStackTrace()
      }
      callCommandService.showDialog(params)
      callCommandService.callCommand(params)
    }
  }
}

return ExpressionException

export {
  create,
  isException,
  handle,
  getExceptionHtml,
  onBeforeHandler,
  onHandleFunction,
  _getHandler
}
