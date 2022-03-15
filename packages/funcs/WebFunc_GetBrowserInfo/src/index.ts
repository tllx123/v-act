/**
 * GetBrowserInfo(Operation,KeyWord1,KeyWord2,Symbol) 参数1：字符串，必填，浏览器属性，不区分大小写
 * 枚举值： Name/Version/Ver/isMobile/OS/DeviceBrand/NetType/Match/AppPlatform/
 * AppName/AppVersion/AppCodename/CookieEnabled/OnLine/Platform/Language/Useragent
 * 参数2：字符串，选填，仅适用于参数1=“Match”时，必填)，关键字1，主要用于判断App平台或手机品牌等，不区分大小写
 * 参数3：字符串，选填，仅适用于参数1=“Match”时，选填)，关键字2，主要用于判断App平台或手机品牌等，不区分大小写
 * 参数4：字符串，选填，仅适用于参数1=“Match”时，选填，默认“and”)，关系操作符 枚举值：and/or ，不区分大小写
 */
const main = function (
  Operation: string,
  KeyWord1?: string,
  KeyWord2?: string,
  Symbol?: string
) {
  // 容错处理，默认获取name
  if (Operation == null || Operation == undefined) {
    Operation = 'name'
  }

  if (KeyWord1 == null || KeyWord1 == undefined) {
    KeyWord1 = ''
  }

  if (KeyWord2 == null || KeyWord2 == undefined) {
    KeyWord2 = ''
  }

  if (Symbol == null || Symbol == undefined) {
    Symbol = ''
  }

  Operation = Operation.toLowerCase()

  switch (Operation) {
    case 'name': // 浏览器内核
      return uaMatch()?.browser
      break
    case 'version': // 浏览器版本
      return uaMatch()?.version
      break
    case 'ver': // 浏览器版本
      return uaMatch()?.version
      break
    case 'ismobile': // 是否移动端
      return isMobile()
      break
    case 'os': // 操作系统
      return GetOS()
      break
    case 'nettype': // 获取联网方式,注意部分浏览器不兼容
      return GetNetType()
      break
    case 'devicebrand': // 获取设备品牌
      return GetDeviceBrand()
      break
    case 'match': // 关键词匹配
      return MatchKeyword(KeyWord1, KeyWord2, Symbol)
      break
    case 'appplatform': // APP平台
      return GetAppPlatform()
      break
    case 'appname': // 浏览器的名称
      return navigator.appName
      break
    case 'appversion': // 浏览器的平台和版本信息
      return navigator.appVersion
      break
    case 'appcodename': // 浏览器的代码名。
      return navigator.appCodeName
      break
    case 'appminorversion': // 浏览器的次级版本
      //@ts-ignore
      return navigator.appMinorVersion
      break
    case 'cookieenabled': // 浏览器中是否启用 cookie
      return navigator.cookieEnabled
      break
    case 'cpuclass': // 浏览器系统的 CPU 等级
      //@ts-ignore
      return navigator.cpuClass
      break
    case 'online': // 是否处于脱机模式
      return navigator.onLine
      break
    case 'platform': // 浏览器的操作系统平台
      return navigator.platform
      break
    case 'language': // 浏览器的语言
      return navigator.language
      break
    case 'browserlanguage': // 浏览器的语言
      //@ts-ignore
      return navigator.browserLanguage
      break
    case 'userlanguage': // 客户机发送服务器的 user-agent 头部的值
      //@ts-ignore
      return navigator.userLanguage
      break
    case 'systemlanguage': // 操作系统使用的默认语言
      //@ts-ignore
      return navigator.systemLanguage
      break
    case 'useragent': // 浏览器userAgent
      return navigator.userAgent
      break
    default:
      // 浏览器userAgent
      return navigator.userAgent
  }
}
// 关键词匹配
function MatchKeyword(KeyWord1: string, KeyWord2: string, Symbol: string) {
  let userAgent = navigator.userAgent.toLowerCase()

  // 按关键字匹配
  if (KeyWord2 == '') {
    if (userAgent.indexOf(KeyWord1.toLowerCase()) > -1) {
      return 'true'
    } else {
      return 'false'
    }
  }

  if (KeyWord1 != '' && KeyWord2 != '' && Symbol != '') {
    if (Symbol.toLowerCase().trim() == 'and') {
      if (
        userAgent.indexOf(KeyWord1.toLowerCase()) > -1 &&
        userAgent.indexOf(KeyWord2.toLowerCase()) > -1
      ) {
        return 'true'
      } else {
        return 'false'
      }
    } else {
      if (
        userAgent.indexOf(KeyWord1.toLowerCase()) > -1 ||
        userAgent.indexOf(KeyWord2.toLowerCase()) > -1
      ) {
        return 'true'
      } else {
        return 'false'
      }
    }
  }
}

