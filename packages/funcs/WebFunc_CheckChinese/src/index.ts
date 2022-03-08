/**
 *	中文检查 检查指定字符串是否包含中文字符
 *  代码示例:CheckChinese('sadf测试sd是否包含f中asdf文asdf') 返回值为 true
 *  参数数量:1
 *  参数1(字符串类型)
 *  返回值为布尔型
 */
var main = function (checkStr) {
  if (undefined == checkStr || null == checkStr) return false
  else {
    checkStr = checkStr + ''
    var checkret = checkStr.match(/[\u4e00-\u9fa5]/)
    return checkret != null
  }
}
export { main }
