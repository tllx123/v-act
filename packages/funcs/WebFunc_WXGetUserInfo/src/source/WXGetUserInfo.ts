import { ProgressBarUtil as progressBar } from '@v-act/vjs.framework.extension.ui.common.plugin.services.progressbar'
import { RemoteOperation as remoteOperation } from '@v-act/vjs.framework.extension.platform.services.operation.remote'

import { FunctionContext } from '@v-act/vjs.framework.extension.platform.interface.function'

//主入口(必须有)
let main = function () {
  if (!isWeiXinFunc()) {
    alert('【获取微信用户信息】函数仅支持微信端使用!')
    return ''
  } else {
    let code = location.href.substring(
      location.href.indexOf('&code=') + 6,
      location.href.indexOf('&state')
    )
    let userID = null
    let cb = function (res) {
      if (res.responseText) {
        let obj = $.parseJSON(res.responseText)
        userID = obj.userid
        if (userID) {
          setCookie('wx_user_id', userID)
        } else {
          alert('获取微信用户信息失败，请刷新页面再次尝试！')
        }
      } else {
        alert('获取微信用户信息失败，请重新尝试！')
      }
    }

    let currUrl = location.href.split('#')[0]
    let config = { callBack: cb, isAsync: false }
    let ajaxUrl =
      location.href.substring(0, location.href.indexOf('module-operation')) +
      '/module-operation!executeOperation?operation=WexinGetUserInfo'
    let ajaxData = {
      code: code
    }
    //从cookie中获取当前用户名，如果不存在则向后台获取
    userID = getCookie('wx_user_id')
    if (!userID) {
      remoteOperation.orginalRequest({
        host: ajaxUrl,
        param: { code: code },
        isAsync: false,
        afterResponse: cb
      })
    }
    return userID
  }
}

/**
 * 根据key获取cookie中的值
 */
let getCookie = function (key) {
  let cookies = document.cookie
  let arrCookie = cookies.split('; ')
  let value
  for (let i = 0; i < arrCookie.length; i++) {
    let arr = arrCookie[i].split('=')
    if (key == arr[0]) {
      value = arr[1]
      break
    }
  }
  return value
}

/**
 * 设置cookie
 */
let setCookie = function (key, value) {
  document.cookie = key + '=' + value
}

function isWeiXinFunc() {
  let ua = navigator.userAgent.toLowerCase()
  if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    return true
  } else {
    return false
  }
}

export { main }
