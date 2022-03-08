/**
 *	在字符串中用一些字符替换另一些字符，或替换一个与正则表达式匹配的子串。
 *  代码示例:Replace('ab','b','a') 返回值为'aa'
 *  参数数量:3
 *  参数1(字符串类型)，参数2(字符串类型)，参数3(字符串类型)
 *  返回值为字符串类型
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as string from '@v-act/vjs.framework.extension.platform.services.integration.vds.string'
import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'
const vds = { object, string, exception }

const main = function (arg1, arg2, arg3, isRegexp) {
  if (vds.object.isUndefOrNull(arg1)) arg1 = ''

  if (vds.object.isUndefOrNull(arg2))
    throw vds.exception.newConfigException('被替换字符串为空，请检查')
  if (vds.object.isUndefOrNull(arg3))
    throw vds.exception.newConfigException('替换字符串为空，请检查')

  arg1 = String(arg1)
  arg2 = String(arg2)
  arg3 = String(arg3)

  if (isRegexp == true) {
    // try {
    //     eval("var re = /" + arg2 + "/g;");
    // } catch (e) {
    //     throw vds.exception.newConfigException("Replace函数的第2个参数需要正则表达式，请检查正则表达式是否合法：arg2=" + arg2 + ", " + e.message);
    // }
    // if(typeof(re) == "undefined"){
    //     var re = null;
    // }
    var re = new RegExp(arg2, 'g')
    arg1 = vds.string.replace(arg1, re, arg3)
  }
  // 替换所有匹配字符
  // arg1 = arg1.replaceAll(arg2, arg3);
  // replaceAll是sc加进去的函数，不适合所有场景使用
  else arg1 = arg1.split(arg2).join(arg3)

  return arg1
}
export { main }
