import { DateFormatUtil as dateFormatUtil } from '@v-act/vjs.framework.extension.util'
let undefined

exports.initModule = function (sb) {}

let main = function (param) {
  let df = dateFormatUtil.newInstance('yyyy-MM-dd HH:mm:ss')
  return df.format(new Date())
}

export { main }
