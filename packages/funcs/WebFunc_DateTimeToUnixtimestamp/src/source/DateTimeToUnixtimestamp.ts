//初始化vjs模块，如果函数逻辑需要引用相关vjs服务，则初始化相关vjs模块；如果不需要初始化逻辑可以为空
exports.initModule = function (sb) {
  //sb：前台vjs的沙箱（容器/上下文），可以用它根据vjs名称，获取到相应vjs服务
  sandbox = sb
}

//主入口(必须有)
let main = function (param) {
  //获取函数传入的参数
  let args = param.getArgs()
  //var routeContext = param.getRouteContext(); //获取路由上下文，函数里想执行一些表达式逻辑需要用到
  if (args.length != 1) {
    throw new Error(
      '[DateTimeToUnixtimestamp]函数参数个数不正确,要求参数个数1个,实际参数个数=' +
        args.length
    )
  }
  let datetime = args[0]
  if (datetime.replace(/(^\s*)|(\s*$)/g, '') == '') {
    throw new Error(
      '[DateTimeToUnixtimestamp]函数参数配置有误,转换的日期不能为空'
    )
  }
  let date = new Date(datetime.replace(/-/g, '/'))
  let unixTimestamp = date.getTime() / 1000
  return unixTimestamp + ''
}

export { main }
