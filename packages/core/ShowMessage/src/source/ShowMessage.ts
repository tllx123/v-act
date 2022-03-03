import { JsonUtil as jsonUtil } from '@v-act/vjs.framework.extension.util'
import { log as log } from '@v-act/vjs.framework.extension.util'
import { ExpressionEngine as formulaEngine } from '@v-act/vjs.framework.extension.platform.engine.expression'
import { ExpressionContext as ExpressionContext } from '@v-act/vjs.framework.extension.platform.engine.expression'
import { DialogUtil as dialogUtil } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.dialog'
let undefined
let undefined
let undefined
let undefined
let undefined

exports.initModule = function (sBox) {}

let SHOWTYPE_ALERT_CONTINUE = '0' //0:提示，可以继续
let SHOWTYPE_WARN_CONTINUE = '1' //1:警告，可以继续
let SHOWTYPE_ERROR_STOP = '2' //2:错误，不能继续
let SHOWTYPE_CONFIRM = '3' //3:询问（确定/取消），根据用户选择继续或终止

let main = function (ruleContext) {
  let ruleCfgValue = ruleContext.getRuleCfg()
  let inParams = ruleCfgValue['inParams']
  let inParamsObj = jsonUtil.json2obj(inParams)
  let showType = inParamsObj['showType'] // 提示类型(硬编码来区分类型)
  let secDistance = inParamsObj['time'] //倒计时
  let simpleChinesePrompt = inParamsObj['simpleChinesePrompt'] // 简体中文提示
  let traditionChinesePrompt = inParamsObj['traditionChinesePrompt'] //繁体中文提示
  let englishPrompt = inParamsObj['englishPrompt '] //英文提示
  let japanesePrompt = inParamsObj['japanesePrompt'] //日文提示
  let msgObj = simpleChinesePrompt // 获取提示信息内容
  let message = msgObj['msgnote'] //提示信息(目前只取简体中文);
  let messageType = msgObj['type'] //提示信息类型0代表非表达式，1代表表达式
  if (
    undefined == messageType ||
    null == messageType ||
    messageType.length == 0
  ) {
    messageType = 1
  }
  if ('1' == messageType + '') {
    let expContext = {}
    let context = new ExpressionContext()
    context.setRouteContext(ruleContext.getRouteContext())
    message = formulaEngine.execute({
      expression: message,
      context: context
    })
  }

  let userConfirm = true
  let callback = function (val) {
    userConfirm = typeof val == 'boolean' ? val : userConfirm
    setBusinessRuleResult(ruleContext, userConfirm)
    ruleContext.setRuleStatus(true)
    ruleContext.fireRuleCallback()
    ruleContext.fireRouteCallback()
  }
  switch (showType) {
    case SHOWTYPE_ALERT_CONTINUE:
      //2017-02-14 liangzc：倒计时秒数暂时不支持表达式
      //				if(null != secDistance && secDistance != ""){
      //					var context = new ExpressionContext();
      //					context.setRouteContext(ruleContext.getRouteContext());
      //					secDistance = formulaEngine.execute({
      //						"expression": secDistance,
      //						"context": context
      //					});
      //					if(null == secDistance || secDistance == "" || isNaN(secDistance)){
      //						secDistance = 3;
      //					}
      //				}else{
      //					secDistance = 3;
      //				}
      if (null == secDistance || secDistance == '' || isNaN(secDistance)) {
        secDistance = 3
      }
      dialogUtil.propmtDialog(message, callback, false, secDistance)
      break
    case SHOWTYPE_WARN_CONTINUE:
      dialogUtil.warnDialog(message, callback, false)
      break
    case SHOWTYPE_ERROR_STOP:
      dialogUtil.errorDialog(message, callback, false)
      break
    case SHOWTYPE_CONFIRM:
      dialogUtil.confirmDialog(message, callback, false)
      break
    default:
      break
  }
  //TODO xiedh
  //ruleContext.fireRouteCallback();
  //ruleContext.setRuleCallbackFireFlag(true);
  ruleContext.markRouteExecuteUnAuto()
  return true
}
/**
 * 设置业务返回结果
 */
function setBusinessRuleResult(ruleContext, userConfirm) {
  if (ruleContext.setBusinessRuleResult) {
    ruleContext.setBusinessRuleResult({
      confirm: userConfirm
    })
  }
}

export { main }
