import * as componentUtil from './api/BootstrapMobileUtil'
import { Environment as environment } from '@v-act/vjs.framework.extension.platform.interface.environment'
import { ScopeManager as ScopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { ProgressBarUtil as progressbar } from '@v-act/vjs.framework.extension.ui.common.plugin.services.progressbar'
import { ApplicationParam as AppData } from '@v-act/vjs.framework.extension.platform.data.storage.schema.param'
import { ComponentPackData as componentPackData } from '@v-act/vjs.framework.extension.platform.global.data'

let sb

exports.initModule = function (sb) {}
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
 * inited ： 组件初始化后回调
 * beforeFormLoad : 窗体加载事件前回调
 * refComponents:{}
 */
let execute = function (newComponentCode, newWindowCode, inputParam, paramCfg) {
  let scopeId = paramCfg.scopeId
  //处理app上窗体替换不生效的问题
  let componentCode = newComponentCode
  let windowCode = newWindowCode
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
    /* 若窗体映射信息不为空的话，则表示配置相应的映射信息，需替换，并且是app中过来的，需要替换scopeId为目标窗体的 */
    if (windowMappingInfo != null) {
      componentCode = windowMappingInfo.componentCode
      windowCode = windowMappingInfo.windowCode
      if (scopeId) {
        let winScope = ScopeManager.getScope(scopeId)
        if (winScope) {
          scopeId = winScope.getChildId()
        }
      }
    }
  }
  let runningMode = paramCfg.runningMode,
    debug = paramCfg.debug,
    contextPath = paramCfg.contextPath,
    //窗体加载事件前回调
    beforeFormLoad = paramCfg.beforeFormLoad,
    platformType = paramCfg.platformType
  let renderedCallback = paramCfg.rendered
  environment.setRunningMode(runningMode)
  environment.setDebug(debug)
  environment.setContextPath(contextPath)
  environment.setPlatformType(platformType)
  environment.setDebugPort(paramCfg.debugPort)
  let initedCallback = paramCfg.inited
  let refComponents = paramCfg.refComponents
  let callbackCfg = function (component, scopeId) {
    //			if(first_window_scopeId != scopeId) {
    /* 渲染到页面指定容器内，解决swiper跟vui容器冲突的问题 */
    $('body').append(
      $(
        '<div class="swiper-wrapper swiper-pos swiper-wrapper-compent"><div class="swiper-slide v-component-fill scollbarhidden" id="mobile_render_component"></div></div>'
      )
    )
    $('#mobile_render_component').append(component)
    //				$("body").append(component);
    //			}

    let viewLib = this
    if (typeof renderedCallback == 'function') {
      renderedCallback()
    }
    let _title = ScopeManager.getWindowScope().getTitle()
    //链接地址打开时没有域信息，暂时通过window对象上的信息传递
    if (!window._$VPLATFORMCHANGETITLEIDEN) {
      if (_title && document.title != _title) document.title = _title
    } else {
      document.title = window._$VPLATFORMCHANGETITLEIDEN
    }
    let initCallbak = function () {
      viewLib.fireCallback()
      if (typeof initedCallback == 'function') {
        initedCallback()
      }
    }
    let extParams = {
      beforeFormLoad: beforeFormLoad
    }
    if (!window.GlobalVariables) {
      //PC端访问
      VMetrix.loadBundles(
        [
          'vjs.framework.extension.platform.init.view.schema.window.' +
            componentCode +
            '.' +
            windowCode,
          'vjs.framework.extension.platform.init.view.schema.Application',
          'vjs.framework.extension.platform.init.view.schema.component.' +
            componentCode
        ],
        function (bundles) {
          componentUtil.prepareComponent(
            componentCode,
            windowCode,
            scopeId,
            inputParam,
            initCallbak,
            refComponents,
            null,
            [
              {
                'vjs.framework.extension.ui.adapter.dependency.bootstrap.mobile':
                  null
              }
            ],
            extParams
          )
        }
      )
    } else {
      //mobile端访问
      componentUtil.prepareComponent(
        componentCode,
        windowCode,
        scopeId,
        inputParam,
        initCallbak,
        refComponents,
        null,
        [
          {
            'vjs.framework.extension.ui.adapter.dependency.bootstrap.mobile':
              null
          }
        ],
        extParams
      )
    }
  }

  if (scopeId == undefined) {
    let parentScopeId = ScopeManager.getCurrentScopeId()
    scopeId = ScopeManager.createWindowScope({
      parentScopeId: parentScopeId,
      componentCode: componentCode,
      windowScope: windowScope,
      series: 'bootstrap_mobile'
    })
  }
  componentUtil.setRunningMode(runningMode)
  componentUtil.renderComponent(
    componentCode,
    windowCode,
    scopeId,
    callbackCfg,
    refComponents,
    null,
    false
  ) //从页面打开的，已经经过权限校验，因此不需要再进行权限验证 xiedh 2016-07-27
  progressbar.hideProgress()
}

export { execute }
