const data = require('./data')
const parser = require('../dist/index')

const testVisit = function (exp) {
  let syntax = parser.parse(exp)
  return parser.visit(syntax)
}

const testVisitAll = function () {
  const exps = data.getExps()
  let startTime = new Date().getTime()
  for (let i = 0, l = exps.length; i < l; i++) {
    let exp = exps[i]
    let exp1 = testVisit(exp)
    console.log(`表达式转换，原始表达式：${exp}`)
    console.log(`转换后结果：${exp1}`)
  }
  let endTime = new Date().getTime()
  console.log(`表达式个数：${exps.length}，总耗时：${endTime - startTime}毫秒`)
}

testVisitAll()
