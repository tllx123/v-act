import { log as log } from 'packages/core/WebFunc_PrdGetProcessApplicationBizInfo/src/source/node_modules/packages/core/WebFunc_PrdGetBizFrameCurrentRecord/src/source/node_modules/@v-act/vjs.framework.extension.util'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { RemoteOperation as operation } from '@v-act/vjs.framework.extension.platform.services.domain.operation'
import { RouteEngine as routeEngine } from 'packages/core/WebFunc_PrdSetFrameWindowEnable/src/source/node_modules/packages/core/WebFunc_PrdSetBizFormStateInfo/src/source/node_modules/@v-act/vjs.framework.extension.platform.services.engine.route'
import { ExpressionEngine as expressionEngine } from 'packages/core/WebFunc_WFCurrentActivityName/src/source/node_modules/@v-act/vjs.framework.extension.platform.services.engine.expression'
import { ExpressionContext as ExpressionContext } from 'packages/core/WebFunc_WFCurrentActivityName/src/source/node_modules/@v-act/vjs.framework.extension.platform.services.engine.expression'
import { DatasourceFactory as DBFactory } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'
import { WidgetProperty as widgetProperty } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { WidgetAction as widgetAction } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { DialogUtil as dialogUtil } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.dialog'
import { JsonUtil as jsonUtil } from 'packages/core/WebFunc_PrdGetProcessApplicationBizInfo/src/source/node_modules/packages/core/WebFunc_PrdGetBizFrameCurrentRecord/src/source/node_modules/@v-act/vjs.framework.extension.util'
import { StringUtil as stringUtil } from 'packages/core/WebFunc_PrdGetProcessApplicationBizInfo/src/source/node_modules/packages/core/WebFunc_PrdGetBizFrameCurrentRecord/src/source/node_modules/@v-act/vjs.framework.extension.util'

const initModule = function (sBox) {
  //sBox：前台vjs的沙箱（容器/上下文），可以用它根据vjs名称，获取到相应vjs服务
  sandbox = sBox
}

//定义常量
let OPERATION_TYPE_PROMPT = 'prompt'
let OPERATION_TYPE_CONTROL = 'control'
let CONTROL_PROPERTY_ENABLED = 'Enabled'
let CONTROL_PROPERTY_VISIBLE = 'Visible'
let CONTROL_PROPERTY_READONLY = 'ReadOnly'
let CONTROL_PROPERTY_MUST = 'Must'
let CONTROL_PROPERTY_VARNAME = 'BR_VAR_PARENT.strategyOperation'
let MENU_RULE_API = 'API_WorkflowChangeFrameDatas'
let MENU_COMPONENT_CODE = 'vbase_prd_workflow'

