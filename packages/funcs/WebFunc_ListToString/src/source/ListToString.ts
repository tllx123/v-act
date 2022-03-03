import { StringUtil as stringUtil } from '@v-act/vjs.framework.extension.util'
import { DatasourceFactory as DBFactory } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'
import { Math as mathUtil } from '@v-act/vjs.framework.extension.util'
import { DatasourceManager as manager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { ExpressionContext as ExpressionContext } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { ExpressionEngine as engine } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
let undefined
let undefined
let undefined

exports.initModule = function (sb) {}

let main = function (param) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0,
    dsName = argsLen >= 1 ? args[0] : null,
    columnName = argsLen >= 2 ? args[1] : null,
    separator = argsLen >= 3 ? args[2] : null,
    selectType = argsLen >= 4 ? args[3] : null,
    isNullFilter = argsLen >= 5 ? args[4] : null,
    isUnique = argsLen >= 6 ? args[5] : null

  if (stringUtil.isEmpty(dsName)) throw new Error('实体名称不允许为空，请检查')

  if (stringUtil.isEmpty(isNullFilter)) isNullFilter = false

  if (stringUtil.isEmpty(columnName)) return ''

  if (mathUtil.isEmpty(separator)) separator = ';' //为空默认取分号

  // 兼容原有函数
  if (null == selectType || undefined == selectType) selectType = 0 // 0：全部记录；1：选中记录；默认为0。原有为0。

  //从DB中取值
  let records
  let datasource = null
  //		if(DBFactory.isDatasource(tableName)){
  //			datasource = tableName;
  //		}else{
  //			datasource = manager.lookup({
  //				"datasourceName": tableName
  //			});
  //		}
  let routeContext = param.getRouteContext()
  if (DBFactory.isDatasource(dsName)) {
    datasource = dsName
  } else {
    let context = new ExpressionContext()
    context.setRouteContext(routeContext)
    if (dsName.indexOf('.') == -1 && dsName.indexOf('@') == -1) {
      datasource = manager.lookup({
        datasourceName: dsName
      })
    } else {
      datasource = engine.execute({
        expression: dsName,
        context: context
      })
    }
  }
  if (!datasource) throw new Error('实体变量无法识别！')
  if (selectType == 1) records = datasource.getSelectedRecords()
  else records = datasource.getAllRecords() // 默认0

  let retStr = ''
  if (null != records && records.toArray().length > 0) {
    records = records.toArray()
    let arr = new Array()
    for (let i = 0; i < records.length; i++) {
      let record = records[i]
      let temValue = record.get(columnName)
      if (isUnique) {
        if (!contains(arr, temValue)) {
          arr.push(temValue)
          if (isNullFilter) {
            if (!mathUtil.isEmpty(temValue)) {
              if (retStr == '') retStr = temValue
              else retStr = retStr + separator + temValue
            }
          } else {
            if (i == 0 && retStr == '') retStr = temValue
            else retStr = retStr + separator + temValue
          }
        }
      } else {
        if (isNullFilter) {
          if (!mathUtil.isEmpty(temValue)) {
            if (retStr == '') retStr = temValue
            else retStr = retStr + separator + temValue
          }
        } else {
          if (i == 0 && retStr == '') retStr = temValue
          else retStr = retStr + separator + temValue
        }
      }
    }
  } else return null

  return retStr
}

function contains(arr, obj) {
  let i = arr.length
  if (i > 0) {
    while (i--) {
      if (arr[i] === obj) {
        return true
      }
    }
  }
  return false
}

export { main }
