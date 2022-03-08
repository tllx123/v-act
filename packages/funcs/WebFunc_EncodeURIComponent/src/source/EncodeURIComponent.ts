export function initModule(sb) {}

const main = function (param) {
  let args = param.getArgs()
  let str = args[0]
  let retStr = encodeURIComponent(str)
  return retStr
}

export { main }
