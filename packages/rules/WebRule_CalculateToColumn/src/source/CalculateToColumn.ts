import {
  ExpressionContext,
  ExpressionEngine as formulaUtil
} from '@v-act/vjs.framework.extension.platform.engine.expression'
import { StoreTypes as storeTypes } from '@v-act/vjs.framework.extension.platform.interface.enum'
import { DatasourcePusher as pusher } from '@v-act/vjs.framework.extension.platform.services.domain.datasource'
import { DatasourceManager as manager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { WidgetContext as widgetContext } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'
import { WindowVMMappingManager as windowVmManager } from '@v-act/vjs.framework.extension.platform.services.vmmapping.manager'
import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'
import { Log as log } from '@v-act/vjs.framework.extension.util.logutil'

let sandbox

export function initModule(sBox) {
  sandbox = sBox
}

const main = function (ruleContext) {
  let ruleCfgValue = ruleContext.getRuleCfg()
  let inParams = ruleCfgValue['inParams']
  let inParamsObj = jsonUtil.json2obj(inParams)

  // 根据key获取规则配置参数值
  let destFieldName = inParamsObj['destFieldName'] // 赋值字段的fieldName
  let dest = destFieldName.split('.')
  let calFormula = inParamsObj['formula'] // 计算公式
  let dsName = dest[0]
  destFieldName = dest[1]
  let refWidgetIds = windowVmManager.getWidgetCodesByDatasourceName({
    datasourceName: dsName
  })
  let flag = true
  for (let index = 0; index < refWidgetIds.length; index++) {
    let retWidgetId = refWidgetIds[index]
    let widgetType = widgetContext.get(retWidgetId, 'widgetType')
    let storeType = widgetContext.getStoreType(retWidgetId)
    if (storeType == storeTypes.SET) {
      let dsNames = windowVmManager.getDatasourceNamesByWidgetCode({
        widgetCode: retWidgetId
      })
      let datasource = manager.lookup({
        datasourceName: dsNames[0]
      })
      let record = datasource.getCurrentRecord()
      if (!record) {
        return
      }
      flag = false
      calculateValueForSet(
        calFormula,
        dsName,
        destFieldName,
        record,
        ruleContext
      )
      break
    } else if (storeType == storeTypes.SINGLE_RECORD) {
      let fields = windowVmManager.getFieldCodesByWidgetCode({
        widgetCode: retWidgetId
      })
      if (fields && fields.length > 0) {
        for (let i = 0; i < fields.length; i++) {
          let field = fields[i]
          if (field['refField'] == destFieldName) {
            flag = false
            calculateValueForSingleValue(
              calFormula,
              dsName,
              destFieldName,
              ruleContext
            )
            break
          }
        }
      }
    } else if (storeType == storeTypes.SINGLE_RECORD_MULTI_VALUE) {
      let fields = windowVmManager.getFieldCodesByWidgetCode({
        widgetCode: retWidgetId
      })
      if (fields && fields.length > 0) {
        for (let i = 0; i < fields.length; i++) {
          let field = fields[i]
          if (field['refField'] == destFieldName) {
            flag = false
            calculateValueForSingleMultiValue(
              calFormula,
              dsName,
              destFieldName,
              ruleContext
            )
            break
          }
        }
      }
    }
  }
  if (flag == true) {
    calculateValueForSingleValue(calFormula, dsName, destFieldName, ruleContext)
  }
}

/**
 * 根据公式串与公式中的字段的fieldName计算公式值赋值给单行多值控件的fieldname。
 *
 * @param calFormula
 *            公式串 如：(HT_FKJH.JHBH+2)*HT_FKJH.BZ
 * @param dsName
 *            赋值字段的dsName
 * @param destFieldName
 *            赋值字段的fieldname
 */
let calculateValueForSingleMultiValue = function (
  calFormula,
  dsName,
  destFieldName,
  ruleContext
) {
  // 对公式进行计算
  let context = new ExpressionContext()
  context.setRouteContext(ruleContext.getRouteContext())
  try {
    let value = formulaUtil.execute({
      expression: calFormula,
      context: context
    })
    let obj = {}
    obj[destFieldName] = value
    let pusher = sandbox.getService(
      'vjs.framework.extension.platform.services.domain.datasource.DatasourcePusher'
    )
    pusher.setValues({
      datasourceName: dsName,
      values: obj
    })
  } catch (e) {
    let msg = '执行字段计算表达式【' + calFormula + '】失败，原因' + e.message
    log.log(msg)
  }
}

/**
 * 根据公式串与公式中的字段的fieldName计算公式值赋值给单值控件的fieldname。
 *
 * @param calFormula
 *            公式串 如：(HT_FKJH.JHBH+2)*HT_FKJH.BZ
 * @param dsName
 *            赋值字段的dsName
 * @param destFieldName
 *            赋值字段的fieldname
 */
let calculateValueForSingleValue = function (
  calFormula,
  dsName,
  destFieldName,
  ruleContext
) {
  // 对公式进行计算
  // TODO:直接进行赋值 value = new Number(value).toFixed(4);
  // 对应字段赋值
  let context = new ExpressionContext()
  context.setRouteContext(ruleContext.getRouteContext())
  try {
    let value = formulaUtil.execute({
      expression: calFormula,
      context: context
    })
    pusher.setFieldValue({
      datasourceName: dsName,
      fieldCode: destFieldName,
      value: value
    })
  } catch (e) {
    let msg = '执行字段计算表达式【' + calFormula + '】失败，原因' + e.message
    log.log(msg)
  }
}

/**
 * 根据公式串与公式中的字段的fieldName计算公式值赋值集合控件的对应行的某一列。
 *
 * @param calFormula
 *            公式串 如：(HT_FKJH.JHBH+2)*HT_FKJH.BZ
 * @param dsName
 *            赋值字段的dsName
 * @param destFieldName
 *            赋值字段的fieldname
 * @param record
 *            集合控件操作行的数据
 */
let calculateValueForSet = function (
  calFormula,
  dsName,
  destFieldName,
  record,
  ruleContext
) {
  let context = new ExpressionContext()
  context.setRouteContext(ruleContext.getRouteContext())
  try {
    let value = formulaUtil.execute({
      expression: calFormula,
      context: context
    })
    record.set(destFieldName, value) //TODO:直接进行赋值，
    // 对应字段赋值
    let datasource = manager.lookup({
      datasourceName: dsName
    })
    datasource.updateRecords({
      records: [record]
    })
  } catch (e) {
    let msg = '执行字段计算表达式【' + calFormula + '】失败，原因' + e.message
    log.log(msg)
  }
}
export { main }
