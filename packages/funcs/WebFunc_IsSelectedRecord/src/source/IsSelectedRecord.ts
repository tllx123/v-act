import { ExceptionFactory as factory } from '@v-act/vjs.framework.extension.platform.interface.exception'
import { Criteria as criteCondition } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'
import { DatasourceManager as datasourceManager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'

//初始化vjs模块，如果函数逻辑需要引用相关vjs服务，则初始化相关vjs模块；如果不需要初始化逻辑可以为空
let sandbox

export function initModule(sb) {
  //sb：前台vjs的沙箱（容器/上下文），可以用它根据vjs名称，获取到相应vjs服务
  sandbox = sb
}

//主入口(必须有)
const main = function (param) {
  //获取函数传入的参数
  let args = param.getArgs()
  if (args.length != 3) {
    let exception = factory.create({
      type: factory.TYPES.Dialog,
      message: '函数参数个数必须为3个!'
    })
    throw exception
  }
  let entityCode = args[0]
  let fieldCode = args[1]
  let fieldValue = args[2]
  if (!entityCode || '' == entityCode) {
    let exception = factory.create({
      type: factory.TYPES.Dialog,
      message: '函数第一个参数,实体编码不能为空!'
    })
    throw exception
  }
  if (!fieldCode || '' == fieldCode) {
    let exception = factory.create({
      type: factory.TYPES.Dialog,
      message: '函数第二个参数,字段编码不能为空!'
    })
    throw exception
  }
  if (!fieldValue || '' == fieldValue) {
    let exception = factory.create({
      type: factory.TYPES.Dialog,
      message: '函数第三个参数,字段值不能为空!'
    })
    throw exception
  }
  let datasource = datasourceManager.lookup({ datasourceName: entityCode })
  if (!datasource) {
    let exception = factory.create({
      type: factory.TYPES.Dialog,
      message: '实体不存在，请重新配置!'
    })
    throw exception
  }
  //判断字段是否存在
  let fields = datasource.getMetadata().fields
  let isField = false
  for (let i = 0; i < fields.length; i++) {
    let entityField = fields[i].code
    if (entityField == fieldCode) {
      isField = true
      break
    }
  }
  if (!isField) {
    let exception = factory.create({
      type: factory.TYPES.Dialog,
      message: '实体字段不存在，请重新配置!'
    })
    throw exception
  }
  //根据条件获取记录数
  let querycondition = new criteCondition()
  let criteriaS = querycondition.sw(fieldCode, fieldValue)
  let returnvalue = false
  let records = datasource.queryRecord({ criteria: criteriaS })
  records = records.toArray()
  for (let rIndex = 0; rIndex < records.length; rIndex++) {
    let selRecord = records[rIndex]
    let isSelected = datasource.isSelectedRecord({ record: selRecord })
    if (isSelected) {
      returnvalue = true
      break
    }
  }
  return returnvalue
}

export { main }