// 获取联网方式,注意部分浏览器不兼容
function GetNetType() {
  try {
    return navigator.connection.type
    // bluetooth: 蓝牙
    // cellular: 蜂窝网络(e.g., EDGE, HSPA, LTE, etc.)
    // ethernet: 以太网
    // none: 无连接
    // mixed: 多类型混合
    // other: 类型可知，但不可枚举
    // unknown: 有链接，但类型未知
    // wifi: Wi-Fi
    // wimax: WiMAX

    // return navigator.connection.effectiveType;
    // '2g'
    // '3g'
    // '4g'
    // 'slow-2'
  } catch (err) {
    let userAgent = navigator.userAgent.toLowerCase()

    if (userAgent.indexOf('nettype/wifi') > -1) return 'wifi'

    for (let i = 6; i >= 6; i--) {
      if (userAgent.indexOf('nettype/' + i + 'g+') > -1) return '' + i + 'g+'

      if (userAgent.indexOf('nettype/' + i + 'g') > -1) return '' + i + 'g'
    }

    return 'unknow'
  }
}

// 获取设备品牌
function GetDeviceBrand() {
  let userAgent = navigator.userAgent.toLowerCase()

  let Brands = [
    'HUAWEI',
    'HONOR',
    'XiaoMi',
    'Redmi',
    'OPPO',
    'Realme',
    'vivo',
    'IQOO',
    'TCL',
    'ZTE',
    'Lenovo',
    'Moto',
    'meizu',
    'ONEPLUS',
    'nubia',
    'SHARK',
    'GIONEE',
    'AGM',
    'coolpad',
    'Hisense',
    'DOOV',
    '8848',
    'Newman',
    'Meitu',
    'Micromax',
    'K-Touch',
    'CECT',
    'BIRD',
    'Daxian',
    'DBTEL',
    'Eastcom',
    'PANTECH',
    'Dopod',
    'HAIER',
    'KONKA',
    'KEJIANK',
    'Changhong',
    'sony',
    'rog',
    'auas',
    'HTC',
    'BenQ',
    'Compal',
    'NEC',
    'nokia',
    'Alcatel',
    'Ericsson',
    'LG',
    'SAMSUNG',
    'Nexus',
    'sharp',
    'iPhone',
    'iPad',
    'iPod',
    'BlackBerry',
    'Philips'
  ]

  for (let i = 0; i < Brands.length; i++) {
    let BrandName = Brands[i].toLowerCase()
    if (userAgent.indexOf(BrandName) > -1) return BrandName
  }
}

// 判断是否移动端
function isMobile() {
  if (
    navigator.userAgent.match(
      /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    )
  ) {
    return true
  } else {
    return false
  }
}

