import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { EventManager as eventManager } from '@v-act/vjs.framework.extension.platform.interface.event'
import { log as logUtil } from '@v-act/vjs.framework.extension.util'
import { Modal as modalUtil } from '@v-act/vjs.framework.extension.platform.services.view.modal'
import { CreateModalByUrl as modalByUrlUtil } from '@v-act/vjs.framework.extension.platform.services.view.modal'
import { JsonUtil as jsonUtils } from '@v-act/vjs.framework.extension.util'
import { Environment as environmentUtils } from '@v-act/vjs.framework.extension.platform.interface.environment'
import { StorageManager as storageManager } from '@v-act/vjs.framework.extension.platform.interface.storage'

let Open_Url_Mapping_Storage_Token = 'Open_Url_Mapping_Storage_Token',
  missAtt = [
    'operation',
    'componentCode',
    'windowCode',
    'moduleId',
    'vplatform_container_iden'
  ],
  //需要执行旧逻辑的域名标识列表
  OldLogicOrgin = [],
  //临时兼容，需要补上处理
  UrlDomMapping = {},
  //是否兼容旧服务的模态
  CompatibleModal = false

const initModule = function (sb) {}

let getStorage = function () {
  return storageManager.get(
    storageManager.TYPES.MAP,
    Open_Url_Mapping_Storage_Token
  )
}
/**
 * 解码token
 * */
let parseToken = function (token) {
  let result = {}
  try {
    if (null != token) {
      let tmp = token
      if (token.indexOf('{') == -1) {
        let count = 3
        let tmpToken = token
        while (count > 0) {
          tmpToken = decodeURIComponent(tmpToken)
          if (tmpToken.indexOf('{') != -1) {
            tmp = tmpToken
            break
          }
          count--
        }
      }
      result = jsonUtils.json2obj(tmp)
    }
  } catch (e) {}
  return result
}
/**
 * 解析url
 * */
let parseUrl = function (sourceUrl, targetResult) {
  let url = sourceUrl
  if (url.indexOf('http') != 0) {
    //没有域名开头
    let last = url[0] == '/' ? '' : '/'
    if (targetResult && targetResult.origin) {
      url = targetResult.origin + last + url
    } else {
      url = window.location.protocol + '//' + window.location.host + last + url
    }
  }
  let result = {
    source: url,
    isSaasPortal: false, //判断是否统一门户
    saasCommand: [],
    params: {}
  }
  if (targetResult) {
    //上一个调用过来
    result.parent = targetResult.isError
    result.parent = targetResult
  }
  let urlArr = url.split('//')
  result.protocal = urlArr[0]
  url = urlArr[1]
  let firstIndex = url.indexOf('/')
  if (firstIndex != -1) {
    result.host = url.substring(0, firstIndex)
    result.origin = result.protocal + '//' + result.host
    url = url.substring(firstIndex)
    firstIndex = url.indexOf('?')
    if (firstIndex != -1) {
      result.pathname = url.substring(0, firstIndex)
      let search = url.substring(firstIndex)
      result.search = search
      let startIndex = search.indexOf('?moduleId=')
      if (startIndex != -1) {
        result.isError = true
        result.type = '2.x'
        if (search.indexOf('#') == -1 && search.indexOf('%23') != -1) {
          try {
            search = decodeURIComponent(search)
            result.search = search
          } catch (e) {}
        }
        urlArr = search.split('#')
        if (urlArr.length != 1) {
        } else {
          result.isError = true
          logUtil.log('已忽略解析的地址:' + sourceUrl)
        }
      } else {
        startIndex = search.indexOf('?operation=Form')
        if (
          startIndex != -1 ||
          url.indexOf('/module-operation!executeOperation') != -1
        ) {
          let contextPath = url.substring(0, url.lastIndexOf('/', firstIndex)) //web上下文
          result.contextPath = contextPath ? contextPath : ''
          result.type = '3.x'
          //如果operation不是form标识是统一门户增强后的地址
          let isSaasPortal =
            startIndex == -1 && search.indexOf('?operation=') != -1
              ? true
              : false
          if (search.indexOf('&') == -1 && search.indexOf('%26') != -1) {
            try {
              search = decodeURIComponent(search)
            } catch (e) {}
          }
          urlArr = search.substring(1).split('&')
          let params = result.params
          for (let i = 0; i < urlArr.length; i++) {
            let arr = urlArr[i].split('=')
            let code = arr[0]
            if (code == 'token') {
              try {
                let token = parseToken(arr[1])
                if (token && token.data && token.data.inputParam) {
                  params[code] = token.data.inputParam
                }
              } catch (e) {}
            } else {
              params[code] = arr[1]
            }
          }
          if (isSaasPortal) {
            result.isSaasPortal = true
            if (params.operation) {
              result.saasCommand.push(params.operation)
            }
            let redirect_uri = params.redirect_uri
            if (redirect_uri) {
              redirect_uri = decodeURIComponent(redirect_uri)
              result = parseUrl(redirect_uri, result)
            } else {
              result.isError = true
            }
          }
        } else {
          result.isError = true
          logUtil.log('已忽略解析的地址: ' + sourceUrl)
        }
      }
    } else {
      result.isError = true
      result.pathname = url
    }
  } else {
    result.isError = true
    result.origin = result.host = url
    result.pathname = '/'
    result.search = ''
  }
  return result
}

const isVPlatformUrl = function (url) {
  let urlObj = parseUrl(url)
  return isPaltformUrl(urlObj)
}

/**
 * 判断是否平台的url
 * */
