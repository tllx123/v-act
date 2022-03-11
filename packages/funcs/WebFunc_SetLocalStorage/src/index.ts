/**
 * 设置cookie
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
const vds = { object }

const main = function (name:string, value:string) {
  var set_name = 'toone_v3_mobile_localStorage_itemName_' + name
  if (vds.object.isUndefOrNull(name)) throw new Error('cookie名称为空，请检查')
  if (vds.object.isUndefOrNull(value)) throw new Error('cookie值为空，请检查')
  try {
    if (window.localStorage) {
      localStorage.setItem(set_name, value)
      return true
    } else {
      // Cookie.write(set_name, value);
      return false
    }
  } catch (e) {
    return false
  }
}
export { main }
