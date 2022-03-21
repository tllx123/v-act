import { AlertMessage as alertMessage } from '@v-act/vjs.framework.extension.platform.services.view.ui'

// let sandbox

// export function initModule(sb) {
//   sandbox = sb
// }

let isFunction = function (func: any) {
  if (typeof func == 'function') {
    return true
  } else {
    return false
  }
}

const confirmDialog = function (message: string, callback: any) {
  let result
  alertMessage.confirmDialog('', message, callback, false)
  //		if(window.VJSBridge){//移动端
  //			var cb = function(arg1,arg2){
  //				if(isFunction(callback) && (arg1 == 1)){
  //					callback(true);
  //				}else if(isFunction(callback) && (arg1 == 2)){
  //					callback(false);
  //				}
  //			}
  //			result = window.VJSBridge.plugins.vplatform.Dialogs.confirm(message+"",cb,"确认框",["确认","取消"]);
  //		}else{//PC端
  //			alertMessage.confirmDialog("", message, callback);
  ////			result = confirm(message);
  ////			if(isFunction(callback)){
  ////				callback(result);
  ////			}
  //		}
  return result
}

const propmtDialog = function (
  message: string,
  callback: any,
  secDistance: any
) {
  let CB = function () {
    if (isFunction(callback)) {
      CB = callback()
    }
  }
  //		if(window.VJSBridge){//移动端
  ////			window.VJSBridge.plugins.vplatform.Dialogs.alert(message+"",CB,"提示","确认");
  //			isMobile = true;
  //		}
  //		else{//PC端
  ////			alert(message);
  //			//2017-02-09 liangzc：显示规则需要支持设置倒计时描述
  //			alertMessage.propmtDialog("", _toString(message), CB,secDistance);
  //		}
  alertMessage.propmtDialog('', _toString(message), CB, secDistance, false)
}

let _toString = function (content: any) {
  return typeof content == 'string' ? content : '' + content
}

const infoDialog = function (message: string, callback: any) {
  let result
  let CB = function (res: any) {
    let result = false
    if (res == 1) {
      //确认为1  取消为2
      result = true
    }
    if (isFunction(callback)) {
      callback(result)
    }
  }
  //@ts-ignore
  if (window.VJSBridge) {
    //移动端
    //@ts-ignore
    result = window.VJSBridge.plugins.vplatform.Dialogs.confirm(
      message + '',
      CB,
      '提示',
      ['确认', '取消']
    )
  } else {
    //PC端
    //@ts-ignore
    result = confirm(content)
    CB(result)
  }
}

const warnDialog = function (message: string, callback: any) {
  let CB = function () {
    if (isFunction(callback)) {
      CB = callback()
    }
  }
  //@ts-ignore
  if (window.VJSBridge) {
    //移动端
    //@ts-ignore
    window.VJSBridge.plugins.vplatform.Dialogs.alert(
      message + '',
      CB,
      '警告',
      '确认'
    )
  } else {
    //PC端
    alert(message)
    CB()
  }
}

const errorDialog = function (message: string, callback: any) {
  let CB = function () {
    if (isFunction(callback)) {
      CB = callback()
    }
  }
  //@ts-ignore
  if (window.VJSBridge) {
    //移动端
    //@ts-ignore
    window.VJSBridge.plugins.vplatform.Dialogs.alert(
      message + '',
      CB,
      '错误',
      '确认'
    )
  } else {
    //PC端
    alert(message)
    CB()
  }
}

export { confirmDialog, errorDialog, infoDialog, propmtDialog, warnDialog }