let isPaltformUrl = function (urlObj) {
  let pathName = urlObj.pathname
  if ('/module-operation!executeOperation' == pathName) {
    return true
  }
  return false
}
/**
 * 获取dom对象
 * */
let getDomObj = function (dom) {
  let result = dom
  if (typeof dom == 'string') {
    result = $('#' + dom)
  } else {
    result = $(dom)
    let domId = result.attr('id')
    if (!domId) {
      let newId = 'vplatform_' + new Date().getTime()
      result.attr('id', newId)
    }
  }
  return result
}
/**
 * 每个域名生成一个md5作为key
 * */
let getObjKey = function (urlObj) {
  let keyArr = [urlObj.origin]
  if (keyArr.isSaasPortal && keyArr.saasCommand) {
    //是统一门户，并且是有command
    let saascommand = keyArr.saasCommand
    if (saascommand.length > 0) {
      keyArr = keyArr.concat(saascommand)
    }
  }
  let parent = urlObj.parent
  if (parent) {
    keyArr = keyArr.concat(getObjKey(parent))
  }
  return keyArr
}
/**
 * 每个域名生成一个md5作为key
 * @param	{Object}	urlObj
 * @param	{Boolean}	isAddWindowInfo 是否加上窗体信息
 * */
let getKey = function (urlObj, isAddWindowInfo) {
  let keyArr = getObjKey(urlObj)
  if (isAddWindowInfo && urlObj.params) {
    let params = urlObj.params
    if (params.componentCode) {
      keyArr.push(params.componentCode)
    }
    if (params.windowCode) {
      keyArr.push(params.windowCode)
    }
  }
  let key = keyArr.join('')
  return VMetrix._fn.md5(key)
}
/**
 * 判断是否在平台iframe管理打开的首页
 * */
let isIframeContainerIndex = function (url) {
  let urlObj = parseUrl(url)
  if (
    urlObj &&
    urlObj.params &&
    null != urlObj.params.vplatform_container_iden
  ) {
    //由平台iframe管理器打开
    return true
  }
  return false
}

const handleUrl = function (params) {
  let url = params.url
  let urlObj = parseUrl(url)
}

const handleScope = function (params) {
  let windowScope = params.scope
  let nowPM = vdk.postMsg.getPMIden()
  //注册跨域事件：设置窗体域由模态链接打开
  eventManager.onCrossDomainEvent({
    eventName: eventManager.CrossDomainEvents.CustomEvent,
    eventInfo: {
      condition: "type=='GetParentIden'&&nowPM=='" + nowPM + "'",
      isDelete: true
    },
    handler: (function (scope) {
      return function (params) {
        let parentPM = params.parentPM
        scope.setOpenMode(scopeManager.OpenMode.ModalContaniner)
        vdk.postMsg.setParentPMIden(parentPM)
        if (params._$urlObj) {
          vdk.postMsg.updateInfoByScopeId(scope.getInstanceId(), {
            _$urlObj: params._$urlObj
          })
        }
      }
    })(windowScope)
  })
  eventManager.fireCrossDomainEvent({
    eventName: eventManager.CrossDomainEvents.CustomEvent,
    eventInfo: {
      type: 'SetChildPM'
    },
    params: {
      Iden: nowPM,
      newTitle: document.title,
      isInit: true,
      _version: vdk.postMsg.getVersion && vdk.postMsg.getVersion() //传递版本
    }
  })
  //		var url = params.url;
  //		var scope = params.scope;
  //		var urlObj = parseUrl(url);
  //		if(urlObj && urlObj.params){
  //			var up = urlObj.params;
  //			var parentPM = up.vplatform_container_iden;
  //			var tmpCPM = up.vplatform_cpm;
  //			if(null != parentPM && "" != parentPM){//由平台iframe管理器打开的首页
  //				scope.setOpenMode(scopeManager.OpenMode.ModalContaniner);
  //				vdk.postMsg.setParentPMIden(parentPM);
  //				if(null != tmpCPM && "" != tmpCPM){
  //					var nowPM = vdk.postMsg.getPMIden();
  //					eventManager.fireCrossDomainEvent({
  //						eventName: eventManager.CrossDomainEvents.CustomEvent,
  //						eventInfo : {
  //							type : "SetChildPM",
  //							parentPM : parentPM
  //						},
  //			            params: {
  //			            	Iden : nowPM,
  //			            	newTitle : document.title,
  //			            	tmpCPM : tmpCPM
  //			            }
  //					})
  //				}
  //			}
  //		}
}

/**
 * 打开非平台链接，走旧逻辑
 * */
