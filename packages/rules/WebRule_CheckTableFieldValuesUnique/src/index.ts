﻿/**
 * 检查表中字段数值的唯一性
 */

import * as ds from '@v-act/vjs.framework.extension.platform.services.integration.vds.ds'
import * as expression from '@v-act/vjs.framework.extension.platform.services.integration.vds.expression'
import * as log from '@v-act/vjs.framework.extension.platform.services.integration.vds.log'
import * as message from '@v-act/vjs.framework.extension.platform.services.integration.vds.message'
import { RuleContext } from '@v-act/vjs.framework.extension.platform.services.integration.vds.rule'
import * as string from '@v-act/vjs.framework.extension.platform.services.integration.vds.string'

const vds = { ds, expression, log, message, string }

const main = function (ruleContext: RuleContext) {
  return new Promise<void>(function (resolve, reject) {
    try {
      let inParamsObj = ruleContext.getVplatformInput()
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
        isExist = checkResult[0] as boolean
        let checkResultObj = checkResult[1] as Record<string, any>
        let hasTheSameValueInDB = checkResult[2]
        if (isExist) {
          let checkMsgs = ''
          if (hasTheSameValueInDB) {
            checkMsgs = '界面记录重复:\n'
            for (let key in checkResultObj) {
              let count = checkResultObj[key].length
              if (count > 1) {
                checkMsgs =
                  checkMsgs + '重复值:' + key + ' 记录数:' + count + '\n'
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
          if (vds.string.isEmpty(message)) {
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
                    let tmpStr = vds.expression.execute(message, {
                      ruleContext: ruleContext,
                      records: [record]
                    })
                    if (
                      tmpStr == null ||
                      tmpStr == '' ||
                      logMsg.indexOf(tmpStr) >= 0
                    )
                      continue
                    //@ts-ignore
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
          vds.log.log(checkMsgs + logMsg)

          let callback = function (val: any) {
            userConfirm = typeof val == 'boolean' ? val : userConfirm
            setBusinessRuleResult(ruleContext, !isExist, userConfirm)
            resolve()
          }
          if (messageType == 0) {
            //不提示，直接返回验证结果
            setBusinessRuleResult(ruleContext, !isExist, userConfirm)
            resolve()
          } else {
            if (messageType == 1) {
              //提示，继续执行
              let promise = vds.message.info(retMsg, { time: 0 })
              promise.then(callback)
            } else if (messageType == 2) {
              //警告，继续执行
              let promise = vds.message.warn(retMsg)
              promise.then(callback)
            } else if (messageType == 3) {
              //错误，不能继续
              let promise = vds.message.error(retMsg)
              promise.then(callback)
              returnValue = true //不中断执行，验证结果由业务返回值返回
            } else if (messageType == 4) {
              //询问（确定/取消），根据用户选择继续或终止
              let promise = vds.message.confirm(retMsg)
              promise.then(callback)
            } else {
              alert('--------------------')
            }
          }
        } else {
          setBusinessRuleResult(ruleContext, !isExist, userConfirm)
          resolve()
        }
      } else {
        resolve()
      }
      return true //不中断执行，规则总是返回true
    } catch (ex) {
      reject(ex)
    }
  })
}

/**
 * 设置业务返回结果
 */
function setBusinessRuleResult(
  ruleContext: RuleContext,
  result: any,
  userConfirm: any
) {
  if (ruleContext.setResult) {
    ruleContext.setResult('isUnique', result) //业务返回结果：表中字段数值是否满足唯一性约束
    ruleContext.setResult('confirm', userConfirm) //业务返回结果：用户选择继续还是终止
  }
}

/**
 * 集合型的控件,对发生改变的记录进行判断
 * 1、发生改变的记录与当前组件的所有页面DB中记录进行对比，如果出现重复的字段，则进行提示
 * 2、若页面DB中记录没有重复的，然后再去在后台进行查找看有没有重复的
 */
let checkSetRecordData = function (
  dsName: string,
  judgeField: Array<any>,
  fieldsNameMap: any
) {
  let checkResult = []
  let isExist = false
  let checkResultObj: Record<string, any> = {}
  //发生改变的记录集
  let changeRecords = []
  let changeRecordDeletes = [] //记录已删除的，第二步检查时不用再检查已删除的记录
  let datasource = vds.ds.lookup(dsName)
  //删除记录
  let deleteRecords = datasource.getDeletedRecords()
  deleteRecords.iterate(function (record: Record<string, any>, num: number) {
    changeRecordDeletes.push(record)
  })
  //新增记录
  let insertRecords = datasource.getInsertedRecords()
  insertRecords.iterate(function (record: Record<string, any>, num: number) {
    changeRecords.push(record)
  })
  //更新的记录
  let updateRecords = datasource.getUpdatedRecords()
  updateRecords.iterate(function (record: Record<string, any>, num: number) {
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
          vds.string.trim(valTemp + '') == '' &&
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
let parseFieldsMessage = function (dsName: string) {
  let datasource = vds.ds.lookup(dsName)
  let metadata = datasource.getMetadata()
  let metadataFields = metadata.getFields()
  let fieldsNameMap: Record<string, any> = {}
  for (let i = 0; i < metadataFields.length; i++) {
    let fieldObj = metadataFields[i]
    let value = ''
    if (vds.string.isEmpty(fieldObj.getName())) {
      value = dsName + '.' + fieldObj.getCode()
    } else {
      value = fieldObj.getName()
    }
    fieldsNameMap[dsName + '.' + fieldObj.getCode()] = value
  }
  return fieldsNameMap
}

export { main }
