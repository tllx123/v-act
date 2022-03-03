import { FrontEndAlerter as alerter } from '@v-act/vjs.framework.extension.platform.interface.alerter'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { JsonUtil as jsonUtil } from '@v-act/vjs.framework.extension.util'
let sandbox

exports.initModule = function (sb) {
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
  create,
  isException,
  handle,
  getExceptionHtml,
  onBeforeHandler,
  onHandleFunction,
  _getHandler,
  showDialog,
  callCommand
}
