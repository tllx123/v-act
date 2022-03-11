//import { EventManager as eventManager } from '@v-act/vjs.framework.extension.platform.interface.event'
/**
 *  关闭窗口页实现
 *  仅支持谷歌浏览器和IE浏览器
 *  火狐浏览器需要在浏览器地址栏输入 about:config, 在该列表中查找 dom.allow_scripts_to_close_windows，设置为 true 即可
 */
let closeWindowTab = function () {
  window.close()
}

export { closeWindowTab }
