import { ExceptionFactory as exception } from '@v-act/vjs.framework.extension.platform.interface.exception'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { ParamFeldUtil as ParamFieldUtil } from '@v-act/vjs.framework.extension.platform.services.domain.ruleset'
import { RemoteMethodAccessor as accessor } from '@v-act/vjs.framework.extension.platform.services.operation.remote'
import { DialogUtil as dialogUtil } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.dialog'
import {
  QueryCondUtil as util,
  WhereRestrict as whereRestrict
} from '@v-act/vjs.framework.extension.platform.services.where.restrict'
import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'

let operationLib

export function initModule(sBox) {}

function main(ruleContext) {
  debugger
  let ruleConfig = ruleContext.getRuleCfg()
  let inParamObj = jsonUtil.json2obj(ruleConfig.inParams)
  let routeContext = ruleContext.getRouteContext()
  if (!check(inParamObj)) return

  // 处理查询条件
  let condCfgs = inParamObj.condition
  let wrParam = {
    fetchMode: 'custom',
    routeContext: routeContext
  }
  let where = whereRestrict.init(wrParam)
  if (condCfgs != null && condCfgs.length > 0) {
    where.andExtraCondition(condCfgs, 'custom')
  }

  //查询参数配置
  let sourceType = inParamObj['sourceType']
  if (sourceType == 'Query') {
    let dsQueryParam = inParamObj['queryParam']
    if (dsQueryParam != null && dsQueryParam.length > 0) {
      dsQueryParam = util.genCustomParams({
        paramDefines: dsQueryParam,
        routeContext: routeContext
      })
    }
  }
  where.addExtraParameters(dsQueryParam)

  let params = {
    condSql: where.toWhere(), //查询条件
    condParams: where.toParameters() || {}, //查询参数
    equalFields: [] //字段对应关系数组
  }

  //处理字段对应关系中的参数:组件变量/系统变量/自定义值
  let fieldUtil = ParamFieldUtil.getInstance(
    inParamObj.equalFields,
    null,
    ruleContext.getRouteContext()
  )
  params.equalFields = fieldUtil.toItemsConverted()
  fieldUtil.toParamMap(params.condParams)
  params.condition = inParamObj['condition']
  params.sourceTableName = inParamObj['sourceTableName']
  params.destTableName = inParamObj['destTableName']
  params.repeatType = inParamObj['repeatType']

  let callback = scopeManager.createScopeHandler({
    handler: function (responseObj) {
      let success = responseObj.Success
      if (!success) {
        exception.create({
          message: '表间数据复制执行异常！',
          type: exception.TYPES.UnExpected
        })
      }
      ruleContext.fireRouteCallback()
      return success
    }
  })

  let scope = scopeManager.getWindowScope()
  let windowCode = scope.getWindowCode()
  let componentCode = scope.getComponentCode()
  let routeContext = ruleContext.getRouteContext()
  debugger
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
    ruleSetCode: 'CommonRule_CopyDataBetweenTables',
    commitParams: commitParams,
    componentCode: componentCode,
    windowCode: windowCode,
    transactionId: transactionId,
    afterResponse: callback
  }
  ruleContext.markRouteExecuteUnAuto()
  accessor.invoke(reObj)
}

/**
 * 配置检查
 */
function check(inParamObj) {
  if (!checkEqualFields(inParamObj)) return false
  return true
}

/**
 * 要求 非检查重复字段 必须至少有1个
 */
function checkEqualFields(inParamObj) {
  let equalFields = inParamObj.equalFields
  if (equalFields == null || equalFields.length == 0) {
    // alert('[表间数据复制]规则配置有误：字段映射关系不能为空！');
    dialogUtil.infoDialog(
      '[表间数据复制]规则配置有误：字段映射关系不能为空！',
      null,
      true
    )
    return false
  }

  //行重复处理方式：忽略=1，追加=2，更新=3
  if (inParamObj.repeatType != '3') {
    return true
  }

  let notCheckedField = false // 非检查重复字段 必须至少有1个
  //行重复处理方式为更新时，字段更新方式：""--忽略，"1"--累加，2--覆盖，3--忽略，4--累减
  let fieldRepeattype = {
    '1': '1',
    '2': '2',
    '4': '4'
  }
  for (let i = 0; i < equalFields.length; i++) {
    let field = equalFields[i]
    if (field.checkRepeat.toLowerCase() != 'false') continue
    if (fieldRepeattype[field.treatRepeattype] !== undefined) {
      notCheckedField = true
      break
    }
  }
  if (!notCheckedField) {
    dialogUtil.infoDialog(
      '[表间数据复制]规则配置有误：当行重复处理方式为更新时，字段映射关系中，至少需要配置一个更新字段，并且其重复处理方式不为空或者忽略。',
      null,
      true
    )
    return false
  }
  return true
}

export { main }
