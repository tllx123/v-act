import { Browser as browser } from '@v-act/vjs.framework.extension.platform.services.browser'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

export function render(params) {
  var componentCode = params.componentCode
  var windowCode = params.windowCode
  var title = params.title
  var windowInputParams = params.inputs
  var series = scopeManager.getWindowScope().getSeries()

  // 总是新窗口打开,标注为非模态打开
  if ('bootstrap_mobile' != series) {
    windowInputParams['variable']['formulaOpenMode'] = 'dialog'
    //viewModel.getCmpModule().callModuleEx(componentCode,windowCode, title, windowInputParams, null, null, false, "_blank");
    browser.callBrowserWindow({
      componentCode: componentCode,
      windowCode: windowCode,
      title: title,
      inputParam: windowInputParams,
      isBlock: false,
      winName: '_blank'
    })
  }
}
