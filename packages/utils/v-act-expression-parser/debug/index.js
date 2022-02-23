const data = require('./data')
const parser = require('../dist/index')
const testAll = function () {
  const exps = data.getExps()
  let startTime = new Date().getTime()
  for (let i = 0, l = exps.length; i < l; i++) {
    let exp = exps[i]
    let syntax = parser.parse(exp)
    let exp1 = syntax.toString()
    if (exp1 !== exp) {
      console.log(`表达式解析错误，原始表达式：${exp}，解析后结果：${exp1}`)
    }
  }
  let endTime = new Date().getTime()
  console.log(`表达式个数：${exps.length}，总耗时：${endTime - startTime}毫秒`)
}

const test = function () {
  let exp = 'Multiply(BR_IN_PARENT.taxRate,0.01)'
  let syntax = parser.parse(exp)
  console.log(syntax.toString())
}

//test()
testAll()
