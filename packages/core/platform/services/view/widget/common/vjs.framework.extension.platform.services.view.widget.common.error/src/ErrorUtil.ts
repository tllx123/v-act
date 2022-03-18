import { DialogUtil as dialogUtil } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.dialog'

let sb

export function initModule(sandbox) {
  sb = sandbox
}

let handleError = function (e: any) {
  if (e.handle) {
    let error = e
    while (error.error && error.error.handle) {
      error = error.error
    }
    error.handle()
  } else {
    dialogUtil.errorDialog('系统内部错误，请联系系统管理员处理。', null, false)
    if (window.console && console.log && e.stack) {
      console.log(e.stack.toString().replace(/,/g, '\n'))
    }
    throw e
  }
}

export { handleError }
