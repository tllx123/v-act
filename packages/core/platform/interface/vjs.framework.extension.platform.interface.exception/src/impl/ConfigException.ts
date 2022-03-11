import { Platform as i18n } from '@v-act/vjs.framework.extension.platform.interface.i18n'

import { ExceptionJsonArg } from './Exception'
import ExpectedException from './ExpectedException'

class ConfigException extends ExpectedException {
  constructor(
    message: string,
    e: Error,
    errInfo: { [key: string]: any },
    json: ExceptionJsonArg
  ) {
    super(message, e, errInfo, json)
  }

  getClassName() {
    return 'ConfigException'
  }

  /**
   * 异常标题
   * */
  getTitle() {
    return i18n.get('错误', '配置异常弹框的标题')
  }
  /**
   * 异常弹框顶部信息
   * */
  getMsgHeader() {
    return i18n.get('配置异常', '配置弹框的顶部描述信息')
  }
}

export default ConfigException
