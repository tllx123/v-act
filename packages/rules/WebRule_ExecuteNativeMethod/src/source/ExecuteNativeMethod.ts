import { Record } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'
import { DatasourceUtil as dbService } from '@v-act/vjs.framework.extension.platform.services.view.logic.datasource'
import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'

let sandBox
export function initModule(sBox) {
  sandBox = sBox
}
//规则主入口(必须有)
const main = function (ruleContext) {
  //处理规则的入参
  let ruleCfgValue = ruleContext.getRuleCfg()
  let inParams = ruleCfgValue['inParams']
  let inParamsObj = jsonUtil.json2obj(inParams)
  let invokeTarget = inParamsObj['invokeTarget']

  let invokeParams = inParamsObj['invokeParams']
  let returnMapping = inParamsObj['returnMapping']
  let filter = inParamsObj['filterCondition']
  let orderBy = inParamsObj['orderBy']
  //获取invokeTarget属性
  let methodName = invokeTarget['methodCode']
  //获取服务调用原生党法
  let nativeMethodAccessorService = sandBox.getService(
    'vjs.framework.extension.platform.services.operation.local.NativeMethodAccessor',
    { type: 'dotNet' }
  )
  let config = {}
  let routeContext = ruleContext.getRouteContext()
  let result = nativeMethodAccessorService.invoke(
    'invokeNativeMethod',
    methodName,
    invokeParams,
    config,
    routeContext
  )
  let resultFromExeRuleSet = jsonUtil.json2obj(result)
  if (returnMapping && returnMapping.length > 0) {
    for (let i = 0; i < returnMapping.length; i++) {
      let mapping = returnMapping[i]
      let dest = mapping['dest'] //目标名称
      if (!dest) {
        throw Error(
          '[ExecuteNativeMethod.main]执行原生方法调用规则出错：返回值设置目标不能为空！'
        )
      }
      let destType = mapping['destType'] //目标类型（entity：实体）
      //	var src = mapping["src"];        //来源(returnValu:返回值，expression:表达式)
      let srcType = mapping['srcType'] //来源(当目标类型是实体时，返回实体存在此处)
      let destFieldMapping = mapping['destFieldMapping']
      let updateDestEntityMethod = mapping['updateDestEntityMethod']
      let isCleanDestEntityData = mapping['isCleanDestEntityData']
      if (
        !destFieldMapping ||
        !(destFieldMapping instanceof Array) ||
        destFieldMapping.length <= 0
      ) {
        throw new Error('没有配置任何返回字段映射信息')
      }
      if (updateDestEntityMethod == null) {
        updateDestEntityMethod = 'insertOrUpdateBySameId'
      }
      let srcEntityName = 'srcDB' //源实体名称：活动集内的
      let destEntityName = dest //目标实体名称：窗体内的
      //用c#返回的json对象拼装源实体记录集合
      let srcRecords = []
      // var dataSource = datasourceManager.lookup({"datasourceName":srcEntityName});
      for (let i = 0; i < resultFromExeRuleSet.length; i++) {
        //srcRecords[i] = Record.create(srcEntityName,resultFromExeRuleSet[i],null);

        srcRecords[i] = new Record(null, resultFromExeRuleSet[i])
      }
      // 插入数据到界面实体
      // dbUtil.insertOrUpdateRecords2Entity(destEntityName,srcRecords,isCleanDestEntityData,destFieldMapping,updateDestEntityMethod);
      // 2015-05-08 liangchaohui：修改insertOrUpdateRecords2Entity，操作类型为更新时，如果目标实体没有匹配id的记录，则不做任何操作，原来没匹配id时会新增记录
      // 本规则只操作界面实体，所以第二个参数写死为entity
      dbService.insertOrUpdateRecords2Entity(
        destEntityName,
        'entity',
        srcRecords,
        destFieldMapping,
        updateDestEntityMethod,
        isCleanDestEntityData,
        ruleContext
      )
    }
  }
}

export { main }
