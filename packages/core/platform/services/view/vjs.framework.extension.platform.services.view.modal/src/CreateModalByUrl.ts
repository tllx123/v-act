// import { default } from 'yargs'

import { VPlatfromIframeManager as vplatformIframeManager } from '@v-act/vjs.framework.extension.platform.data.manager.runtime.window.iframe'
import { EventManager as eventManager } from '@v-act/vjs.framework.extension.platform.interface.event'
import { $ } from '@v-act/vjs.framework.extension.vendor.jquery'

import modalUtil from './Modal'

let sandbox

// export function initModule(sb) {
//   sandbox = sb
// }

const renderIFrameToDom = function (params: any) {
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
      return function (params: any) {
        if (params.title && typeof st == 'function') {
          st(params.title)
        }
      }
    })(setTitle)
  })
  eventManager.onCrossDomainEvent({
    eventName: eventManager.CrossDomainEvents.ModalWindowClose,
    handler: (function (cm) {
      return function (params: any) {
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
      //@ts-ignore
      if (typeof modalCloseCallBack == 'function') {
        //@ts-ignore
        modalCloseCallBack()
      }
    } else {
      timeoutIndex = setTimeout(iter, 100)
    }
  }
  iter()
}

const create = function (params: any) {
  if (null != vplatformIframeManager) {
    createNew(params)
  } else {
    createOld(params)
  }
}

/**
 * 根据url创建一个模态窗口
 *
 * */
let createNew = function (params: any) {
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
      title: title,
      width: width,
      windowState: windowState,
      formBorderStyle: null,
      // windowState: null,
      maximizeBox: true,
      modalCloseCallBack: modalCloseCallBack,
      height: height
    }
  })
}

const createOld = function (params: any) {
  let url = params.url,
    title = params.title,
    width = params.width,
    windowState = params.windowState,
    modalCloseCallBack = params.callback,
    height = params.height
  let win: any
  let timeoutIndex: any
  let closeFuncHandler: any
  params['rendered'] = function (containerCode: string, closeFunc: any) {
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
        return function (params: any) {
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
                  //@ts-ignore
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
      handler: function (params: any) {
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
  params['closed'] = (function (win) {
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
let getUrlHost = function (url: string) {
  if (url) {
    let dom = document.createElement('a')
    dom.href = url
    return dom.host
  }
}

export default { create, createOld, renderIFrameToDom }
