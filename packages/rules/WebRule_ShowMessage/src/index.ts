/**
 * 显示设置的提示信息(用于需要提示用户或者询问用户的场景。)
 */
import { execute } from '@v-act/vjs.framework.extension.platform.services.integration.vds.expression'
import {
  confirm,
  error,
  info,
  warn
} from '@v-act/vjs.framework.extension.platform.services.integration.vds.message'
import { RuleContext } from '@v-act/vjs.framework.extension.platform.services.integration.vds.rule'

const SHOWTYPE_ALERT_CONTINUE = '0' //0:提示，可以继续
const SHOWTYPE_WARN_CONTINUE = '1' //1:警告，可以继续
const SHOWTYPE_ERROR_STOP = '2' //2:错误，不能继续
const SHOWTYPE_CONFIRM = '3' //3:询问（确定/取消），根据用户选择继续或终止
/**
 * 规则入口
 */
const main = function (ruleContext: RuleContext) {
  return new Promise<void>(function (resolve, reject) {
    try {
      const inParamsObj = ruleContext.getVplatformInput()
      const showType = inParamsObj['showType'] // 提示类型(硬编码来区分类型)
      let secDistance = inParamsObj['time'] //倒计时
      const simpleChinesePrompt = inParamsObj['simpleChinesePrompt'] // 简体中文提示
      const msgObj = simpleChinesePrompt // 获取提示信息内容
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
        message = execute(message, {
          ruleContext: ruleContext
        })
      }

      var userConfirm = true
      var callback = function (val?: boolean) {
        userConfirm = typeof val == 'boolean' ? val : userConfirm
        setResult(ruleContext, 'confirm', userConfirm)
        resolve()
      }
      switch (showType) {
        case SHOWTYPE_ALERT_CONTINUE:
          if (null == secDistance || secDistance == '' || isNaN(secDistance)) {
            secDistance = 3
          }
          var promise = info(message, {
            time: secDistance
          })
          promise.then(callback).catch(reject)
          break
        case SHOWTYPE_WARN_CONTINUE:
          var promise = warn(message)
          promise.then(callback).catch(reject)
          break
        case SHOWTYPE_ERROR_STOP:
          var promise = error(message)
          promise.then(callback).catch(reject)
          break
        case SHOWTYPE_CONFIRM:
          var promise = confirm(message)
          promise.then(callback).catch(reject)
          break
        default:
          callback(true)
          break
      }
    } catch (err) {
      reject(err)
    }
  })
}
/**
 * 设置规则返回值
 * @param {RuleContext} ruleContext 规则上下文
 * @param {String} code 返回值编码
 * @param {Any} value 值
 */
var setResult = function (ruleContext: RuleContext, code: string, value: any) {
  if (ruleContext.setResult) {
    ruleContext.setResult(code, value)
  }
}

export { main }
