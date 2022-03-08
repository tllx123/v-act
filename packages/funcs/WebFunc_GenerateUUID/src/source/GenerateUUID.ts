import { uuid } from '@v-act/vjs.framework.extension.util.uuid'

export function initModule(sb) {}

const main = function (param) {
  return uuid.generate()
}

export { main }
