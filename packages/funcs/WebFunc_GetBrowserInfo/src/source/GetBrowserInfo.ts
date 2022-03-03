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

  //获取参数
  let Operation = args[0] //参数

  if (Operation == null || Operation == undefined) {
    Operation = 'name'
  }

  Operation = Operation.toLowerCase()

  switch (Operation) {
    case 'name':
      return uaMatch().browser
      break
    case 'version':
      return uaMatch().version
      break
    case 'ver':
      return uaMatch().version
      break
    default:
      return ''
  }
}

/*检测浏览器类型*/
function uaMatch() {
  let userAgent = navigator.userAgent,
    rEdge = /(edge)\/([\w.]+)/,
    rMsie = /(msie\s|trident.*rv:)([\w.]+)/,
    rFirefox = /(firefox)\/([\w.]+)/,
    rOpera = /(opera).+version\/([\w.]+)/,
    rChrome = /(chrome)\/([\w.]+)/,
    rSafari = /version\/([\w.]+).*(safari)/
  let ua = userAgent.toLowerCase()

  let match = rEdge.exec(ua)
  if (match != null) {
    return {
      browser: 'EDGE',
      version: match[2] || '0'
    }
  }
  let match = rMsie.exec(ua)
  if (match != null) {
    return {
      browser: 'IE',
      version: match[2] || '0'
    }
  }
  let match = rFirefox.exec(ua)
  if (match != null) {
    return {
      browser: match[1] || '',
      version: match[2] || '0'
    }
  }
  let match = rOpera.exec(ua)
  if (match != null) {
    return {
      browser: match[1] || '',
      version: match[2] || '0'
    }
  }
  let match = rChrome.exec(ua)
  if (match != null) {
    return {
      browser: match[1] || '',
      version: match[2] || '0'
    }
  }
  let match = rSafari.exec(ua)
  if (match != null) {
    return {
      browser: match[2] || '',
      version: match[1] || '0'
    }
  }
  if (match != null) {
    return {
      browser: '',
      version: '0'
    }
  }
}
export { main }
