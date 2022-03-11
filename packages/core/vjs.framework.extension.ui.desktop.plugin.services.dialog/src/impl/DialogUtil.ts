let sandbox

export function initModule(sb: any): void {
  sandbox = sb
}

/**
 * 显示确认提示框
 *
 * @content 确认信息的内容
 */
let confirmDialog = function (
  content: string,
  responseCallBackFunc: Function
): any {
  let result

  let callback = function (val: any) {
    if (typeof responseCallBackFunc == 'function') {
      val = !!val
      responseCallBackFunc(val)
    }
  }
  //@ts-ignore
  result = isc.confirm(_toString(content), callback)

  return result
}
/**
 * 显示确认提示框
 *
 * @content 确认信息的内容
 */
let propmtDialog = function (
  content: string,
  responseCallBackFunc: Function
): void {
  //直接使用sc的
  //@ts-ignore
  isc.say(_toString(content), responseCallBackFunc)
}
/**
 * 显示错误提示框
 *
 * @content 确认信息的内容
 */
let errorDialog = function (
  content: string,
  responseCallBackFunc: Function
): void {
  //@ts-ignore
  isc.warn(_toString(content), responseCallBackFunc)
}
/**
 * 显示警告提示框
 *
 * @content 确认信息的内容
 */
let warnDialog = function (
  content: string,
  responseCallBackFunc: Function
): void {
  //@ts-ignore
  isc.warn(_toString(content), responseCallBackFunc)
}
/**
 * 显示信息提示框
 *
 * @content 确认信息的内容
 */
let infoDialog = function (
  content: string,
  responseCallBackFunc: Function
): void {
  //@ts-ignore
  isc.say(_toString(content), responseCallBackFunc)
}
let _toString = function (content: string): string {
  //@ts-ignore
  if (isc.isA.String(content)) {
    return content
  } else {
    return content == null || typeof content == 'undefined' ? '' : '' + content
  }
}

export { confirmDialog, propmtDialog, errorDialog, warnDialog, infoDialog }
