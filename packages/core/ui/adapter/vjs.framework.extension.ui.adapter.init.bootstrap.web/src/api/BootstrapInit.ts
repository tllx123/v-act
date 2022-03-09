import { VPlatfromIframeManager as iframeManager } from '@v-act/vjs.framework.extension.platform.data.manager.runtime.window.iframe'
import { Environment as environment } from '@v-act/vjs.framework.extension.platform.interface.environment'
import { ExceptionHandler as exceptionHandler } from '@v-act/vjs.framework.extension.platform.interface.exception'
import { ScopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import {
  WindowContainer,
  WindowContainerManager as windowRelation
} from '@v-act/vjs.framework.extension.platform.services.view.relation'

import * as componentUtil from './api/BootstrapUtil'

let sandbox

export function initModule(sb) {
  sandbox = sb
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
 * refComponents:{}
 */
let execute = function (
  componentCode,
  windowCode,
  inputParam,
  paramCfg,
  languageCode
) {
  let runningMode = paramCfg.runningMode
  let debug = paramCfg.debug
  let contextPath = paramCfg.contextPath
  let renderedCallback = paramCfg.rendered
  let initedCallback = paramCfg.inited
  let scopeId = paramCfg.scopeId
  let refComponents = paramCfg.refComponents

  environment.setRunningMode(runningMode)
  environment.setDebug(debug)
  environment.setContextPath(contextPath)
  environment.setDebugPort(paramCfg.debugPort)
  //environment.setPlatformType(platformType);
  let callbackCfg = function (component, scopeId) {
    if (first_window_scopeId != scopeId) {
      $('body').append(component)
    }
    let _title = ScopeManager.getWindowScope().getTitle()
    //链接地址打开时没有域信息，暂时通过window对象上的信息传递
    if (!window._$VPLATFORMCHANGETITLEIDEN) {
      if (_title && document.title != _title) {
        document.title = _title
      }
    } else {
      document.title = window._$VPLATFORMCHANGETITLEIDEN
    }
    //更新ele，处理进度条不显示的问题
    if (component) {
      let domId = $(component)[0].id
      if (vdk.postMsg) {
        vdk.postMsg.putAllInfo({
          componentCode: componentCode,
          windowCode: windowCode,
          title: document.title,
          modalCode: domId,
          _$urlObj: iframeManager.parseUrl(window.location.href)
        })
      }
      let winConId = windowRelation.getByScopeId(scopeId)
      if (winConId) {
        windowRelation.updateWindowInfo(winConId, {
          ele: domId,
          title: _title
        })
      }
    }
    let viewLib = this
    if (typeof renderedCallback == 'function') {
      renderedCallback()
    }

    let initCallbak = function () {
      viewLib.fireCallback()
      if (typeof initedCallback == 'function') {
        initedCallback()
      }
    }
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
            { 'vjs.framework.extension.ui.adapter.dependency.bootstrap': null },
            { 'vjs.framework.extension.platform.rpc.operationLib.web': null }
          ]
        )
      }
    )
    /**
     * 浏览器页面关闭前事件
     * */
    window.onbeforeunload = (function (param_scopeId) {
      return function () {
        var isError = null
        var success = function () {}
        var error = function () {
          isError = true
        }
        ScopeManager.openScope(param_scopeId)
        var windowScope = ScopeManager.getWindowScope()
        if (windowScope && windowScope.fireBeforeClose) {
          windowScope.fireBeforeClose(success, error)
        }
        ScopeManager.closeScope()
        if (isError) return isError
      }
    })(scopeId)
  }

  if (scopeId == undefined) {
    scopeId = ScopeManager.createWindowScope({
      parentScopeId: null,
      componentCode: componentCode,
      windowCode: windowCode,
      series: 'bootstrap'
    })
  }
  ScopeManager.openScope(scopeId)
  let setTitle = function (newTitle) {
    if (newTitle) document.title = newTitle
  }
  let _title = ScopeManager.getWindowScope().getTitle()
  let container = new WindowContainer({
    titleFunc: setTitle,
    scopeId: scopeId,
    componentCode: componentCode,
    windowCode: windowCode,
    title: document.title
  })
  let windowContainerId = windowRelation.put(container)
  if (languageCode) {
    let resourcePackage = sandbox.getService(
      'vjs.framework.extension.ui.adapter.resourcepackage'
    )
    resourcePackage.setWindowCurrentResourceCode(
      scopeId,
      null,
      componentCode,
      languageCode
    )
  }
  ScopeManager.closeScope()
  componentUtil.setRunningMode(runningMode)
  componentUtil.renderComponent(
    componentCode,
    windowCode,
    scopeId,
    callbackCfg,
    refComponents,
    function (exception) {
      let progressbar = sandbox.getService(
        'vjs.framework.extension.ui.common.plugin.services.progressbar.ProgressBarUtil'
      )
      progressbar.hideProgress()
      exceptionHandler.handle(exception)
    }
  )
  let progressbar = sandbox.getService(
    'vjs.framework.extension.ui.common.plugin.services.progressbar.ProgressBarUtil'
  )
  progressbar.hideProgress()
}

export { execute }
