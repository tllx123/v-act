import { ApplicationParam as AppData } from '@v-act/vjs.framework.extension.platform.data.storage.schema.param'
import { ComponentPackData as componentPackData } from '@v-act/vjs.framework.extension.platform.global'
import { FrontEndAlerter as AlertUtils } from '@v-act/vjs.framework.extension.platform.interface.alerter'
import { Environment as environment } from '@v-act/vjs.framework.extension.platform.interface.environment'
import { EventManager as eventManager } from '@v-act/vjs.framework.extension.platform.interface.event'
import { ExceptionFactory as exceptionFactory } from '@v-act/vjs.framework.extension.platform.interface.exception'
import { DatasourceFactory as datasourceFactory } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { Config as consoleConfigService } from '@v-act/vjs.framework.extension.platform.services.mobile.console'
import { WindowParam as wParamManager } from '@v-act/vjs.framework.extension.platform.services.param.manager'
import { CreateModalByUrl as modalUtil } from '@v-act/vjs.framework.extension.platform.services.view.modal'
import {
  WidgetAction as actionHandler,
  WidgetRenderer as widgetRenderer
} from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'
import { Log as log } from '@v-act/vjs.framework.extension.util.logutil'

export function initModule(sb) {}

/**
 * 关闭模态窗体
 *
 * @param {Object}  params 参数信息
 * {
 * 	"selectConfirm": 是否为确实选择 true/false
 *   "collectOutput" : 是否收集outputValue
 * }
 */
let closeModalWindow = function (params) {
  let selectConfirm = params.selectConfirm
  let collectOutput = params.collectOutput
  let outputValue = {}
  outputValue['config'] = {}
  outputValue['config']['isSelectionConfirm'] = selectConfirm == true
  if (collectOutput == true && selectConfirm == true) {
    outputValue['config']['isReturnValues'] = true
    outputValue['values'] = wParamManager.getOutputs()
  } else {
    outputValue['config']['isReturnValues'] = false
    //解决 取消选择 的方式下关闭窗体还能拿到窗体输出数据的问题。
    outputValue['values'] = null
  }
  let retVal = outputValue
  window.returnValue = retVal
  if (window['opener']) {
    try {
      window.opener.ReturnValue = retVal
    } catch (e) {
      log.error(
        '[viewOperation.closeOpenedWindowEx]模态窗体设置值失败!原因:' +
          e.message
      )
    }
  }
  actionHandler.executeComponentAction('closeComponent', retVal)
}
/**
 * 替换构件包信息
 * */
let replaceComponentPackInfo = function (componentCode, windowCode) {
  let result = null
  let info = {
    componentCode: componentCode,
    code: windowCode
  }
  if (componentPackData.existMapping(info)) {
    let newInfo = componentPackData.getMapping(info)
    if (newInfo) {
      result = {
        componentCode: newInfo.componentCode,
        windowCode: newInfo.windowCode
      }
    }
  }
  return result
}
/**
 * 重定向窗体(当前页面跳转)
 *
 * @param paramsObj<{
 *              componentCode : <string> //构件code
 *            	windowCode : <string>    //窗体code
 *            	params : {}              //参数
 *         }>
 */
