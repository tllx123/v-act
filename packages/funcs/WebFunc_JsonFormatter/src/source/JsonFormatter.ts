exports.initModule = function () {}

let main = function (json) {
  if (!json) {
    return null
  }
  let value = doValue(json)
  return jsonFormatter(value)
}

/**
 * 处理特殊的符号，
 * 1. 去掉空格
 * 2. 判断值是否以“｛” 或者 "[" 开头
 */
let doValue = function (value) {
  if (value) {
    if (isString(value)) {
      value = value.replace(/(^\s*)|(\s*$)/g, '')
      if (value.indexOf('[') == 0) {
        value = eval(value)
      } else if (value.indexOf('{') == 0) {
        value = eval('(' + value + ')')
      }
    }
  }
  return value
}

let isString = function (value) {
  return typeof value == 'string' || value.constructor == String
}

let jsonFormatter = function (json) {
  //写对象
  let __writeObj = function (obj, level, isInArray) {
    //此对象是否在一个集合内
    //如果为空，直接输出null
    if (obj == null) {
      return 'null'
    }
    //为普通类型，直接输出值
    if (
      obj.constructor == Number ||
      obj.constructor == Date ||
      obj.constructor == String ||
      obj.constructor == Boolean
    ) {
      let v = obj.toString()
      let tab = isInArray ? __repeatStr('\t', level - 1) : ''
      if (obj.constructor == String || obj.constructor == Date) {
        //时间格式化只是单纯输出字符串，而不是Date对象
        return tab + ('"' + v + '"')
      } else if (obj.constructor == Boolean) {
        return tab + v.toLowerCase()
      } else {
        return tab + v
      }
    }
    //写Json对象，缓存字符串
    let currentObjStrings = []
    //遍历属性
    for (let name in obj) {
      let temp = []
      //格式化Tab
      let paddingTab = __repeatStr('\t', level)
      temp.push(paddingTab)
      //写出属性名
      temp.push('"' + name + '" : ')
      let val = obj[name]
      if (val == null) {
        temp.push('null')
      } else {
        let c = val.constructor
        if (c == Array) {
          //如果为集合，循环内部对象
          temp.push('\n' + paddingTab + '[' + '\n')
          let levelUp = level + 2
          //层级+2
          let tempArrValue = []
          //集合元素相关字符串缓存片段
          for (let i = 0; i < val.length; i++) {
            //递归写对象
            tempArrValue.push(__writeObj(val[i], levelUp, true))
          }
          temp.push(tempArrValue.join(',' + '\n'))
          temp.push('\n' + paddingTab + ']')
        } else if (c == Function) {
          temp.push('[Function]')
        } else {
          //递归写对象
          temp.push(__writeObj(val, level + 1))
        }
      }
      //加入当前对象“属性”字符串
      currentObjStrings.push(temp.join(''))
    }
    return (
      (level > 1 && !isInArray ? '\n' : '') + //如果Json对象是内部，就要换行格式化
      __repeatStr('\t', level - 1) +
      '{' +
      '\n' + //加层次Tab格式化
      currentObjStrings.join(',' + '\n') + //串联所有属性值
      '\n' +
      __repeatStr('\t', level - 1) +
      '}'
    )
    //封闭对象
  }
  let __isArray = function (obj) {
    if (obj) {
      return obj.constructor == Array
    }
    return false
  }
  let __repeatStr = function (str, times) {
    let newStr = []
    if (times > 0) {
      for (let i = 0; i < times; i++) {
        newStr.push(str)
      }
    }
    return newStr.join('')
  }
  return __writeObj(json, 1)
}

export { main }
