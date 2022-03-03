import { DatasourceManager as manager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { Math as mathUtil } from '@v-act/vjs.framework.extension.util'
import { log as log } from '@v-act/vjs.framework.extension.util'
import { DatasourceFactory as DBFactory } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'
import { ExpressionContext as ExpressionContext } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { ExpressionEngine as engine } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
let undefined
let undefined
let undefined
let undefined
let undefined
let undefined

exports.initModule = function (sb) {}

let main = function (param) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0,
    dsName = argsLen >= 1 ? args[0] : null,
    condition = argsLen >= 2 ? args[1] : null
  let routeContext = param.getRouteContext()
  if (dsName == null) throw new Error('实体名称不允许为空，请检查')
  let datasource = null
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
    //			datasource = manager.lookup({
    //				"datasourceName": dsName
    //			});
  }
  if (!datasource) throw new Error('实体变量无法识别！')
  let allRecords = datasource.getAllRecords().toArray()

  if (mathUtil.isEmpty(condition) || typeof condition == 'undefined') {
    return allRecords.length
  }
  let results = []
  for (let i = 0; i < allRecords.length; i++) {
    let record = allRecords[i]
    let context = new ExpressionContext()
    try {
      context.setRecords([record])
      context.setRouteContext(routeContext)
      let ret = engine.execute({
        expression: condition,
        context: context
      })

      if (typeof ret != 'boolean') throw new Error('条件必须返回布尔类型')

      // 条件满足
      if (ret == true) results.push(record)
    } catch (e) {
      let message =
        '表达式执行错误！condition=' + condition + '错误信息：' + e.message
      log.error(message)
      throw new Error('实体过滤条件不正确！' + message)
    }
  }
  return results.length
}

export { main }