let redirectModule = function (paramsObj) {
  let componentCode = paramsObj.componentCode
  let windowCode = paramsObj.windowCode
  //替换构件包映射信息
  let newInfo = replaceComponentPackInfo(componentCode, windowCode)
  if (newInfo) {
    componentCode = newInfo.componentCode
    windowCode = newInfo.windowCode
  }
  if (AppData && typeof AppData.getWindowMapping == 'function') {
    /* 获取窗体映射信息 */
    let windowMappingInfo = AppData.getWindowMapping({
      componentCode: componentCode,
      windowCode: windowCode
    })
    /* 若窗体映射信息不为空的话，则表示是配置相应的映射信息，需替换 */
    if (windowMappingInfo != null) {
      componentCode = windowMappingInfo.componentCode
      windowCode = windowMappingInfo.windowCode
    }
  }
  let params = paramsObj.params
  let inputParam = params ? (params.inputParam ? params.inputParam : {}) : {}
  //预加载主页（目前仅支持iOS）
  if (
    consoleConfigService &&
    consoleConfigService.needShowMainPage(componentCode, windowCode)
  ) {
    consoleConfigService.showMainPage()
  } else {
    let scopeId = scopeManager.getCurrentScopeId()
    let scope = scopeManager.getChildWindowScope()
    let RemoveModalFunc = scope.get('RemoveModalFunc')
    if (typeof RemoveModalFunc == 'function') {
      scope.un(scopeManager.EVENTS.DESTROY, RemoveModalFunc)
    }
    let info = widgetRenderer.executeComponentRenderAction(
      'getParentContainerInfo'
    )
    if (info && info.containerCode) {
      $('#' + info.containerCode).attr('data-is-link-jump', true)
    }
    return actionHandler.executeComponentAction(
      'loadComponent',
      componentCode,
      windowCode,
      inputParam
    )
  }
}

/**
 *  用浏览器打开窗体（弹出窗口）
 *  @param paramsObj<{
 *    componentCode : <string>  构件code
 *    windowCode  : <string>  被打开组件的moduleId
 *    title    : <string>   组件窗口的名称
 *    inputParam  : 组件的输入参数
 *                      json格式 ：
 *                      {
 *                          "variable" ：variable    //variable的值为组件变量的默认值,如{"A" : "变量A的值", "B" : "变量B的值"}
 *                      }
 *    width  : <int> 弹出窗口的宽度(可选,不赋值默认最大化显示)
 *    height : <int> 弹出窗口的高度(可选,不赋值默认最大化显示)
 *    isBlock : <string> 是否进行阻塞，默认为true
 *    winName : <string> 非阻塞时，打开窗体的标识名
 *  }>
 *
 *  @return 返回map格式{"数据源名称1" : [数据集合数组], ..., "数据源名称i" : [数据集合数组]..., "数据源名称n" : [数据集合数组]}
 */
let callBrowserWindow = function (paramsObj) {
  let componentCode = paramsObj.componentCode
  let moduleId = paramsObj.windowCode
  //替换构件包映射信息
  let newInfo = replaceComponentPackInfo(componentCode, moduleId)
  if (newInfo) {
    componentCode = newInfo.componentCode
    moduleId = newInfo.windowCode
  }
  if (AppData && typeof AppData.getWindowMapping == 'function') {
    /* 获取窗体映射信息 */
    let windowMappingInfo = AppData.getWindowMapping({
      componentCode: componentCode,
      windowCode: moduleId
    })
    /* 若窗体映射信息不为空的话，则表示是配置相应的映射信息，需替换 */
    if (windowMappingInfo != null) {
      componentCode = windowMappingInfo.componentCode
      moduleId = windowMappingInfo.windowCode
    }
  }
  let operation = paramsObj.operation
  let paramDataJson = paramsObj.paramDataJson
  let title = paramsObj.title
  let inparamJson = paramsObj.inputParam
  let width = paramsObj.width
  let height = paramsObj.height
  let isBlock = paramsObj.isBlock
  let winName = paramsObj.winName

  if (!moduleId) {
    let exception = exceptionFactory.create({
      type: exceptionFactory.TYPES.Expected,
      message: '调用组件失败!传入的windowCode值为空.'
    })
    throw exception
  }
  if (!paramDataJson) {
    paramDataJson = {}
  }
  paramDataJson['inputParam'] = inputParam2Obj(inparamJson)
  // 目前暂时认为传入的title必须在组件变量上存在，否则，打开的窗口无法设置对应的窗口标题
  if (!paramDataJson['inputParam']) {
    paramDataJson['inputParam'] = {}
  }
  if (!paramDataJson['inputParam']['variable']) {
    paramDataJson['inputParam']['variable'] = {}
  }
  paramDataJson['inputParam']['variable']['v3ComponentTitle'] = title
  // token内容进行encodeURIComponent编码,防止%无法传递的问题
  let token = encodeURIComponent(
    encodeURIComponent(
      jsonUtil.obj2json({
        //编译两次，防止浏览器location.href解码
        data: paramDataJson
      })
    )
  )
  let moduleUrl =
    getUrlPrefix() +
    urlPath +
    '?componentCode=' +
    componentCode +
    '&windowCode=' +
    moduleId +
    '&operation=' +
    operation
  let isCustomSize = width > 0 && height > 0
  let inputJson = {
    url: moduleUrl,
    token: token,
    isCustomSize: isCustomSize
  }
  isBlock =
    isBlock == null || isBlock == undefined || isBlock == true ? true : false
  winName = winName == null || winName == undefined ? '_blank' : winName

  let initUrlParam = {}
  let initToken = encodeURIComponent(
    jsonUtil.obj2json({
      data: initUrlParam
    })
  )
  // 用于多语言，从地址栏获取语言信息
  let newToken = inputJson.token ? inputJson.token : initToken
  let debugPort = environment.getDebugPort()
  let moduleInitUrl =
    'module-operation!executeOperation?componentCode=' +
    componentCode +
    '&windowCode=' +
    moduleId +
    (debugPort ? '&debugPort=' + debugPort : '') +
    '&token=' +
    newToken
  let result = showModalDialogEx({
    id: moduleId,
    url: moduleInitUrl,
    title: title,
    width: width,
    height: height,
    param: inputJson,
    isBlock: isBlock,
    winName: winName
  })
  return result
}

