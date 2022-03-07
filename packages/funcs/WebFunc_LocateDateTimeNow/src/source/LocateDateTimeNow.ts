import { DateTimeUtil as dateFormatUtil } from '@v-act/vjs.framework.extension.util.date'

const main = function (param) {
  let df = dateFormatUtil.newInstance('yyyy-MM-dd HH:mm:ss')
  return df.format(new Date())
}

export { main }
