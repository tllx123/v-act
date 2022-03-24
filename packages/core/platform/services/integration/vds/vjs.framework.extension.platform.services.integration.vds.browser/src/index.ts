/**
 * 浏览器方法
 * @desc 提供与浏览器相关的一系列接口，使用前请先import：vds.import("vds.browser.*")
 * @namespace vds/browser
 * @module browser
 * @catalog 工具方法/浏览器
 * @example
 * vds.import("vds.browser.*");
 * vds.browser.dialog("http://www.yindangu.com");
 */

import { Browser as browserUtils } from '@v-act/vjs.framework.extension.platform.services.browser'

import { WidgetAction as widgetAction } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'

import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

import { CreateModalByUrl as modalByUrlUtil } from '@v-act/vjs.framework.extension.platform.services.view.modal'

import { WindowRender as webViewService } from '@v-act/vjs.framework.extension.platform.services.integration.render'

import { EventManager as eventManager } from '@v-act/vjs.framework.extension.platform.interface.event'

import { Modal as viewModel } from '@v-act/vjs.framework.extension.platform.services.view.modal'

import { render as newWindowRender } from '@v-act/vjs.framework.extension.platform.services.view.window.render.mode.newwindow'
import { render as windowContainerRender } from '@v-act/vjs.framework.extension.platform.services.view.window.render.mode.windowcontainer'
import { render as divWindowContainerRender } from '@v-act/vjs.framework.extension.platform.services.view.window.render.mode.divwindowcontainer'
import { render as iemsHomeTabRender } from '@v-act/vjs.framework.extension.platform.services.view.window.render.mode.iemshometab'
import { render as currentWindowRedirectionRender } from '@v-act/vjs.framework.extension.platform.services.view.window.render.mode.currentwindowredirection'
import { render as appointWindowRender } from '@v-act/vjs.framework.extension.platform.services.view.window.render.mode.appointwindow'

const rendererObj = {
  newWindow: newWindowRender,
  windowContainer: windowContainerRender,
  divWindowContainer: divWindowContainerRender,
  iemsHomeTab: iemsHomeTabRender,
  currentWindowRedirection: currentWindowRedirectionRender,
  appointWindow: appointWindowRender
}

/**
 * 网页窗体，vds.browser的initModule比browser触发更早，临时兼容
 * */
var _getBrowserUtils = function () {
  return browserUtils
}

var _getWindowInfo = function () {
  var windowScope = scopeManager.getWindowScope()
  if (windowScope) {
    return {
      componentCode: windowScope.getComponentCode(),
      windowCode: windowScope.getWindowCode()
    }
  }
  return {}
}

/**
 * 重定向窗体(当前页面跳转)
 * @param {String} componentCode 构件编码
 * @param {String} windowCode 窗体编码
 * @param {Object} params 其他参数（可选）
 * {
 * 	"inputParams":{Object},//窗体输入参数，格式：{"窗体输入变量编码1":"变量值",....}
 *  "windowTitle":{String} 窗体标题
 *  "inited" : {Function},//窗体渲染后事件
 *  "vjsContext" : {Object},//当前上下文变量
 * }
 * @example
 * vds.import("vds.browser.*");
 * vds.browser.redirect("v3_example", "index");
 */
export function redirect(componentCode, windowCode, params) {
  if (!componentCode || !windowCode) {
    return
  }
  params = params || {}
  var windowInputParams = handleInputParams(params['inputParams'])
  windowInputParams['variable']['formulaOpenMode'] = 'locationHref' //应该废弃，否则跟窗体入参冲突，可以改用窗体域的OpenMode或者CloseMode
  if (params.hasOwnProperty('windowTitle')) {
    windowInputParams.variable['windowtitle'] = params['windowTitle']
  }
  var callParams = {
    componentCode: componentCode,
    windowCode: windowCode,
    params: {
      inputParam: windowInputParams
    }
  }
  if (typeof params['inited'] == 'function') {
    callParams['inited'] = params['inited']
  }
  if (params.hasOwnProperty('vjsContext')) {
    callParams['vjsContext'] = params['vjsContext']
  }
  _getBrowserUtils().redirectModule(callParams)
}

