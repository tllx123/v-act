/**
 *
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'

const vds = { object }

const main = function (str: string) {
  //@ts-ignore
  if (vds.object.isUndefOrNull(str)) return 0

  str = String(str)
  return str.length
}
export { main }
