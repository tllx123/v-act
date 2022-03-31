import { DatasourceFactory as DBFactory } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'
import {
  RouteContext,
  RuleContext
} from '@v-act/vjs.framework.extension.platform.interface.route'
import {
  ExpressionContext,
  ExpressionEngine as engine
} from 'packages/core/WebFunc_WFFromActivityName/src/source/node_modules/packages/core/WebFunc_WFCurrentTaskOwnerName/src/source/node_modules/packages/core/WebFunc_WFCurrentTaskOwnerID/src/source/node_modules/packages/core/WebFunc_WFCurrentTaskCreateMod/src/source/node_modules/packages/core/WebFunc_WFCurrentActivityName/src/source/node_modules/@v-act/vjs.framework.extension.platform.services.engine.expression'
//规则主入口(必须有)
/* import {
  RuleContext
} from '@v-act/vjs.framework.extension.platform.services.integration.vds.rule' */
import { DatasourceManager as manager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import * as ContactsService from '@v-act/vjs.framework.extension.platform.services.native.mobile.Contacts'
import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'

const main = function (ruleContext: RuleContext) {
  // 获取规则链路由上下文,终止执行后续规则
  let routeContext = ruleContext.getRouteContext()
  // 获取规则链路由上下文的配置参数值
  let ruleCfgValue = ruleContext.getRuleCfg()
  // 获取开发系统配置的参数
  let inParams = ruleCfgValue['inParams']
  let inParamObj = jsonUtil.json2obj(inParams)
  getContactsInfo(inParamObj, routeContext, ruleContext)
}

/**
 * 获取通讯录的id，姓名，手机号码
 */
let getContactsInfo = function (
  inParamObj: Record<string, any>,
  routeContext: RouteContext,
  ruleContext: RuleContext
) {
  ruleContext.markRouteExecuteUnAuto()
  let successCB = function (contactsInfo: Array<Record<string, any>>) {
    let datas = []
    if (contactsInfo) {
      for (let i = 0; i < contactsInfo.length; i++) {
        let contact = contactsInfo[i]
        let formattedName = contact.name.formatted
        let id = contact.id
        let phoneNum = ''
        if (contact.phoneNumbers) {
          phoneNum = contact.phoneNumbers[0].value
        }
        let data = {
          id: id,
          phoneNum: phoneNum,
          name: formattedName
        }
        datas.push(data)
      }
    }
    setValue2Entity(datas, inParamObj, routeContext, ruleContext)
  }

  let errorCB = function (errorMsg: string) {
    alert(errorMsg)
  }
  ContactsService.getInfo(successCB, errorCB)
}

let setValue2Entity = function (
  datas: Array<Record<string, any>>,
  inParamObj: Record<string, any>,
  routeContext: RouteContext,
  ruleContext: RuleContext
) {
  let entityCode = inParamObj.entityCode //实体编码
  let fieldName = inParamObj.fieldName //字段编码(姓名)
  let fieldId = inParamObj.fieldId //字段编码（唯一标识）
  let fieldPhoneNum = inParamObj.fieldPhoneNum //字段编码（电话号码）
  let dataSource = getDataSource(entityCode, routeContext)
  let insertRecords = []
  for (let i = 0; i < datas.length; i++) {
    let data = datas[i]
    let emptyRecord = dataSource.createRecord()
    for (let key in data) {
      if ('id' == key) {
        emptyRecord.set(fieldId, data[key])
      } else if ('phoneNum' == key) {
        emptyRecord.set(fieldPhoneNum, data[key])
      } else if ('name' == key) {
        emptyRecord.set(fieldName, data[key])
      }
    }
    insertRecords.push(emptyRecord)
  }

  dataSource.insertRecords({
    records: insertRecords,
    position: 3
  })
  ruleContext.fireRouteCallback()
}

//获取实体对象
function getDataSource(entityCode: string, routeContext: RouteContext) {
  let dsName = entityCode
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
  }
  //			log.warn("目标实体没有数据，无法进行赋值");
  datasource.clear()
  return datasource
}

export { main }