let inputParam2Obj = function (inputParam) {
  if (inputParam && inputParam.variable) {
    let variable = inputParam.variable
    let obj = {}
    for (let attr in variable) {
      let val = variable[attr]
      obj[attr] = datasourceFactory.isDatasource(val) ? val.serialize() : val
    }
    return { variable: obj }
  }
  return null
}

/**
 * 打开模态组件窗口
 * @param paramsObj<{
 * 	 	 componentCode : <string>  需要打开构件的code
 * 	 	 windowCode : <string>     需要打开的组件ID需要打开的组件ID
 * 		 title : <string>          弹出窗口标题
 * 		 width : <int>			   宽度
 *		 height : <int>			   高度
 * 		 inputParam : {}             组件入参
 * 		 callBack : <function>     回调函数 var callBack = function(data) data为弹出窗口的输出参数
 * }>
 */
let callBrowserModalWindow = function (paramsObj) {
  let componentCode = paramsObj.componentCode
  let windowCode = paramsObj.windowCode
  let title = paramsObj.title
  let width = paramsObj.width
  let height = paramsObj.height
  let inputParam = paramsObj.inputParam
  let callBack = paramsObj.callBack

  let async = environment.isAsync()

  if (async) {
    //规则链为异步方式
    let scopeId = scopeManager.getCurrentScopeId()
    let callBackFunc = function () {
      scopeManager.openScope(scopeId)
      if (typeof callBack == 'function') {
        callBack.apply(arguments.callee.caller, arguments)
      }
      scopeManager.closeScope()
    }
    return showModalModule(
      componentCode,
      windowCode,
      title,
      width,
      height,
      inputParam,
      callBackFunc
    )
  } else {
    let params = {
      componentCode: componentCode,
      openModuleId: windowCode,
      title: title,
      inputParam: inputParam,
      width: width,
      height: height,
      isBlock: true,
      winName: ''
    }
    let output = callBrowserWindow(params)
    if (typeof callBack == 'function') {
      callBack.apply(arguments.callee.caller, [output])
    }
  }
}

/**
 * 原生弹出窗体方法
 * @param {Object}  params 参数信息
 * {
 * 		"id": {String} 目标组件ID
 * 		"url"  ： {String} 目标组件地址
 * 		"title" : {String} 标题
 * 		"width" : {Integer} 目标宽度
 * 		"height" : {String}   目标高度
 * 		"param": {Object}    目标参数
 * 		"isBlock" : {Boolean}  是否需要阻塞
 * 		"winName": {String}  当目标窗体为不阻塞时使用的窗口标识
 * }
 */
