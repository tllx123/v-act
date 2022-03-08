import { FrontEndAlerter as frontAlert } from '@v-act/vjs.framework.extension.platform.interface.alerter'
import { Environment as environment } from '@v-act/vjs.framework.extension.platform.interface.environment'
import { ExceptionFactory as factory } from '@v-act/vjs.framework.extension.platform.interface.exception'
import { platform as i18n } from '@v-act/vjs.framework.extension.platform.interface.i18n'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import {
  ExpressionContext as expressionContext,
  ExpressionEngine as engine
} from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { RemoteMethodAccessor as remoteMethodAccessor } from '@v-act/vjs.framework.extension.platform.services.operation.remote'
import { WidgetAction as widgetAction } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { RPC as rpc } from '@v-act/vjs.framework.extension.system'
import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'
import { uuid } from '@v-act/vjs.framework.extension.util.uuid'

let viewModel

let operationLib

let accessor

let ExpressionContext

export function initModule(sBox) {}
/**
 * 获取文件标识数据
 * */
function getCookie(name) {
  let arr,
    reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  if ((arr = document.cookie.match(reg))) return unescape(arr[2])
  else return null
}

const main = function (ruleContext) {
  let ruleCfgValue = ruleContext.getRuleCfg()
  let inParams = ruleCfgValue['inParams']
  let inParamsObj = jsonUtil.json2obj(inParams)
  //图片组件ID
  let widgetId = inParamsObj['picId']
  //生成目标：imageControl(图片控件), fileID（文件标识）
  let buildTargetType =
    'fileID' == inParamsObj['buildTargetType'] ? 'fileID' : 'imageControl'
  let fileIDReceiveTargetType = inParamsObj['fileIDReceiveTargetType']
    ? inParamsObj['fileIDReceiveTargetType']
    : null
  let valueTarget = inParamsObj['fileIDReceiveTarget']
  //是否重置
  let isReset = inParamsObj['isReset']
  //输入的验证码
  let context = new expressionContext()
  context.setRouteContext(ruleContext.getRouteContext())
  let inputCode = engine.execute({
    expression: inParamsObj['inputCode'],
    context: context
  })

  let iden = getCookie('v_platform_make_code_iden')

  inParamsObj.inputCode = inputCode
  //文件标识
  inParamsObj.fileId = iden

  if (
    undefined == inputCode ||
    null == inputCode ||
    undefined == widgetId ||
    null == widgetId
  ) {
    if ('fileID' != buildTargetType) {
      //
      //设置返回值
      setBusinessRuleResult(ruleContext, false)
      return
    }
  }

  let outFlag = false
  let callback = function (responseObj) {
    let success = responseObj.IsSuccess
    if (!success) {
      HandleException(
        ruleContext,
        'session过期或生成的验证码为空，请重新生成验证码.'
      )
      //				throw new Error("校验验证码异常！");
    }

    outFlag = responseObj.OutFlag
    if (!outFlag) {
      //如果选中重置调用重新生成验证码
      if (isReset) {
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
                  title: i18n.get(
                    '请求数据错误',
                    '获取随机验证码时报错弹框的标题'
                  ),
                  msgHeader: i18n.get(
                    '生成验证码失败',
                    '获取随机验证码时报错的错误信息标题'
                  ),
                  msg:
                    i18n.get(
                      '生成验证码失败，错误信息：',
                      '获取随机验证码时报错错误信息'
                    ) + (datas.msg ? datas.msg : ''),
                  detail: i18n.get(
                    '暂无',
                    '获取随机验证码时报错的详细错误信息'
                  ),
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
            iden
          widgetAction.executeWidgetAction(widgetId, 'setImageUrl', url)
        }
      }
    }
    //设置返回值
    setBusinessRuleResult(ruleContext, outFlag)
  }
  /**
   * desc 异常处理方法
   * @ruleContext 规则上下文
   * @error_msg 提示信息
   * vjs: 可省略
   * services:
   * 		factory = sandbox.getService("vjs.framework.extension.platform.interface.exception.ExceptionFactory");
   * */
  function HandleException(ruleContext, error_msg) {
    let exception = factory.create({
      type: factory.TYPES.Business,
      message: error_msg
    })
    ruleContext.handleException(exception)
    throw exception
  }
  let scope = scopeManager.getWindowScope()
  let windowCode = scope.getWindowCode()
  let componentCode = scope.getComponentCode()
  let routeContext = ruleContext.getRouteContext()
  let sConfig = {
    isAsyn: false,
    componentCode: componentCode,
    windowCode: windowCode,
    transactionId: routeContext.getTransactionId(),
    ruleSetCode: 'CommonRule_CheckCertCode',
    commitParams: [
      {
        paramName: 'InParams',
        paramType: 'char',
        paramValue: jsonUtil.obj2json(inParamsObj)
      }
    ],
    afterResponse: callback
  }
  remoteMethodAccessor.invoke(sConfig)

  /**
   * 设置业务返回结果
   */
  function setBusinessRuleResult(ruleContext, result) {
    if (ruleContext.setBusinessRuleResult) {
      ruleContext.setBusinessRuleResult({
        isValidateOK: result
      })
    }
  }
}

export { main }
