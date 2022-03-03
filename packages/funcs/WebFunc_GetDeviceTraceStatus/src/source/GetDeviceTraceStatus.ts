import { Baidutrace as BaiduTrace } from '@v-act/vjs.framework.extension.platform.services.native.mobile'
let undefined
exports.initModule = function (sb) {}

//主入口(必须有)
let main = function (param) {
  let result = BaiduTrace.getGatherState()
  return result
}

export { main }
