export function initModule(sb) {}

const main = function (param) {
  let args = param.getArgs()
  let str = args[0]
  let retStr = decodeURIComponent(str)
  return retStr
}

export { main }