let oldLogic = function (params) {
  let tmpDom = params.dom
  if (tmpDom) {
    //组件容器直接创建iframe打开即可
    let url = params.url
    let iframeId = 'iframe_modal_by_url_' + new Date().getTime()
    let iframeDom =
      '<iframe id="' +
      iframeId +
      '" name="' +
      iframeId +
      '" framespacing="0" frameborder="0" height="100%" width="100%" border="0"></iframe>'
    tmpDom.append(iframeDom)
    window.open(url, iframeId)
  } else {
    modalByUrlUtil.createOld(params.oldModalParams)
  }
}
let initNewPageCrossDomainEvent = function (params) {
  //当前页面的vdk标识
  let pmIden = params.pmIden
  let key = params.key
  let closeCallBack = params.closeCallBack
  let win = params.win
  let setChildFunc = params.setChildFunc
    ? params.setChildFunc
    : (function (_key, _win) {
        return function (params) {
          var source = params.MsgEvent.source
          if (source != _win) {
            return
          }
          var stroage = getStorage()
          var tmpCPM = params.tmpCPM
          var newTitle = params.newTitle
          var domInfo = stroage.get(_key)
          var _sourceTitle = getTitle(_key)
          if (_sourceTitle) {
            /* 先打开设置标题的（模态标题），再打开不设置标题的（还原窗体标题），最后打开设置标题的（模态标题） */
            newTitle = _sourceTitle
          }
          /* _fixTitle处理模态方式打开窗口后，标题被还原的问题Task20210908057，后续支持动态修改标题时，注意验证此场景 */
          if (
            newTitle &&
            '' != newTitle &&
            typeof domInfo.setTitleFunc == 'function'
          ) {
            domInfo.setTitleFunc(newTitle)
          }
          var childPM = params.Iden
          eventManager.fireCrossDomainEvent({
            eventName: eventManager.CrossDomainEvents.CustomEvent,
            eventInfo: {
              nowPM: childPM,
              type: 'GetParentIden'
            },
            win: _win,
            params: {
              parentPM: pmIden
            }
          })
          var domIds = domInfo.domIds
          for (var key in domIds) {
            if (domIds[key].indexOf('TEMP') != -1) {
              domIds[key] = childPM
              break
            }
          }
        }
      })(key, win)
  //用于建立链接
  eventManager.onCrossDomainEvent({
    eventName: eventManager.CrossDomainEvents.CustomEvent,
    eventInfo: {
      condition: "type=='SetChildPM'"
    },
    handler: setChildFunc
  })
  //用于iframe内部跳转
  eventManager.onCrossDomainEvent({
    eventName: eventManager.CrossDomainEvents.CustomEvent,
    eventInfo: {
      condition: "type=='ResetUrl'"
    },
    handler: (function (_key) {
      return function (params) {
        let childPM = params.childPM
        let newUrl = params.url
        let stroage = getStorage()
        let domInfo = stroage.get(_key)
        if (domInfo) {
          domInfo.domIds.domId = 'TEMP_' + new Date().getTime()
          domInfo.isReset = true
        }
      }
    })(key)
  })
  let closeModeFunc = params.closeModeFunc
    ? params.closeModeFunc
    : (function (_key) {
        return function (params) {
          var pmIden = params.pmIden
          var stroage = getStorage()
          var domInfo = stroage.get(_key)
          var domIds = domInfo.domIds
          var renderParams = domInfo.renderParams
          if (!renderParams.isHide) {
            //模态已经主动关闭，不需要内部通信关闭
            for (var key in domIds) {
              if (domIds[key] == pmIden) {
                renderParams.isHide = true
                renderParams.hideFunc(renderParams.modalCode)
                break
              }
            }
            var closeParams = {
              isClickConfirm: params.isClickConfirm,
              outputs: params.outputs
            }
            if (typeof renderParams.closeCallback == 'function') {
              //优先执行，因为会动态更新
              renderParams.closeCallback(closeParams)
            } else if (typeof closeCallBack == 'function') {
              closeCallBack(closeParams)
            } else {
              //此方式应该废弃
              eventManager.fireCrossDomainEvent({
                eventName: eventManager.CrossDomainEvents.CustomEvent,
                eventInfo: {
                  type: 'CloseSuccess'
                },
                params: {
                  isClickConfirm: params.isClickConfirm,
                  outputs: params.outputs
                }
              })
            }
          }
        }
      })(key)
  eventManager.onCrossDomainEvent({
    eventName: eventManager.CrossDomainEvents.CustomEvent,
    eventInfo: {
      condition: "type=='CloseModal'&&parentPM=='" + pmIden + "'"
    },
    handler: closeModeFunc
  })
  let setModalTitle = params.setModalTitle
  if (typeof setModalTitle == 'function') {
    eventManager.onCrossDomainEvent({
      eventName: eventManager.CrossDomainEvents.CustomEvent,
      eventInfo: {
        condition: "type=='SetTitle'&&parentPM=='" + pmIden + "'"
      },
      handler: (function (titleFunc, _key) {
        return function (params) {
          let title = params.title
          let _sourceTitle = getTitle(_key)
          if (_sourceTitle) {
            /* 先打开设置标题的（模态标题），再打开不设置标题的（还原窗体标题），最后打开设置标题的（模态标题） */
            title = _sourceTitle
          }
          if (title && typeof titleFunc == 'function') {
            titleFunc(title)
          }
        }
      })(setModalTitle, key)
    })
  }
}
/**
 * 获取标题
 * */
let getTitle = function (key) {
  let storage = getStorage()
  if (storage && storage.containsKey(key) && storage.get(key)) {
    let renderParams = storage.get(key).renderParams
    if (renderParams && renderParams.title) {
      return renderParams.title
    }
  }
  return null
}
/**
 * 平台组件容器逻辑
 * */
