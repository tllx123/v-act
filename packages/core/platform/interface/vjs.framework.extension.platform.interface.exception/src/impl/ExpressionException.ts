import { Platform as i18n } from '@v-act/vjs.framework.extension.platform.interface.i18n'
import { Log as log } from '@v-act/vjs.framework.extension.util.logutil'

import * as ExpectedException from './ExpectedException'
import * as callCommandService from '../util/CallCommand'

let ExpressionException = function (message, e) {
  ExpectedException.apply(this, arguments)
}

export function initModule(sandbox) {}

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
  _getHandler,
  create,
  getExceptionHtml,
  handle,
  isException,
  onBeforeHandler,
  onHandleFunction
}
