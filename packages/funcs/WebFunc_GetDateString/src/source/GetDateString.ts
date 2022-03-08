import { SystemConstant as sysConstant } from '@v-act/vjs.framework.extension.platform.services.constant'

export function initModule(sb) {}

const main = function (param) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0,
    fromatStr = argsLen >= 1 ? args[0] : null

  return sysConstant.get({
    type: sysConstant.TYPES.CurrentTime,
    params: [fromatStr]
  })
}

export { main }