let showModalDialogEx = function (params) {
  let id = params.id,
    url = params.url,
    title = params.title,
    width = params.width,
    height = params.height,
    param = params.param,
    isBlock = params.isBlock,
    winName = params.winName
  window['inputJson'] = undefined

  // 需要阻塞
  if (isBlock == true) {
    // 遮罩
    mask()
    let retVal = null
    try {
      retVal = window.showModalDialog(
        url,
        param,
        'dialogWidth=' +
          width +
          'px;dialogHeight= ' +
          height +
          'px;resizable:yes;status:no'
      )
    } catch (e) {
      throw e
    } finally {
      // 取消遮罩
      unmask()
    }
    // 兼容chrome,firefox
    if (retVal == undefined) {
      if (window['ReturnValue'] != undefined) {
        // 拿到值之后对ReturnValue清空
        retVal = window.ReturnValue
        if (window['ReturnValue'] != null) {
          window['ReturnValue'] = null
        }
      }
    }
  } else {
    // 不需要阻塞
    showModelessDialogEx({
      winName: winName,
      url: url,
      title: title,
      param: param,
      width: width,
      height: height
    })
  }
  return retVal
}

/**
 * 原生弹出窗体方法,调用window.open,窗体不会阻塞
 * @param params 参数信息
 * {
 * 		winName : {String} 窗口的标识，如果标识相同则会在对应的窗口打开
 *      url   : {String}   目标url
 * 		title   : {String} 目标窗体标题
 * 		param   : {Object} 目标
 * 		width  : {Integer}  目标宽度,可选
 * 		height   : {Integer} 目标高度,可选
 * 		left    : {Integer} 目标横坐标
 * 		top    : {Integer}  目标纵坐标
 * 		feature  : {String} 窗体属性配置
 * }
 */
let showModelessDialogEx = function (params) {
  let winName = params.winName,
    url = params.url,
    title = params.title,
    param = params.param,
    width = params.width,
    height = params.height,
    left = params.left,
    top = params.top,
    feature = params.feature
  window['inputJson'] = param
  let w = width != null ? width : screen.availWidth
  let h = height != null ? height : screen.availHeight
  let l = left != null ? left : (screen.availWidth - w) / 2
  let t = top != null ? top : (screen.availHeight - h) / 2
  let defaultFtr =
    'status=no,scrollbars=yes,resizable=yes,menubar=no,toolbar=no,titlebar=no'
  let ftr = feature != null ? feature : defaultFtr
  // 高度加15屏蔽滚动条
  ftr += ',left=' + l + ',top=' + t + ',width=' + w + ',height=' + h
  let name = winName != null ? winName : '_blank'
  //打开第三方时，win会存在空的情况
  let win = window.open(url, name, ftr)
  let scanFun = (function (w, wi) {
    return function () {
      // add by xiedh 2015-04-29 打开窗体设置标题
      try {
        //如果此值不为空，链接地址打开不能再修改窗体标题
        if (w) w._$VPLATFORMCHANGETITLEIDEN = title
        if (w && w.document) {
          if (title != null) {
            /* 标题不为空时才修改 */
            w.document.title = title
          }
          wi.clearInterval(wi.scanInterval)
        }
      } catch (e) {
        wi.clearInterval(wi.scanInterval)
      }
    }
  })(win, window)
  window.scanInterval = window.setInterval(scanFun, 200)
  return win
}

/**
 * 新页签打开新窗体,调用window.open,窗体不会阻塞
 * @param params 参数信息
 * {
 * 		winName : {String} 窗口的标识，如果标识相同则会在对应的窗口打开
 *      url   : {String}   目标url
 * 		title   : {String} 目标窗体标题
 * 		param   : {Object} 目标
 * 		width  : {Integer}  目标宽度,可选
 * 		height   : {Integer} 目标高度,可选
 * 		left    : {Integer} 目标横坐标
 * 		top    : {Integer}  目标纵坐标
 * 		feature  : {String} 窗体属性配置
 * }
 */
