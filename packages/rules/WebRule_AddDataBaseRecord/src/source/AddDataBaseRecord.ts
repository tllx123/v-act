import { JsonUtil as jsonUtil } from '@v-act/vjs.framework.extension.util'
import { ErrorUtil as errorUtil } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.error'
import { DialogUtil as dialogUtil } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.dialog'
import { ExpressionContext as ExpressionContext } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { ExpressionEngine as engine } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { RemoteMethodAccessor as remoteMethodAccessor } from '@v-act/vjs.framework.extension.platform.services.operation.remote'
import { RPC as rpcEnum } from '@v-act/vjs.framework.extension.platform.interface.enum'
import { log as logUtil } from '@v-act/vjs.framework.extension.util'

let undefined
let undefined
let undefined
let undefined
let undefined
let undefined
let undefined
let undefined
exports.initModule = function (sBox) {}

let main = function (ruleContext) {
  let isCascadeSave = true
  let ruleConfig = ruleContext.getRuleCfg()
  let routeContext = ruleContext.getRouteContext()
  let paramsValue = ruleConfig['inParams']
  let dataSourcesMapping = null
  let scope = scopeManager.getScope()
  if (paramsValue) {
    let inParams = jsonUtil.json2obj(paramsValue)
    dataSourcesMapping = inParams['dataSourcesMapping']
  }

  //如果存在映射关系则生成目标映射表保存数据进行保存
  if (undefined != dataSourcesMapping && null != dataSourcesMapping) {
    let parsedDatas = []
    for (let i = 0; i < dataSourcesMapping.length; i++) {
      let dataSourceMapping = dataSourcesMapping[i]
      let dataSourceName = dataSourceMapping['dataSource']

      let currData = {}
      currData['dataSource'] = dataSourceName
      currData['values'] = []
      let dataMap = dataSourceMapping['dataMap']
      for (let k = 0; k < dataMap.length; k++) {
        let currMap = dataMap[k]
        let colValue = currMap['colValue']
        let valueType = currMap['valueType']
        let value
        let currValueObject = {}
        //现在的来源类型只能为expression
        if (valueType == 'expression') {
          let context = new ExpressionContext()
          context.setRouteContext(ruleContext.getRouteContext())
          let value = engine.execute({
            expression: colValue,
            context: context
          })
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

    //如果没有需要保存的数据则不调用后台规则
    if (parsedDatas.length > 0) {
      let params = {}
      params.condParams = parsedDatas
      params.dataSourcesMapping = dataSourcesMapping

      // 调用完活动集之后的回调方法
      let callback = function (responseObj) {
        logUtil.error(responseObj.message)
        ruleContext.handleException(responseObj)
      }
      let successCallBack = function (responseObj) {
        ruleContext.fireRouteCallback()
      }
      //  调用后台活动集
      let sConfig = {
        isAsyn: true,
        timeout: rpcEnum.TIMEOUT.SHORT,
        componentCode: scope.getComponentCode(),
        transactionId: routeContext.getTransactionId(),
        ruleSetCode: 'CommonRule_AddDataBaseRecord',
        commitParams: [
          {
            paramName: 'InParams',
            paramType: 'char',
            paramValue: jsonUtil.obj2json(params)
          }
        ],
        error: callback,
        afterResponse: successCallBack
      }

      let scopeId = scope.getInstanceId()
      let windowScope = scopeManager.getWindowScope()
      if (scopeManager.isWindowScope(scopeId)) {
        sConfig.windowCode = windowScope.getWindowCode()
      }
      remoteMethodAccessor.invoke(sConfig)
      ruleContext.markRouteExecuteUnAuto()
    }
  }
}

export { main }
