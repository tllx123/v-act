import { Math as mathUtil } from '@v-act/vjs.framework.extension.util'
let undefined

exports.initModule = function (sb) {}

let main = function (param) {
  let result = false,
    args = param.getArgs(),
    argsLen = args ? args.length : 0,
    content = argsLen >= 1 ? args[0] : null,
    type = argsLen >= 2 ? args[1] : null

  // 传入参数不能为空
  if (mathUtil.isEmpty(type)) {
    throw new Error('传入转换类型为空，请检查')
  } else {
    content = mathUtil.isEmpty(content) ? content : '' + content
    // 转换类型必须为整数类型
    if (!mathUtil.judgeInt(type)) throw new Error('转换类型不是整数，请检查')
    else {
      // 转换为数字,传入数据必须是数字
      if (type == 1) {
        if (mathUtil.isEmpty(content)) return 0

        try {
          result = parseFloat(content)
        } catch (e) {
          throw new Error('传入数据' + content + '无法转为数字，请检查')
        }
      }
      // 转换为字符串,传入数据不为空即可
      else if (type == 2) {
        if (mathUtil.isEmpty(content)) return ''

        result = content
      }
      // 转换为布尔值
      else if (type == 3) {
        if (mathUtil.isEmpty(content)) return false

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
      } else throw new Error('转换类型只能为[1-数字,2-字符串,3-布尔值]，请检查')
    }
  }
  return result
}

export { main }
