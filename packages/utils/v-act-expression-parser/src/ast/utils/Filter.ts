// 获取某字符串出现的次数
const getStringNum = (str: string, target: string): number => {
  let index = str.indexOf(target)
  let num = 0

  while (index !== -1) {
    num++
    index = str.indexOf(target, index + 1)
  }
  return num
}

const filterFunctionName = (syntaxName: string): string | boolean => {
  const reg = /.*\(.*\)/
  // 出现次数
  const occurrences = getStringNum(syntaxName, '(')

  // 只有一个括号时
  if (occurrences <= 1) {
    return syntaxName.match(reg)[0].replace(/\(.*\)/, '')
  } else {
    // 多个括号
    // syntaxName.match(reg)

    // 先获取括号内容
    let result: string[] = syntaxName.match(/\(([^)]*)\)/)

    if (result) {
      return /.*\(.*\)/g.test(result[1]) ? filterFunctionName(result[1]) : false
    }
  }

  return syntaxName
}

export { filterFunctionName }