/**
 * 模态窗口打开链接地址
 * @param {String} url 需要打开的链接
 * @param {Object} params 其他参数（可选）
 * {
 *  "title" : {String} 窗体标题（可选）
 *  "maximize": {Boolean} 是否最大化窗体，默认：false（可选）,
 *  "width": {Integer} 模态窗口宽度（可选）
 *  "height": {Integer} 模态窗口高度（可选）
 *  "primordial": {Boolean} 是否使用浏览器原生弹窗
 *  "winName" {String} 指定窗口标识，primordial为true时有效（可选）
 * }
 * @example
 * vds.import("vds.browser.*");
 * vds.browser.dialog("http://www.yindangu.com");
 */
export function dialog(url, params) {
  var __params = params || {}
  var func = function (resolve, reject) {
    try {
      if (!url) {
        reject(vds.exception.newBusinessException('打开的地址不能为空.'))
        return
      }
      var params = __params || {}
      if (vds.environment.isMobileWindow()) {
        var userAgent = navigator.userAgent
        if (userAgent.indexOf('v3app') < 1 && userAgent.indexOf('ydgApp') < 1) {
          var params = {
            url: url,
            title: title
          }
          params['callback'] = function () {
            resolve()
          }
          widgetAction.executeComponentAction('showModalUrl', params)
        } else {
          var config = {}
          config.url = url //创建webview后请求的url地址，需要带http://或https://            （打开H5窗体时必填）
          config.onClose = function () {
            resolve()
          }
          webViewService.openUrl(config)
          resolve()
        }
        return
      }
      var width = null
      var height = null
      var title
      var windowState = false
      if (params) {
        if (params.hasOwnProperty('title')) {
          title = params['title']
        }
        if (params.hasOwnProperty('width')) {
          width = params['width']
        }
        if (params.hasOwnProperty('height')) {
          height = params['height']
        }
        if (params['windowState'] === true) {
          windowState = true
        }
      }
      var newParams = {
        url: url,
        title: title,
        width: width,
        height: height
      }
      if (title) {
        newParams['title'] = title
      }
      if (params.primordial) {
        //浏览器原生弹窗
        if (params.winName) {
          newParams['winName'] = params['winName']
        }
        browserUtil.showModelessDialogEx(newParams)
        resolve()
        return
      } else {
        newParams['windowState'] = windowState
      }
      newParams.callback = resolve
      modalByUrlUtil.create(newParams)
    } catch (err) {
      reject(err)
    }
  }
  return new Promise(func)
}
/**
 * 模态打开窗体
 * @param {String} componentCode 构件编码
 * @param {String} windowCode 窗体编码
 * @param {Object} params 其他参数（可选）
 * {
 *  "title" {String} 页签标题
 *  "ruleContext" {@link RuleContext} 规则上下文
 *  "inputParams" {Object} 输入参数
 *  "width" : {Integer} 窗口宽度
 *  "height" : {Integer} 窗口高度
 * }
 * @returns {Promise}
 * @example
 * var promise = vds.browser.dialogWindow("comCode1","winCode1");
 * promise.then(function(){
 * 	alert("模态窗体已关闭")
 * }).catch(function(){
 * 	alert("模态窗体打开失败")
 * })
 * */
export function dialogWindow(componentCode, windowCode, params) {
  /*var __params = params || {}
  var func = function (resovle, reject) {
    var params = __params
    var inputs = handleInputParams(params.inputParams)
    inputs['variable']['formulaOpenMode'] = 'dialog'
    _getBrowserUtils().showModalModule({
      componentCode: componentCode,
      windowCode: windowCode,
      title: params.title,
      inputParam: inputs,
      closeCallback: resovle,
      extraParams: {
        errorCallback: reject
      },
      width: params.width,
      height: params.height
    })
  }
  return new Promise(func)*/
  return new Promise((resolve, reject) => {
    const windowScope = scopeManager.getWindowScope()
    const handler = windowScope.get('dialogWindowHandler')
    if (handler) {
      handler(
        componentCode,
        windowCode,
        params.title,
        handleInputParams(params.inputParams),
        resolve
      )
    } else {
      reject(Error('未找到模态打开窗体处理方法！'))
    }
  })
}

