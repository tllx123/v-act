import * as hardwareOperationService from '.'
import { JsonUtil as jsonUtil } from '@v-act/vjs.framework.extension.util'
import { log as log } from '@v-act/vjs.framework.extension.util'
import { ExpressionContext as ExpressionContext } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { ExpressionEngine as engine } from '@v-act/vjs.framework.extension.platform.services.engine.expression'

let undefined

//初始化vjs模块，如果规则逻辑需要引用相关vjs服务，则初始化相关vjs模块；如果不需要初始化逻辑可以为空
exports.initModule = function (sBox) {}

//规则主入口(必须有)
let main = function (ruleContext) {
  let routeContext = ruleContext.getRouteContext()
  let ruleCfgValue = ruleContext.getRuleCfg()
  let inParamObj = jsonUtil.json2obj(ruleCfgValue['inParams'])

  if (inParamObj.operationType == 'flashOn') {
    hardwareOperationService.openFlashLight()
  } else if (inParamObj.operationType == 'flashOff') {
    hardwareOperationService.closeFlashLight()
  } else if (inParamObj.operationType == 'brightness') {
    let inputParam = inParamObj.inputParams[0]
    if (
      inputParam.paramCode == 'lightenessValue' &&
      inputParam.paramType == 'expression'
    ) {
      let lightnessValue = expressFunc(inputParam.paramValue, routeContext)
      hardwareOperationService.setScreenBrightness(lightnessValue)
    } else {
      //TODO 抛出“无效参数”异常
      log.error('无效参数')
    }
  } else if (inParamObj.operationType == 'getGPSOpenstate') {
    let success = function (s) {
      if (s == 0) {
        setBusinessRuleResult(ruleContext, inParamObj.returnResult, false)
      } else if (s == 1) {
        setBusinessRuleResult(ruleContext, inParamObj.returnResult, true)
      }
      ruleContext.fireRouteCallback()
    }
    let error = function (message) {
      //TODO 异常处理
      log.error('执行getGPSStatus发生错误。' + message)
      ruleContext.fireRouteCallback()
    }
    hardwareOperationService.getGPSStatus(success, error)

    ruleContext.markRouteExecuteUnAuto()
  } else if (inParamObj.operationType == 'getBluetoothOpenstate') {
    ruleContext.markRouteExecuteUnAuto()
    let success = function (s) {
      setBusinessRuleResult(ruleContext, inParamObj.returnResult, s)
      ruleContext.fireRouteCallback()
    }
    let error = function (message) {
      //TODO 异常处理
      log.error('执行getBluetoothStatus发生错误。' + message)
      ruleContext.fireRouteCallback()
    }
    hardwareOperationService.getBluetoothStatus(success, error)
  } else if (inParamObj.operationType == 'getCurrentNetworkstatus') {
    let success = function (s) {
      setBusinessRuleResult(ruleContext, inParamObj.returnResult, s)
      ruleContext.fireRouteCallback()
    }
    let error = function (message) {
      //TODO 异常处理
      log.error('执行getNetworkState发生错误。' + message)
      ruleContext.fireRouteCallback()
    }
    hardwareOperationService.getNetworkState(success, error)
    ruleContext.markRouteExecuteUnAuto()
  } else if (inParamObj.operationType == 'setShock') {
    let inputParam = inParamObj.inputParams[0]
    if (
      inputParam.paramCode == 'shockSeconds' &&
      inputParam.paramType == 'expression'
    ) {
      let shockSeconds = expressFunc(inputParam.paramValue, routeContext)
      hardwareOperationService.vibrate(shockSeconds * 1000)
    } else {
      //TODO 抛出“无效参数”异常
      log.error('无效参数')
    }
  } else {
    //TODO 抛出 "无效操作"异常
    log.error('无效操作类型。' + inParamObj.operationType)
  }
}

function expressFunc(experss, routeContext) {
  if (experss == null || experss == '') {
    return null
  }
  let context = new ExpressionContext()
  context.setRouteContext(routeContext)
  let resultValue = engine.execute({
    expression: experss,
    context: context
  })
  return resultValue
}

function setBusinessRuleResult(ruleContext, returnResult, resultValue) {
  for (let i = 0; i < returnResult.length; i++) {
    let resultType = returnResult[i].resultType
    let resultName = returnResult[i].resultValue
    if (resultType == 'ruleSetVar') {
      ruleContext.getRouteContext().setVariable(resultName, resultValue)
    } else if (resultType == 'ruleSetOutput') {
      ruleContext.getRouteContext().setOutputParam(resultName, resultValue)
    } else {
      //TODO 警告“无效返回类型”
      log.warn('无效的返回类型：' + resultType)
    }
  }
}

export { main }
