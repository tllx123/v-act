import { JsonUtil as jsonUtil } from '@v-act/vjs.framework.extension.util.json'
import { DialogUtil as dialogUtil } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.dialog'
import { ExpressionContext as ExpressionContext } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { ExpressionEngine as engine } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { DatasourcePuller as datasourcePuller } from '@v-act/vjs.framework.extension.platform.services.domain.datasource'
let undefined
let undefined
let undefined
let undefined
let undefined

exports.initModule = function (sBox) {}

let SHOWTYPE_NOCONFIRM = '0' // 0:不询问，直接返回true或false
let SHOWTYPE_CONFIRM = '1' // 1:询问（确定/取消），根据用户选择继续或终止

let main = function (ruleContext) {
  let ruleCfgValue = ruleContext.getRuleCfg()
  let inParams = ruleCfgValue['inParams']
  let inParamsObj = jsonUtil.json2obj(inParams)
  let showType = inParamsObj['showType'] // 0为不询问（直接返回改变状态T/F），1为询问（确定/取消）
  let englishPrompt = inParamsObj['englishPrompt'] // 英文内容
  let englishtype = inParamsObj['englishtype'] // 英文内容类型:0为字符串，1为表达式
  let japanesePrompt = inParamsObj['japanesePrompt'] // 日文内容
  let japanesetype = inParamsObj['japanesetype'] // 日文内容类型:0为字符串，1为表达式
  let simpleChinesePrompt = inParamsObj['simpleChinesePrompt'] // 简体中文内容
  let simpleChinesetype = inParamsObj['simpleChinesetype'] // 简体中文内容类型:0为字符串，1为表达式
  let traditionChinesePrompt = inParamsObj['traditionChinesePrompt'] // 繁体中文内容
  let traditionChinesetype = inParamsObj['traditionChinesetype'] // 繁体中文内容类型:0为字符串，1为表达式
  let tableNames = inParamsObj['tablesName'] // 数据源数组
  if (tableNames == null || tableNames == undefined || tableNames.length == 0) {
    throw '没有选择数据源，请检查'
  }
  // 遍历数据源判断是否有数据更改
  let isChanged = false
  let userConfirm = true
  for (let index = 0; index < tableNames.length; index++) {
    let result = datasourcePuller.hasChanged({
      datasourceName: tableNames[index]
    })
    if (result) {
      isChanged = true
      break
    }
  }

  /*
    // 如果数据内容修改过，根据提示类型判断是否提示终止
    if (isChanged == true) {
        if (SHOWTYPE_CONFIRM == showType) {
            // 获取提示信息内容
            var message = simpleChinesePrompt; //提示信息(目前只取简体中文);
            var messageType = simpleChinesetype; //提示信息类型0代表非表达式，1代表表达式
            if (undefined != message && null != message) {
                if (message.length == 0) {
                    log.warn("请设置有效的提示信息");
                    return false;
                }
                if ("1" == messageType) {
                    message = formulaUtil.evalExpression(message);
                }
                if (typeof message == "string") {
                    if (message.length == 0) {
                        log.warn("请设置有效的提示信息");
                        return false;
                    }
                    if (message.substring(0, 1) == "\"" || message.substring(0, 1) == "'") {
                        message = message.substring(1);
                    }
                    if (message.substring(message.length - 1, message.length) == "\"" || message.substring(message.length - 1, message.length) == "'") {
                        message = message.substring(0, message.length - 1);
                    }
                    if (message.length == 0) {
                        log.warn("请设置有效的提示信息");
                        return false;
                    }
                }
            } else {
                if (message.length == 0) {
                    log.warn("请设置有效的提示信息");
                    return false;
                }
            }
            if (!confirm(message)) {
                return false;
            }
        } else if (SHOWTYPE_NOCONFIRM == showType) {
            //return false;
            return true; //不询问（直接返回改变状态T/F），返回true继续执行，改变状态由业务信息返回
        }
    }
    return true;
    */
  let callback = function (val) {
    userConfirm = typeof val == 'boolean' ? val : userConfirm
    setBusinessRuleResult(ruleContext, isChanged, userConfirm)
    ruleContext.setRuleStatus(true)
    ruleContext.fireRouteCallback()
  }

  //当数据已改变、并且需要提示信息的时候，处理下提示信息
  if (isChanged == true && SHOWTYPE_CONFIRM == showType) {
    let message = simpleChinesePrompt //提示信息(目前只取简体中文);
    let messageType = simpleChinesetype //提示信息类型0代表非表达式，1代表表达式
    if (message != null && '1' == messageType) {
      let context = new ExpressionContext()
      context.setRouteContext(ruleContext.getRouteContext())
      let message = engine.execute({
        expression: message,
        context: context
      })
    }
    if (message == null || String(message) == '') {
      throw new Error('请设置有效的提示信息')
    }
    message = String(message)
    if (
      message != '' &&
      (message.substring(0, 1) == '"' || message.substring(0, 1) == "'")
    ) {
      message = message.substring(1)
    }
    if (
      message != '' &&
      (message.substring(message.length - 1, message.length) == '"' ||
        message.substring(message.length - 1, message.length) == "'")
    ) {
      message = message.substring(0, message.length - 1)
    }
    userConfirm = dialogUtil.confirmDialog(message, callback, false)
  } else {
    setBusinessRuleResult(ruleContext, isChanged, userConfirm)
    ruleContext.setRuleStatus(true)
    ruleContext.fireRouteCallback()
  }
  ruleContext.markRouteExecuteUnAuto()
  return true
}

/**
 * 设置业务返回结果
 */
function setBusinessRuleResult(ruleContext, result, userConfirm) {
  if (ruleContext.setBusinessRuleResult) {
    ruleContext.setBusinessRuleResult({
      isChanged: result,
      confirm: userConfirm
    })
  }
}

export { main }
