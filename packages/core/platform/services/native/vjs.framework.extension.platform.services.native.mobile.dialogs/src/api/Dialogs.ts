import { AlertMessage as alertMessage } from '@v-act/vjs.framework.extension.platform.services.view.ui'
let sandbox

export function initModule(sb) {
  sandbox = sb
}

let isFunction = function (func) {
  if (typeof func == 'function') {
    return true
  } else {
    return false
  }
}

const confirmDialog = function (message, callback) {
  let result
  alertMessage.confirmDialog('', message, callback)
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

const propmtDialog = function (message, callback, secDistance) {
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
  alertMessage.propmtDialog('', _toString(message), CB, secDistance)
}

let _toString = function (content) {
  return typeof content == 'string' ? content : '' + content
}

const infoDialog = function (message, callback) {
  let result
  let CB = function (res) {
    let result = false
    if (res == 1) {
      //确认为1  取消为2
      result = true
    }
    if (isFunction(callback)) {
      callback(result)
    }
  }
  if (window.VJSBridge) {
    //移动端
    result = window.VJSBridge.plugins.vplatform.Dialogs.confirm(
      message + '',
      CB,
      '提示',
      ['确认', '取消']
    )
  } else {
    //PC端
    result = confirm(content)
    CB(result)
  }
}

const infoDialog = function (message, callback) {
  let CB = function () {
    if (isFunction(callback)) {
      CB = callback()
    }
  }
  if (window.VJSBridge) {
    //移动端
    window.VJSBridge.plugins.vplatform.Dialogs.alert(
      message + '',
      CB,
      '提示',
      '确认'
    )
  } else {
    //PC端
    alert(message)
    CB()
  }
}

const warnDialog = function (message, callback) {
  let CB = function () {
    if (isFunction(callback)) {
      CB = callback()
    }
  }
  if (window.VJSBridge) {
    //移动端
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

const errorDialog = function (message, callback) {
  let CB = function () {
    if (isFunction(callback)) {
      CB = callback()
    }
  }
  if (window.VJSBridge) {
    //移动端
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

export {
  confirmDialog,
  propmtDialog,
  infoDialog,
  infoDialog,
  warnDialog,
  errorDialog
}
