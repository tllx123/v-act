import { WindowRenderer as windowRenderer } from '@v-act/vjs.framework.extension.platform.services.view.window.renderer'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { DesUtil as desUtil } from '@v-act/vjs.framework.extension.util.des'
import { FrontEndAlerter as frontEndAlerterUtil } from '@v-act/vjs.framework.extension.platform.interface.alerter'
import { EventManager as eventManager } from '@v-act/vjs.framework.extension.platform.interface.event'
import { DatasourceFactory as DBFactory } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'

/**
 * 渲染窗体到首页
 * @prams	Object
 * {
 * 	title		:	"",
 * 	ruleContext	:	Object,
 * 	inputs : 窗体输入
 * 	createdTab : Function 创建首页页签后事件
 * 	closeTab : Function 关闭页签后
 * 	componentCode : 构件编码
 * 	windowCode : 构件编码
 * }
 * */
export function render(params) {
  if (!window._$addMultiPageLabel) {
    //            var message = "请在首页页面中打开";
    //            dialogUtil.errorDialog(message, _callbackLabel, false);
    frontEndAlerterUtil.error({
      title: '错误信息',
      msgHeader: '页面打开失败！',
      msg: '当前页面未包含首页框架，请在包含首页框架的页面中预览。',
      detail: '缺少vjs.framework.extension.business.toone.iems.portal依赖',
      callback: params.callback
    })
    return
  }
  if (params.url) {
    showHomeTabByUrl(params)
    return
  }
  var title = params.title
  var ruleContext = params.ruleContext
  var windowInputParams = params.inputs
  var componentCode = params.componentCode
  var windowCode = params.windowCode
  var inParams = params.inParams
  var vjsContext = params.vjsContext //框架窗体
  var otherIden = params.idens //其他参与页签标识的key（框架窗体）
  var inited = params.inited
  var destroyScopeListener = params.destroyScopeListener //窗体域销毁的监听函数
  if (ruleContext) {
    var routeContext = ruleContext.getRouteContext()
    ruleContext.markRouteExecuteUnAuto()
  }
  var scopeId = scopeManager.getCurrentScopeId()
  var newScopeId = null
  var cloaseTab = params.closeTab
  /* 如果指定scopeId，则优先使用，解决首页打开的窗体刷新后，窗体域改变，导致返回值取不到，但是，目前首页暂不支持返回值*/
  var _callbackLabel = function (output, _newscopeId) {
    var output = null
    var isConfirmSelectionOnClose = false
    if (newScopeId != null) {
      var scope = scopeManager.getScope(newScopeId)
      output = scope.getOutput()
      if (output && output.config && output.config.isSelectionConfirm) {
        isConfirmSelectionOnClose = true
      }
    }
    if (typeof params.closeTab == 'function') {
      cloaseTab({
        isConfirmExit: isConfirmSelectionOnClose,
        output: output ? output.values : {}
      })
    } else {
      if (ruleContext) {
        ruleContext.setBusinessRuleResult({
          isConfirmSelectionOnClose: isConfirmSelectionOnClose
        })
        ruleContext.fireRuleCallback()
        ruleContext.fireRouteCallback(output)
      }
    }
  }
  windowInputParams['variable']['formulaOpenMode'] = 'iemsHomeTab'
  // 当前窗体跳转
  windowInputParams['variable']['windowtitle'] = title
  var idens = [componentCode, windowCode, title ? title : '']
  if (otherIden && otherIden instanceof Array) {
    idens = idens.concat(otherIden)
  }
  idens.push(genInputParamIden(windowInputParams))
  var widgetId = desUtil.toMD5(idens.join('$_$'))
  var rendered = function (component, scopeId) {
    var windowScope = scopeManager.getScope(scopeId)
    windowScope.setCloseMode(scopeManager.CloseMode.DestroyScope)
    windowScope.set('_$FrameWindow', true)
  }
  var callBackFunc =
    typeof params.createdTab == 'function'
      ? params.createdTab
      : function (closeHandler, config, holderId) {
          holderId = holderId ? holderId : widgetId
          var renderedFunc = config ? config.rendered : function () {}
          var renderParams = {
            source: {
              componentCode: componentCode,
              windowCode: windowCode,
              inputs: windowInputParams
            },
            target: {
              type: 'DOM',
              code: holderId
            },
            context: {
              //						scopeId: scopeId
            },
            aops: {
              closed: function () {
                //								_callbackLabel();
                closeHandler()
              },
              inited: inited
            }
          }
          renderParams.aops.rendered = (function (func, func1, _renderParams) {
            return function (component, scopeId) {
              if (typeof destroyScopeListener == 'function') {
                scopeManager.on(
                  scopeManager.EVENTS.DESTROY,
                  destroyScopeListener
                )
              }
              newScopeId = scopeId
              func(scopeId, _renderParams)
              func1(component, scopeId)
            }
          })(renderedFunc, rendered, renderParams)
          if (vjsContext) {
            renderParams.vjsContext = vjsContext
          }
          if (typeof inited == 'function') {
            renderParams.aops.inited = inited
          }
          windowRenderer.render(renderParams)
        }
  window._$addMultiPageLabel(title, widgetId, callBackFunc, _callbackLabel)
}