let excuteContainerLogic = function (urlObj, params) {
  let dom = getDomObj(params.dom)
  if (dom.length < 1) {
    logUtil.warn('打开url失败. 原因：无法在指定位置添加元素.')
    return
  }
  //要打开的链接
  let url = params.url
  //容器id
  let domId = dom.attr('id')
  //临时兼容
  UrlDomMapping[url] = domId
  //存储标识
  let domIdKey = 'container_' + domId
  //链接域标识
  let urlKey = getKey(urlObj)
  //窗体标识
  let winKey = getKey(urlObj, true)
  //窗体退出后执行
  let closedFunc = params.closed
  /**
   * 存储格式：
   * {
   * 	domIdKey
   * 	{
   * 		'domIds'
   * 		{
   * 				urlKey :
   * 		},
   * 		'iframeObj':{Object},//iframe的winow对象
   * 	}
   * }
   * */
  let storage = getStorage()
  //映射信息
  let mappingInfos
  if (storage.containsKey(domIdKey)) {
    mappingInfos = storage.get(domIdKey)
  } else {
    mappingInfos = {}
  }
  let domInfo = mappingInfos[urlKey]
  let openToExistIframe = function () {
    let urlParams = urlObj.params
    let openParams = {
      _$urlObj: urlObj
    }
    for (let key in urlParams) {
      let value = urlParams[key]
      if (missAtt.indexOf(key) != -1) {
        openParams[key] = value
      } else if (key == 'token') {
        openParams.inputParams = urlParams[key]
      }
    }
    if (!domInfo.winKeyInfos) {
      domInfo.winKeyInfos = {}
    }
    domInfo.winKeyInfos[winKey] = {
      close: closedFunc
    }
    if (!openParams.inputParams) {
      openParams.inputParams = { variable: {} }
    }
    eventManager.fireCrossDomainEvent({
      eventName: eventManager.CrossDomainEvents.OpenWindow,
      eventInfo: {
        nowPM: domInfo.domIds[domId]
      },
      params: openParams,
      win: domInfo.iframeObj
    })
  }

  let setChildFunc = function (_domIdKey, _urlKey, _win, _pmIden, _urlObj) {
    return function (params) {
      let source = params.MsgEvent.source
      if (source != _win) {
        return
      }
      let childPM = params.Iden
      eventManager.fireCrossDomainEvent({
        eventName: eventManager.CrossDomainEvents.CustomEvent,
        eventInfo: {
          nowPM: childPM,
          type: 'GetParentIden'
        },
        win: _win,
        params: {
          parentPM: _pmIden,
          _$urlObj: _urlObj
        }
      })
      let stroage = getStorage()
      let _domInfos = stroage.get(_domIdKey)[_urlKey]
      _domInfos.iframeState = 'Reusable' //可复用
      let domIds = _domInfos.domIds
      for (let key in domIds) {
        if (domIds[key].indexOf('TEMP') != -1) {
          domIds[key] = childPM
          break
        }
      }
    }
  }
  let createNewIframe = function () {}
  if (!domInfo) {
    //如果当前域之前没有在指定的dom里面打开过或者是等待开启，那就创建一个新的iframe
    let pmIden = vdk.postMsg.getPMIden() //当前页面vdk标识
    let stroage = getStorage()
    let iframeId = 'iframe_modal_by_url_' + new Date().getTime()
    let iframeObj = document.getElementById(iframeId)
    let iframeDom =
      '<iframe id="' +
      iframeId +
      '" name="' +
      iframeId +
      '" framespacing="0" frameborder="0" height="100%" width="100%" border="0"></iframe>'
    dom.append($(iframeDom))
    let tmpChildPM = 'TEMP_' + new Date().getTime()
    let win = window.open(url, iframeId)
    initNewPageCrossDomainEvent({
      pmIden: pmIden,
      key: domIdKey,
      win: win,
      setChildFunc: setChildFunc(domIdKey, urlKey, win, pmIden, urlObj)
    })
    let closeWindowCallback = function (
      _domIdKey,
      _urlKey,
      _win,
      _pmIden,
      _urlObj
    ) {
      return function (params) {
        let stroage = getStorage()
        let _domInfos = stroage.get(_domIdKey)[_urlKey]
        let _urlObj = params._urlObj
        if (_urlObj && _domInfos['winKeyInfos']) {
          let tmpWinKey = getKey(_urlObj, true)
          let winInfo = _domInfos['winKeyInfos'][tmpWinKey]
          if (typeof winInfo.close == 'function') {
            winInfo.close()
          }
        }
      }
    }
    //用于建立链接
    eventManager.onCrossDomainEvent({
      eventName: eventManager.CrossDomainEvents.CustomEvent,
      eventInfo: {
        condition: "type=='CloseWindow'"
      },
      handler: closeWindowCallback(domIdKey, urlKey, win, pmIden, urlObj)
    })
    let domIds = {}
    domIds[domId] = tmpChildPM //保存对应子节点的标识
    let winKeyInfos = {}
    winKeyInfos[winKey] = {
      iframeId: iframeId,
      win: win,
      close: closedFunc
    }
    mappingInfos[urlKey] = {
      domId: domId,
      domIds: domIds,
      winKeyInfos: winKeyInfos,
      iframeState: 'WaitOpen', //等待打开
      iframeObj: win
    }
    stroage.put(domIdKey, mappingInfos)
  } else if (domInfo.iframeState == 'WaitOpen') {
    setTimeout(function () {
      openToExistIframe()
    }, 2000)
  } else {
    openToExistIframe()
  }
}
/**
 * 平台模态逻辑，每个模态框只能存一个iframe，此iframe只能存一个域，打开不同域，需要创建不同模态框,暂不设计成一个模态框里同时存在多个iframe
 * */
