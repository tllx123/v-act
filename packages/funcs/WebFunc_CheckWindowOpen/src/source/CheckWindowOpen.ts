import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
//加载模块
let undefined

exports.initModule = function (sb) {}

//主入口(必须有)
let main = function (componentCode, windowCode) {
  if (componentCode && windowCode) {
    let windosInstansIds = scopeManager._getInstanceIds(
      componentCode,
      windowCode
    )
    if (windosInstansIds.length > 0) {
      return true
    } else {
      return false
    }
  } else {
    throw new Error(
      '函数【CheckWindowOpen】入参为空，请指定构件编号和窗体编号!'
    )
  }
}
export { main }
