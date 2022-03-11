import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

//let sb = sandbox

/**
 * 获取运行时对应体系的提示服务
 */
let _getDialogService = function () {
  let serviceName =
    'vjs.framework.extension.platform.services.view.widget.common.dialog.impl.DialogUtil'
  let seriesType = scopeManager.getWindowScope().getSeries()
  let service: any = null
  /* service = sb.getService(serviceName, {
    type: seriesType
  }) */

  if (service == null) {
    throw new Error(
      '[Services.getService]获取服务失败！原因：控件体系[' +
        seriesType +
        ']未找到服务[' +
        serviceName +
        ']'
    )
  }
  return service
}

/**
 * 显示确认提示框
 *
 * @content 确认信息的内容
 */
let confirmDialog = function (
  content: string,
  responseCallBackFunc: Function,
  isUseDefault: boolean
) {
  let dialog = _getDialogService()
  if (dialog) {
    let result = dialog.confirmDialog(
      content,
      responseCallBackFunc,
      isUseDefault
    )
    return result
  } else {
    return confirm(content)
  }
}

/**
 * 显示确认提示框
 *
 * @content 确认信息的内容
 * @secDistance 倒计时
 */
let propmtDialog = function (
  content: string,
  responseCallBackFunc: Function,
  isUseDefault: boolean,
  secDistance: any
) {
  let dialog = _getDialogService()
  if (dialog) {
    let dialog = _getDialogService()
    dialog.propmtDialog(
      content,
      responseCallBackFunc,
      isUseDefault,
      secDistance
    )
  } else {
    alert(content)
    responseCallBackFunc()
  }
}

/**
 * 显示错误提示框
 *
 * @content 确认信息的内容
 */
let errorDialog = function (
  content: string,
  responseCallBackFunc: Function,
  isUseDefault: boolean
) {
  let dialog = _getDialogService()
  if (dialog) {
    let dialog = _getDialogService()
    dialog.errorDialog(content, responseCallBackFunc, isUseDefault)
  } else {
    alert(content)
    responseCallBackFunc()
  }
}

/**
 * 显示警告提示框
 *
 * @content 确认信息的内容
 */
let warnDialog = function (
  content: string,
  responseCallBackFunc: Function,
  isUseDefault: boolean
) {
  let dialog = _getDialogService()
  if (dialog) {
    let dialog = _getDialogService()
    dialog.warnDialog(content, responseCallBackFunc, isUseDefault)
  } else {
    alert(content)
    responseCallBackFunc()
  }
}

/**
 * 显示信息提示框
 *
 * @content 确认信息的内容
 */
let infoDialog = function (
  content: string,
  responseCallBackFunc: Function,
  isUseDefault: boolean
) {
  let dialog = _getDialogService()
  if (dialog) {
    let dialog = _getDialogService()
    dialog.infoDialog(content, responseCallBackFunc, isUseDefault)
  } else {
  }
}

export { confirmDialog, errorDialog, infoDialog, propmtDialog, warnDialog }
