var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

var randomText = function (len) {
  var charList = new Array(len)
  var maxPos = chars.length
  for (var i = 0; i < len; i++) {
    charList[i] = chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return charList.join('')
}

function getRandom(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function toFix(num) {
  return num < 10 ? '0' + num : num
}

function getInteger(editor) {
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
  return min + Math.round(Math.random() * parseInt(delta / step)) * step
}

var getRandom = function (min, max) {
  return Math.floor(Math.random() * (min - max + 1)) + max
}

exports.random = {
  char: function (editor) {
    var len = parseInt(Math.abs(Math.random() * 20)) + 1
    return randomText(len)
  },
  text: function (editor) {
    var len = parseInt(Math.abs(Math.random() * 2000))
    return randomText(len)
  },
  integer: getInteger,
  top: function (editor) {
    var info = {
      min: editor.min ? editor.min : 0,
      max: editor.max ? editor.max : 500
    }
    return getInteger(info)
  },
  left: function (editor) {
    var info = {
      min: editor.min ? editor.min : 0,
      max: editor.max ? editor.max : 500
    }
    return getInteger(info)
  },
  width: function (editor) {
    var info = {
      min: editor.min ? editor.min : 0,
      max: editor.max ? editor.max : 500
    }
    return getInteger(info)
  },
  height: function (editor) {
    var info = {
      min: editor.min ? editor.min : 0,
      max: editor.max ? editor.max : 500
    }
    return getInteger(info)
  },
  ruleset: function (editor, props) {
    return function () {
      alert('[' + props.name + ']执行成功！')
    }
  },
  date: function (editor) {
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
  longDate: function (editor) {
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
  boolean: function (editor) {
    var random = Math.random()
    return random > 0.5
  },
  number: function (editor) {
    var max = Math.pow(10, parseInt(Math.random() * 8)) //最大值
    var num = new Number(Math.random() * max) //随机数
    var des = Math.random() * 10 //小数位数
    return num.toFixed(des) - 0
  }
}