let showModelessDialogExNewTab = function (params) {
  let url = params.url,
    param = params.param
  window['inputJson'] = param
  let win = window.open(url, '_blank')
  $.ajax({
    type: 'POST',
    url: 'itop/common/rule/temp.json',
    async: false,
    success: function (data) {
      if (win) win.location
      else
        AlertUtils.error({
          title: '系统提示',
          msgHeader: '弹窗异常',
          msg: '弹出窗口已被阻止，请调整浏览器配置！',
          detail: '暂无.'
        })
    }
  })
  return win
}

/**
 * 打开模态组件窗口
 * @param {Ogject} params 参数信息
 * {
 * 		"componentCode" : {String} 构件code
 * 		"windowCode" : {String} 窗体code
 * 		"title" 	: {String} 标题
 * 		"width"		: {Integer} 宽度
 * 		"height" 	: {Integer} 高度
 * 		"inputParam": {Object} 窗体输入参数
 * 		"loaded"	:	{Function}	目标窗体加载完成后回调
 * 		"closeCallback" : {Function} 关闭回调
 * }
 */
let showModalModule = function (params) {
  let componentCode = params.componentCode,
    windowCode = params.windowCode,
    title = params.title,
    width = params.width,
    height = params.height,
    inputParam = params.inputParam,
    closeCallback = params.closeCallback
  let callBackCfg = { destroyed: closeCallback }
  let extraParams = {
    loaded: params.loaded
  } //额外参数
  return actionHandler.executeComponentAction(
    'showModalModule',
    componentCode,
    windowCode,
    title,
    width,
    height,
    inputParam,
    callBackCfg,
    extraParams
  )
}

/**
 *	取消mask遮罩
 */
let unmask = function () {
  document.body.removeChild(document.getElementById('maskdivgen'))
}
/**
 * 获取当前页面URL地址
 */
let urlPath = window.location.pathname
let getUrlPrefix = function () {
  return urlPath.indexOf('/') != 0 ? '/' : ''
}

const setWindowTitle = function (params) {
  let title = params.title,
    isTop = !!params.isTop
  let scanFun = (function (flag) {
    return function () {
      // add by xiedh 2015-04-29 打开窗体设置标题
      try {
        let doc = flag ? top.document : window.document
        if (doc) {
          if (title != null) {
            doc.title = title
          }
          window.clearInterval(window.scanInterval)
        }
      } catch (e) {
        window.clearInterval(window.scanInterval)
      }
    }
  })(isTop)
  window.scanInterval = window.setInterval(scanFun, 200)
}

const callModuleEx = function (params) {
  let componentCode = params.componentCode,
    moduleId = params.windowCode,
    operation = params.operation,
    paramDataJson = params.paramDataJson,
    title = params.title,
    inparamJson = params.inputParam,
    width = params.width,
    height = params.height,
    isBlock = params.isBlock,
    winName = params.winName
  //替换构件包映射信息
  let newInfo = replaceComponentPackInfo(componentCode, moduleId)
  if (newInfo) {
    componentCode = newInfo.componentCode
    moduleId = newInfo.windowCode
  }
  /* 获取窗体映射信息 */
  let windowMappingInfo = AppData.getWindowMapping({
    componentCode: componentCode,
    windowCode: moduleId
  })
  /* 若窗体映射信息不为空的话，则表示是配置相应的映射信息，需替换 */
  if (windowMappingInfo != null) {
    componentCode = windowMappingInfo.componentCode
    moduleId = windowMappingInfo.windowCode
  }
  if (!moduleId) {
    let exception = exceptionFactory.create({
      type: exceptionFactory.TYPES.Expected,
      message: '调用组件失败!传入的windowCode值为空.'
    })
    throw exception
  }
  if (!paramDataJson) {
    paramDataJson = {}
  }
  paramDataJson['inputParam'] = inparamJson
  // 目前暂时认为传入的title必须在组件变量上存在，否则，打开的窗口无法设置对应的窗口标题
  if (!paramDataJson['inputParam']) {
    paramDataJson['inputParam'] = {}
  }
  if (!paramDataJson['inputParam']['variable']) {
    paramDataJson['inputParam']['variable'] = {}
  }
  paramDataJson['inputParam']['variable']['v3ComponentTitle'] = title
  // token内容进行encodeURIComponent编码,防止%无法传递的问题
  let token = encodeURIComponent(
    jsonUtil.obj2json({
      data: paramDataJson
    })
  )
  let moduleUrl =
    getUrlPrefix() +
    urlPath +
    '?componentCode=' +
    componentCode +
    '&windowCode=' +
    moduleId +
    '&operation=' +
    operation
  let isCustomSize = width > 0 && height > 0
  let inputJson = {
    url: moduleUrl,
    token: token,
    isCustomSize: isCustomSize
  }
  isBlock =
    isBlock == null || isBlock == undefined || isBlock == true ? true : false
  winName = winName == null || winName == undefined ? '_blank' : winName

  let initUrlParam = {}
  let initToken = encodeURIComponent(
    jsonUtil.obj2json({
      data: initUrlParam
    })
  )
  // 用于多语言，从地址栏获取语言信息
  let newToken = inputJson.token ? inputJson.token : initToken
  let moduleInitUrl =
    'module-operation!executeOperation?componentCode=' +
    componentCode +
    '&windowCode=' +
    moduleId +
    '&token=' +
    newToken
  let result = showModalDialogEx({
    id: moduleId,
    url: moduleInitUrl,
    title: title,
    width: width,
    height: height,
    param: inputJson,
    isBlock: isBlock,
    winName: winName
  })
  return result
}