let excuteModalLogic = function (urlObj, params) {
  //要打开的链接
  let url = params.url
  //链接域标识
  let urlKey = getKey(urlObj)
  //存储标识
  let domIdKey = 'modal_' + urlKey
  //模态参数
  let modalParams = params.modalParams
  //模态关闭后的回调
  let modalCloseCallBack = modalParams ? modalParams.modalCloseCallBack : null
  /**
   * 存储格式：
   * {
   * 	domIdKey
   * 	{
   * 		'domId' : {String} domId
   * 		"renderParams": {Object},//渲染对象
   * 		'iframeObj':{Object},//iframe的winow对象
   * 	}
   * }
   * */
  let storage = getStorage()
  //映射信息
  let mappingInfos
  //是否已经创建模态/iframe
  let exist = false
  if (storage.containsKey(domIdKey)) {
    mappingInfos = storage.get(domIdKey)
    exist = true
  } else {
    mappingInfos = {}
  }
  let callback = function (dom, closeModalFunc, setTitleFunc, renderParams) {
    let dom = getDomObj(dom)
    if (dom.length < 1) {
      logUtil.warn('打开url失败. 原因：无法在指定位置添加元素.')
      return
    }
    let domId = dom.attr('id')
    if (renderParams) {
      $('#' + domId).css('overflow', 'hidden')
      //更新关闭后回调：vds提供的dialog接口，关闭回调每次都不一样，所以不能服用
      if (renderParams.closeCallback != modalCloseCallBack) {
        renderParams.closeCallback = modalCloseCallBack
      }
    }
    let iframeId
    let pmIden = vdk.postMsg.getPMIden() //当前页面vdk标识
    let stroage = getStorage()
    if (!exist) {
      //没有创建iframe
      iframeId = 'iframe_modal_by_url_' + new Date().getTime()
      let iframeDom =
        '<iframe id="' +
        iframeId +
        '" name="' +
        iframeId +
        '" framespacing="0" frameborder="0" height="100%" width="100%" border="0"></iframe>'
      dom.append($(iframeDom))
      let prefix = '&'
      if (url.indexOf('?') == -1) {
        prefix = '?'
      }
      //新页面的vdk标识，临时的，等新页面初始化再发起postmessage进行更新，此时建立父子链接关系，靠这个判断是否能用新逻辑
      let tmpChildPM = 'TEMP_' + new Date().getTime()
      //两个标识，一个用来标识父的vdk，一个是临时的子vdk，通信都得带上自己vdk的标识以及给谁通信
      //移除判断
      //				url = url + prefix + "vplatform_container_iden="+pmIden+ "&vplatform_cpm=" + tmpChildPM;
      let win = window.open(url, iframeId)
      //初始化新页面的跨域监听事件
      initNewPageCrossDomainEvent({
        pmIden: pmIden,
        win: win,
        closeCallBack: modalCloseCallBack,
        setModalTitle: setTitleFunc,
        key: domIdKey,
        title: renderParams.title
      })
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
                    parentPM: pmIden
                  }
                })
              }
            }
          }
        })(win)
      })
      let domIds = {}
      domIds.domId = tmpChildPM //保存对应子节点的标识
      mappingInfos = {
        domId: domId, //当前域所在的dom的id
        domIds: domIds, //子域vdk标识
        closeModalFunc: closeModalFunc,
        setTitleFunc: setTitleFunc,
        renderParams: renderParams,
        iframeObj: win
      }
      storage.put(domIdKey, mappingInfos)
      if (!CompatibleModal) {
        CompatibleModal = true
        //兼容旧服务
        eventManager.onCrossDomainEvent({
          eventName: eventManager.CrossDomainEvents.ModalWindowClose,
          handler: (function (cf, _k) {
            return function (params) {
              if (OldLogicOrgin.indexOf(_k) != -1) {
                //已触发另一个事件
                return
              }
              let stroage = getStorage()
              let info = stroage.get(_k)
              if (
                !info ||
                !info.domIds ||
                !info.domIds.domId ||
                info.domIds.domId.indexOf('TEMP_') != -1
              ) {
                //如果没有或者没有更新子vdk，表示url所在服务是旧的，后续走旧逻辑
                if (OldLogicOrgin.indexOf(_k) == -1) {
                  OldLogicOrgin.push(_k)
                }
                if (info && typeof info.closeModalFunc == 'function') {
                  if (info.renderParams) info.renderParams.isHide = true //处理打开立即关闭后，执行多次回调的问题
                  info.closeModalFunc()
                }
                if (typeof cf == 'function') {
                  cf()
                }
              }
            }
          })(modalCloseCallBack, domIdKey)
        })
      }
      let iter = function () {
        if (!win || win.closed) {
          if (typeof modalCloseCallBack == 'function') {
            //打开后立即关闭会多次执行
            if (
              !mappingInfos ||
              !mappingInfos.renderParams ||
              !mappingInfos.renderParams.isHide
            )
              modalCloseCallBack()
          }
        } else {
          timeoutIndex = setTimeout(iter, 100)
        }
      }
      iter()
    } else {
      vdk.postMsg._MODALCLOSECF = modalCloseCallBack
      let mappingInfos = stroage.get(domIdKey)
      //关闭后再次打开需要显示
      let renderParams = mappingInfos.renderParams
      if (renderParams) {
        delete renderParams['isHide']
        if (typeof renderParams.showFunc == 'function') {
          renderParams.showFunc(renderParams.modalCode, modalParams)
        }
      }
      let urlParams = urlObj.params
      let openParams = {}
      for (let key in urlParams) {
        let value = urlParams[key]
        if (missAtt.indexOf(key) != -1) {
          openParams[key] = value
        } else if (key == 'token') {
          openParams.inputParams = urlParams[key]
        }
      }
      if (!openParams.inputParams) {
        openParams.inputParams = { variable: {} }
      }
      eventManager.fireCrossDomainEvent({
        eventName: eventManager.CrossDomainEvents.OpenWindow,
        eventInfo: {
          nowPM: mappingInfos.domIds.domId
        },
        params: openParams,
        win: mappingInfos.iframeObj
      })
    }
  }
  if (exist) {
    //如果之前已经创建过iframe
    /* 重置标题 先打开一个有标题的，再打开一个无标题的 */
    if (mappingInfos.renderParams) {
      let newTitle = modalParams.title
      let _setTitleFunc = mappingInfos.setTitleFunc
      if (newTitle && typeof _setTitleFunc == 'function') {
        _setTitleFunc(
          newTitle
        ) /* 模态显示前先更新标题，解决窗体标题切换的问题 */
      }
      mappingInfos.renderParams.title = modalParams.title
    }
    callback(
      mappingInfos.domId,
      mappingInfos.closeModalFunc,
      mappingInfos.setTitleFunc,
      mappingInfos.renderParams
    )
  } else {
    if (typeof modalCloseCallBack == 'function') {
      //注册跨域事件，由内部关闭后触发外面模态关闭
      eventManager.onCrossDomainEvent({
        eventName: eventManager.CrossDomainEvents.CustomEvent,
        eventInfo: {
          condition: "type=='CloseSuccess'"
        },
        handler: (function (callFun) {
          return function (params) {
            let global_cb = vdk.postMsg._MODALCLOSECF
            if (typeof global_cb == 'function') {
              global_cb(params)
              vdk.postMsg._MODALCLOSECF = null
            } else {
              callFun(params)
            }
          }
        })(modalCloseCallBack)
      })
    }
    let closed = (function (sourceUrl, cf, _k) {
      //模态框关闭事件，如果url所在的服务不是最新，需要关闭事件调用，并且标记此服务不能用最新的逻辑处理
      return function (bodyCode, renderParams) {
        if (OldLogicOrgin.indexOf(_k) != -1) {
          //已触发另一个事件
          return
        }
        let stroage = getStorage()
        let info = stroage.get(_k)
        if (
          !info ||
          !info.domIds ||
          !info.domIds.domId ||
          info.domIds.domId.indexOf('TEMP_') != -1
        ) {
          //如果没有或者没有更新子vdk，表示url所在服务是旧的，后续走旧逻辑
          //如果内部通过链接地址跳转到另一个地址
          let isNeedRemove = info && info.isReset ? true : false
          if (OldLogicOrgin.indexOf(_k) == -1) {
            OldLogicOrgin.push(_k)
          }
          if (info && typeof info.closeModalFunc == 'function') {
            if (info.renderParams) info.renderParams.isHide = true //处理打开立即关闭后，执行多次回调的问题
            info.closeModalFunc()
          }
          if (typeof cf == 'function') {
            cf()
          }
        } else {
          exports.close({
            url: sourceUrl,
            type: 'modal',
            closeAll: true //设置退出所有
          })
          //关闭所有时，直接隐藏弹框，不需要里面通信，避免出错不执行或者执行多次关闭
          let domIds = info.domIds
          let renderParams = info.renderParams
          let pmIden = vdk.postMsg.getPMIden() //当前页面vdk标识
          for (let key in domIds) {
            renderParams.isHide = true
            renderParams.hideFunc(renderParams.modalCode)
            break
          }
          if (typeof renderParams.closeCallback == 'function') {
            //会更新，优先使用
            renderParams.closeCallback()
          } else if (typeof cf == 'function') {
            cf()
          }
        }
      }
    })(url, modalCloseCallBack, domIdKey)
    let defaultParams = {
      width: '100%',
      height: '100%',
      rendered: callback,
      windowState: 'Maximized',
      formBorderStyle: 'None',
      contentType: 'url', //内容类型
      closed: closed, //关闭后回调
      maximizeBox: false
    }
    let modalParams = params.modalParams
    if (modalParams) {
      for (let key in modalParams) {
        if (modalParams.hasOwnProperty(key) && key != 'rendered') {
          defaultParams[key] = modalParams[key]
        }
      }
    }
    modalUtil.create(defaultParams)
  }
}

