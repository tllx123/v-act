import { Platform as i18n } from '@v-act/vjs.framework.extension.platform.interface.i18n'

import * as ExpectedException from './ExpectedException'

let sandbox

let ConfigException = function (message, e, errInfo, json) {
  ExpectedException.call(this, message, e, errInfo, json)
}

const initModule = function (sandbox) {}

ConfigException.prototype = {
  initModule: function (sandbox) {
    var Extend = require('vjs/framework/extension/platform/interface/exception/util/Extend')
    Extend.extend(ConfigException, ExpectedException, sandbox)
  },

  getClassName: function () {
    return 'ConfigException'
  },

  /**
   * 异常标题
   * */
  getTitle: function () {
    return i18n.get('错误', '配置异常弹框的标题')
  },
  /**
   * 异常弹框顶部信息
   * */
  getMsgHeader: function () {
    return i18n.get('配置异常', '配置弹框的顶部描述信息')
  }
}
export default ConfigException