/**
 * 新页签打开新窗口,调用window.open,窗体不会阻塞
 * @param {String} url 需要打开的链接
 * @param {Object} params 其他参数（可选）
 * {
 * 	"winName" : {String} 指定窗口标识
 *  "title" : {String} 窗体标题
 *  "width" : {Integer} 窗口宽度
 *  "height" : {Integer} 窗口高度
 *  "top" : {Integer} 窗口上边距
 *  "left" : {Integer} 窗口左边距
 *  "feature" : {String} 其他
 *  "closed" : {Function} 关闭回调
 * }
 * @example
 * vds.import("vds.browser.*");
 * vds.browser.newTab("http://www.yindangu.com");
 */
export function newTab(url: string, params?: any) {
  if (!url) {
    return
  }
  var newParams = {
    url: url
  }
  if (params) {
    newParams['winName'] = params.winName
    newParams['title'] = params.title
    newParams['width'] = params.width
    newParams['height'] = params.height
    newParams['top'] = params.top
    newParams['left'] = params.left
    newParams['feature'] = params.feature
    newParams['closed'] = params.closed
  }
  _getBrowserUtils().showModelessDialogExNewTab(newParams)
}
/**
 * 当前页面跳转
 * @param {String} url 链接地址
 * @example
 * vds.browser.redirectByUrl("http://www.yindangu.com");
 * */
export function redirectByUrl(url) {
  _getBrowserUtils().currentPageOpen({
    url: url
  })
}
/**
 * 原生浏览器弹窗
 * @param {String} componentCode 构件编码
 * @param {String} windowCode 窗体编码
 * @param {Object} params 其他参数（可选）
 * {
 *  title {String} 页签标题
 *  ruleContext {@link RuleContext} 规则上下文
 *  inputParams {Object} 输入参数
 * }
 * */
export function newWindow(componentCode, windowCode, params) {
  if (!componentCode || !windowCode) {
    throw vds.exception.newConfigException('构件编码和窗体编码不能为空.')
  }
  params = params || {}
  var ruleContext = params.ruleContext
  if (ruleContext && typeof ruleContext._get == 'function') {
    ruleContext = ruleContext._get()
  }
  var inputs = handleInputParams(params.inputParams)
  var newConfig = {
    componentCode: componentCode,
    windowCode: windowCode,
    title: params['title'],
    ruleContext: ruleContext,
    inputs: inputs
  }
  const renderer = rendererObj.newWindow
  if (renderer) {
    renderer(newConfig)
  }
}
/**
 * 渲染到组件容器
 * @param {String} componentCode 构件编码
 * @param {String} windowCode 窗体编码
 * @param {String} containerCode 组件容器编码
 * @params {Object} params 其他参数（可选）
 * {
 *  title {String} 页签标题
 *  ruleContext {@link RuleContext} 规则上下文
 *  inputParams {Object} 输入参数
 *  inited {Function} 窗体初始化后事件
 * }
 * */
export function renderToContainer(
  componentCode,
  windowCode,
  containerCode,
  params
) {
  var __args = arguments
  var __params = params || {}
  return new Promise(function (resolve, reject) {
    try {
      var names = ['构件编码', '窗体编码', '组件容器编码']
      for (var i = 0, len = __args.length; i < len; i++) {
        if (!__args[i]) {
          throw vds.exception.newConfigException(names[i] + '不能为空.')
        }
      }
      var params = __params
      var ruleContext = params.ruleContext
      if (ruleContext && typeof ruleContext._get == 'function') {
        ruleContext = ruleContext._get()
      }
      var inputs = handleInputParams(params.inputParams)
      var newConfig = {
        componentCode: componentCode,
        windowCode: windowCode,
        title: params['title'],
        inParams: {
          windowContainer: containerCode
        },
        ruleContext: ruleContext,
        inited: resolve,
        inputs: inputs
      }
      const renderer = rendererObj.windowContainer
      if (renderer) {
        renderer(newConfig)
      } else {
        resolve()
      }
    } catch (err) {
      reject(err)
    }
  })
}
/**
 * 打开url到Div容器
 * @param {String} url 地址
 * @param {String} widgetCode div控件编码
 * @param {String} containerTagCode div容器标签编码
 * @params {Object} params 其他参数（可选）
 * {
 *  title {String} 页签标题
 *  ruleContext {@link RuleContext} 规则上下文
 * }
 * */
