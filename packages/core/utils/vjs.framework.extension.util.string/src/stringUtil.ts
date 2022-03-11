const anchor = function (str: string, anchorname: string) {
  return str.anchor(anchorname)
}

const big = function (str: string) {
  return str.big()
}

/**
 * 显示闪动的字符串(IE不支持此功能)
 */
let blink = function (str: string) {
  return str.blink()
}

/**
 * 把字符串显示为粗体
 */
let bold = function (str: string) {
  return str.bold()
}

/**
 * @param {String} str 字符串
 * @param {Integer} index 下标
 * @desc 返回指定位置的字符
 * @return String
 */
let charAt = function (str: string, index: number) {
  return str.charAt(index)
}

/**
 * 返回指定位置的字符的 Unicode 编码。这个返回值是 0 - 65535 之间的整数。
 */
let charCodeAt = function (str: string, index: number) {
  return str.charCodeAt(index)
}

/**
 * 用于连接两个或多个字符串。
 */
let concat = function (str1: string, str2: string) {
  return str1.concat(str2)
}

/**
 * 把字符串显示为打字机字体
 */
let fixed = function (str: string) {
  return str.fixed()
}

/**
 * 按照指定的颜色来显示字符串
 */
let fontcolor = function (str: string, color: string) {
  return str.fontcolor(color)
}

/**
 * 按照指定的尺寸来显示字符串
 */
let fontsize = function (str: string, size: number) {
  return str.fontsize(size)
}

/**
 * 接受一个指定的 Unicode 值，然后返回一个字符串
 * String.fromCharCode(numX,numX,...,numX)
 * str：numX,numX,...,numX
 */
let fromCharCode = function (str: Array<number>) {
  return String.fromCharCode(...str)
}

/**
 * 返回某个指定的字符串值在字符串中首次出现的位置。
 * searchvalue 必需。规定需检索的字符串值。
 * fromindex 可选的整数参数。规定在字符串中开始检索的位置。它的合法取值是 0 到 str.length - 1。如省略该参数，则将从字符串的首字符开始检索。
 */
let indexOf = function (str: string, searchvalue: string, fromindex?: number) {
  return str.indexOf(searchvalue, fromindex)
}

/**
 * 把字符串显示为斜体
 */
let italics = function (str: string) {
  return str.italics()
}

/**
 * 返回某个指定的字符串值在字符串中首次出现的位置(从后向前)。 searchvalue 必需。规定需检索的字符串值。 fromindex
 * 可选的整数参数。规定在字符串中开始检索的位置。它的合法取值是 0 到 str.length - 1。如省略该参数，则将从字符串的首字符开始检索。
 */
let lastIndexOf = function (
  str: string,
  searchvalue: string,
  fromindex?: number
) {
  return str.lastIndexOf(searchvalue, fromindex)
}

/**
 * 把字符串显示为超链接
 * url 必需。规定要链接的 URL
 */
let link = function (str: string, url: string) {
  return str.link(url)
}

/**
 * 用本地特定的顺序来比较两个字符串。
 */
let localeCompare = function (str: string, target: string) {
  return str.localeCompare(target)
}

/**
 * 可在字符串内检索指定的值，或找到一个或多个正则表达式的匹配
 * @searchvalue 指定的值或者一个或多个正则表达式
 * 该方法类似 indexOf() 和 lastIndexOf()，但是它返回指定的值，而不是字符串的位置。
 */
let match = function (str: string, searchvalue: RegExp) {
  return str.match(searchvalue)
}

/**
 * 在字符串中用一些字符替换另一些字符，或替换一个与正则表达式匹配的子串。
 * regexp/substr 必需。规定子字符串或要替换的模式的 RegExp 对象。
 * 请注意，如果该值是一个字符串，则将它作为要检索的直接量文本模式，而不是首先被转换为 RegExp 对象。
 * replacement 必需。一个字符串值。规定了替换文本或生成替换文本的函数。
 */
let replace = function (str: string, substr: string, replacement: string) {
  return str.replace(substr, replacement)
}

/**
 * 用于检索字符串中指定的子字符串，或检索与正则表达式相匹配的子字符串。
 * regexp 该参数可以是需要在 stringObject 中检索的子串，也可以是需要检索的 RegExp 对象。
 * 注释：要执行忽略大小写的检索，请追加标志 i。
 */
let search = function (str: string, regexp: RegExp) {
  return str.search(regexp)
}

/**
 * 提取字符串的某个部分，并以新的字符串返回被提取的部分。 start
 * 要抽取的片断的起始下标。如果是负数，则该参数规定的是从字符串的尾部开始算起的位置。也就是说，-1 指字符串的最后一个字符，-2
 * 指倒数第二个字符，以此类推。 end 紧接着要抽取的片段的结尾的下标。若未指定此参数，则要提取的子串包括 start
 * 到原字符串结尾的字符串。如果该参数是负数，那么它规定的是从字符串的尾部开始算起的位置。
 */
let slice = function (str: string, start?: number, end?: number) {
  return str.slice(start, end)
}

/**
 * 把字符串显示为小号字
 */
let small = function (str: string) {
  return str.small()
}

/**
 * 把一个字符串分割成字符串数组
 * separator 必需。字符串或正则表达式，从该参数指定的地方分割 stringObject.
 * howmany 可选。该参数可指定返回的数组的最大长度。如果设置了该参数，返回的子串不会多于这个参数指定的数组。如果没有设置该参数，整个字符串都会被分割，不考虑它的长度。
 * 如果把空字符串 ("") 用作 separator，那么 stringObject 中的每个字符之间都会被分割。
 * 注释：String.split() 执行的操作与 Array.join 执行的操作是相反的。
 */
