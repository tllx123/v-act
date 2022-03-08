/**
 *
 *
 */
const main = function (LogMessage, Operation) {
  try {
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

    var Style = ''

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

    if (browserInfo) {
      var browser = browserInfo.browser
      if (browser.toUpperCase() == 'IE' || browser.toUpperCase() == 'EDGE') {
        window.console.info(Operation + '：' + LogMessage)
      } else {
        window.console.info(
          '%c' + Operation + '：' + LogMessage,
          'font-size:2em;' + Style
        )
      }
    }
  } catch (e) {}
}
/*检测浏览器类型*/
var browserInfo = null

browserInfo = (function () {
  try {
    var userAgent = navigator.userAgent,
      rEdge = /(edge)\/([\w.]+)/,
      rMsie = /(msie\s|trident.*rv:)([\w.]+)/,
      rFirefox = /(firefox)\/([\w.]+)/,
      rOpera = /(opera).+version\/([\w.]+)/,
      rChrome = /(chrome)\/([\w.]+)/,
      rSafari = /version\/([\w.]+).*(safari)/
    var ua = userAgent.toLowerCase()

    var match = rEdge.exec(ua)
    if (match != null) {
      return {
        browser: 'EDGE',
        version: match[2] || '0'
      }
    }
    var match = rMsie.exec(ua)
    if (match != null) {
      return {
        browser: 'IE',
        version: match[2] || '0'
      }
    }
    var match = rFirefox.exec(ua)
    if (match != null) {
      return {
        browser: match[1] || '',
        version: match[2] || '0'
      }
    }
    var match = rOpera.exec(ua)
    if (match != null) {
      return {
        browser: match[1] || '',
        version: match[2] || '0'
      }
    }
    var match = rChrome.exec(ua)
    if (match != null) {
      return {
        browser: match[1] || '',
        version: match[2] || '0'
      }
    }
    var match = rSafari.exec(ua)
    if (match != null) {
      return {
        browser: match[2] || '',
        version: match[1] || '0'
      }
    }
    return null
  } catch (e) {
    return null
  }
})()
export { main }