// 获取app平台
function GetAppPlatform() {
  let userAgent = navigator.userAgent.toLowerCase()

  // 腾讯-企业微信
  if (userAgent.indexOf('wxwork') > -1) return 'WeChat Work'

  // 腾讯-微信(小程序)
  if (
    userAgent.indexOf('micromessenger') > -1 &&
    userAgent.indexOf('miniprogram') > -1
  )
    return 'WeChat MiniProgram'

  // 腾讯-微信
  if (userAgent.indexOf('micromessenger') > -1) return 'WeChat'

  // 阿里-支付宝(小程序)
  if (userAgent.indexOf('alipay') > -1 && userAgent.indexOf('miniprogram') > -1)
    return 'Alipay MiniProgram'

  // 阿里-支付宝
  if (userAgent.indexOf('alipay') > -1) return 'Alipay'

  // 阿里-钉钉
  if (userAgent.indexOf('dingtalk') > -1) return 'DingTalk'

  // 阿里-天猫
  if (userAgent.indexOf('tmall') > -1) return 'tmall'

  // 阿里-淘宝
  if (userAgent.indexOf('taobao') > -1) return 'taobao'

  // 京东
  if (userAgent.indexOf('jd') > -1) return 'jd'

  // 百度
  if (userAgent.indexOf('baidu') > -1) return 'baidu'

  // 新浪-微博
  if (userAgent.indexOf('weibo') > -1) return 'weibo'

  // 未知
  return 'unknow'
}

// 获取操作系统
function GetOS() {
  let userAgent = navigator.userAgent

  // 苹果iPhone
  if (userAgent.indexOf('iPhone') > -1) {
    for (let i = 4; i < 20; i++) {
      for (let j = 0; j <= 9; j++) {
        if (
          userAgent.indexOf(' OS ' + i + '.' + j) > -1 ||
          userAgent.indexOf(' OS ' + i + '_' + j) > -1
        )
          return 'iPhone OS ' + i + '.' + j
      }
      if (userAgent.indexOf(' OS ' + i) > -1) return 'iPod OS ' + i
    }
    return 'iPhone'
  }

  // 苹果iPad
  if (userAgent.indexOf('iPad') > -1) {
    for (let i = 4; i <= 20; i++) {
      for (let j = 0; j <= 9; j++) {
        if (
          userAgent.indexOf(' OS ' + i + '.' + j) > -1 ||
          userAgent.indexOf(' OS ' + i + '_' + j) > -1
        )
          return 'iPad OS ' + i + '.' + j
      }
      if (userAgent.indexOf(' OS ' + i) > -1) return 'iPod OS ' + i
    }
    return 'iPad'
  }

  // 苹果iPod
  if (userAgent.indexOf('iPod') > -1) {
    for (let i = 4; i < 20; i++) {
      for (let j = 0; j <= 9; j++) {
        if (
          userAgent.indexOf(' OS ' + i + '.' + j) > -1 ||
          userAgent.indexOf(' OS ' + i + '_' + j) > -1
        )
          return 'iPod OS ' + i + '.' + j
      }
      if (userAgent.indexOf(' OS ' + i) > -1) return 'iPod OS ' + i
    }
    return 'iPod'
  }

  // 黑莓BlackBerry
  if (userAgent.indexOf('BlackBerry') > -1) return 'BlackBerry'

  // 塞班Symbian
  if (userAgent.indexOf('Symbian') > -1) return 'Symbian'

  // 微软Windows Phone
  if (userAgent.indexOf('Windows Phone') > -1) return 'Windows Phone'

  // 谷歌安卓Android
  if (userAgent.indexOf('Android') > -1 || userAgent.indexOf('Adr') > -1) {
    for (let i = 4; i < 20; i++) {
      for (let j = 0; j <= 9; j++) {
        if (userAgent.indexOf('Android ' + i + '.' + j) > -1)
          return 'Android ' + i + '.' + j
      }
      if (userAgent.indexOf('Android ' + i) > -1) return 'Android ' + i
    }
    return 'Android'
  }

  // 微软Windows
  let isWin = navigator.platform == 'Win32' || navigator.platform == 'Windows'

  // 苹果Mac
  let isMac =
    navigator.platform == 'Mac68K' ||
    navigator.platform == 'MacPPC' ||
    navigator.platform == 'Macintosh' ||
    navigator.platform == 'MacIntel' ||
    userAgent.indexOf('Mac OS') > -1
  if (isMac) {
    for (let i = 9; i < 20; i++) {
      for (let j = 0; j <= 20; j++) {
        if (
          userAgent.indexOf('Mac OS X ' + i + '.' + j) > -1 ||
          userAgent.indexOf('Mac OS X ' + i + '_' + j) > -1
        )
          return 'Mac ' + i + '.' + j
      }
    }
    return 'Mac'
  }

  // Unix
  if (navigator.platform == 'X11' && !isWin && !isMac) return 'Unix'

  // Linux
  if (navigator.platform.indexOf('Linux') > -1) return 'Linux'

  if (isWin) {
    if (
      userAgent.indexOf('Windows NT 10.0') > -1 ||
      userAgent.indexOf('Windows 10') > -1
    )
      return 'Windows 10'

    if (
      userAgent.indexOf('Windows NT 6.4') > -1 ||
      userAgent.indexOf('Windows 10') > -1
    )
      return 'Windows 10 Technical Preview'

    if (
      userAgent.indexOf('Windows NT 6.3') > -1 ||
      userAgent.indexOf('Windows 2012') > -1
    )
      return 'Windows 2012 R2'

    if (
      userAgent.indexOf('Windows NT 6.3') > -1 ||
      userAgent.indexOf('Windows 8.1') > -1
    )
      return 'Windows 8.1'

    if (
      userAgent.indexOf('Windows NT 6.2') > -1 ||
      userAgent.indexOf('Windows 2012') > -1
    )
      return 'Windows 2012'

    if (
      userAgent.indexOf('Windows NT 6.2') > -1 ||
      userAgent.indexOf('Windows 8') > -1
    )
      return 'Windows 8'

    if (
      userAgent.indexOf('Windows NT 6.1') > -1 ||
      userAgent.indexOf('Windows 7') > -1
    )
      return 'Windows 7'

    if (
      userAgent.indexOf('Windows NT 6.1') > -1 ||
      userAgent.indexOf('Windows 2008') > -1
    )
      return 'Windows 2008 R2'

    if (
      userAgent.indexOf('Windows NT 6.0') > -1 ||
      userAgent.indexOf('Windows Vista') > -1
    )
      return 'Windows Vista'

    if (
      userAgent.indexOf('Windows NT 6.0') > -1 ||
      userAgent.indexOf('Windows 2008') > -1
    )
      return 'Windows 2008'

    if (
      userAgent.indexOf('Windows NT 5.2') > -1 ||
      userAgent.indexOf('Windows 2003') > -1
    )
      return 'Windows 2003'

    if (
      userAgent.indexOf('Windows NT 5.1') > -1 ||
      userAgent.indexOf('Windows XP') > -1
    )
      return 'Windows XP'

    if (
      userAgent.indexOf('Windows NT 5.0') > -1 ||
      userAgent.indexOf('Windows 2000') > -1
    )
      return 'Windows 2000'

    return 'Windows'
  }

  return 'unknow'
}