export function renderToDivContainerByUrl(
  url,
  widgetCode,
  containerTagCode,
  params
) {
  var __info = _getWindowInfo()
  var _setWidget = function (_closeParams) {
    return function () {
      widgetAction.executeWidgetAction(
        widgetCode,
        'setfireVueEvent',
        _closeParams
      )
    }
  }
  var __params = params || {}
  var ruleContext = __params.ruleContext
  if (ruleContext && ruleContext._get) {
    ruleContext = ruleContext._get()
  }
  if (ruleContext) {
    _setWidget = ruleContext.genAsynCallback(_setWidget)
  }
  return new Promise(function (resolve, reject) {
    try {
      var callBackFunc = function (params) {
        if (!params) {
          resolve()
          return
        }
        var exist = params.existIden === true ? true : false
        if (!exist) {
          //之前未打开过
          var closeParams = {
            widgetId: widgetCode,
            vuiCode: containerTagCode,
            eventName: 'close',
            params: {
              tagIden: params._iden
            }
          }
          var closeFunc = _setWidget(closeParams)
          //注册跨域关闭事件
          eventManager.onCrossDomainEvent({
            eventName: eventManager.CrossDomainEvents.ContainerWindowClose,
            handler: closeFunc
          })
        }
        resolve()
      }
      var closeback = function (params) {}
      var params = __params
      var containerParam = {
        containerCode: containerTagCode,
        /* 这个是标签的code */
        componentCode: __info.componentCode,
        windowCode: __info.windowCode,
        OpenMode: 'OpenLink',
        callback: callBackFunc,
        closeback: closeback,
        url: url,
        divCode: widgetCode,
        /* 这个是标签所在div的code */
        title: params.title
      }
      widgetAction.executeWidgetAction(
        widgetCode,
        'setopenWindowToDivContainer',
        containerParam
      )
    } catch (err) {
      reject(err)
    }
  })
}
/**
 * 渲染到div容器
 * @param {String} componentCode 构件编码
 * @param {String} windowCode 窗体编码
 * @param {String} widgetCode div控件编码
 * @param {String} divTagCode div容器标签编码
 * @params {Object} params 其他参数（可选）
 * {
 *  title {String} 页签标题
 *  ruleContext {@link RuleContext} 规则上下文
 *  inputParams {Object} 输入参数
 * }
 * @returns {Promise}
 * */
export function renderToDivContainer(
  componentCode,
  windowCode,
  widgetCode,
  divTagCode,
  params
) {
  var __args = arguments
  var __params = params || {}
  return new Promise(function (resolve, reject) {
    try {
      var names = ['构件编码', '窗体编码', 'div控件编码', 'div容器标签编码']
      for (var i = 0, len = __args.length; i < len; i++) {
        if (!__args[i]) {
          throw vds.exception.newConfigException(names[i] + '不能为空.')
        }
      }
      var params = __params
      var ruleContext = params.ruleContext
      if (ruleContext && typeof ruleContext._get == 'function') {
        ruleContext = ruleContext._get()
      }
      var inputs = handleInputParams(params.inputParams)
      var newConfig = {
        componentCode: componentCode,
        windowCode: windowCode,
        inParams: {
          divCode: widgetCode,
          windowContainer: divTagCode
        },
        title: params['title'],
        ruleContext: ruleContext,
        inputs: inputs,
        inited: function (windowInstanceCode) {
          resolve(windowInstanceCode)
        }
      }
      const renderer = rendererObj.divWindowContainer
      if (renderer) {
        renderer(newConfig)
      } else {
        resolve()
      }
    } catch (e) {
      reject(e)
    }
  })
}
/**
 * 打开窗体到首页页签
 * @param {String} componentCode 构件编码
 * @param {String} windowCode 窗体编码
 * @param {Object} params 其他参数（可选）
 * {
 *  title {String} 页签标题
 *  ruleContext {@link RuleContext} 规则上下文
 *  inputParams {Object} 输入参数
 * }
 * */
export function renderToHomeTab(componentCode, windowCode, params) {
  var __params = params || {}
  return new Promise(function (resolve, reject) {
    try {
      if (!componentCode || !windowCode) {
        throw vds.exception.newConfigException('构件编码和窗体编码不能为空.')
      }
      var params = __params
      var ruleContext = params.ruleContext
      if (ruleContext && typeof ruleContext._get == 'function') {
        ruleContext = ruleContext._get()
      }
      var inputs = handleInputParams(params.inputParams)
      var newConfig = {
        componentCode: componentCode,
        windowCode: windowCode,
        title: params['title'],
        ruleContext: ruleContext,
        inputs: inputs,
        closeTab: function (params) {
          params = params || {}
          var output = params.output || {}
          var isSure = params.isConfirmExit === true
          resolve(isSure, output)
        }
      }
      const renderer = rendererObj.iemsHomeTab
      if (renderer) {
        renderer(newConfig)
      } else {
        resolve()
      }
    } catch (err) {
      reject(err)
    }
  })
}
/**
 * 打开url到首页页签
 * @param {String} url 链接地址
 * @param {Object} params 其他参数（可选）
 * {
 * 	title {String} 标题
 *  ruleContext {@link RuleContext} 规则上下文
 * }
 * @returns {Promise}
 * */
