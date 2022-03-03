import { DatasourceManager as manager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { log as log } from '@v-act/vjs.framework.extension.util'
import { DatasourceFactory as DBFactory } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'
import { ExpressionContext as ExpressionContext } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { ExpressionEngine as engine } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
let undefined
let undefined
let undefined
let undefined

exports.initModule = function (sb) {}

let main = function (param) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0,
    dsName = argsLen >= 1 ? args[0] : null,
    fieldName = argsLen >= 1 ? args[1] : null
  let datasource = null
  if (dsName == null) throw new Error('实体名称不允许为空，请检查')
  if (fieldName == null) throw new Error('实体字段名称不允许为空，请检查')
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
  let record = datasource.getCurrentRecord()
  if (!record) return null

  let recValue = record.get(fieldName)
  if (undefined == recValue || recValue.length == 0) {
    log.log('获取当前记录的某字段值函数当前记录某字段的值为空，请检查')
    return null
  }

  return recValue
}

export { main }