//规则主入口(必须有)
let main = function (ruleContext) {
  //debugger;
  // 获取规则链路由上下文,终止执行后续规则
  let routeContext = ruleContext.getRouteContext()
  // 获取规则链路由上下文的配置参数值
  let ruleCfgValue = ruleContext.getRuleCfg()
  let inParams = ruleContext.getRuleCfg()['inParams']
  let inParamObjs = jsonUtil.json2obj(inParams)
  if (null == inParamObjs || undefined == inParamObjs) {
    throw new Error('[WFExecuteInspectStrategy]执行失败，inParams为空')
  }
  try {
    let windowScope = scopeManager.getWindowScope()
    /* 执行规则路由  */
    let executeAPI = function (frameInputParams) {
      let params = {}
      params['FrameMenu'] = frameInputParams
      let ruleSetParams = {
        targetConfig: {
          //client-ruleSet(客户端)，server-ruleSet(服务端)
          sourceType: 'client-ruleSet',
          invokeType: 'api',
          windowCode: '',
          componentCode: MENU_COMPONENT_CODE,
          ruleSetCode: MENU_RULE_API
        },
        inputParam: params,
        config: {
          success: function () {
            log.log('execute: ' + MENU_RULE_API)
          },
          error: function (e) {
            log.log(e)
          }
        }
      }
      routeEngine.execute(ruleSetParams)
    }
    /* 修改控件/菜单属性 */
    let modifyControl = function (strategyType, code, attr, value) {
      if ('menu' == strategyType) {
        let dataJson = {
          datas: {
            recordCount: 1,
            //实体数据
            values: [
              {
                menuCode: code,
                attributeKey: attr,
                attributeValue: value
              }
            ]
          },
          metadata: {
            model: [
              {
                //实体名称
                datasource: 'FrameMenu',
                //实体字段
                fields: [
                  {
                    type: 'char',
                    code: 'menuCode'
                  },
                  {
                    type: 'char',
                    code: 'attributeKey'
                  },
                  {
                    type: 'char',
                    code: 'attributeValue'
                  }
                ]
              }
            ]
          }
        }
        let inputParams = DBFactory.unSerialize(dataJson)
        executeAPI(inputParams)
      }
      if ('control' == strategyType) {
        widgetProperty.set(code, attr, 'true' == value ? true : false)
      }
    }
    /* 执行主方法 */
    let _func = scopeManager.createScopeHandler({
      scopeId: windowScope.getInstanceId(),
      handler: function (inParamObjs) {
        let context = new ExpressionContext()
        context.setRouteContext(routeContext)
        // 检查策略实体
        let inspectStrategy, dataSource
        let paramMaps = inParamObjs.inputParams.datas.values
        for (let index = 0; index < paramMaps.length; index++) {
          let key = paramMaps[index].paramKey
          let valueField = paramMaps[index].paramValue
          // 获取入参
          let value = expressionEngine.execute({
            expression: valueField,
            context: context
          })
          if ('inspectStrategy' == key) {
            dataSource = value
          }
        }
        if (null == dataSource || undefined == dataSource) {
          throw new Error('[WFExecuteInspectStrategy]执行失败，dataSource为空')
        }
        let records = dataSource.getAllRecords()
        if (!records.isEmpty()) {
          for (let i = 0; i < records.size(); i++) {
            inspectStrategy = records.datas[i]
            //log.log("inspectStrategy：" + jsonUtil.obj2json(inspectStrategy));
            //策略类型
            let strategyType = inspectStrategy['strategyType']
            //执行类型
            let strategyOperationType = inspectStrategy['strategyOperationType']
            //执行条件
            let strategyCondition = inspectStrategy['strategyCondition']
            if (null == strategyCondition || undefined == strategyCondition) {
              throw new Error(
                '[WFExecuteInspectStrategy]执行失败，strategyCondition为空'
              )
            }
            //执行动作
            let strategyOperation = inspectStrategy['strategyOperation']
            if (null == strategyOperation || undefined == strategyOperation) {
              throw new Error(
                '[WFExecuteInspectStrategy]执行失败，strategyOperation为空'
              )
            }
            //执行条件表达式
            let execResult = expressionEngine.execute({
              expression: strategyCondition,
              context: context
            })
            if (typeof execResult != 'boolean') {
              throw new Error(
                '[WFExecuteInspectStrategy]执行失败，条件表达式必须返回布尔类型'
              )
            }
            if (true == execResult) {
              if ('form' == strategyType) {
                let attrStr = strategyOperation.toLowerCase().trim()
                let windowCode = windowScope.getWindowCode()
                // 禁用表单编辑,允许设置后，在窗体可对控件使能只读等进行控制，resetable要传true
                widgetAction.executeComponentAction(
                  'setReadOnly',
                  windowCode,
                  'true' == attrStr ? false : true,
                  true
                )
              } else {
                if (OPERATION_TYPE_PROMPT == strategyOperationType) {
                  // 弹窗提示并中断规则
                  let message = expressionEngine.execute({
                    expression: strategyOperation,
                    context: context
                  })
                  dialogUtil.propmtDialog(message, null, false, 3)
                  routeContext.markForInterrupt(routeContext.GLOBAL)
                  return
                }

                if (OPERATION_TYPE_CONTROL == strategyOperationType) {
                  // 解析控件属性
                  let expression =
                    'WFExecuteInspectStrategy("' + strategyOperation + '")'
                  let scope = scopeManager.getWindowScope()
                  let windowCode = scope.getWindowCode()
                  let tableDataMap = operation.evalExpression({
                    windowCode: windowCode,
                    expression: expression
                  })
                  if (null == tableDataMap || undefined == tableDataMap) {
                    throw new Error(
                      '[WFExecuteInspectStrategy]执行失败，tableDataMap为空'
                    )
                  }
                  let controlPropertys =
                    tableDataMap.data.result[CONTROL_PROPERTY_VARNAME]
                  if (
                    null == controlPropertys ||
                    undefined == controlPropertys
                  ) {
                    throw new Error(
                      '[WFExecuteInspectStrategy]执行失败，controlPropertys为空'
                    )
                  }
                  //修改控件属性
                  for (
                    let index = 0;
                    index < controlPropertys.length;
                    index++
                  ) {
                    let controlProperty = controlPropertys[index]
                    //log.log("controlProperty：" + jsonUtil.obj2json(controlProperty));
                    // 控件编码
                    let controlCode = controlProperty['controlCode']
                    // 使能
                    let enabled = controlProperty['enabled']
                    if (!stringUtil.isEmpty(enabled)) {
                      modifyControl(
                        strategyType,
                        controlCode,
                        CONTROL_PROPERTY_ENABLED,
                        enabled.trim()
                      )
                    }
                    // 显示
                    let visible = controlProperty['visible']
                    if (!stringUtil.isEmpty(visible)) {
                      modifyControl(
                        strategyType,
                        controlCode,
                        CONTROL_PROPERTY_VISIBLE,
                        visible.trim()
                      )
                    }
                    // 只读
                    let readOnly = controlProperty['readOnly']
                    if (!stringUtil.isEmpty(readOnly)) {
                      modifyControl(
                        strategyType,
                        controlCode,
                        CONTROL_PROPERTY_READONLY,
                        readOnly.trim()
                      )
                    }
                    // 必填： 暂不支持
                    // var must = controlProperty["must"];
                    // if (!stringUtil.isEmpty(must)) {
                    //	 widgetProperty.set(controlCode CONTROL_PROPERTY_MUST, "true" == must.trim() ? true : false);
                    // }
                  }
                }
              }
            }
          }

          return
        } else {
          throw new Error(
            '[WFExecuteInspectStrategy]执行失败，inspectStrategy为空'
          )
        }
      }
    })
    return _func(inParamObjs)
  } catch (e) {
    log.error(e)
  }
}

export { initModule, main }
