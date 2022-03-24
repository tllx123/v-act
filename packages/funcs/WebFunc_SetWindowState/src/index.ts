//vds.import('vds.window.*')
import * as window from '@v-act/vjs.framework.extension.platform.services.integration.vds.window'
const vds = { window }
const main = function (param: any) {
  //获取函数传入的参数
  vds.window.setState(param)
}
export { main }
