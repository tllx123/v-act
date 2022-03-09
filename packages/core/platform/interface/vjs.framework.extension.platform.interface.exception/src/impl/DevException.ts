import { platform as i18n } from '@v-act/vjs.framework.extension.platform.interface.i18n'
import * as ExpectedException from './impl/ExpectedException'
import { log as log } from '@v-act/vjs.framework.extension.util'
import * as callCommandService from './util/CallCommand'
import { platform as i18n } from '@v-act/vjs.framework.extension.platform.interface.i18n'
let sandbox

let DevException = function (message, e, errInfo, json) {
  ExpectedException.call(this, message, e, errInfo, json)
}

const initModule = function (sandbox) {}

DevException.prototype = {
  initModule: function (sandbox) {
    var Extend = require('vjs/framework/extension/platform/interface/exception/util/Extend')
    Extend.extend(DevException, ExpectedException, sandbox)
  },

  getClassName: function () {
    return 'DevException'
  },
  /**
   * 异常标题
   * */
  getTitle: function () {
    return i18n.get('错误', '环境异常弹框的标题')
  },
  /**
   * 异常弹框顶部信息
   * */
  getMsgHeader: function () {
    return i18n.get('环境异常', '环境异常弹框的顶部描述信息')
  }
}
return DevException

export {
  plupload,
  initModule,
  create,
  isException,
  isAcceptType,
  genError,
  getExceptionTypeByError,
  unSerialize,
  initModule,
  handle,
  getExceptionHtml,
  initModule,
  onBeforeHandler,
  onHandleFunction,
  _getHandler,
  initModule,
  initModule,
  initModule
}
