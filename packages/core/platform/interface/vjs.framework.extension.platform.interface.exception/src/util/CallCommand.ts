import { FrontEndAlerter as alerter } from '@v-act/vjs.framework.extension.platform.interface.alerter'
import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'

let sandbox

export function initModule(sb) {
  sandbox = sb
}

const showDialog = function (params) {
  alerter.error(params)
}

const callCommand = function (value, callback) {
  let remote = sandbox.getService(
    'vjs.framework.extension.platform.services.domain.operation.RemoteOperation'
  )
  if (!remote) return
  let json = jsonUtil.obj2json(value)
  remote.request({
    operation: 'FrontendException',
    windowCode: null, //设置窗体Code，防止接口里设置导致走权限校验
    params: {
      detail: json
    },
    error: function () {}
  })
}

export {
  _getHandler,
  callCommand,
  create,
  getExceptionHtml,
  handle,
  isException,
  onBeforeHandler,
  onHandleFunction,
  showDialog
}
