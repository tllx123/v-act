import {
  ExpressionContext,
  ExpressionEngine as engine
} from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { DatasourceManager as manager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { ArrayUtil as util } from '@v-act/vjs.framework.extension.util.array'
import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'
import { uuid } from '@v-act/vjs.framework.extension.util.uuid'

export function initModule(sBox) {
  sandbox = sBox
}

//规则主入口(必须有)
const main = function (ruleContext) {
  let inParams = jsonUtil.json2obj(ruleContext.getRuleCfg()['inParams'])
  let masterConfig = inParams.masterConfig.datas.values
  //获取传入的参数
  let printerServiceHost = masterConfig[0]['serviceHost']
  //获取目标实体
  let tableName = masterConfig[0]['entityCode']
  let printDetail = inParams.mappings.datas.values
  if (typeof printerServiceHost != 'string' || printerServiceHost == '') {
    throw new Error(
      '[GetPrinterListToEntity.main]规则json配置有误,打印服务器不能为空'
    )
  }
  if (typeof tableName != 'string' || tableName == '') {
    throw new Error(
      '[GetPrinterListToEntity.main]规则json配置有误,目标实体不能为空'
    )
  }
  if (!util.isArray(printDetail) || printDetail.length <= 0) {
    throw new Error(
      '[GetPrinterListToEntity.main]规则json配置有误,字段映射关系不能为空'
    )
  }
  //解析服务器名称
  let context = new ExpressionContext()
  context.setRouteContext(ruleContext.getRouteContext())
  let serviceDataValue = engine.execute({
    expression: printerServiceHost,
    context: context
  })
  if (serviceDataValue == null || serviceDataValue == '') {
    throw new Error(
      '[GetPrinterListToEntity.main]规则json配置有误,打印服务器不能为空'
    )
  } else {
    if (CheckUrl(serviceDataValue)) {
      //解析对应的关系
      let fieldObjArr = []
      for (let index = 0; index < printDetail.length; index++) {
        let printDetailElement = printDetail[index]
        let targetFiled = printDetailElement['targetField']
        let sourceType = printDetailElement['sourceType']
        let source = printDetailElement['source']
        if (sourceType == 'expression') {
          //如为表达式的值，则执行表达式的值
          let elementValue = engine.execute({
            expression: source,
            context: context
          })
          let field = targetFiled.substring(targetFiled.indexOf('.') + 1)
          let fieldObj = {}
          fieldObj.field = field
          fieldObj.element = elementValue
          fieldObjArr.push(fieldObj)
        } else {
          //如为服务端返回实体字段
          let fieldObj = {}
          let field = targetFiled.substring(targetFiled.indexOf('.') + 1)
          fieldObj.field = field
          fieldObj.element = source
          fieldObjArr.push(fieldObj)
        }
      }
      //var libs = ["http://10.1.30.129:8000/CLodopfuncs.js"];
      let libs = []
      serviceDataValue += '/CLodopfuncs.js'
      libs.push(serviceDataValue)
      let callback = ruleContext.genAsynCallback(function () {
        let iPrinterCount = LODOP.GET_PRINTER_COUNT()
        let list = []
        for (let i = 0; i < iPrinterCount; i++) {
          let printName = LODOP.GET_PRINTER_NAME(i)
          list.push(printName)
        }
        console.log(list)
        //赋值给界面实体(如何区分不同的实体类型并赋值？)
        let datasource = manager.lookup({ datasourceName: tableName })
        //先清空实体记录
        datasource.clear()
        let emptyRecord = datasource.createRecord()
        let emptyRecords = []
        for (let index = 0; index < list.length; index++) {
          let tempRecord = emptyRecord.clone()
          if (tempRecord.getMetadata().isContainField('id')) {
            tempRecord.set('id', uuid.generate())
          }
          let record = tempRecord
          //循环赋值
          for (let i = 0; i < fieldObjArr.length; i++) {
            let fieldObj = fieldObjArr[i]
            let field = fieldObj.field
            let element = fieldObj.element
            if (element == 'printerName') {
              element = list[index]
            }
            record.set(field, element)
          }
          emptyRecords.push(record)
        }
        //插入记录
        datasource.insertRecords({ records: emptyRecords })
        ruleContext.fireRuleCallback()
        ruleContext.fireRouteCallback()
      })
      libs.push(callback)
      head.js.apply(head, libs)
    } else {
      throw new Error(
        '[GetPrinterListToEntity.main]规则json配置有误,打印服务器地址必须为网址'
      )
    }
  }

  //终止规则链执行
  ruleContext.markRouteExecuteUnAuto()
}

function CheckUrl(str) {
  let RegUrl = new RegExp()
  RegUrl.compile('[a-zA-z]+://[^s]*')
  if (!RegUrl.test(str)) {
    return false
  }
  return true
}
export { main }
