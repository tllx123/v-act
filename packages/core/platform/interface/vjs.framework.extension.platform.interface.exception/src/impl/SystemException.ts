import { Platform as i18n } from '@v-act/vjs.framework.extension.platform.interface.i18n'

import ExpectedException from './ExpectedException'

let sandbox

class SystemException extends ExpectedException {
  getClassName() {
    return 'SystemException'
  }

  /**
   * 异常标题
   * */
  getTitle() {
    return i18n.get('错误', '系统异常弹框的标题')
  }
  /**
   * 异常弹框顶部信息
   * */
  getMsgHeader() {
    return i18n.get('系统异常', '系统异常弹框的顶部描述信息')
  }
}
export default SystemException
