let openNotificationListener
let lastopenNotificationEvent

export function initModule(sb) {
  let JPushrService = sb.getService(
    'vjs.framework.extension.platform.services.native.mobile.jpush'
  )
  let scopeManager = sb.getService(
    'vjs.framework.extension.platform.interface.scope.ScopeManager'
  )
  JPushrService.putInstance(exports)

  if (window.device && window.device.platform == 'iOS') {
    document.addEventListener('jpush.openNotification', function (event) {
      if (openNotificationListener) {
        lastopenNotificationEvent = undefined
        openNotificationListener(event)
      } else {
        lastopenNotificationEvent = event
      }
    })
  } else {
    let func = scopeManager.createScopeHandler({
      handler: function (event) {
        if (openNotificationListener) {
          lastopenNotificationEvent = undefined
          openNotificationListener(event)
        } else {
          lastopenNotificationEvent = event
        }
      }
    })
    document.addEventListener('jpush.openNotification', func)
  }

  if (window.JPush) {
    window.JPush.init()
  }
  let windowInit = sb.getService(
    'vjs.framework.extension.platform.services.init.WindowInit'
  )
  exports.registerOpenNotification(function (event) {
    //edit by wangyue  2019.05.16
    //由于iOS的Xcode版本不能升级到最新，所以使用的是jpush的3.03旧版本，所以此处的传参event的数据结构会与安卓最新版本不同，在此做兼容处理
    let extras = event.extras
    if (window.device && window.device.platform == 'iOS') {
      extras = event
    }
    let openType = extras.private_openType
    if ('vpage' == openType) {
      let windowInfo = extras.private_windowInfo.split('.')
      let componentCode = windowInfo[0]
      let windowCode = windowInfo[1]
      let windowInputParams = {
        variable: {
          formulaOpenMode: 'dialog',
          windowtitle: ''
        },
        dialogParams: {
          dialogType: '',
          dialogFlag: '',
          openLocation: 'full',
          heightType: '',
          heightExp: '',
          heightUnit: '',
          widthType: '',
          widthExp: '',
          widthUnit: '',
          isPushMainWindow: true
        }
      }
      let stringUtil = sb.getService('vjs.framework.extension.util.StringUtil')
      for (let key in extras) {
        if (stringUtil.startsWith('privateParameter_', key)) {
          windowInputParams['variable'][key.split('privateParameter_')[1]] =
            extras[key]
        }
      }
      openDialogWindow(componentCode, windowCode, windowInputParams)
    } else if ('h5page' == openType) {
      let url = extras.private_windowInfo
      if (window.device && window.device.platform == 'iOS') {
        url = encodeURI(url)
        if (window.GlobalVariables && window.GlobalVariables.appVersion >= 2) {
          cordova.plugins.webview.open({
            url: url,
            type: 'H5PAGE',
            isPush: 'true'
          })
        } else {
          cordova.InAppBrowser.open(url, '_blank', 'location=no')
        }
      } else {
        cordova.plugins.webview.open({
          url: url,
          type: 'H5PAGE',
          urlType: 'message'
        })
      }
    }
  })
}

/**
 * 打开模态窗体，并处理窗体返回值
 */
let openDialogWindow = function (componentCode, windowCode, windowInputParams) {
  let callBackFunc = function (output) {}
  let browser = sb.getService(
    'vjs.framework.extension.platform.services.browser.Browser'
  )
  let windowInstanceCode = browser.showModalModule({
    componentCode: componentCode,
    windowCode: windowCode,
    title: '',
    inputParam: windowInputParams,
    closeCallback: callBackFunc,
    width: '',
    height: ''
  })
}

/**
 * 初始化cordova的极光推送插件，注为全局对象
 *
 */
if (window.VJSBridge) {
  window.VJSBridge.plugins.vplatform.JPush = window.plugins.jPushPlugin
}

const setAlias = function (param) {
  window.plugins.jPushPlugin.setAlias(param)
}

const setBadge = function (param) {
  if (cordova.platformId == 'android') {
    window.plugins.badgeplugin.setBadgeCount(param)
  } else {
    window.plugins.jPushPlugin.setApplicationIconBadgeNumber(param)
    window.plugins.jPushPlugin.setBadge(param)
  }
}

const getBadge = function (callback) {
  if (cordova.platformId == 'android') {
    window.plugins.badgeplugin.getBadgeCount(callback)
  } else {
    window.plugins.jPushPlugin.getApplicationIconBadgeNumber(callback)
  }
}

const init = function () {
  if (window.JPush) {
    window.JPush.init()
  }
}

const setDebugMode = function (isDebug) {
  console.log('调试模式：' + isDebug)
  if (window.JPush) {
    window.JPush.setDebugMode(isDebug)
  }
}

const stopPush = function () {
  console.log('停止推送')
  if (window.JPush) {
    window.JPush.stopPush()
  }
}

const resumePush = function () {
  console.log('继续推送')
  if (window.JPush) {
    window.JPush.resumePush()
  }
}

const isPushStopped = function (callback) {
  if (window.JPush) {
    window.JPush.isPushStopped(callback)
  }
}

const getRegistrationID = function (callback) {
  if (window.JPush) {
    window.JPush.getRegistrationID(callback)
  }
}

const registerOpenNotification = function (callback) {
  openNotificationListener = callback
  if (lastopenNotificationEvent) {
    setTimeout(function () {
      callback(lastopenNotificationEvent)
      lastopenNotificationEvent = undefined
    })
  }
}

export {
  setAlias,
  setBadge,
  getBadge,
  init,
  setDebugMode,
  stopPush,
  resumePush,
  isPushStopped,
  getRegistrationID,
  registerOpenNotification
}
