import { SystemConstant as sysConstant } from '@v-act/vjs.framework.extension.platform.services.constant'
let undefined

exports.initModule = function (sb) {}

let main = function (param) {
  return sysConstant.get({
    type: sysConstant.TYPES.CurrentTime,
    params: ['HH:mm']
  })
}

export { main }
