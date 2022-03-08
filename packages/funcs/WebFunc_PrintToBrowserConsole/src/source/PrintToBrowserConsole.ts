//初始化vjs模块，如果函数逻辑需要引用相关vjs服务，则初始化相关vjs模块；如果不需要初始化逻辑可以为空
export function initModule(sb) {
  //sb：前台vjs的沙箱（容器/上下文），可以用它根据vjs名称，获取到相应vjs服务
  sandbox = sb
}

//主入口(必须有)
const main = function (param) {
  //获取函数传入的参数
  let args = param.getArgs()
  //var routeContext = param.getRouteContext(); //获取路由上下文，函数里想执行一些表达式逻辑需要用到

  //创建空console对象，避免JS报错
  if (!window.console) {
    window.console = {}
    let console = window.console

    let funcs = [
      'assert',
      'clear',
      'count',
      'debug',
      'dir',
      'dirxml',
      'error',
      'exception',
      'group',
      'groupCollapsed',
      'groupEnd',
      'info',
      'log',
      'markTimeline',
      'profile',
      'profileEnd',
      'table',
      'time',
      'timeEnd',
      'timeStamp',
      'trace',
      'warn'
    ]

    for (let i = 0, l = funcs.length; i < l; i++) {
      let func = funcs[i]
      if (!console[func]) console[func] = function () {}
    }

    if (!console.memory) console.memory = {}
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

  //获取参数
  let LogMessage = args[0]
  let Operation = args[1]

  if (LogMessage == null || LogMessage == undefined) {
    LogMessage = ''
  }

  if (Operation == null || Operation == undefined) {
    Operation = 'log'
  }

  Operation = Operation.toLowerCase()

  if (Operation == 'clear') {
    window.console.clear()
    return
  }

  let Style = ''

  if (window.console) {
    switch (Operation) {
      case 'log':
        Style = 'color:#000000;background:#FFFF66;'
        break
      case 'info':
        Style = 'color:#000000;background:#66CCFF;'
        break
      case 'warn':
        Style = 'color:#000000;background:#CC6666;'
        break
      case 'debug':
        Style = 'color:#CCCCCC;background:#999999;'
        break
      case 'error':
        Style = 'color:#FF0000;background:#99CC33;'
        break
      default:
        Style = 'color:000000;background:#99CCCC;'
    }
  }

  let browser = uaMatch().browser

  if (browser.toUpperCase() == 'IE' || browser.toUpperCase() == 'EDGE') {
    window.console.info(Operation + '：' + LogMessage)
  } else {
    window.console.info(
      '%c' + Operation + '：' + LogMessage,
      'font-size:2em;' + Style
    )
  }
}

export { main }