const mounted = function (params) {
  let url = params.url
  if (!url) {
    return
  }
  let urlObj = parseUrl(params.url)
  let tmpDom = params.dom
  if (
    !isPaltformUrl(urlObj) ||
    urlObj.isError ||
    (environmentUtils.isOptimizeLink && !environmentUtils.isOptimizeLink())
  ) {
    //非平台的url，直接创建新的iframe或者没成功解析的地址
    oldLogic(params)
    return
  }

  //url的key
  let urlKey = getKey(urlObj)
  let modalParams = params.modalParams
  //如果模态的话，可以重用模态外框，如果不是模态的话，先判断dom里面有没有创建过iframe
  let isModal = tmpDom == null ? true : false
  if (isModal) {
    if (OldLogicOrgin.indexOf('modal_' + urlKey) != -1) {
      oldLogic(params)
    } else {
      excuteModalLogic(urlObj, params)
    }
  } else {
    if (OldLogicOrgin.indexOf('container_' + urlKey) != -1) {
      oldLogic(params)
    } else {
      excuteContainerLogic(urlObj, params)
    }
  }
  return
  //		//模态框关闭后的回调
  //		var closeFunc = modalParams ? modalParams.modalCloseCallBack : null;
  //		//渲染回调
  //		var callback = function(dom, closeModalFunc, setTitleFunc, renderParams){
  //			var dom = getDomObj(dom);
  //			if(dom.length < 1){
  //				logUtil.warn("打开url失败. 原因：无法在指定位置添加元素.");
  //				return;
  //			}
  //			var domId = dom.attr("id");
  //			if(renderParams){
  //				 $("#" + domId).css("overflow", "hidden");
  //			}
  //			var iframeId;
  //			if(!isPaltformUrl(urlObj)){//非平台的url，直接创建新的iframe
  //				iframeId = "iframe_modal_by_url_"+(new Date()).getTime();
  //				var iframeDom = '<iframe id="'+iframeId+'" name="'+iframeId+'" framespacing="0" frameborder="0" height="100%" width="100%" border="0"></iframe>'
  //				dom.append(iframeDom);
  //				window.open(url,iframeId);
  //			}else{//平台url，先查是否已经有打开过，如果有打开过，则通过postmessage让iframe内部再打开新的窗体，如果没有，则创建
  //				var pmIden = vdk.postMsg.getPMIden();//当前页面vdk标识
  //				var stroage = getStorage();
  //				var key = getKey(urlObj);
  //				if(!stroage.containsKey(key)){//之前没打开过这个域名，就创建iframe
  //					iframeId = "iframe_modal_by_url_"+(new Date()).getTime();
  //					var iframeObj = document.getElementById(iframeId);
  //					if(null == iframeObj){
  //						var iframeDom = '<iframe id="'+iframeId+'" name="'+iframeId+'" framespacing="0" frameborder="0" height="100%" width="100%" border="0"></iframe>'
  //						dom.append($(iframeDom));
  //					}
  //					var prefix = "&";
  //					if(url.indexOf("?") == -1){
  //						prefix = "?";
  //					}
  //					//用于建立链接
  //					eventManager.onCrossDomainEvent({
  //						eventName : eventManager.CrossDomainEvents.CustomEvent,
  //						eventInfo : {
  //							condition : "type=='SetChildPM'&&parentPM=='" + pmIden + "'"
  //						},
  //						handler : (function(_key){
  //							return function(params){
  //								var pmIden = params.Iden;
  //								var tmpCPM = params.tmpCPM;
  //								var domIds = stroage.get(_key).domIds;
  //								for(var key in domIds){
  //									if(domIds[key] == tmpCPM){
  //										domIds[key] = pmIden;
  //										break;
  //									}
  //								}
  //							}
  //						})(key)
  //					});
  //					eventManager.onCrossDomainEvent({
  //						eventName : eventManager.CrossDomainEvents.CustomEvent,
  //						eventInfo : {
  //							condition : "type=='CloseModal'&&parentPM=='"+pmIden+"'"
  //						},
  //						handler : (function(_key){
  //							return function(params){
  //								var pmIden = params.pmIden;
  //								var domInfo = stroage.get(_key);
  //								var domIds = domInfo.domIds;
  //								for(var key in domIds){
  //									if(domIds[key] == pmIden){
  //										domInfo.renderParams.hideFunc(renderParams.modalCode);
  //										break;
  //									}
  //								}
  //								eventManager.fireCrossDomainEvent({
  //									eventName : eventManager.CrossDomainEvents.CustomEvent,
  //									eventInfo : {
  //										type : "CloseSuccess"
  //									}
  //								});
  //							}
  //						})(key)
  //					});
  //					var tmpChildPM = "TEMP_"+(new Date().getTime());
  //					url = url + prefix + "vplatform_container_iden="+pmIden+ "&vplatform_cpm=" + tmpChildPM;
  //					var win = window.open(url,iframeId);
  //					var domIds = {};
  //					domIds.domId = tmpChildPM;//保存对应子节点的标识
  //					stroage.put(key, {
  //						domId : domId,
  //						domIds : domIds,
  //						renderParams : renderParams,
  //						iframeObj : win
  //					});
  //				}else{
  //					var domInfo = stroage.get(key);
  //					//关闭后打开需要显示
  //					var renderParams = domInfo.renderParams;
  //					if(renderParams && typeof(renderParams.showFunc) == "function"){
  //						renderParams.showFunc(renderParams.modalCode,modalParams);
  //					}
  //					var urlParams = urlObj.params;
  //					var type = urlObj.type;
  //					var openParams ={
  //		            	iden : key
  //		            };
  //					for(var key in urlParams){
  //						var value = urlParams[key];
  //						if(missAtt.indexOf(key)!=-1){
  //							openParams[key] = value;
  //						}else if(key == "token"){
  //							openParams.inputParams = urlParams[key];
  //						}
  //					}
  //					if(!openParams.inputParams){
  //						openParams.inputParams = {variable:{}};
  //					}
  //					eventManager.fireCrossDomainEvent({
  //						eventName: eventManager.CrossDomainEvents.OpenWindow,
  //			            params: openParams,
  //			            win : domInfo.iframeObj,
  //					});
  //				}
  //			}
  //		}
  //
  //		if(!tmpDom){//如果未传指定位置，则创建模态框，如果模态参数为空，则创建全屏模态
  //			var stroage = getStorage();
  //			var key = getKey(urlObj);
  //			if(stroage.containsKey(key)){
  //				var domObj = stroage.get(key);
  //				callback(domObj.domId);
  //			}else{
  //				if(typeof(closeFunc) == "function"){
  //					eventManager.onCrossDomainEvent({
  //						eventName : eventManager.CrossDomainEvents.CustomEvent,
  //						eventInfo : {
  //							condition : "type=='CloseSuccess'"
  //						},
  //						handler : (function(callFun){
  //							return function(params){
  //								callFun();
  //							}
  //						})(closeFunc)
  //					});
  //				}
  //				var closed = (function(sourceUrl, cf, _k){
  //					return function(bodyCode, renderParams){
  //						var stroage = getStorage();
  //						var info = stroage.get(_k);
  //						if(OldLogicOrgin.indexOf(_k) == -1){
  //							OldLogicOrgin.push(_k);
  //						}
  //						exports.close({
  //							url : sourceUrl,
  //							closeAll : true//设置退出所有
  //						});
  //					}
  //				})(url, closeFunc, key);
  //				var defaultParams = {
  //					width:"100%",
  //					height:"100%",
  //					rendered : callback,
  //					windowState : "Maximized",
  //					formBorderStyle : "None",
  //					contentType : "url",//内容类型
  //					closed:closed,//关闭后回调
  //					maximizeBox : false
  //				};
  //				var modalParams = params.modalParams;
  //				if(modalParams){
  //					for(var key in modalParams){
  //						if(modalParams.hasOwnProperty(key) && key != "rendered"){
  //							defaultParams[key]  = modalParams[key];
  //						}
  //					}
  //				}
  //				modalUtil.create(defaultParams);
  //			}
  //
  //		}else{
  //			callback(tmpDom);
  //		}
}

