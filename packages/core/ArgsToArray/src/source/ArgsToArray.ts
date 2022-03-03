//初始化vjs模块，如果函数逻辑需要引用相关vjs服务，则初始化相关vjs模块；如果不需要初始化逻辑可以为空
exports.initModule = function (sb) {
  //sb：前台vjs的沙箱（容器/上下文），可以用它根据vjs名称，获取到相应vjs服务
  sandbox = sb
}

//主入口(必须有)
let main = function (param) {
  //获取函数传入的参数
  let args = param.getArgs()
  if (args.length == 0)
    throw new Error('函数[ArgsToArray]：至少要有一个参数！当前参数个数为0')
  let result = []
  for (let index = 0; index < args.length; index++) {
    result.push(args[index])
  }
  return result
}

export { main }
