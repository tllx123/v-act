import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { JPush as JPushrService } from '@v-act/vjs.framework.extension.platform.services.native.mobile.jpush'

let openNotificationListener: any
let lastopenNotificationEvent: any

export function initModule(sb: any) {
  JPushrService.putInstance(exports)

  //@ts-ignore
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
      handler: function (event: any) {
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

  //@ts-ignore
  if (window.JPush) {
    //@ts-ignore
    window.JPush.init()
  }
  let windowInit = sb.getService(
    'vjs.framework.extension.platform.services.init.WindowInit'
  )
  registerOpenNotification(function (event: any) {
    //edit by wangyue  2019.05.16
    //由于iOS的Xcode版本不能升级到最新，所以使用的是jpush的3.03旧版本，所以此处的传参event的数据结构会与安卓最新版本不同，在此做兼容处理
    let extras = event.extras
    //@ts-ignore
    if (window.device && window.device.platform == 'iOS') {
      extras = event
    }
    let openType = extras.private_openType
    if ('vpage' == openType) {
      let windowInfo = extras.private_windowInfo.split('.')
      let componentCode = windowInfo[0]
      let windowCode = windowInfo[1]
      let windowInputParams: Record<string, any> = {
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
      //@ts-ignore
      if (window.device && window.device.platform == 'iOS') {
        url = encodeURI(url)
        //@ts-ignore
        if (window.GlobalVariables && window.GlobalVariables.appVersion >= 2) {
          //@ts-ignore
          cordova.plugins.webview.open({
            url: url,
            type: 'H5PAGE',
            isPush: 'true'
          })
        } else {
          //@ts-ignore
          cordova.InAppBrowser.open(url, '_blank', 'location=no')
        }
      } else {
        //@ts-ignore
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
let openDialogWindow = function (
  componentCode: string,
  windowCode: string,
  windowInputParams: Record<string, any>
) {
  throw '此功能暂未开放'
  /*  let callBackFunc = function (output: any) {}
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
  }) 解开注释*/
}

/**
 * 初始化cordova的极光推送插件，注为全局对象
 *
 */
//@ts-ignore
if (window.VJSBridge) {
  //@ts-ignore
  window.VJSBridge.plugins.vplatform.JPush = window.plugins.jPushPlugin
}

const setAlias = function (param: any) {
  //@ts-ignore
  window.plugins.jPushPlugin.setAlias(param)
}

const setBadge = function (param: any) {
  //@ts-ignore
  if (cordova.platformId == 'android') {
    //@ts-ignore
    window.plugins.badgeplugin.setBadgeCount(param)
  } else {
    //@ts-ignore
    window.plugins.jPushPlugin.setApplicationIconBadgeNumber(param)
    //@ts-ignore
    window.plugins.jPushPlugin.setBadge(param)
  }
}

const getBadge = function (callback: Function) {
  //@ts-ignore
  if (cordova.platformId == 'android') {
    //@ts-ignore
    window.plugins.badgeplugin.getBadgeCount(callback)
  } else {
    //@ts-ignore
    window.plugins.jPushPlugin.getApplicationIconBadgeNumber(callback)
  }
}

const init = function () {
  //@ts-ignore
  if (window.JPush) {
    //@ts-ignore
    window.JPush.init()
  }
}

const setDebugMode = function (isDebug: boolean) {
  console.log('调试模式：' + isDebug)
  //@ts-ignore
  if (window.JPush) {
    //@ts-ignore
    window.JPush.setDebugMode(isDebug)
  }
}

const stopPush = function () {
  console.log('停止推送')
  //@ts-ignore
  if (window.JPush) {
    //@ts-ignore
    window.JPush.stopPush()
  }
}

const resumePush = function () {
  console.log('继续推送')
  //@ts-ignore
  if (window.JPush) {
    //@ts-ignore
    window.JPush.resumePush()
  }
}

const isPushStopped = function (callback: Function) {
  //@ts-ignore
  if (window.JPush) {
    //@ts-ignore
    window.JPush.isPushStopped(callback)
  }
}

const getRegistrationID = function (callback: Function) {
  //@ts-ignore
  if (window.JPush) {
    //@ts-ignore
    window.JPush.getRegistrationID(callback)
  }
}

const registerOpenNotification = function (callback: Function) {
  openNotificationListener = callback
  if (lastopenNotificationEvent) {
    setTimeout(function () {
      callback(lastopenNotificationEvent)
      lastopenNotificationEvent = undefined
    })
  }
}

export {
  getBadge,
  getRegistrationID,
  init,
  isPushStopped,
  registerOpenNotification,
  resumePush,
  setAlias,
  setBadge,
  setDebugMode,
  stopPush
}