export function renderToHomeTabByUrl(url, params) {
  var __params = params || {}
  return new Promise(function (resolve, reject) {
    try {
      if (!url) {
        reject(vds.exception.newConfigException('打开的地址不能为空.'))
        return
      }
      var params = __params
      var ruleContext = params.ruleContext
      if (ruleContext && typeof ruleContext._get == 'function') {
        ruleContext = ruleContext._get()
      }
      _getBrowserUtils().showByHomeTab({
        url: url,
        title: params.title,
        ruleContext: ruleContext,
        callback: resolve
      })
    } catch (err) {
      reject(err)
    }
  })
}
/**
 * 浏览器刷新
 * @param {String} componentCode 构件编码
 * @param {String} windowCode 窗体编码
 * @param {Object} params 其他参数（可选）
 * {
 *  title {String} 浏览器标题
 *  ruleContext {@link RuleContext} 规则上下文
 *  inputParams {Object} 输入参数
 *  winName {String} 在指定窗体标识中刷新，默认为空，当值为空时刷新当前浏览器页
 * }
 * */
export function refresh(componentCode, windowCode, params) {
  if (!componentCode || !windowCode) {
    throw vds.exception.newConfigException('构件编码和窗体编码不能为空.')
  }
  params = params || {}
  var ruleContext = params.ruleContext
  if (ruleContext && typeof ruleContext._get == 'function') {
    ruleContext = ruleContext._get()
  }
  var inputs = handleInputParams(params.inputParams)
  var newConfig = {
    componentCode: componentCode,
    windowCode: windowCode,
    title: params['title'],
    ruleContext: ruleContext,
    inputs: inputs
  }
  var type = 'currentWindowRedirection'
  if (params['winName']) {
    newConfig.inParams = {
      browerWindowFlag: params['winName']
    }
    type = 'appointWindow'
  }
  const renderer = rendererObj[type]
  if (renderer) {
    renderer(newConfig)
  }
}
/**
 * 将vds数据源对象转换成平台数据源对象
 * */
var handleInputParams = function (params) {
  var variable = {}
  var windowInputParams = {
    variable: variable
  }
  if (params) {
    for (var key in params) {
      if (!params.hasOwnProperty(key)) {
        continue
      }
      if (params[key] && vds.ds.isDatasource(params[key])) {
        var val = params[key]
        variable[key] = val._get()
      } else {
        variable[key] = params[key]
      }
    }
  }
  return windowInputParams
}
/**
 * 创建模态窗口
 * @params {Object} 弹窗参数
 * {
 * 	title {String} 弹框标题
 * 	width {Integer} 弹框宽度
 * 	height {Integer} 弹框高度
 * 	rendered {Function} 渲染回调
 *  closed {Function} 关闭回调
 *  formBorderStyle {String} 边框样式
 *  maximizeBox {Boolean} 是否显示最大化按钮 默认true
 *  windowState {String} Normal
 * }
 * @example
 * vds.browser.createDialog({
 * 	title:"自定义弹窗标题",
 *  width:900,
 *  height:600,
 *  rendered:function(containerCode, closeFunc, setTitleFunc){
 *  	document.getElementById(containerCode).innerHTML = "弹窗内容",
 *  	setTitleFunc("新标题");
 *  }
 * });
 * */
export function createDialog(params) {
  var modalParams = {
    title: params.title,
    width: params.width,
    height: params.height,
    rendered: params.rendered,
    closed: params.closed,
    resized: function (containerCode) {},
    formBorderStyle: params.formBorderStyle
      ? params.formBorderStyle
      : 'FixedSingle',
    maximizeBox: params.maximizeBox != false,
    windowState: params.windowState ? params.windowState : 'Normal'
  }
  viewModel.create(modalParams)
}