/* 检测浏览器类型 */
function uaMatch() {
  let userAgent = navigator.userAgent
  let ua = userAgent.toLowerCase()

  let rEdge = /(edge)\/([\w.]+)/
  let rMsie = /(msie\s|trident.*rv:)([\w.]+)/
  let rFirefox = /(firefox)\/([\w.]+)/
  let rOpera = /(opera).+version\/([\w.]+)/
  let rChrome = /(chrome)\/([\w.]+)/
  let rSafari = /version\/([\w.]+).*(safari)/

  let match = rEdge.exec(ua)
  if (match != null) {
    return {
      browser: 'EDGE',
      version: match[2] || '0'
    }
  }
  match = rMsie.exec(ua)
  if (match != null) {
    return {
      browser: 'IE',
      version: match[2] || '0'
    }
  }
  match = rFirefox.exec(ua)
  if (match != null) {
    return {
      browser: match[1] || '',
      version: match[2] || '0'
    }
  }
  match = rOpera.exec(ua)
  if (match != null) {
    return {
      browser: match[1] || '',
      version: match[2] || '0'
    }
  }
  match = rChrome.exec(ua)
  if (match != null) {
    return {
      browser: match[1] || '',
      version: match[2] || '0'
    }
  }
  match = rSafari.exec(ua)
  if (match != null) {
    return {
      browser: match[2] || '',
      version: match[1] || '0'
    }
  }
  if (match != null) {
    return {
      browser: 'unknow',
      version: '0'
    }
  }
}
export { main }
