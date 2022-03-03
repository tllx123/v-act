import { UUID as uuidUtil } from '@v-act/vjs.framework.extension.util'
import { log as log } from '@v-act/vjs.framework.extension.util'
import { CreateModalByUrl as modalByUrlUtil } from '@v-act/vjs.framework.extension.platform.services.view.modal'
import { JsonUtil as jsonUtil } from '@v-act/vjs.framework.extension.util'
import { ExpressionContext as ExpressionContext } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { ExpressionEngine as ExpressEngine } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { WidgetAction as widgetAction } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { Browser as BrowserUtil } from '@v-act/vjs.framework.extension.platform.services.browser'
import { WidgetProperty as widgetProperty } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { render as webViewService } from '@v-act/vjs.framework.extension.platform.services.integration'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { EventManager as eventManager } from '@v-act/vjs.framework.extension.platform.interface.event'
let undefined
let undefined
let viewContext
let actionHandler
let undefined

//加载表达式计算模块
//	var formulaUtil ;
let rendererUtil
let undefined
let undefined
let undefined
let undefined
let undefined
let undefined
let undefined

exports.initModule = function (sandBox) {}
//dengb:去掉来源类型的判断逻辑，现在只要一直来源就是表达式
//值类型(1:实体字段,2:系统变量,3:组件变量,4:常量,5:自定义,6:表达式)
/*var TYPE_ENTITY_FIELD='1';
var TYPE_SYSTEM_VARIABLE = '2';
var TYPE_COMPONENT_VARIABLE = '3';
var TYPE_CONST = '4';
var TYPE_CUSTOM = '5';
var TYPE_EXPRESSION = '6';*/

//目标窗口类型(0:当前页面,1:新窗口,2:当前组件容器,3:父亲组件容器,4:div容器)
let TARGET_TYPE_CUR_PAGE = 0
let TARGET_TYPE_NEW_WINDOW = 1
let TARGET_TYPE_COMPONENT_CONTAINER = 2
let TARGET_TYPE_COMPONENT_NEW_TAB = 3
let TARGET_TYPE_DIV_CONTAINER = 4