const getWindowUrl = function (params) {
  let moduleId = params.windowCode
  let operation = params.operation,
    inParam = params.inputParams
  let url =
    getUrlPrefix() +
    urlPath +
    '?moduleId=' +
    moduleId +
    '&operation=' +
    operation

  // 将inParam补充进paramData。另外inParam会作为wooui的调用参数，直接传递到打开窗体中
  let paramData = {}
  paramData['inputParam'] = inParam
  // token内容进行encodeURIComponent编码,防止%无法传递的问题
  let token = encodeURIComponent(
    encodeURIComponent(
      jsonUtil.obj2json({
        data: paramData
      })
    )
  )
  url = url + '&token=' + token
  return url
}

let getServerUrl = function (urlPath) {
  let index = urlPath.indexOf('module-operation')
  let url
  if (index != -1) {
    url = urlPath.substring(0, index)
  } else {
    url = urlPath
  }
  return url
}

const redirectLocation = function (paramsObj) {
  let componentCode = paramsObj.componentCode
  let moduleId = paramsObj.windowCode
  //替换构件包映射信息
  let newInfo = replaceComponentPackInfo(componentCode, moduleId)
  if (newInfo) {
    componentCode = newInfo.componentCode
    moduleId = newInfo.windowCode
  }
  /* 获取窗体映射信息 */
  let windowMappingInfo = AppData.getWindowMapping({
    componentCode: componentCode,
    windowCode: moduleId
  })
  /* 若窗体映射信息不为空的话，则表示是配置相应的映射信息，需替换 */
  if (windowMappingInfo != null) {
    componentCode = windowMappingInfo.componentCode
    moduleId = windowMappingInfo.windowCode
  }
  let operation = paramsObj.operation
  let title = paramsObj.title
  let paramDataJson = paramsObj.paramDataJson
  let inparamJson = paramsObj.inputParam

  if (!moduleId) {
    let exception = exceptionFactory.create({
      type: exceptionFactory.TYPES.Expected,
      message: '调用组件失败!传入的windowCode值为空.'
    })
    throw exception
  }
  if (!paramDataJson) {
    paramDataJson = {}
  }
  paramDataJson['inputParam'] = inparamJson
  // 目前暂时认为传入的title必须在组件变量上存在，否则，打开的窗口无法设置对应的窗口标题
  if (typeof paramDataJson['inputParam']['variable'] == 'undefined') {
    paramDataJson['inputParam']['variable'] = {}
  }
  paramDataJson['inputParam']['variable']['v3ComponentTitle'] = title
  // token内容进行encodeURIComponent编码,防止%无法传递的问题
  let token = encodeURIComponent(
    jsonUtil.obj2json({
      data: paramDataJson
    })
  )
  let moduleUrl =
    getUrlPrefix() +
    window.location.pathname +
    '?componentCode=' +
    componentCode +
    '&windowCode=' +
    moduleId +
    '&operation=' +
    operation
  let inputJson = {
    url: moduleUrl,
    token: token
  }
  let initUrlParam = {}
  let initToken = encodeURIComponent(
    jsonUtil.obj2json({
      data: initUrlParam
    })
  )
  // 用于多语言，从地址栏获取语言信息
  let newToken = inputJson.token ? inputJson.token : initToken
  let debugPort = environment.getDebugPort()
  let moduleInitUrl =
    'module-operation!executeOperation?componentCode=' +
    componentCode +
    '&windowCode=' +
    moduleId +
    (debugPort ? '&debugPort=' + debugPort : '') +
    '&token=' +
    newToken
  window.location.href = getServerUrl(window.location.href) + moduleInitUrl
}

