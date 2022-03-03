import { JsonUtil as jsonUtil } from '@v-act/vjs.framework.extension.util'
import { UUID as uuid } from '@v-act/vjs.framework.extension.util'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { WidgetAction as widgetAction } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { Environment as environment } from '@v-act/vjs.framework.extension.platform.interface.environment'
import { FrontEndAlerter as frontAlert } from '@v-act/vjs.framework.extension.platform.interface.alerter'
import { RPC as rpc } from '@v-act/vjs.framework.extension.system'
import { platform as i18n } from '@v-act/vjs.framework.extension.platform.interface.i18n'
let undefined
let undefined
let undefined
let undefined
let undefined
let undefined
let undefined

exports.initModule = function (sBox) {
  sb = sBox
}

let main = function (ruleContext) {
  let ruleCfgValue = ruleContext.getRuleCfg()
  let inParams = ruleCfgValue['inParams']
  let inParamsObj = jsonUtil.json2obj(inParams)
  let widgetId = inParamsObj['picCode']
  let buildTargetType =
    'fileID' == inParamsObj['buildTargetType'] ? 'fileID' : 'imageControl'
  let fileIDReceiveTargetType = inParamsObj['fileIDReceiveTargetType']
    ? inParamsObj['fileIDReceiveTargetType']
    : null
  let valueTarget = inParamsObj['fileIDReceiveTarget']
  let scope = scopeManager.getWindowScope()
  let moduleId = scope.getWindowCode()
  let iden = uuid.generate()
  document.cookie = 'v_platform_make_code_iden=' + iden
  if ('fileID' == buildTargetType) {
    let scope = scopeManager.getWindowScope()
    let componentCode = scope.getComponentCode()
    let windowCode = scope.getWindowCode()
    let str = jsonUtil.obj2json({
      iden: iden,
      target: buildTargetType
    })
    let infos = {
      paramName: 'InParams',
      paramType: 'string',
      paramValue: ''
    }
    let success = function (datas) {
      switch (fileIDReceiveTargetType) {
        case 'ruleSetInput':
          ruleContext.getRouteContext().setInputParam(valueTarget, iden)
          break
        case 'ruleSetVar':
          ruleContext.getRouteContext().setVariable(valueTarget, iden)
          break
        case 'ruleSetOutput':
          ruleContext.getRouteContext().setOutputParam(valueTarget, iden)
          break
      }
      ruleContext.fireRouteCallback()
    }
    rpc.invokeOperation({
      componentCode: componentCode,
      windowCode: windowCode,
      CertPicCode: iden,
      operationName: 'FileCertImage',
      isAsync: false,
      afterResponse: function (datas) {
        if (datas.success) {
          success()
        } else {
          frontAlert.error({
            title: i18n.get('请求数据错误', '获取随机验证码时报错弹框的标题'),
            msgHeader: i18n.get(
              '生成验证码失败',
              '获取随机验证码时报错的错误信息标题'
            ),
            msg:
              i18n.get(
                '生成验证码失败，错误信息：',
                '获取随机验证码时报错错误信息'
              ) + (returnJson.msg ? returnJson.msg : ''),
            detail: i18n.get('暂无', '获取随机验证码时报错的详细错误信息'),
            callback: function () {
              ruleContext.fireRouteCallback()
            }
          })
        }
      }
    })
  } else {
    //xx参数防止图片组件接受相同地址时不刷新问题
    let url =
      environment.getContextPath() +
      'module-operation!executeOperation?moduleId=' +
      moduleId +
      '&operation=FileCertImage&xx=' +
      uuid.generate()
    widgetAction.executeWidgetAction(widgetId, 'setImageUrl', url)
  }
}

export { main }
