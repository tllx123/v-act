import { ComponentParam as componentParam } from '@v-act/vjs.framework.extension.platform.data.storage.runtime.param'
import { ExceptionFactory as exception } from '@v-act/vjs.framework.extension.platform.interface.exception'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import {
  ExpressionContext,
  ExpressionEngine as engine
} from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { DatasourceManager as datasourcemanager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { RemoteMethodAccessor as accessor } from '@v-act/vjs.framework.extension.platform.services.operation.remote'
import { WindowParam as windowParam } from '@v-act/vjs.framework.extension.platform.services.param.manager'
import { WidgetProperty as widgetProperty } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { WhereRestrict } from '@v-act/vjs.framework.extension.platform.services.where.restrict'
import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'
import { Log as logUtil } from '@v-act/vjs.framework.extension.util.logutil'

let context

export function initModule(sBox) {}

const main = function (ruleContext) {
  let isCascadeSave = true
  let ruleConfig = ruleContext.getRuleCfg()
  let paramsValue = ruleConfig['inParams']
  let dataSourcesMapping = null
  if (paramsValue) {
    let inParams = jsonUtil.json2obj(paramsValue)
    dataSourcesMapping = inParams['dataSourcesMapping']
  }

  context = new ExpressionContext()
  let routeContext = ruleContext.getRouteContext()
  context.setRouteContext(routeContext)
  //如果存在映射关系则生成目标映射表保存数据进行保存
  if (undefined != dataSourcesMapping && null != dataSourcesMapping) {
    let parsedDatas = []
    for (let i = 0; i < dataSourcesMapping.length; i++) {
      let dataSourceMapping = dataSourcesMapping[i]
      let currData = {}
      currData['dataSource'] = dataSourceMapping['dataSource']
      let condition = dataSourceMapping['condition']
      let wrParam = {
        fetchMode: 'custom',
        routeContext: routeContext
      }
      let w = WhereRestrict.init(wrParam)
      if (undefined != condition && null != condition && condition.length > 0) {
        w.andExtraCondition(condition, 'custom')
      }
      currData['condition'] = w.toWhere()
      currData['parameters'] = w.toParameters()
      currData['values'] = []
      let dataMap = dataSourceMapping['dataMap']
      for (let k = 0; k < dataMap.length; k++) {
        let currMap = dataMap[k]
        let colValue = currMap['colValue']
        let valueType = currMap['valueType']
        let value
        let currValueObject = {}
        switch (valueType) {
          case '0': //界面实体
            var tempTabName = colValue.substring(0, colValue.indexOf('.'))
            var tempColName = colValue.substring(
              colValue.indexOf('.') + 1,
              colValue.length
            )
            var curValue = datasourcemanager
              .lookup({
                datasourceName: tempTabName
              })
              .getCurrentRecord()
            if (curValue) {
              value = curValue.get(tempColName)
            }
            break
          case 'expression': //表达式
            value = engine.execute({
              expression: colValue,
              context: context
            })
            break
          case '2': //组件变量
            value = windowParam.getInput({
              code: colValue
            })
            break
          case '3': //系统变量
            value = componentParam.getVariant({
              code: colValue
            })
            break
          case '4': //控件
            value = widgetProperty.get(colValue, 'Value')
            break
          case '5': //固定值
            value = colValue
            break
          case '6': //SQL表达式
            value = engine.execute({
              expression: colValue,
              context: context
            })
            break
          default:
            break
        }
        currValueObject['destField'] = currMap['colName']
        currValueObject['sourceField'] = value
        currValueObject['valueType'] = valueType
        currData['values'].push(currValueObject)
      }
      //如果所有字段值都为空则不给予保存
      if (currData['values'].length > 0) {
        parsedDatas.push(currData)
      }
    }
    if (parsedDatas.length > 0) {
      let params = {}
      params.condParams = parsedDatas

      let callback = function (responseObj) {
        let success = responseObj.Success
        if (!success) {
          exception.create({
            message: '修改数据库中的记录执行异常！' + result.msg,
            type: exception.TYPES.UnExpected
          })
        }
        ruleContext.fireRouteCallback()
        return success
      }
      let errorCallback = function (responseObj) {
        logUtil.error(responseObj.message)
        ruleContext.handleException(responseObj)
      }

      let scope = scopeManager.getScope()
      let componentCode = scope.getComponentCode()
      let routeContext = ruleContext.getRouteContext()
      let transactionId = routeContext.getTransactionId()
      let commitParams = [
        {
          paramName: 'InParams',
          paramType: 'char',
          paramValue: jsonUtil.obj2json(params)
        }
      ]
      let reObj = {
        isAsyn: true,
        ruleSetCode: 'CommonRule_ModifyDataBaseRecord',
        commitParams: commitParams,
        componentCode: componentCode,
        transactionId: transactionId,
        error: errorCallback,
        afterResponse: callback
      }
      let scopeId = scope.getInstanceId()
      let windowScope = scopeManager.getWindowScope()
      if (scopeManager.isWindowScope(scopeId)) {
        reObj.windowCode = windowScope.getWindowCode()
      }
      accessor.invoke(reObj)
      ruleContext.markRouteExecuteUnAuto()
    }
  }
}

export { main }
