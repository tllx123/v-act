exports.initModule = function (sandbox) {
  let exceptionManager = sandbox.getService(
    'vjs.framework.extension.platform.interface.exception.ExceptionManager'
  )
  exceptionManager.onBeforeHandler({
    handler: function () {
      let remote = sandbox.getService(
        'vjs.framework.extension.platform.services.domain.operation.RemoteOperation'
      )
      remote.request({
        operation: 'FrontendException',
        windowCode: null, //设置窗体Code，防止接口里设置导致走权限校验
        params: {
          detail: this.getStackTrace()
        },
        error: function () {}
      })
    }
  })
  exceptionManager.onBeforeHandler({
    handler: function () {
      let type = this.getClassName()
      if (type == 'NetworkException') {
        alert('连接失败。')
      } else if (type == 'UnExpectedException') {
        this.showMessage = '程序出错。'
      }
    }
  })
}
