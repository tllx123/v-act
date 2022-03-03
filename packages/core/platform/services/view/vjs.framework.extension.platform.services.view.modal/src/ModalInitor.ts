import { Environment as environment } from '@v-act/vjs.framework.extension.platform.interface.environment'
import { ExceptionFactory as factory } from '@v-act/vjs.framework.extension.platform.interface.exception'

let undefined
let cssStr =
  '.fade{opacity:0;-webkit-transition:opacity .15s linear;-o-transition:opacity .15s linear;transition:opacity .15s linear}.fade.in{opacity:1}.modal{position:fixed;top:0;right:0;bottom:0;left:0;z-index:1050;display:none;overflow:hidden;-webkit-overflow-scrolling:touch;outline:0}.modal-open{overflow:hidden}.modal-open .modal{overflow-x:hidden;overflow-y:auto}.modal-content{position:relative;background-color:#fff;-webkit-background-clip:padding-box;background-clip:padding-box;border:1px solid #999;border:1px solid rgba(0,0,0,.2);border-radius:6px;outline:0;-webkit-box-shadow:0 3px 9px rgba(0,0,0,.5);box-shadow:0 3px 9px rgba(0,0,0,.5)}.modal-header{min-height:16.43px;padding:15px;border-bottom:1px solid #e5e5e5}.modal-title{margin:0;line-height:1.42857143}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}.v-modal-dialog>.modal-content{box-shadow:none;border-radius:inherit;border:3px solid #2B579A;border-top:0;padding:0;margin-bottom:2px;-webkit-box-shadow:0 5px 15px rgba(0,0,0,.5);box-shadow:0 5px 15px rgba(0,0,0,.5)}.v-modal-dialog>.modal-content>.modal-header{background-color:#2B579A;color:#FFF;padding:5px 8px}.v-modal-dialog>.modal-content>.modal-header .close{float:right;margin-top:-5px;color:#FFF;font-size:19px;font-weight:400;padding-left:16px;padding-right:16px;background-color:#C75050;opacity:1;line-height:1;text-shadow:0 1px 0 #fff;filter:alpha(opacity=20);-webkit-appearance:none;cursor:pointer;border:0}.v-modal-dialog>.modal-content>.modal-header .close:focus,.v-modal-dialog>.modal-content>.modal-header .close:hover{color:#000;text-decoration:none;cursor:pointer;filter:alpha(opacity=50);opacity:.5}.v-modal-dialog>.modal-content>.modal-header .maximum{margin-top:-5px;color:#FFF;font-size:19px;font-weight:400;padding-left:16px;padding-right:16px;padding-buttom:0;background-color:transparent;opacity:1;width:43px;height:19px;float:right;line-height:1;color:#000;border:0;text-shadow:0 1px 0 #fff;filter:alpha(opacity=20);outline:none;}.v-modal-dialog>.modal-content>.modal-header .maximum:hover{color:#000;text-decoration:none;cursor:pointer;filter:alpha(opacity=50);opacity:.5}.v-modal-dialog.v-full-center{width:1000px;height:600px;top:50%;left:50%;margin-left:-500px;margin-top:-300px;position:absolute}.v-modal-dialog.v-full-center>.modal-content{top:0;bottom:0;right:0;left:0;position:absolute}.v-modal-dialog.v-full-center>.modal-content>.modal-body{top:36px;bottom:0;right:0;left:0;position:absolute}.v-modal-dialog.v-full-screen{top:0;bottom:0;right:0;left:0;padding:5px;margin:0;position:absolute}.v-modal-dialog.v-full-screen>.modal-content{top:0;bottom:0;right:0;left:0;position:absolute}.v-modal-dialog.v-full-screen>.modal-content>.modal-body{top:36px;bottom:0;right:0;left:0;position:absolute}'

exports.initModule = function (sb) {}

const init = function () {
  if ($) {
    if (!$.fn.modal) {
      //如果bootstrap框架加入，则使用bootstrap样式
      //environment.parseCssStr(cssStr);
    }
  } else {
    throw factory.create({
      message: '模态窗体依赖JQuery，请检查JQuery是否引入！'
    })
  }
}

export {
  renderIFrameToDom,
  create,
  createOld,
  create,
  setModalWindowState,
  init
}