let main = function (ruleContext) {
  let ruleConfig = ruleContext.getRuleCfg()
  let inParams = ruleConfig.inParams
  let inParamObj = jsonUtil.json2obj(inParams)

  let urlType = inParamObj.urlType
  let urlstr = inParamObj.url
  let targetType = inParamObj.targetType
  let isEncodeURL = inParamObj.isEncodeURL
  let isShowDialog = inParamObj.isShowDialog ? inParamObj.isShowDialog : false
  let targetComponentContainerCode = inParamObj.targetComponentContainerCode
  let paramsArray = inParamObj.parameters
  let series = scopeManager.getWindowScope().getSeries()
  let context = new ExpressionContext()
  context.setRouteContext(ruleContext.getRouteContext())
  let url = ExpressEngine.execute({ expression: urlstr, context: context }) //getData(urlType,urlstr);

  //"打开页面"
  let titleExp = inParamObj.title
  let title
  if (!titleExp) {
    title = '打开页面'
  } else {
    title = ExpressEngine.execute({ expression: titleExp, context: context })
  }
  let paramStr = ''
  for (let i = 0; paramsArray != null && i < paramsArray.length; i++) {
    let paramName = paramsArray[i].name
    let paramValue = getData(paramsArray[i].value, context)
    if (paramStr.length > 0) paramStr += '&'
    paramStr += paramName + '=' + paramValue
  }

  let errorMsg = null
  if (url == null || url.lenght == 0) {
    errorMsg = '打开链接地址不能为空！'
  }
  if (
    targetType != TARGET_TYPE_CUR_PAGE &&
    targetType != TARGET_TYPE_NEW_WINDOW &&
    targetType != TARGET_TYPE_COMPONENT_CONTAINER &&
    targetType != TARGET_TYPE_DIV_CONTAINER &&
    targetType != TARGET_TYPE_COMPONENT_NEW_TAB
  ) {
    errorMsg = '目标窗口类型不正确！'
  }

  if (errorMsg != null && errorMsg.length > 0) {
    throw new Error(errorMsg)
  }

  if (paramStr.length > 0) {
    let pos = url.indexOf('?')
    if (pos < 0) url += '?'
    else if (pos < url.length - 1) url += '&'
    url += paramStr
  }
  if (
    isEncodeURL != undefined &&
    (isEncodeURL == true || isEncodeURL == 'true')
  ) {
    url = encodeURI(url)
  }

  log.log('打开链接地址为：' + url)

  //当前页面打开
  if (targetType == TARGET_TYPE_CUR_PAGE) {
    BrowserUtil.currentPageOpen({
      url: url
    })
    //			window.location.href=url;
  } else if (targetType == TARGET_TYPE_COMPONENT_NEW_TAB) {
    /* 新页签打开方式 */
    let widthExp = inParamObj.widthExp
    let heightExp = inParamObj.heightExp
    let width = null
    if (widthExp != null && widthExp != '') {
      width = parseInt(
        '' + ExpressEngine.execute({ expression: widthExp, context: context })
      )
      if (isNaN(width)) width = null
    }

    let height = null
    if (heightExp != null && heightExp != '') {
      height = parseInt(
        '' + ExpressEngine.execute({ expression: heightExp, context: context })
      )
      if (isNaN(height)) height = null
    }
    let params = {
      winName: '_blank',
      url: url,
      title: title,
      width: width,
      height: height
    }
    BrowserUtil.showModelessDialogExNewTab(params)
  } else if (targetType == TARGET_TYPE_NEW_WINDOW) {
    if ('bootstrap_mobile' != series) {
      let widthExp = inParamObj.widthExp
      let heightExp = inParamObj.heightExp
      let width = null
      if (widthExp != null && widthExp != '') {
        width = parseInt(
          '' + ExpressEngine.execute({ expression: widthExp, context: context })
        )
        if (isNaN(width)) width = null
      }

      let height = null
      if (heightExp != null && heightExp != '') {
        height = parseInt(
          '' +
            ExpressEngine.execute({ expression: heightExp, context: context })
        )
        if (isNaN(height)) height = null
      }
      let winName = uuidUtil.generate()

      let params = {
        winName: winName,
        url: url,
        title: title,
        width: width,
        height: height
      }
      if (isShowDialog) {
        params['callback'] = function () {
          ruleContext.fireRouteCallback()
        }
        modalByUrlUtil.create(params)
        ruleContext.markRouteExecuteUnAuto()
      } else {
        BrowserUtil.showModelessDialogEx(params)
      }
    } else {
      let userAgent = navigator.userAgent
      if (userAgent.indexOf('v3app') > 0 || userAgent.indexOf('ydgApp') > 0) {
        let config = {}
        config.url = url //创建webview后请求的url地址，需要带http://或https://            （打开H5窗体时必填）
        config.onClose = function () {
          ruleContext.fireRouteCallback()
        }
        ruleContext.markRouteExecuteUnAuto()
        webViewService.openUrl(config)
      } else {
        if (isShowDialog) {
          let params = {
            url: url,
            title: title
          }
          params['callback'] = function () {
            ruleContext.fireRouteCallback()
          }
          widgetAction.executeComponentAction('showModalUrl', params)
          ruleContext.markRouteExecuteUnAuto()
        } else {
          let config = {}
          config.url = url //创建webview后请求的url地址，需要带http://或https://            （打开H5窗体时必填）
          config.onClose = function () {
            ruleContext.fireRouteCallback()
          }
          ruleContext.markRouteExecuteUnAuto()
          webViewService.openUrl(config)
        }
      }
    }
    //			rendererUtil.showModelessDialogEx("openLink", url, title,null,width,height);
  } else if (targetType == TARGET_TYPE_COMPONENT_CONTAINER) {
    let tmpActionHandler = widgetAction
    let targetComponentContainerId = targetComponentContainerCode

    //			//非空说明是当前组件容器
    //			if(targetComponentContainerId!=null && targetComponentContainerId!="")
    //			    tmpActionHandler=widgetAction;
    //			else{
    //			    tmpActionHandler=rendererUtil.getParentActionHandler(targetComponentContainerCode);
    //如果没有找到父容器则用新窗口打开
    //			    if(tmpActionHandler==null){
    //			    	Browser.showModelessDialogEx("openLink", url, title);
    //			    	Browser.showModelessDialogEx("openLink", url, title);
    //			        return true;
    //			    }
    //			}

    let width = screen.availWidth
    let height = screen.availHeight
    let info = {}
    info.title = title
    info.otherInfo = url
    // 标注打开方式为container
    let containerId = tmpActionHandler.executeWidgetAction(
      targetComponentContainerId,
      'exists',
      info
    )
    if (containerId) {
      //因为可能有数据更新了，要先刷新,刷新后再激活
      tmpActionHandler.executeWidgetAction(
        targetComponentContainerId,
        'reloadSingleTab',
        '',
        containerId,
        title,
        info.otherInfo,
        url,
        true,
        false
      )
      tmpActionHandler.executeWidgetAction(
        targetComponentContainerId,
        'active',
        info
      )
    } else {
      tmpActionHandler.executeWidgetAction(
        targetComponentContainerId,
        'add',
        {
          id: null,
          isComponent: false,
          title: title,
          url: url,
          iconCls: 'icon-save',
          selected: true
        },
        0
      )
    }
  } else if (targetType == TARGET_TYPE_DIV_CONTAINER) {
    //在div容器打开
    //			windowInputParams["variable"]["formulaOpenMode"] = "vuiWindowContainer";
    let winScope = scopeManager.getWindowScope()
    let componentCode = winScope.getComponentCode()
    let windowCode = winScope.getWindowCode()
    let widgetId = inParamObj.divCode
    let containerCode = inParamObj.targetComponentContainerCode
    let scopeId = winScope.getInstanceId()
    let callBackFunc = function (params) {
      if (!params) return
      let exist = params.existIden === true ? true : false
      if (!exist) {
        //之前未打开过
        let closeParams = {
          widgetId: widgetId,
          vuiCode: containerCode,
          eventName: 'close',
          params: {
            tagIden: params._iden
          }
        }
        let closeFunc = scopeManager.createScopeHandler({
          scopeId: scopeId,
          handler: function () {
            widgetProperty.set(widgetId, 'fireVueEvent', closeParams)
          }
        })
        //注册跨域关闭事件
        eventManager.onCrossDomainEvent({
          eventName: eventManager.CrossDomainEvents.ContainerWindowClose,
          handler: closeFunc
        })
      }
    }
    let closeback = function (params) {}

    let containerParam = {
      containerCode: containerCode /* 这个是标签的code */,
      componentCode: componentCode,
      windowCode: windowCode,
      OpenMode: 'OpenLink',
      callback: callBackFunc,
      closeback: closeback,
      url: url,
      divCode: widgetId /* 这个是标签所在div的code */,
      title: title
    }
    widgetProperty.set(widgetId, 'openWindowToDivContainer', containerParam)
  }
  return true
}

function toString(obj) {
  return obj == null ? '' : obj.toString()
}
//dengb:去掉来源类型的判断逻辑，现在只要一直来源就是表达式

function getData(value, context) {
  if (value == null) return ''
  let val = ''
  val = ExpressEngine.execute({ expression: value, context: context })
  val += '' //转换成字符串，否则传递到后台的参数可能不是字符串类型而出错
  return val
}

export { main }
