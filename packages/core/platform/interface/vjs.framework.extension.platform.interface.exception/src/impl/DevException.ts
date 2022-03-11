import { Platform as i18n } from '@v-act/vjs.framework.extension.platform.interface.i18n'

import ExpectedException from './ExpectedException'

class DevException extends ExpectedException {
  getClassName() {
    return 'DevException'
  }
  /**
   * 异常标题
   * */
  getTitle() {
    return i18n.get('错误', '环境异常弹框的标题')
  }
  /**
   * 异常弹框顶部信息
   * */
  getMsgHeader() {
    return i18n.get('环境异常', '环境异常弹框的顶部描述信息')
  }
}

export default DevException
