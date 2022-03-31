import { log as log } from '@v-act/vjs.framework.extension.util'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { RemoteOperation as operation } from '@v-act/vjs.framework.extension.platform.services.domain.operation'
import { RouteEngine as routeEngine } from '@v-act/vjs.framework.extension.platform.services.engine.route'
import { ExpressionEngine as expressionEngine } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { ExpressionContext as ExpressionContext } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { DatasourceFactory as DBFactory } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'
import { WidgetProperty as widgetProperty } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { WidgetAction as widgetAction } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { DialogUtil as dialogUtil } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.dialog'
import { JsonUtil as jsonUtil } from '@v-act/vjs.framework.extension.util'
import { StringUtil as stringUtil } from '@v-act/vjs.framework.extension.util'

const initModule = function (sBox) {
  // sBox：前台vjs的沙箱（容器/上下文），可以用它根据vjs名称，获取到相应vjs服务
  sandbox = sBox
}

// 规则主入口(必须有)
let main = function (ruleContext) {
  // debugger;
  // 获取规则链路由上下文,终止执行后续规则
  let routeContext = ruleContext.getRouteContext()
  // 获取规则链路由上下文的配置参数值
  let ruleCfgValue = ruleContext.getRuleCfg()
  let inParams = ruleContext.getRuleCfg()['inParams']
  let inParamObjs = jsonUtil.json2obj(inParams)
  if (null == inParamObjs || undefined == inParamObjs) {
    log.log('[ExecLoginModelSelectIdentityRuleSet]输出参数为空')
  }
  try {
    let windowScope = scopeManager.getWindowScope()
    /* 执行主方法 */
    let _func = scopeManager.createScopeHandler({
      scopeId: windowScope.getInstanceId(),
      handler: function (inParamObjs) {
        ruleContext.markRouteExecuteUnAuto()
        let context = new ExpressionContext()
        context.setRouteContext(routeContext)
        let params = {},
          componentCode,
          ruleSetCode
        // 获取入参
        let inMaps = inParamObjs.inputParams.datas.values
        for (let index = 0; index < inMaps.length; index++) {
          let key = inMaps[index].paramKey
          let valueField = inMaps[index].paramValue
          if (
            null == valueField ||
            undefined == valueField ||
            '' == valueField
          ) {
            continue
          }
          let value = expressionEngine.execute({
            expression: valueField,
            context: context
          })
          if ('loginId' == key) {
            params['loginId'] = value
          }
          if ('isHandoffIdentity' == key) {
            params['isHandoffIdentity'] = value
          }
          if ('componentCode' == key) {
            componentCode = value
          }
          if ('ruleSetCode' == key) {
            ruleSetCode = value
          }
        }
        if (
          (null == componentCode || undefined == componentCode) &&
          (null == ruleSetCode || undefined == ruleSetCode)
        ) {
          log.log('[ExecLoginModelSelectIdentityRuleSet]待执行方法为空')
        }
        let ruleSetParams = {
          targetConfig: {
            // client-ruleSet(客户端)，server-ruleSet(服务端)
            sourceType: 'client-ruleSet',
            invokeType: 'api',
            windowCode: '',
            componentCode: componentCode,
            ruleSetCode: ruleSetCode
          },
          inputParam: params,
          config: {
            success: function (result) {
              if (null != result) {
                // 获取出参
                var outMaps = inParamObjs.outputParams.datas.values
                for (var index = 0; index < outMaps.length; index++) {
                  var key = outMaps[index].paramKey
                  var valueField = outMaps[index].paramValue
                  if (
                    null == valueField ||
                    undefined == valueField ||
                    '' == valueField
                  ) {
                    continue
                  }
                  var mappingMap = valueField.split('.')
                  var destName = mappingMap[1]
                  var sourceValue = result[key]
                  if (mappingMap[0] == 'BR_VAR_PARENT') {
                    ruleContext
                      .getRouteContext()
                      .setVariable(destName, sourceValue)
                  }
                  if (mappingMap[0] == 'BR_IN_PARENT') {
                    ruleContext
                      .getRouteContext()
                      .setInputParam(destName, sourceValue)
                  }
                  if (mappingMap[0] == 'BR_OUT_PARENT') {
                    ruleContext
                      .getRouteContext()
                      .setOutputParam(destName, sourceValue)
                  }
                }

                // 继续规则链执行
                ruleContext.fireRuleCallback()
                ruleContext.fireRouteCallback(result)
              }
            },
            error: function (e) {
              log.log('[ExecLoginModelSelectIdentityRuleSet]执行失败，' + e)
            }
          }
        }
        log.log(
          '[ExecLoginModelSelectIdentityRuleSet]执行方法:' +
            componentCode +
            '.' +
            ruleSetCode
        )
        routeEngine.execute(ruleSetParams)
      }
    })
    return _func(inParamObjs)
  } catch (e) {
    log.error(e)
  }
}

export { initModule, main }