/**
 * 打开窗体到指定div中
 * @param {Object} params
 * {
 * 	"componentCode" : "构件编码",
 *  "windowCode" : "窗体编码",
 *  "divId" : "div id",
 *  "title" : "窗体标题",
 *  "param" ：{Object} 窗体入参
 *  "closeBack": function(){} //窗体关闭的回调
 * }
 * */
let openWindowToDiv = function (params) {
  actionHandler.executeComponentAction('loadWindowToDiv', params)
}

let isRoot = function (parentInfo) {
  /* 父级信息不存在，则表示为根元素 */
  if (!parentInfo) return true
  if (!parentInfo || parentInfo.scopeId != '__Container_Scope__') {
    return false
  }
  return true
}

let currentPageOpen = function (params) {
  let url = params.url
  let info = widgetRenderer.executeComponentRenderAction(
    'getParentContainerInfo'
  )
  //		var isRootContainer = widgetContext.get(info.containerCode, "IsRootContainer");
  if (isRoot(info)) {
    let windowScope = scopeManager.getWindowScope()
    if (windowScope.getOpenMode() == scopeManager.OpenMode.ModalContaniner) {
      let RemoveModalFunc = windowScope.get('RemoveModalFunc')
      if (typeof RemoveModalFunc == 'function') {
        windowScope.un(scopeManager.EVENTS.DESTROY, RemoveModalFunc)
      }
      //用于iframe内部跳转
      eventManager.fireCrossDomainEvent({
        eventName: eventManager.CrossDomainEvents.CustomEvent,
        eventInfo: {
          type: 'ResetUrl'
        },
        params: {
          url: url,
          childPM: vdk.postMsg.getPMIden()
        }
      })
    }
    window.location.href = url
  } else {
    let scopeId = scopeManager.getCurrentScopeId()
    let scope = scopeManager.getScope()
    let RemoveModalFunc = scope.get('RemoveModalFunc')
    if (typeof RemoveModalFunc == 'function') {
      scope.un(scopeManager.EVENTS.DESTROY, RemoveModalFunc)
    }
    let setTitle = scope.get('SetModalWinTitleFunc')
    let closeModal = scope.get('ModalCloseFunc')
    scopeManager.destroy(scopeId)
    try {
      // 约定dom上此属性存在的话，不执行原来执行的关闭事件，直接执行模态本身的关闭事件
      $('#' + info.containerCode).attr('data-is-link-jump', true)
      modalUtil.renderIFrameToDom({
        containerCode: info.containerCode,
        url: url,
        setTitle: setTitle,
        closeModal: closeModal
      })
    } catch (e) {}
  }
  //获取当前窗体所在容器信息
}
export {
  callBrowserModalWindow,
  callBrowserWindow,
  callModuleEx,
  closeModalWindow,
  currentPageOpen,
  getWindowUrl,
  openWindowToDiv,
  redirectLocation,
  redirectModule,
  setWindowTitle,
  showModalDialogEx,
  showModalModule,
  showModelessDialogEx,
  showModelessDialogExNewTab
}
