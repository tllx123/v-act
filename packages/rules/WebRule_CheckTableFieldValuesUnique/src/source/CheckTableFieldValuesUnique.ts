import {
  ExpressionContext,
  ExpressionEngine as Engine
} from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { DatasourceManager as dbManager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { DialogUtil as dialogUtil } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.dialog'
import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'
import { Log as log } from '@v-act/vjs.framework.extension.util.logutil'
import { StringUtil as stringUtil } from '@v-act/vjs.framework.extension.util.string'

export function initModule(sBox) {}

const main = function (ruleContext) {
  let ruleCfgValue = ruleContext.getRuleCfg()
  let inParams = ruleCfgValue['inParams']
  let inParamsObj = jsonUtil.json2obj(inParams)
  let returnValue = true //处理此规则时，记录是否中断业务规则不再往下执行，返回true:不中断，false:中断
  let userConfirm = true
  let dsName = inParamsObj['tableName']
  let message = inParamsObj['msg'] //提示信息
  let type = inParamsObj['type'] //信息类型:1.表达式、0.提示字符串
  let messageType = inParamsObj['messageType'] //0返回结果，1提示，继续执行 2警告，继续执行 3错误，不能继续 4询问（确定/取消），根据用户选择继续或终止
  let fields = inParamsObj['field']
  let fieldsNameMap = parseFieldsMessage(dsName)
  let isExist = false // 是否存在相同数据标识
  let checkResult = []
  checkResult = checkSetRecordData(dsName, fields, fieldsNameMap)

  //如果数据已经存在，先提示信息，再按照要求的中断类型，是否继续判断或者中断操作
  if (checkResult && checkResult.length > 0) {
    isExist = checkResult[0]
    let checkResultObj = checkResult[1]
    let hasTheSameValueInDB = checkResult[2]
    if (isExist) {
      let checkMsgs = ''
      if (hasTheSameValueInDB) {
        checkMsgs = '界面记录重复:\n'
        for (let key in checkResultObj) {
          let count = checkResultObj[key].length
          if (count > 1) {
            checkMsgs = checkMsgs + '重复值:' + key + ' 记录数:' + count + '\n'
          }
        }
      } else {
        checkMsgs = '界面上有1条记录和后台表重复:\n'
        for (let key in checkResultObj) {
          let count = checkResultObj[key].length
          if (count > 1) {
            checkMsgs =
              checkMsgs + '重复值:' + key + ' 记录数:' + (count - 1) + '\n'
          }
        }
      }
      let retMsg = ''
      let logMsg = ''
      if (stringUtil.isEmpty(message)) {
        retMsg = '无配置提示信息'
        logMsg = '无配置提示信息'
      } else {
        if (type == '1') {
          let count = 1 // 大于10行用省略号
          for (let key in checkResultObj) {
            let arr = checkResultObj[key]
            if (arr.length > 1) {
              for (let i = 0; i < arr.length; i++) {
                if (arr[i] == 'backRecord') {
                  //后台有重复记录，只提示前台记录
                  break
                }
                let record = arr[i]
                let context = new ExpressionContext()
                context.setRouteContext(ruleContext.getRouteContext())
                context.setRecords([record])
                let tmpStr = Engine.execute({
                  expression: message,
                  context: context
                })
                if (
                  tmpStr == null ||
                  tmpStr == '' ||
                  logMsg.indexOf(tmpStr) >= 0
                )
                  continue
                if (logMsg != '' && logMsg.length() > 0) logMsg += '\n'
                logMsg += tmpStr

                count++
                if (count == 10) {
                  retMsg = logMsg + '\n ..................'
                }
              }
            }
          }
          if (count < 10) {
            retMsg = logMsg
          }
        } else {
          retMsg = message
          logMsg = message
        }
      }
      //以log形式提示比较细则信息
      log.log(checkMsgs + logMsg)
      let callback = function (val) {
        userConfirm = typeof val == 'boolean' ? val : userConfirm
        setBusinessRuleResult(ruleContext, !isExist, userConfirm)
        ruleContext.setRuleStatus(true)
        ruleContext.fireRuleCallback()
      }
      if (messageType == 0) {
        //不提示，直接返回验证结果
        setBusinessRuleResult(ruleContext, !isExist, userConfirm)
      } else {
        if (messageType == 1) {
          //提示，继续执行
          dialogUtil.propmtDialog(retMsg, callback, false)
        } else if (messageType == 2) {
          //警告，继续执行
          dialogUtil.warnDialog(retMsg, callback, false)
        } else if (messageType == 3) {
          //错误，不能继续
          dialogUtil.errorDialog(retMsg, callback, false)
          returnValue = true //不中断执行，验证结果由业务返回值返回
        } else if (messageType == 4) {
          //询问（确定/取消），根据用户选择继续或终止
          dialogUtil.confirmDialog(retMsg, callback, false)
        } else {
          alert('--------------------')
        }
        ruleContext.markRouteExecuteUnAuto()
      }
    } else {
      setBusinessRuleResult(ruleContext, !isExist, userConfirm)
    }
  }
  return true //不中断执行，规则总是返回true
}

/**
 * 设置业务返回结果
 */
function setBusinessRuleResult(ruleContext, result, userConfirm) {
  if (ruleContext.setBusinessRuleResult) {
    ruleContext.setBusinessRuleResult({
      isUnique: result, //业务返回结果：表中字段数值是否满足唯一性约束
      confirm: userConfirm //业务返回结果：用户选择继续还是终止
    })
  }
}

/**
 * 集合型的控件,对发生改变的记录进行判断
 * 1、发生改变的记录与当前组件的所有页面DB中记录进行对比，如果出现重复的字段，则进行提示
 * 2、若页面DB中记录没有重复的，然后再去在后台进行查找看有没有重复的
 */
let checkSetRecordData = function (dsName, judgeField, fieldsNameMap) {
  let checkResult = []
  let isExist = false
  let checkResultObj = {}
  //发生改变的记录集
  let changeRecords = []
  let changeRecordDeletes = [] //记录已删除的，第二步检查时不用再检查已删除的记录
  let datasource = dbManager.lookup({
    datasourceName: dsName
  })
  //删除记录
  let deleteRecords = datasource.getDeletedRecords()
  deleteRecords.iterate(function (record, num) {
    changeRecordDeletes.push(record)
  })
  //新增记录
  let insertRecords = datasource.getInsertedRecords()
  insertRecords.iterate(function (record, num) {
    changeRecords.push(record)
  })
  //更新的记录
  let updateRecords = datasource.getUpdatedRecords()
  updateRecords.iterate(function (record, num) {
    changeRecords.push(record)
  })

  //页面DB中的记录集
  let records = datasource.getAllRecords().toArray()
  //对发生改变的记录进行判断
  //判断过程:有1、2
  //1、发生改变的记录与当前组件的所有页面DB中记录进行对比，如果出现重复的字段，则进行提示
  let hasTheSameValueInDB = false //在所有页面DB中记录是否已存在重复
  if (null != records && records.length > 0) {
    for (let i = 0; i < records.length; i++) {
      let record = records[i]
      let value = ''
      for (let t = 0; t < judgeField.length; t++) {
        let field = judgeField[t]
        let valTemp = record.get(field)
        if ('null' == valTemp) {
          valTemp = '"null"'
        }
        if (valTemp == null || valTemp == '') {
          valTemp = ''
        }
        if (
          valTemp != null &&
          stringUtil.trim(valTemp + '') == '' &&
          (valTemp + '').length > 0
        ) {
          valTemp = '"' + valTemp + '"'
        }
        let valueTemp = '' + valTemp

        if (value == '') {
          if (valueTemp == '') {
            value = field + '为空'
          } else {
            value = field + '=' + valueTemp
          }
        } else {
          if (valueTemp == '') {
            value = value + ',' + field + '为空'
          } else {
            value = value + ',' + field + '=' + valueTemp
          }
        }
      }
      if (undefined != checkResultObj[value] || null != checkResultObj[value]) {
        // 如果在_array中已经存在，表示该列表中该字段已经有相同的值了
        hasTheSameValueInDB = true
        checkResultObj[value].push(record)
      } else {
        // 直接使用字段值作为key，如果下次有相同的值，表示重复
        checkResultObj[value] = [record]
      }
    }
  }
  //2、若页面DB中记录没有重复的，然后再去在后台进行查找看有没有重复的--------------废除检查后台唯一性逻辑
  //		var hasTheSameValueInAllData = false; //在后台中是否存在重复
  //		var repeatRecObj = {};
  //		var isCustomSqlDataSource = WindowVMMappingManager.isCustomSqlDataSource({"datasourceName":dsName}) ? true : false;
  ////TODO  var isCustomSqlDataSource = viewModel.getMetaModule().isCustomSqlDataSource(dsName) ? true : false;
  //		if (!hasTheSameValueInDB && !isCustomSqlDataSource) {
  //			if (null != records && records.length > 0) {
  //				var theSameRecords = [];
  //				// 构建查询条件
  //				var w = WhereRestrict.init();
  //				for (var i = 0; i < records.length; i++) {
  //					var record = records[i];
  //					var andEqConds = [];
  //					for (var t = 0; t < judgeField.length; t++) {
  //						var judgeValue = record.get(judgeField[t]);
  //
  //						// 当前表单中，需要进行判定字段的值
  //						//2、若页面DB中记录没有重复的，然后再去在后台进行查找看有没有重复的
  //						// 2012-12-03 RTX沟通结果（tugx，huangjr） 唯一性检查规则中对于null值和0长度字符串看作是等同的
  //						if (judgeValue == null || judgeValue == "") {
  //							andEqConds.push(w.isNull(judgeField[t]));
  //						} else {
  //							andEqConds.push(w.eq(judgeField[t], judgeValue));
  //						}
  //					}
  //					w.link(andEqConds, w.LOGIC_OR, w.LOGIC_AND);
  //				}
  //
  //				var andWhereCons = [];
  //				for (var i = 0; i < changeRecordDeletes.length; i++) {
  //					var changeRecordDelete = changeRecordDeletes[i];
  //					var judgeIdValue = changeRecordDelete["id"];
  //					andWhereCons.push(w.ne("id", judgeIdValue));
  //				}
  //				for (var i = 0; i < records.length; i++) {
  //					var record = records[i];
  //					var judgeIdValue = record.getSysId();
  //					andWhereCons.push(w.ne("id", judgeIdValue));
  //				}
  //				w.and(andWhereCons);

  //明细中各记录的外键值是一样的
  // TODO:取得db库中的关联关系，如果存在，则需要补充实体关联的条件

  //改造后此逻辑废除  wangyue  2015-08-24
  //				var refs = viewModel.getMetaModule().getRelationsByRef(dsName);
  //				if (refs.length > 0) {
  //					var andConds = [];
  //					for (var refIndex = 0; refIndex < refs.length; refIndex++) {
  //						var relation = refs[refIndex];
  //						var refFieldName = relation["refFieldName"]; // 从表关联字段
  //						var refTableName = relation["refTableName"]; // 从表数据源名称
  //						var srcFieldName = relation["srcFieldName"]; // 主表的主键
  //						var srcTableName = relation["srcTableName"]; // 主表数据源名称
  //						var srcFieldValue = viewModel.getDataModule().getSingleValueByDS(srcTableName, srcFieldName);
  //						// 进行查询条件补充
  //						andConds.push(w.eq(refFieldName, srcFieldValue));
  //					}
  //					w.and(andConds);
  //				}

  //				var dbObj = dbManager.lookup({"datasourceName":dsName});
  //				var dbObj = dbManager.getDB(dsName);

  //如果是内存表不要再到后台查了
  //				if(dbObj.isVirtual()==false){
  //					//TODO
  //					var findRecords = viewModel.getDataModule().findByDS(dsName, w, -1, -1, false, false);
  //					if (undefined != findRecords && null != findRecords && findRecords.length > 0) {
  //						hasTheSameValueInAllData = true;
  //						for (var i = 0; i < findRecords.length; i++) {
  //							var dataRecord = findRecords[i];
  //							var theSameValue = "";
  //							for (var t = 0; t < judgeField.length; t++) {
  //								var field = judgeField[t];
  //								var valueTemp = dataRecord.get(field);
  //								if (theSameValue == "") {
  //									if (valueTemp == null || valueTemp == "") {
  //										theSameValue = field + "为空";
  //									} else {
  //										theSameValue = field + "=" + valueTemp;
  //									}
  //								} else {
  //									if (valueTemp == null || valueTemp == "") {
  //										theSameValue = theSameValue + "," + field + "为空";
  //									} else {
  //										theSameValue = theSameValue + "," + field + "=" + valueTemp;
  //									}
  //								}
  //							}
  //							checkResultObj[theSameValue].push("backRecord");
  //						}
  //					}
  //				}
  //			}
  //		}
  if (hasTheSameValueInDB) {
    isExist = true
  }
  checkResult[0] = isExist
  checkResult[1] = checkResultObj
  checkResult[2] = hasTheSameValueInDB
  return checkResult
}

/**
 * 处理字段信息，如果配置了字段中文名称显示中文名称，没有配置中文名称显示英文名称
 */
let parseFieldsMessage = function (dsName) {
  let datasource = dbManager.lookup({
    datasourceName: dsName
  })
  let metadata = datasource.getMetadata()
  let metadataFields = metadata.getFields()
  let fieldsNameMap = {}
  for (let i = 0; i < metadataFields.length; i++) {
    let fieldObj = metadataFields[i]
    let value = ''
    if (stringUtil.isEmpty(fieldObj.getName())) {
      value = dsName + '.' + fieldObj.getCode()
    } else {
      value = fieldObj.getName()
    }
    fieldsNameMap[dsName + '.' + fieldObj.getCode()] = value
  }
  return fieldsNameMap
}

export { main }
