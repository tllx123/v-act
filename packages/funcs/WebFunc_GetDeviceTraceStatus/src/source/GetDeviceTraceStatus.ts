import { Baidutrace as BaiduTrace } from '@v-act/vjs.framework.extension.platform.services.native.mobile.baidutrace'

//主入口(必须有)
const main = function () {
  let result = BaiduTrace.getGatherState()
  return result
}

export { main }