let split = function (
  str: string,
  separator: string | RegExp,
  howmany?: number
) {
  return str.split(separator, howmany)
}

/**
 * 显示加删除线的字符串
 */
let strike = function (str: string) {
  return str.strike()
}

/**
 * 把字符串显示为下标
 */
let sub = function (str: string) {
  return str.sub()
}

/**
 * 可在字符串中抽取从 start 下标开始的指定数目的字符
 * start 必需。要抽取的子串的起始下标。必须是数值。如果是负数，那么该参数声明从字符串的尾部开始算起的位置。也就是说，-1 指字符串中最后一个字符，-2 指倒数第二个字符，以此类推。
 * length 可选。子串中的字符数。必须是数值。如果省略了该参数，那么返回从 stringObject 的开始位置到结尾的字串。
 */
let substr = function (str: string, start: number, length: number) {
  return str.substr(start, length)
}

/**
 * 在字符串中抽取从 start 下标开始的指定数目的字符。
 * start 必需。一个非负的整数，规定要提取的子串的第一个字符在stringObject 中的位置
 * stop 可选。一个非负的整数，比要提取的子串的最后一个字符在 stringObject 中的位置多 1。如果省略该参数，那么返回的子串会一直到字符串的结尾。
 */
let substring = function (str: string, start: number, stop: number) {
  return str.substring(start, stop)
}

/**
 * 把字符串显示为上标
 */
let sup = function (str: string) {
  return str.sup()
}

/**
 * 把字符串转换为小写
 */
let toLocaleLowerCase = function (str: string) {
  return str.toLocaleLowerCase()
}

/**
 * 把字符串转换为大写
 */
let toLocaleUpperCase = function (str: string) {
  return str.toLocaleUpperCase()
}

/**
 * 用于把字符串转换为大写。
 */
let toUpperCase = function (str: string) {
  return str.toUpperCase()
}

/**
 * 用于把字符串转换为小写。
 */
let toLowerCase = function (str: string) {
  return str.toLowerCase()
}

/**
 * 去除右边空格。
 */
let rtrim = function (str: string) {
  return str.replace(/\s*$/g, '')
}

/**
 * 去除右边空格。
 */
let ltrim = function (str: string) {
  return str.replace(/^\s*/g, '')
}

/**
 * 去除字符串左右两侧的空格
 */
let trim = function (str: string) {
  return str.replace(/(^\s*)|(\s*$)/g, '')
}

/**
 * 判断参数是否为空
 */
let isEmpty = function (str: string | number) {
  return undefined == str || null == str || String(str) == ''
}

let isInArray = function (str: string, strArray: Array<string>) {
  if (str == null || strArray == null) return false
  for (let i = 0; i < strArray.length; i++) {
    if (str == strArray[i]) return true
  }
  return false
}

let startsWith = function (prefix: string, str: string) {
  if (
    prefix == null ||
    prefix == '' ||
    str.length == 0 ||
    prefix.length > str.length
  )
    return false
  return str.substr(0, prefix.length) == prefix
}

let endsWith = function (sufix: string, str: string) {
  if (
    sufix == null ||
    sufix == '' ||
    str.length == 0 ||
    sufix.length > str.length
  ) {
    return false
  }
  return str.substr(str.length - sufix.length) == sufix
}

/**
 *按位置替换字符
 *@param origStr 原始字符串
 *@param replaceStr 替换的字符串
 *@param beginIndex 替换开始下标（包含,从0开始，必填不能忽略）
 *@param endIndex 替换结束下标（不包含,从0开始,可以忽略，忽略时表示替换到结尾）
 */
let replaceByIndex = function (
  origStr: string,
  replaceStr: string,
  beginIndex: number,
  endIndex?: number
) {
  if (origStr == null || origStr == '') return origStr
  if (beginIndex < 0) beginIndex = 0
  if (!endIndex || endIndex < 0 || endIndex > origStr.length)
    endIndex = origStr.length

  let retStr = origStr
  if (beginIndex < endIndex && beginIndex >= 0 && endIndex <= origStr.length) {
    let s1 = origStr.substring(0, beginIndex)
    let s2 = origStr.substring(endIndex, origStr.length)

    retStr = s1 + replaceStr + s2
  }
  return retStr
}

let arrEntities: any = {
  '<': '&lt;',
  '>': '&gt;',
  ' ': '&nbsp;',
  '&': '&amp;',
  '"': '&quot;',
  '\r': '&nbsp;', //处理规则中设置了分割符为\r时，换为空格
  '\n': '<BR>' //处理规则中设置了分隔符为回车换行的时候，提示信息无法自动换行
}

const escapeHtml = function (str: string) {
  /* 数字以及布尔类型的不需要处理 */
  if (!str || typeof str == 'number' || typeof str == 'boolean') return str
  return str.replace(/(<|>|\s|&|\")/gi, function (all, t) {
    return arrEntities[t]
  })
}

export {
  anchor,
  big,
  escapeHtml,
  blink,
  bold,
  charAt,
  charCodeAt,
  concat,
  fixed,
  fontcolor,
  fontsize,
  fromCharCode,
  indexOf,
  italics,
  lastIndexOf,
  link,
  localeCompare,
  match,
  replace,
  search,
  slice,
  small,
  split,
  strike,
  sub,
  substr,
  substring,
  sup,
  toLocaleLowerCase,
  toLocaleUpperCase,
  toUpperCase,
  toLowerCase,
  rtrim,
  ltrim,
  trim,
  isEmpty,
  isInArray,
  startsWith,
  endsWith,
  replaceByIndex
}
