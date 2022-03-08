//初始化vjs模块，如果函数逻辑需要引用相关vjs服务，则初始化相关vjs模块；如果不需要初始化逻辑可以为空
export function initModule(sb) {
  //sb：前台vjs的沙箱（容器/上下文），可以用它根据vjs名称，获取到相应vjs服务
  sandbox = sb
}

//主入口(必须有)
const main = function (param: FunctionContext) {
  //获取函数传入的参数
  let args = param.getArgs()
  //var routeContext = param.getRouteContext(); //获取路由上下文，函数里想执行一些表达式逻辑需要用到
  let unixTimestamp
  let dateFormat
  if (args.length < 1 || args.length > 2) {
    throw new Error(
      '[UnixtimestampToDateTime]函数参数个数不正确,要求参数个数1或2个,实际参数个数=' +
        args.length
    )
  }
  if (args.length == 1) {
    unixTimestamp = args[0]
    dateFormat = 'yyyy-MM-dd HH:mm:ss'
  }
  if (args.length == 2) {
    unixTimestamp = args[0]
    dateFormat = args[1]
  }
  unixTimestamp = unixTimestamp + ''
  dateFormat = dateFormat + ''
  //为空
  if (unixTimestamp.replace(/(^\s*)|(\s*$)/g, '') == '') {
    throw new Error(
      '[UnixtimestampToDateTime]函数参数配置有误,转换的时间戳不能为空'
    )
  }
  if (dateFormat.replace(/(^\s*)|(\s*$)/g, '') == '') {
    throw new Error(
      '[UnixtimestampToDateTime]函数参数配置有误,转换格式不能为空'
    )
  }

  let date = new Date(parseInt(unixTimestamp) * 1000)
  //var date = new Date(parseInt(unixTimestamp));
  //date转为指定格式字符串的方法
  Date.prototype.format = function (format) {
    let date = {
      'M+': this.getMonth() + 1,
      'd+': this.getDate(),
      'H+': this.getHours(),
      'm+': this.getMinutes(),
      's+': this.getSeconds(),
      'S+': this.getMilliseconds()
    }
    if (/(y+)/i.test(format)) {
      format = format.replace(
        RegExp.$1,
        (this.getFullYear() + '').substr(4 - RegExp.$1.length)
      )
    }
    for (let k in date) {
      if (new RegExp('(' + k + ')').test(format)) {
        format = format.replace(
          RegExp.$1,
          RegExp.$1.length == 1
            ? date[k]
            : ('00' + date[k]).substr(('' + date[k]).length)
        )
      }
    }
    return format
  }

  return date.format(dateFormat)
}

export { main }