/**
 * 获取信息
 * */
let getUrlInfo = function (params) {
  let result
  let url = params.url
  if (!url) {
    return
  }
  let domId = params.domId ? params.domId : UrlDomMapping[url]
  let urlObj = parseUrl(params.url)
  let stroage = getStorage()
  //是否包含映射信息
  let key = getKey(urlObj)
  //dom信息
  let domInfo
  //子页面的vdk版本
  let nowPM
  if (params.type == 'modal') {
    //模态
    key = 'modal_' + key
    domInfo = stroage.get(key)
    if (domInfo) {
      nowPM = domInfo.domIds.domId
      result = {
        domInfo: domInfo,
        nowPM: nowPM,
        urlObj: urlObj
      }
    }
  } else if (domId) {
    //容器
    let tmpKey = 'container_' + domId
    domInfo = stroage.containsKey(tmpKey) ? stroage.get(tmpKey) : null
    if (domInfo && domInfo[key]) {
      domInfo = domInfo[key]
      nowPM = domInfo.domIds[domId]
      result = {
        domInfo: domInfo,
        nowPM: nowPM,
        urlObj: urlObj,
        isContainer: true
      }
    }
  }
  return result
}

const active = function (params) {
  //		var url = params.url;
  //		if(!url){
  //			return;
  //		}
  //		var domId = params.domId ? params.domId : UrlDomMapping[url];
  //		var urlObj = parseUrl(params.url);
  //		var stroage = getStorage();
  //		//是否包含映射信息
  //		var key = getKey(urlObj);
  //		//子页面的vdk版本
  //		var nowPM;
  //		if(params.type =="modal"){//模态
  //			key = "modal_" + key;
  //			nowPM = stroage.containsKey(key) ? stroage.get(key).domIds.domId : null;
  //		}else if(domId){//容器
  //			var tmpKey = "container_" + domId;
  //			nowPM = stroage.containsKey(tmpKey) ? stroage.get(tmpKey)[key].domIds[domId] : null;
  //		}
  let info = getUrlInfo(params)
  if (info) {
    let urlObj = info.urlObj
    let nowPM = info.nowPM
    let domInfo = info.domInfo

    let urlParams = urlObj.params
    let openParams = info.isContainer
      ? {
          //容器需要传入对象
          _$urlObj: urlObj
        }
      : {}
    for (let key in urlParams) {
      if (missAtt.indexOf(key) != -1) {
        openParams[key] = urlParams[key]
      } else if (key == 'token') {
        openParams.inputParams = urlParams[key]
      }
    }
    eventManager.fireCrossDomainEvent({
      eventName: eventManager.CrossDomainEvents.ActiveWindow,
      eventInfo: {
        nowPM: nowPM
      },
      params: openParams,
      win: domInfo.iframeObj
    })
  } else {
    logUtil.warn('获取不到链接地址的打开信息, 已忽略处理, 地址: ' + params.url)
  }
}

