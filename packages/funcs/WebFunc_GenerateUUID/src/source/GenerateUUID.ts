import { UUID as uuid } from '@v-act/vjs.framework.extension.util'
let undefined

exports.initModule = function (sb) {}

let main = function (param) {
  return uuid.generate()
}

export { main }
