const adapt = function (params: any) {
  let value = params.value
  //值如果为null则退出
  if (value == null) {
    return value
  }
  let temp = value
  if (typeof value != 'string') temp += ''
  // TODO 暂时不截取数据
  //		if (params.length && temp != '') {
  //			var len = getLength(temp);
  //			if (params.length < len)
  //				throw new Error("[StringDataAdaptor]值超长：值长度[" + len + "]，字段长度[" + params.length + "]");
  //		}
  //		temp = subString(temp, 0, params.length);
  return temp
}

let isCHS = function (str: string, index: number) {
  if (str.charCodeAt(index) > 255 || str.charCodeAt(index) < 0) return true
  else return false
}

let getLength = function (str: string) {
  let len = 0
  if (str) {
    for (let i = 0; i < str.length; i++) {
      if (isCHS(str, i)) len = len + 3
      else len++
    }
  }
  return len
}

let getChars = function (str: string) {
  let chars = new Array()
  for (let i = 0; i < str.length; i++) {
    chars[i] = [str.substr(i, 1), isCHS(str, i)]
  }
  return chars
}

let subString = function (str: string, start: number, length: number) {
  let end = start + length
  let len = 0
  let substr = ''
  let chars = getChars(str)
  for (let i = 0; i < str.length; i++) {
    if (chars[i][1]) len += 3
    else len++
    if (end < len) return substr
    else if (start < len) substr += chars[i][0]
  }
  return substr
}

export { adapt }
