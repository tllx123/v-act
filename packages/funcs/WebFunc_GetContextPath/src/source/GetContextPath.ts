import { Environment as environment } from '@v-act/vjs.framework.extension.platform.interface.environment'
let undefined

exports.initModule = function (sb) {}

let main = function (param) {
  return environment.getContextPath()
}

export { main }