const close = function (params) {
  //		var url = params.url;
  //		if(!url){
  //			return;
  //		}
  //		var urlObj = parseUrl(params.url);
  //		var stroage = getStorage();
  //		var key = getKey(urlObj);
  //		//dom信息
  //		var domInfo;
  //		//子页面的vdk版本
  //		var nowPM;
  //		if(params.type =="modal"){//模态
  //			key = "modal_" + key;
  //			domInfo = stroage.get(key);
  //			if(domInfo){
  //				nowPM = domInfo.domIds.domId;
  //			}
  //		}else if(domId){//容器
  //			var tmpKey = "container_" + domId;
  //			domInfo = stroage.containsKey(tmpKey) ? stroage.get(tmpKey) : null;
  //			if(domInfo && domInfo[key]){
  //				domInfo = domInfo[key];
  //				nowPM = domInfo.domIds[domId];
  //			}
  //		}
  let info = getUrlInfo(params)
  if (info) {
    let urlObj = info.urlObj
    let nowPM = info.nowPM
    let domInfo = info.domInfo

    let urlParams = urlObj.params
    let openParams = info.isContainer
      ? {
          //容器需要传入对象
          _$urlObj: urlObj
        }
      : {}
    //外框关闭时，关闭全部
    let closeAll = true === params.closeAll ? true : false
    openParams.closeAll = closeAll
    for (let key in urlParams) {
      if (missAtt.indexOf(key) != -1) {
        if (!closeAll) {
          //如果不是关闭全部，才加这些参数
          openParams[key] = urlParams[key]
        }
      } else if (key == 'token') {
        openParams.inputParams = urlParams[key]
      }
    }
    eventManager.fireCrossDomainEvent({
      eventName: eventManager.CrossDomainEvents.CloseWindow,
      eventInfo: {
        nowPM: nowPM
      },
      params: openParams,
      win: domInfo.iframeObj
    })
  } else {
    logUtil.warn('获取不到链接地址的打开信息, 已忽略处理, 地址: ' + params.url)
  }
}

export {
  initModule,
  parseUrl,
  isVPlatformUrl,
  getKey,
  isIframeContainerIndex,
  handleUrl,
  handleScope,
  mounted,
  active,
  close
}
