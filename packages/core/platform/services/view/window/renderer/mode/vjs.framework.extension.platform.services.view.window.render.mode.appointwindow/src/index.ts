import { Browser as browser } from '@v-act/vjs.framework.extension.platform.services.browser'

import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

export function render(params) {
  var componentCode = params.componentCode
  var windowCode = params.windowCode
  var title = params.title
  var windowInputParams = params.inputs
  var series = scopeManager.getWindowScope().getSeries()
  var inParams = params.inParams

  // 标注在指定的窗口打开
  if ('bootstrap_mobile' != series) {
    var flag = inParams['browerWindowFlag']
    windowInputParams['variable']['formulaOpenMode'] = 'dialog'
    browser.callBrowserWindow({
      componentCode: componentCode,
      windowCode: windowCode,
      title: title,
      inputParam: windowInputParams,
      isBlock: false,
      winName: flag
    })
  }
}