var showHomeTabByUrl = function (params) {
  var url = params.url
  var _callbackLabel = params.callback
  var code = desUtil.toMD5(url)
  //首页页签的方式打开
  var callBackFunc = function (closeHandler, config, holderId) {
    holderId = holderId ? holderId : code
    indexCloseFuns[holderId] = closeHandler
    /* 首页局部刷新页面时调用 */
    var render = (function (_rendered) {
      return function (domId) {
        var divEl = document.getElementById(domId)
        var iframe = document.createElement('iframe')
        iframe.width = '100%'
        iframe.height = '100%'
        iframe.style.border = 'none'
        iframe.src = url
        divEl.appendChild(iframe)
        var currentWinScope = scopeManager.getWindowScope()
        var parentScopeId = currentWinScope.getInstanceId()
        var scopeId = scopeManager.createWindowScope({
          parentScopeId: parentScopeId
        })
        if (typeof _rendered == 'function') {
          _rendered(scopeId, params)
        }
      }
    })(config.rendered)
    params._reloadUrl = render
    render(holderId)
    var closeFunc = function (_url) {
      //认证中心重定向后的url跟打开链接配置的不一致，不能这样判断
      //				if(!_url || _url.href != iframe.src){
      //					return;
      //				}
      if (!_url || !_url.MsgEvent || !_url.MsgEvent.source) {
        return
      }
      var rValue = {
        isConfirmExit: false,
        returnValues: {}
      }
      if (_url.datas && _url.datas.returnValues) {
        rValue.isConfirmExit = !!_url.datas.isConfirmExit
        var returnValues = _url.datas.returnValues
        if (returnValues) {
          for (var key in returnValues) {
            if (!returnValues.hasOwnProperty(key)) {
              continue
            }
            var value = returnValues[key]
            if (value && typeof value == 'object') {
              try {
                value = datasourceFactory.unSerialize(value)
              } catch (e) {}
            }
            rValue['returnValues'][key] = value
          }
        }
      }
      var targetIframe
      var targetDivEl
      var targetCloseHandler
      for (var tabIden in indexCloseFuns) {
        var divElement = document.getElementById(tabIden)
        if (
          divElement &&
          divElement.children &&
          divElement.children[0] &&
          divElement.children[0].contentWindow == _url.MsgEvent.source
        ) {
          targetIframe = divElement.children[0]
          targetCloseHandler = indexCloseFuns[tabIden]
          targetDivEl = divElement
          try {
            delete indexCloseFuns[tabIden]
          } catch (e) {}
          break
        }
      }
      if (targetIframe && targetDivEl) {
        targetIframe.src = 'about:blank'
        try {
          targetIframe.contentWindow.document.write('')
          targetIframe.contentWindow.document.clear()
          targetDivEl.removeChild(targetIframe)
        } catch (e) {}
        if (typeof targetCloseHandler == 'function') {
          targetCloseHandler(rValue)
        }
        eventManager.unCrossDomainEvent({
          eventName: eventManager.CrossDomainEvents.ContainerWindowClose,
          handler: closeFunc
        })
      }
    }
    eventManager.onCrossDomainEvent({
      eventName: eventManager.CrossDomainEvents.ContainerWindowClose,
      handler: closeFunc
    })
  }
  window._$addMultiPageLabel(params.title, code, callBackFunc, _callbackLabel)
}

/**
 * 生成输入参数标识
 * */
var genInputParamIden = function (windowInputParams) {
  var idens = []
  if (windowInputParams && windowInputParams.variable) {
    var variable = windowInputParams.variable
    for (var key in variable) {
      if (!variable.hasOwnProperty(key)) {
        continue
      }
      idens.push(key)
      var val = variable[key]
      if (DBFactory.isDatasource(val)) {
        var datas = {}
        var records = val.getAllRecords().toArray()
        for (var i = 0, len = records.length; i < len; i++) {
          var record = records[0]
          datas[record.getSysId()] = records[0].toMap()
        }
      } else if (null != val) {
        idens.push(val)
      }
    }
    return desUtil.toMD5(idens.join('$_$'))
  }
  return ''
}
