import { ComponentParam } from '@v-act/vjs.framework.extension.platform.data.storage.runtime.param'
import {
  ExpressionContext,
  ExpressionEngine as Engine
} from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { DatasourceManager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { WindowParam } from '@v-act/vjs.framework.extension.platform.services.param.manager'
import { DatasourceUtil } from '@v-act/vjs.framework.extension.platform.services.view.logic.datasource'
import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'
import { Log as log } from '@v-act/vjs.framework.extension.util.logutil'

// 加载

export function initModule(sBox) {}
let TYPENAME = 'SourceType' // mappingItems中类型字段的名称
let FORMULANAME = 'FieldValue' // mappingItems中来源字段的名称
let DESTFIELD = 'TargetField' // mappingItems中目标字段的名称
let TYPE_DATASET = '3' // 类型：数据集
let TYPE_FIELD = '4' // 类型：组件实体
let TYPE_SYSVAR = '1' // 类型：系统变量
let TYPE_COMPONENTVAR = '5' // 类型：组件变量
let TYPE_EXPRESSION = '2' // 类型：表达式
let TYPE_EXPRESSIONS = 'expression'

// 规则主入口(必须有)
const main = function (ruleContext) {
  // 获取数据
  let ruleCfg = ruleContext.getRuleCfg()
  let params = ruleCfg['inParams']
  let inParamsObj = jsonUtil.json2obj(params)
  let dsName = inParamsObj['TargetEntity'] // 目标实体数据源
  let queryConds = inParamsObj['Conditions'] // 其他条件的配置

  //		var records = viewModel.getDataModule().getAllRecordsByDS(dsName);
  let datasource = DatasourceManager.lookup({ datasourceName: dsName })
  let records = datasource.getAllRecords().toArray()

  if (undefined != records && null != records && records.length > 0) {
    let updateRecords = []

    if (
      undefined != queryConds &&
      null != queryConds &&
      queryConds.length > 0
    ) {
      for (let index = 0; index < records.length; index++) {
        let record = records[index]
        let context = new ExpressionContext()
        context.setRouteContext(ruleContext.getRouteContext())
        context.setRecords([record])

        let isEditRecord = false
        for (let i = 0; i < queryConds.length; i++) {
          let exp = queryConds[i]['Condition'] // 条件
          let mappingItems = queryConds[i]['Fields'] // 源表中的字段与目标表中的字段的映射关系
          let ret = Engine.execute({ expression: exp, context: context })
          //						var ret = formulaUtil.evalExpressionByRecords(exp, record);
          if (typeof ret != 'boolean' && ret) {
            throw new Error('条件必须返回布尔类型，请检查')
          } else if (ret == null) {
            ret = false
          }

          if (ret == true) {
            for (
              let mappIndex = 0;
              mappIndex < mappingItems.length;
              mappIndex++
            ) {
              let mappingItem = mappingItems[mappIndex]
              let type = mappingItem[TYPENAME]
              let formula = mappingItem[FORMULANAME]
              let destField = mappingItem[DESTFIELD]
              destField = destField.substring(destField.indexOf('.') + 1)
              try {
                let testVal = calculateValue(
                  type,
                  formula,
                  dsName,
                  record,
                  ruleContext
                )
                record.set(destField, testVal)
              } catch (e) {
                let msg =
                  '执行计算表达式【' + formula + '】失败，原因' + e.message
                log.log(msg)
              }
            }
            isEditRecord = true
          }
        }
        if (isEditRecord) {
          updateRecords.push(record)
        }
      }
    }
    if (
      undefined != updateRecords &&
      null != updateRecords &&
      updateRecords.length > 0
    ) {
      DatasourceUtil.setBaseValue(dsName, updateRecords)
      //				viewModel.getDataModule().setBaseValueByDS(dsName, updateRecords);
    }
  }
}

/**
 *	根据配置信息获取值
 *
 *  @param  type	    	源字段类型
 *  @param	formula		  	源字段内容
 *  @param  obj             目标实体当前行（用于表达式计算）
 */
let calculateValue = function (type, formula, dsName, record, ruleContext) {
  let retValue
  let datasource = DatasourceManager.lookup({ datasourceName: dsName })

  switch (type) {
    case TYPE_DATASET:
    case TYPE_FIELD:
      var formulaDS = formula.substring(0, formula.indexOf('.'))
      formula = formula.substring(formula.indexOf('.') + 1)
      if (dsName == formulaDS) {
        retValue = record.get(formula)
      } else {
        var currRecord = datasource.getCurrentRecord()
        retValue = currRecord.get(formula)
        //				retValue = viewModel.getDataModule().getSingleValueByDS(formulaDS, formula);
      }
      break

    case TYPE_SYSVAR:
      retValue = ComponentParam.getVariant({ code: formula })
      //			retValue = viewContext.getSystemVariableValue(formula);
      break

    case TYPE_COMPONENTVAR:
      retValue = WindowParam.getInput({ code: formula })
      //			retValue = viewContext.getVariableValue(formula);
      break
    case TYPE_EXPRESSION:
    case TYPE_EXPRESSIONS:
      var context = new ExpressionContext()
      context.setRouteContext(ruleContext.getRouteContext())
      context.setRecords([record])
      retValue = Engine.execute({ expression: formula, context: context })
      //			retValue = formulaUtil.evalExpressionByRecords(formula, record);
      break
    default:
      retValue = ''
      break
  }
  return retValue
}
export { main }
