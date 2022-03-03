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
    dsName = argsLen >= 1 ? args[0] : null
  let routeContext = param.getRouteContext()
  if (dsName == null) throw new Error('实体名称不允许为空，请检查')
  let datasource = null
  datasource = manager.lookup({
    datasourceName: dsName
  })

  if (!datasource) throw new Error('实体变量无法识别！')
  let selectedRecords = datasource.getSelectedRecords().toArray()
  return selectedRecords.length
}

export { main }
