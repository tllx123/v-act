import { aop as debugService } from '@v-act/vjs.framework.extension.platform.aop'
import { RemoteOperation as remoteOperation } from '@v-act/vjs.framework.extension.platform.services.operation.remote.base'
import { ProgressBarUtil as progressBar } from '@v-act/vjs.framework.extension.ui.common.plugin.services.progressbar'

export function initModule(sb) {}

/**
 * 开启调试
 * 1,检查如果处于微信端则绑定长按事件
 * 2,触发事件后向后台请求debug服务开启状态
 * 3,如果开启则弹出远程调试配置页面
 */
let init = function () {
  if (!isWeiXinFunc()) {
    let touchCB = function (ev) {
      sendRequest()
    }
    loadTouchJS(touchCB)
  }
}

//引入touchjs 绑定长按事件
function loadTouchJS(callback) {
  let touchjs = ['itop/common/touchjs/touchjs.js']
  head.js(touchjs, function () {
    // touchjs实现长按2.5秒，弹出确认框询问是否进入远程调试设置界面
    touch.config.holdTime = 2000
    touch.on(window, 'hold', $('body'), callback)
  })
}

//获取服务端是否开启debug模式
function sendRequest() {
  let callback = function (res) {
    if (res && res.responseText) {
      let obj = $.parseJSON(res.responseText)
      if (obj.data == 'true') {
        if ($('#debugpage').length == 0) {
          let layerHTML =
            "<div  id='debugpage' style='position:fixed;overflow:auto;opacity:1;top:0px;left:0px;right:0px;bottom:0;background-color:#fff;z-index:100'></div>"
          $('body').append(layerHTML)
          $('#debugpage').load(
            'itop/v3/debug/page/debug.html',
            function (html) {
              showDebugPage()
              eventBinding()
            }
          )
        } else {
          let debugCSSHTML =
            '<link id="debug_css" href="itop/v3/debug/page/css/style.css" type="text/css" rel="stylesheet">'
          $('#debugpage').append(debugCSSHTML)
          showDebugPage()
        }
      }
    }
  }

  let ajaxUrl =
    location.href.substring(0, location.href.indexOf('module-operation')) +
    '/module-operation!executeOperation?operation=WXConfig'
  remoteOperation.orginalRequest({
    host: ajaxUrl,
    param: {},
    isAsync: true,
    afterResponse: callback
  })
}

//弹出调试页面
function showDebugPage() {
  //如果本地存储有值则加载
  let storePath = getLocalStorage('weixin_debug_path')
  $('#serverpath').val(storePath)
  $('#debugpage').show()
}

//隐藏调试页面（同时删除样式表）
function hideDebugPage() {
  $('#debug_css').remove()
  $('#debugpage').hide() //隐藏
}

//事件绑定
function eventBinding() {
  $('#debugback').click(function () {
    hideDebugPage()
  })

  $('#useit').click(function (ev) {
    let on = document.getElementById('useit').checked
    let serverPath = $('#serverpath').val()
    setLocalStorage('weixin_debug_path', serverPath)
    if (on) {
      startDebug()
    } else {
      alert('已禁用远程调试功能')
      debugService.markDebugDisable()
    }
  })
}

//开启调试
function startDebug() {
  progressBar.showProgress('正在连接服务器...')
  let debugHost = $('#serverpath').val()
  debugService.setRemoteDebugHost(debugHost, function (success) {
    progressBar.hideProgress()
    if (success) {
      alert('已开启远程调试功能')
      debugService.markDebugEnable()
    } else {
      alert('连接失败，请确认服务地址是否正确')
      document.getElementById('useit').checked = false
    }
  })
}

//检查是否处于微信端
function isWeiXinFunc() {
  let ua = navigator.userAgent.toLowerCase()
  if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    return true
  } else {
    return false
  }
}

//localstorage存储
function setLocalStorage(key, value) {
  localStorage.setItem(key, value)
}

//localstorage取值
function getLocalStorage(key) {
  return localStorage.getItem(key)
}

export { init }
