import { UUID as uuidUtil } from '@v-act/vjs.framework.extension.util'
import { EventManager as eventManager } from '@v-act/vjs.framework.extension.platform.interface.event'
import { VPlatfromIframeManager as vplatformIframeManager } from '@v-act/vjs.framework.extension.platform.data.manager.runtime.window.iframe'
import * as modalUtil from './Modal'

let sandbox

exports.initModule = function (sb) {
  sandbox = sb
}

const renderIFrameToDom = function (params) {
  let containerCode = params.containerCode
  let url = params.url
  let closeModal = params.closeModal
  let setTitle = params.setTitle
  let iframeId = 'iframe_modal_by_url'
  let iframeDom =
    '<iframe id="' +
    iframeId +
    '" name="' +
    iframeId +
    '" framespacing="0" frameborder="0" height="100%" width="100%" border="0"></iframe>'
  $('#' + containerCode).append(iframeDom)
  $('#' + containerCode).css('overflow', 'hidden')
  let timeoutIndex
  let closeFuncHandler
  let win = window.open(url, iframeId)
  eventManager.onCrossDomainEvent({
    eventName: eventManager.CrossDomainEvents.SetModalWindowTitle,
    handler: (function (st) {
      return function (params) {
        if (params.title && typeof st == 'function') {
          st(params.title)
        }
      }
    })(setTitle)
  })
  eventManager.onCrossDomainEvent({
    eventName: eventManager.CrossDomainEvents.ModalWindowClose,
    handler: (function (cm) {
      return function (params) {
        if (typeof cm == 'function') {
          cm(containerCode)
        }
      }
    })(closeModal)
  })
  //		window.addEventListener('message', function(e) {
  //			debugger;
  //			if(e && e.data){
  //				var _data = e.data;
  //				if(typeof(_data) == "object" && _data["TOONE_IDEN"] == "TOONE_COM_CN_V3_PLATFORM_POST_MESSAGE_IDEN"){
  //					var send_window_info = _data["SEND_WINDOW_INFO"];
  //					if(send_window_info && typeof(setTitle) == "function"){
  //						setTitle(send_window_info);
  //					}
  //				}
  //			}
  //	    }, false);
  let iter = function () {
    if (!win || win.closed) {
      if (typeof modalCloseCallBack == 'function') {
        modalCloseCallBack()
      }
    } else {
      timeoutIndex = setTimeout(iter, 100)
    }
  }
  iter()
}

const create = function (params) {
  if (null != vplatformIframeManager) {
    createNew(params)
  } else {
    exports.createOld(params)
  }
}

/**
 * 根据url创建一个模态窗口
 *
 * */
let createNew = function (params) {
  let url = params.url,
    title = params.title,
    width = params.width,
    windowState = params.windowState,
    modalCloseCallBack = params.callback,
    height = params.height
  if (url.indexOf('http') == -1) {
    let last = url[0] == '/' ? '' : '/'
    url = window.location.protocol + '//' + window.location.host + last + url
  }
  vplatformIframeManager.mounted({
    url: url,
    oldModalParams: params,
    modalParams: {
      title: params.title,
      width: params.width,
      windowState: windowState,
      formBorderStyle: null,
      windowState: null,
      maximizeBox: true,
      modalCloseCallBack: params.callback,
      height: params.height
    }
  })
}

const createOld = function (params) {
  let url = params.url,
    title = params.title,
    width = params.width,
    windowState = params.windowState,
    modalCloseCallBack = params.callback,
    height = params.height
  let win
  let timeoutIndex
  let closeFuncHandler
  params['rendered'] = function (containerCode, closeFunc) {
    closeFuncHandler = closeFunc
    let iframeId = 'iframe_modal_by_url_' + new Date().getTime()
    let iframeObj = document.getElementById(iframeId)
    if (iframeObj == null) {
      let iframeDom =
        '<iframe id="' +
        iframeId +
        '" name="' +
        iframeId +
        '" framespacing="0" frameborder="0" height="100%" width="100%" border="0"></iframe>'
      $('#' + containerCode).append(iframeDom)
    }
    $('#' + containerCode).css('overflow', 'hidden')
    win = window.open(url, iframeId)
    //注册跨域事件：获取子消息
    eventManager.onCrossDomainEvent({
      eventName: eventManager.CrossDomainEvents.CustomEvent,
      eventInfo: {
        condition: "type=='GetChildMsg'",
        isDelete: true
      },
      handler: (function (_win) {
        return function (params) {
          if (params && params.MsgEvent) {
            let source = params.MsgEvent.source
            if (source === _win) {
              //如果是同一个
              let childPM = params.childPM
              eventManager.fireCrossDomainEvent({
                eventName: eventManager.CrossDomainEvents.CustomEvent,
                eventInfo: {
                  nowPM: childPM,
                  type: 'SetModalUrlIden'
                },
                win: _win,
                params: {
                  parentPM: vdk.tmpStorage.iden
                }
              })
            }
          }
        }
      })(win)
    })
    eventManager.onCrossDomainEvent({
      eventName: eventManager.CrossDomainEvents.ModalWindowClose,
      handler: function (params) {
        if (closeFuncHandler) {
          let func = closeFuncHandler
          closeFuncHandler = null
          func()
        }
        if (!win.closed) {
          clearTimeout(timeoutIndex)
          modalCloseCallBack()
        }
      }
    })
    //			window.addEventListener('message', function(e) {
    //				debugger;
    //				if(e && e.data){
    //					var _data = e.data;
    //					if((typeof(_data) == "string" && _data == "TOONE_COM_CN_V3_PLATFORM_POST_MESSAGE_IDEN")||(typeof(_data) == "object" && _data["TOONE_IDEN"] == "TOONE_COM_CN_V3_PLATFORM_POST_MESSAGE_IDEN")){
    //						if(closeFuncHandler){
    //							var func = closeFuncHandler;
    //							closeFuncHandler=null;
    //							func();
    //						}
    //						if(!win.closed) {
    //							clearTimeout(timeoutIndex);
    //							modalCloseCallBack();
    //						}
    //					}
    //				}
    ////				if(e.data["TOONE_IDEN"] == "TOONE_COM_CN_V3_PLATFORM_POST_MESSAGE_IDEN"){
    ////					if(closeFuncHandler){
    ////						var func = closeFuncHandler;
    ////						closeFuncHandler=null;
    ////						func();
    ////					}
    ////					if(!win.closed) {
    ////						clearTimeout(timeoutIndex);
    ////						modalCloseCallBack();
    ////					}
    ////				}
    //		    }, false);
    let iter = function () {
      if (!win || win.closed) {
        if (typeof modalCloseCallBack == 'function') {
          modalCloseCallBack()
        }
      } else {
        timeoutIndex = setTimeout(iter, 100)
      }
    }
    iter()
  }
  params['closed'] = (function () {
    return function () {
      if (closeFuncHandler) {
        var func = closeFuncHandler
        closeFuncHandler = null
        func()
      }
      if (!win.closed) {
        clearTimeout(timeoutIndex)
        modalCloseCallBack()
      }
    }
  })(win)
  modalUtil.create(params)
}

/**
 * 获取url地址中的域名
 * @param url {String} 链接地址
 * @return 域名
 * */
let getUrlHost = function (url) {
  if (url) {
    let dom = document.createElement('a')
    dom.href = url
    return dom.host
  }
}

export { renderIFrameToDom, create, createOld }
