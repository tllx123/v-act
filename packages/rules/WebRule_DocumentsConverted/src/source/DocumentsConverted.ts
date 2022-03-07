import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { ParamFeldUtil as ParamFieldUtil } from '@v-act/vjs.framework.extension.platform.services.domain.ruleset'
import { RemoteMethodAccessor as remoteMethodAccessor } from '@v-act/vjs.framework.extension.platform.services.operation.remote'
import { WhereRestrict as whereRestrict } from '@v-act/vjs.framework.extension.platform.services.where.restrict'
import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'

export function initModule(sBox) {}

function main(ruleContext) {
  let ruleConfig = ruleContext.getRuleCfg()
  let inParamObj = jsonUtil.json2obj(ruleConfig.inParams)
  let scope = scopeManager.getWindowScope()
  let routeRuntime = ruleContext.getRouteContext()
  if (!check(inParamObj)) return

  let params = {
    condSqls: [], //查询条件
    condParams: [], //查询参数
    itemsField: []
    //字段对应关系--对于系统变量、组件变量、前台表达式、实体字段参数要解析实际的值
  }
  if (inParamObj.items) {
    for (let i = 0; i < inParamObj.items.length; i++) {
      // 处理查询条件
      let condCfgs = inParamObj.items[i].condition
      let condSqls = ''
      let condParams = {}
      if (condCfgs != null && condCfgs.length > 0) {
        let wrParam = {
          fetchMode: 'custom',
          routeContext: routeRuntime
        }
        let where = whereRestrict.init(wrParam)
        where.andExtraCondition(condCfgs, 'custom')
        condSqls = where.toWhere()
        condParams = where.toParameters()
      }
      params.condSqls.push(condSqls)
      params.condParams.push(condParams)

      //处理字段对应关系
      let itemsField = inParamObj.items[i].itemsField
      let fieldUtil = ParamFieldUtil.getInstance(
        itemsField,
        null,
        ruleContext.getRouteContext()
      )
      params.itemsField.push(fieldUtil.toItemsConverted())
      fieldUtil.toParamMap(condParams)
    }
  }
  params.items = inParamObj['items']

  // 调用完活动集之后的回调方法
  let callback = function (responseObj) {
    if (responseObj.Success == false) {
      throw new Error('单据转换执行异常:' + responseObj.OutputMessage)
    }
  }

  let sConfig = {
    isAsyn: false,
    componentCode: scope.getComponentCode(),
    windowCode: scope.getWindowCode(),
    transactionId: ruleContext.getRouteContext().getTransactionId(),
    ruleSetCode: 'CommonRule_DocumentsConverted',
    commitParams: [
      {
        paramName: 'InParams',
        paramType: 'char',
        paramValue: jsonUtil.obj2json(params)
      }
    ],
    afterResponse: callback,
    error: callback
  }
  remoteMethodAccessor.invoke(sConfig)
}

/**
 * 配置检查
 */
function check(inParamObj) {
  if (!checkMasterIdField(inParamObj)) return false
  return true
}

/**
 * 要求 对于从表来说，必须指定目标表的外键字段(维持目标表主从关系时需要知道)
 *
 * 目前的配置方式，没有指定从表目标表的外键字段，从表的外键字段是通过itemsField获取的；
 * 这种配置方式不明显，很容易使人遗漏，所以特别检查并提示。
 */
function checkMasterIdField(inParamObj) {
  let items = inParamObj.items
  for (let i = 0; i < items.length; i++) {
    // 主表或者某一个从表的规则配置
    let config = items[i]
    if (config.isMasterTable == true || config.isMasterTable == 'true') {
      //主表不需要检查
      continue
    }

    if (!checkItemsFieldContainsSrcRefFK(config.itemsField, config.refFK)) {
      alert(
        '[单据转换]规则配置有误：\n目标从表' +
          config.destTableName +
          '的外键字段必须指定。\n请在字段映射关系列表中进行配置。'
      )
      return false
    }
  }

  return true
}

/**
 * 检查ItemsField中，源表是否包含指定的名称
 */
function checkItemsFieldContainsSrcRefFK(itemsField, srcRefFK) {
  for (let i = 0; i < itemsField.length; i++) {
    if (itemsField[i].sourceField == srcRefFK) return true
  }
  return false
}

export { main }
