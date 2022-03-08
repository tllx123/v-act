/**
 * 转换 代码示例:Convert(3,2)返回值为'3' 参数数量:2 参数1(各种类型)--传入的数据,参数2(整数类型)--转换的类型[1-数字,2-字符串,3-时间,4-布尔值] 返回值为不确定的类型
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as number from '@v-act/vjs.framework.extension.platform.services.integration.vds.number'
import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'
const vds = { object, number, exception }

var main = function (content, type) {
  var result = false
  // 传入参数不能为空
  if (vds.object.isUndefOrNull(type)) {
    throw vds.exception.newConfigException('传入转换类型为空，请检查')
  } else {
    content = vds.object.isUndefOrNull(content) ? content : '' + content
    // 转换类型必须为整数类型
    if (!vds.number.isInteger(type))
      throw vds.exception.newConfigException('转换类型不是整数，请检查')
    else {
      // 转换为数字,传入数据必须是数字
      if (type == 1) {
        if (vds.object.isUndefOrNull(content)) return 0
        try {
          result = parseFloat(content)
        } catch (e) {
          throw vds.exception.newConfigException(
            '传入数据' + content + '无法转为数字，请检查'
          )
        }
      }
      // 转换为字符串,传入数据不为空即可
      else if (type == 2) {
        if (vds.object.isUndefOrNull(content)) return ''

        result = content
      }
      // 转换为布尔值
      else if (type == 3) {
        if (vds.object.isUndefOrNull(content)) return false

        content = content.toLowerCase()
        if (
          content == 'false' ||
          content == '' ||
          content == 'null' ||
          content == 'undefined' ||
          content == 'nan' ||
          content == '0'
        )
          result = false
        else result = true
      } else
        throw vds.exception.newConfigException(
          '转换类型只能为[1-数字,2-字符串,3-布尔值]，请检查'
        )
    }
  }
  return result
}
export { main }
