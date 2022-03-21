/**
 *	ReplaceByIndex(origStr, replaceStr, beginIndex, endIndex)
 *按位置替换字符串。替换位于指定位置范围的字符串。索引超出指定范围的不变,beginIndex<endIndex并且为有效范围才替换。
 *
 *代码示例:ReplaceByIndex("abcdefg","12345",0,3) 返回:"12345defg"
 *ReplaceByIndex("abcdefg","12345",4,3) 返回:"abcdefg"
 *ReplaceByIndex("abcdefg","12345",1,3) 返回:"a12345defg"
 *
 *参数1:要替换的原始字符串（必填）
 *参数2:需要替换字符串（必填）
 *参数3:替换开始下标（包含,从0开始，必填不能忽略）
 *参数4:替换结束下标（不包含,从0开始,可以忽略，忽略时表示替换到结尾）
 *返回值为字符串类型。
 *
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as string from '@v-act/vjs.framework.extension.platform.services.integration.vds.string'
import * as number from '@v-act/vjs.framework.extension.platform.services.integration.vds.number'
const vds = { object, string, number }

const main = function (
  origStr: string,
  replaceStr: string,
  beginIndex: number,
  endIndex: number
) {
  if (vds.object.isUndefOrNull(origStr)) return ''
  if (vds.object.isUndefOrNull(replaceStr))
    throw new Error('替换字符串为空，请检查')
  if (vds.object.isUndefOrNull(beginIndex))
    throw new Error('替换开始索引为空，请检查')
  if (!vds.number.isInteger(beginIndex))
    throw new Error('替换开始索引必须为整数，请检查')
  if (!vds.object.isUndefOrNull(endIndex) && !vds.number.isInteger(endIndex))
    throw new Error('替换结束索引必须为整数，请检查')

  origStr = String(origStr)
  replaceStr = String(replaceStr)

  return vds.string.replaceByIndex(origStr, replaceStr, beginIndex, endIndex)
}
export { main }
