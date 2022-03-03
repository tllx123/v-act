import { ExceptionFactory as factory } from '@v-act/vjs.framework.extension.platform.interface.exception'
import { DatasourceManager as dbManager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'

let undefined
let undefined
let undefined
let undefined

//初始化vjs模块，如果函数逻辑需要引用相关vjs服务，则初始化相关vjs模块；如果不需要初始化逻辑可以为空
exports.initModule = function (sBox) {}

//主入口(必须有)
let main = function (param) {
  let args = param.getArgs()
  let sourceName = args[0]
  if (sourceName == undefined || sourceName == null || sourceName == '') {
    //throw new Error("参数错误！实体名称必填!");
    let exception = factory.create({
      type: factory.TYPES.Dialog,
      message: '参数错误！实体名称必填!'
    })
    throw exception
  }

  if (
    !dbManager.exists({
      datasourceName: sourceName
    })
  ) {
    //throw new Error("实体不存在！sourceName=" + sourceName);
    let exception = factory.create({
      type: factory.TYPES.Dialog,
      message: '实体不存在！'
    })
    throw exception
  }

  // 源记录集合
  let datasource = dbManager.lookup({
    datasourceName: sourceName
  })

  let records = datasource.getAllRecords()
  if (records) records = records.toArray()

  if (records == null || records.length == 0) {
    return false
  }

  let currRecord = datasource.getCurrentRecord()
  return currRecord.getSysId() === datasource.getAllRecords().first().getSysId()
}

export { main }
