import { Environment as environment } from '@v-act/vjs.framework.extension.platform.interface.environment'

export function initModule(sb) {}

const main = function (param) {
  return environment.getContextPath()
}

export { main }
