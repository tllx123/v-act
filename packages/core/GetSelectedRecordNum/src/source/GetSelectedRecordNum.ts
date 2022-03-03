import { DatasourceManager as manager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { Math as mathUtil } from '@v-act/vjs.framework.extension.util'
let undefined

exports.initModule = function (sb) {}

let main = function (param) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0,
    dsName = argsLen >= 1 ? args[0] : null

  if (mathUtil.isEmpty(dsName)) throw new Error('界面实体名称不能为空，请检查')

  let datasource = manager.lookup({
    datasourceName: dsName
  })
  let rs = datasource.getSelectedRecords().toArray() // 注意返回值对象有改变
  return rs.length
}

export { main }
