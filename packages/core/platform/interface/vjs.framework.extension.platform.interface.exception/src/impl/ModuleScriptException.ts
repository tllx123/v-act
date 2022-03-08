import { FrontEndAlerter as FrontEndAlerterUtil } from '@v-act/vjs.framework.extension.platform.interface.alerter'
import { Environment as envir } from '@v-act/vjs.framework.extension.platform.interface.environment'
import { Platform as i18n } from '@v-act/vjs.framework.extension.platform.interface.i18n'

import * as Exception from './Exception'

let ModuleScriptException = function (message, e, params) {
  this.reason = params.reason
  Exception.apply(this, arguments)
  if (params) {
    if (params.exceptionLib) {
      let exceptionLib = params.exceptionLib
      this.setNeedLogin(exceptionLib.isNeedLogin())
      this.setTitle(exceptionLib.getTitle())
      this.setComponentCode(exceptionLib.getComponentCode())
      this.setWindowCode(exceptionLib.getWindowCode())
    } else {
      this.setNeedLogin(params.needLogin)
      this.setTitle(params.title)
    }
  }
}

export function initModule(sandbox) {}

ModuleScriptException.prototype = {
  initModule: function (sandbox) {
    sb = sandbox
    var Extend = require('vjs/framework/extension/platform/interface/exception/util/Extend')
    Extend.extend(ModuleScriptException, Exception, sb)
  },

  getClassName: function () {
    return 'ModuleScriptException'
  },

  setTitle: function (title) {
    this.title = title
  },
  getTitle: function (title) {
    return this.title
  },

  setMessage: function (message) {
    this.message = message
  },
  getMessage: function (message) {
    return this.message
  },

  setComponentCode: function (componentCode) {
    this.componentCode = componentCode
  },
  getComponentCode: function (componentCode) {
    return this.componentCode
  },

  setWindowCode: function (windowCode) {
    this.windowCode = windowCode
  },
  getWindowCode: function (windowCode) {
    return this.windowCode
  },

  setNeedLogin: function (needLogin) {
    this.needLogin = needLogin
  },
  isNeedLogin: function (needLogin) {
    return this.needLogin
  },

  setContainer: function (container) {
    this.container = container
  },
  getContainer: function (container) {
    return this.container
  },
  isNetWorkException: function () {
    return this.reason == 'NetworkError'
  },

  genExceptionHtml: function (
    componentCode,
    windowCode,
    exceptionTitle,
    exceptionMessage
  ) {
    componentCode = componentCode ? componentCode : this.getComponentCode()
    windowCode = windowCode ? windowCode : this.getWindowCode()
    exceptionTitle = exceptionTitle ? exceptionTitle : this.getTitle()
    exceptionMessage = exceptionMessage ? exceptionMessage : this.getMessage()

    let html =
      '<html xmlns="http://www.w3.org/1999/xhtml"> <head> <meta http-equiv="Content-Type" content="text/html; charset=utf-8" /> ' +
      '<title>' +
      i18n.get('错误提示', '模块化脚本异常标题') +
      '</title> <style>  .ebody { font-family: Arial, 宋体, helvertica, sans-serif; font-size: 12px; font-weight: normal; text-align: center; }  ' +
      '.tips_frame { margin: 100px auto; position: absolute; top: 0px; bottom: 0px; left: 0px; right: 0px; } ' +
      '.tips_text { FONT-WEIGHT: bold; FONT-SIZE: 15px; COLOR: #FB7E04; background:url(/itop/exception/images/tips_ico.gif) no-repeat left center; padding-left: 27px; height: 30px; line-height: 30px; display: inline-block; }  ' +
      '.tips_font { FONT-WEIGHT: bold; FONT-SIZE: 13px; COLOR: #FB7E04; margin: 30px 0px 0px 0px; text-align: center; }  ' +
      '.tips_Error { COLOR: #000; margin: 0px; line-height: 30px; } </style> </head> ' +
      '<body class="ebody"> <div class="tips_frame">' +
      ' <div style="width: 400px; margin: 0 auto 10px; text-align: left; padding: 15px; border: 1px solid #aeabd3;"> ' +
      '<span class="tips_text">' +
      i18n.get('错误提示', '模块化脚本异常的提示文字') +
      '</span> <div class="tips_font"> ' +
      (exceptionTitle ? exceptionTitle : '') +
      ' </div> ' +
      '<div class="tips_Error">' +
      (componentCode
        ? i18n.get(' 构件：', '模块化脚本异常的构件标题信息') + componentCode
        : '') +
      '' +
      (windowCode
        ? i18n.get('，窗体：', '模块化脚本异常的窗体标题信息') + windowCode
        : '') +
      ' </div> <textarea rows="5" cols="54" readonly="readonly" style="width:370px;"> ' +
      exceptionMessage +
      ' </textarea> </div> </div> </body> </html>'
    return html
  },

  handling: function (params) {
    let componentCode =
      params && params.componentCode
        ? params.componentCode
        : this.getComponentCode()
    let windowCode =
      params && params.windowCode ? params.windowCode : this.getWindowCode()
    let exceptionTitle =
      params && params.exceptionTitle ? params.exceptionTitle : this.getTitle()
    let exceptionMessage =
      params && params.exceptionMessage
        ? params.exceptionMessage
        : this.getMessage()

    if (this.isNeedLogin() === true) {
      alert(exceptionTitle)
      if (envir.isLogin()) window.top.location.href = envir.getLoginUrl()
      else window.top.location.reload()
    } else {
      if (params && params.container) {
        let exceptionHtml = this.genExceptionHtml(
          componentCode,
          windowCode,
          exceptionTitle,
          exceptionMessage
        )
        params.container.html(exceptionHtml)
      } else {
        FrontEndAlerterUtil.error({
          title: i18n.get('错误', '模块化脚本异常弹框的标题'),
          msgHeader: exceptionTitle,
          msg: exceptionMessage
        })
      }
    }
  }
}

return ModuleScriptException
export {
  _getHandler,
  create,
  getExceptionHtml,
  handle,
  isException,
  onBeforeHandler,
  onHandleFunction
}
