import { Baidutrace as BaiduTrace } from '@v-act/vjs.framework.extension.platform.services.native.mobile'

export function initModule(sb) {}

//主入口(必须有)
const main = function (param) {
  let result = BaiduTrace.getGatherState()
  return result
}

export { main }
