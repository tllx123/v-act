import { platform as i18n } from '@v-act/vjs.framework.extension.platform.interface.i18n'

import * as exceptionFactory from './api/ExceptionFactory'

let sandbox

export function initModule(sb) {
  sandbox = sb
}

const handle = function (e) {
  if (exceptionFactory.isException(e)) {
    e.handle()
  } else {
    let exception = exceptionFactory.create({
      message: i18n.get('未识别异常', '无指定异常类型时信息') + e.message,
      type: exceptionFactory.TYPES.UnExpected,
      error: e
    })
    exception.handle()
    //			log.error("系统内部执行错误:" + e.toString());
    //			alert("系统内部错误，请联系系统管理员处理。");
    //			if (window.console && console.log && e.stack) {
    //				console.log(e.stack.toString().replace(/,/g, '\n'));
    //			}
    //			var error = exceptionFactory.create({"error":e});
    //			error.markTiped();
    //			throw error;
  }
}

const getExceptionHtml = function (
  componentCode,
  windowCode,
  exceptionTitle,
  exceptionMessage
) {
  let html =
    '<html xmlns="http://www.w3.org/1999/xhtml"> <head> <meta http-equiv="Content-Type" content="text/html; charset=utf-8" /> ' +
    '<title>' +
    i18n.get('错误提示', '异常弹框的标题') +
    '</title> <style>  .ebody { font-family: Arial, 宋体, helvertica, sans-serif; font-size: 12px; font-weight: normal; text-align: center; }  ' +
    '.tips_frame { margin: 100px auto; position: absolute; top: 0px; bottom: 0px; left: 0px; right: 0px; } ' +
    '.tips_text { FONT-WEIGHT: bold; FONT-SIZE: 15px; COLOR: #FB7E04; background:url(/itop/exception/images/tips_ico.gif) no-repeat left center; padding-left: 27px; height: 30px; line-height: 30px; display: inline-block; }  ' +
    '.tips_font { FONT-WEIGHT: bold; FONT-SIZE: 13px; COLOR: #FB7E04; margin: 30px 0px 0px 0px; text-align: center; }  ' +
    '.tips_Error { COLOR: #000; margin: 0px; line-height: 30px; } </style> </head> ' +
    '<body class="ebody"> <div class="tips_frame">' +
    ' <div style="width: 400px; margin: 0 auto 10px; text-align: left; padding: 15px; border: 1px solid #aeabd3;"> ' +
    '<span class="tips_text">' +
    i18n.get('错误提示', '异常弹框的提示标题') +
    '</span> <div class="tips_font"> ' +
    (exceptionTitle ? exceptionTitle : '') +
    ' </div> ' +
    '<div class="tips_Error"> ' +
    i18n.get('构件：', '异常弹框的构件描述') +
    componentCode +
    i18n.get('，窗体：', '异常弹框的窗体描述') +
    +windowCode +
    ' </div> <textarea rows="5" cols="54" readonly="readonly" style="width:370px;"> ' +
    exceptionMessage +
    ' </textarea> </div> </div> </body> </html>'
  return html
}

export { create, getExceptionHtml, handle, isException }
