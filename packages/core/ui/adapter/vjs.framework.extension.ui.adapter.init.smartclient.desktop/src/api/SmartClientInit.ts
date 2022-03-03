import { ScopeManager as ScopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { Environment as environment } from '@v-act/vjs.framework.extension.platform.interface.environment'
import * as componentUtil from './api/SmartClientUtil'

let sandbox

exports.initModule = function (sbox) {
  sandbox = sbox
}

/**
 * 渲染组件
 * @param componentCode<String> 组件编号
 * @param windowCode 窗体编号
 * @param {Object} inputParam 输入变量
 * @param {Object} paramCfg 参数配置
 *  runningMode 运行模式,
 * debug 是否debug模式,
 * contextPath 上下文路径,
 * showChromePlugin 是否提示安装chromePlugin插件
 * rendered:渲染回调
 * beforeFormLoad:窗体加载事件前回调
 * inited ： 组件初始化后回调
 * refComponents:{}
 */
let execute = function (componentCode, windowCode, inputParam, paramCfg) {
  isc.WidgetContext.setSkinType(paramCfg.skinType)
  let showChromePlugin = paramCfg.showChromePlugin,
    runningMode = paramCfg.runningMode,
    debug = paramCfg.debug,
    contextPath = paramCfg.contextPath
  environment.setRunningMode(runningMode)
  environment.setDebug(debug)
  environment.setContextPath(contextPath)
  let renderedCallback = paramCfg.rendered
  let initedCallback = paramCfg.inited
  let beforeFormLoadCallback = paramCfg.beforeFormLoad
  let rendererCallback = callBackFunc(showChromePlugin, contextPath)
  isc.WidgetContext.setContextPath(contextPath)
  isc.WidgetContext.setRunningMode(runningMode)
  if (runningMode == 'prd') {
    //关闭日志功能
    isc.Log.addClassMethods({
      isEnabledFor: function () {
        return false
      }
    })
  }
  let refComponents = paramCfg.refComponents
  let callbackCfg = function (component, scopeId) {
    rendererCallback(component, scopeId)
    if (typeof renderedCallback == 'function') {
      renderedCallback()
    }
  }
  let scopeId = ScopeManager.createWindowScope({
    parentScopeId: null,
    componentCode: componentCode,
    windowCode: windowCode,
    series: 'smartclient'
  })
  vjsBridge.properties.scopeId = scopeId
  componentUtil.renderComponentById(componentCode, windowCode, inputParam, {
    refComponents: refComponents,
    rendered: callbackCfg,
    scopeId: scopeId,
    contextPath: contextPath,
    runningMode: runningMode,
    debug: debug,
    beforeFormLoad: beforeFormLoadCallback,
    inited: initedCallback
  })
  //componentUtil.renderComponent(componentCode,windowCode,scopeId,callbackCfg,refComponents);
}

let _layout
let callBackFunc = function (showChromePlugin, contextPath) {
  return function (component, scopeId) {
    let canvas = isc.Canvas.create({
      width: '100%',
      height: '100%',
      children: [component],
      contents: null
    })
    canvas.show()
    component.parentElement = null //当前页面跳转时，如果不设置为null，则会将页面附加进来
  }
}

let createChromePluginCanvas = function (contextPath) {
  return isc.Canvas.create({
    autoDraw: false,
    height: 30,
    contents:
      '<div style="background:#FEFBC6;border:#C8CD7B solid 1px;text-align:center;padding:6px 0;color:#000;font-size:14px;z-index:999999;margin:0px 0;">您当前的IE浏览器版本低于9.0，为取得最佳效果，建议您安装Chrome Frame，点击<a href="' +
      contextPath +
      '/module-operation!executeOperation?operation=ChromeFrameGetter" style="color:#00F;">此处下载</a>！</div>'
  })
}

export { execute }
