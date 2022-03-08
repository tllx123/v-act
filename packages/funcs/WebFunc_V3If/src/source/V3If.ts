const main = function (param: FunctionContext) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0,
    logical_test = argsLen >= 1 ? args[0] : null,
    value_if_true = argsLen >= 2 ? args[1] : null,
    value_if_false = argsLen >= 3 ? args[2] : null

  if (logical_test) return value_if_true
  else return value_if_false
}

export { main }
