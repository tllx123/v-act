var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

var randomText = function (len: number) {
  var charList = new Array(len)
  var maxPos = chars.length
  for (var i = 0; i < len; i++) {
    charList[i] = chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return charList.join('')
}

function toFix(num: string | number) {
  return num < 10 ? '0' + num : num
}

function getInteger(editor: { min: any; max: any; step?: any }) {
  var max = 10000,
    min = 0,
    step = 1
  if (editor) {
    max = parseInt(editor.max)
    if (isNaN(max)) {
      max = 10000
    }
    min = parseInt(editor.min)
    if (isNaN(min)) {
      min = 0
    }
    step = parseInt(editor.step)
    if (isNaN(step)) {
      step = 1
    }
  }
  var delta = max - min
  return min + Math.round(Math.random() * (delta / step)) * step
}

var getRandom = function (min: number, max: number) {
  return Math.floor(Math.random() * (min - max + 1)) + max
}

const random = {
  char: function () {
    var len = Math.abs(Math.random() * 20) + 1
    return randomText(len)
  },
  text: function () {
    var len = Math.abs(Math.random() * 2000)
    return randomText(len)
  },
  integer: getInteger,
  top: function (editor: { min: any; max: any }) {
    var info = {
      min: editor.min ? editor.min : 0,
      max: editor.max ? editor.max : 500
    }
    return getInteger(info)
  },
  left: function (editor: { min: any; max: any }) {
    var info = {
      min: editor.min ? editor.min : 0,
      max: editor.max ? editor.max : 500
    }
    return getInteger(info)
  },
  width: function (editor: { min: any; max: any }) {
    var info = {
      min: editor.min ? editor.min : 0,
      max: editor.max ? editor.max : 500
    }
    return getInteger(info)
  },
  height: function (editor: { min: any; max: any }) {
    var info = {
      min: editor.min ? editor.min : 0,
      max: editor.max ? editor.max : 500
    }
    return getInteger(info)
  },
  ruleset: function (props: { name: string }) {
    return function () {
      alert('[' + props.name + ']执行成功！')
    }
  },
  date: function () {
    var maxdaterandom = new Date(2100, 11, 31, 8).getTime()
    var mindaterandom = new Date(1970, 0, 1, 8).getTime()
    var randomdate = getRandom(mindaterandom, maxdaterandom)
    var date = new Date(randomdate)
    return [
      date.getFullYear(),
      toFix(date.getMonth() + 1),
      toFix(date.getDate())
    ].join('-')
  },
  longDate: function () {
    var maxdaterandom = new Date(2100, 11, 31, 8).getTime()
    var mindaterandom = new Date(1970, 0, 1, 8).getTime()
    var randomdate = getRandom(mindaterandom, maxdaterandom)
    var date = new Date(randomdate)
    return [
      date.getFullYear(),
      '-',
      toFix(date.getMonth() + 1),
      '-',
      toFix(date.getDate()),
      ' ',
      toFix(date.getHours()),
      ':',
      toFix(date.getMinutes()),
      ':',
      toFix(date.getSeconds())
    ].join('')
  },
  boolean: function () {
    var random = Math.random()
    return random > 0.5
  },
  number: function () {
    var max = Math.pow(10, Math.random() * 8) //最大值
    var num: any = new Number(Math.random() * max) //随机数
    var des = Math.random() * 10 //小数位数
    return num.toFixed(des) - 0
  }
}

export { random }
