import { SystemConstant as sysConstant } from '@v-act/vjs.framework.extension.platform.services.constant'

export function initModule(sb) {}

const main = function (param) {
  let result = sysConstant.get({
    type: sysConstant.TYPES.CurrentTime,
    params: ['yyyy-MM-dd HH:mm:ss']
  })

  return result
}

export { main }
