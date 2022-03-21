/**
 * 界面实体之间数据比较
 */

import * as ds from '@v-act/vjs.framework.extension.platform.services.integration.vds.ds'
import * as expression from '@v-act/vjs.framework.extension.platform.services.integration.vds.expression'
import * as log from '@v-act/vjs.framework.extension.platform.services.integration.vds.log'
import { RuleContext } from '@v-act/vjs.framework.extension.platform.services.integration.vds.rule'
import * as string from '@v-act/vjs.framework.extension.platform.services.integration.vds.string'

const vds = { ds, expression, log, string }

const main = function (ruleContext: RuleContext) {
  return new Promise<void>(function (resolve, reject) {
    try {
      //当任何一条匹配数据不满足比较条件时，返回false，否则返回true(包括两种情况：不存在匹配数据或所有匹配数据都满足比较条件)；
      let bussinessReturnValue = true
      let params = ruleContext.getVplatformInput()
      let srcDataSource = params['srcDataSource']
      let destDataSource = params['destDataSource']
      let srcFilterCondition = params['srcFilterCondition']
      let matchFields = params['matchFields']
      let compareCondition = params['compareCondition']

      if (compareCondition == null) {
        throw new Error('比较条件配置不能为空，请检查配置！')
      }

      let srcCompareField = compareCondition['srcField']
      let destCompareField = compareCondition['destField']
      let isMergeRepeatData = compareCondition['isMergeRepeatData']
      let operator = compareCondition['compareOperator']

      srcCompareField = getFieldName(srcCompareField)
      destCompareField = getFieldName(destCompareField)

      if (operator == null || operator == '') {
        throw new Error('比较操作符不能为空，请检查配置！')
      }
      if (srcCompareField == null || srcCompareField == '') {
        throw new Error('源实体比较字段不能为空，请检查配置！')
      }
      if (destCompareField == null || destCompareField == '') {
        throw new Error('目标实体比较字段不能为空，请检查配置！')
      }

      //源实体比较字段类型必须与目标实体比较字段类型兼容
      let stringTypeArray = ['char', 'text', 'longDate']
      let numberTypeArray = ['integer', 'number']
      let srcCompareFieldType = getFieldTypeByDataSource(
        srcDataSource,
        srcCompareField
      )
      let destCompareFieldType = getFieldTypeByDataSource(
        destDataSource,
        destCompareField
      )
      let isCompareAllow = true
      let isCompareBothNumber = false
      if (srcCompareFieldType != destCompareFieldType) {
        isCompareAllow = false
        if (
          vds.string.isInArray(srcCompareFieldType, stringTypeArray) &&
          vds.string.isInArray(destCompareFieldType, stringTypeArray)
        ) {
          isCompareAllow = true
        }
        if (
          vds.string.isInArray(srcCompareFieldType, numberTypeArray) &&
          vds.string.isInArray(destCompareFieldType, numberTypeArray)
        ) {
          isCompareAllow = true
          isCompareBothNumber = true
        }
      }
      if (
        srcCompareFieldType == 'file' ||
        srcCompareFieldType == 'blob' ||
        destCompareFieldType == 'file' ||
        destCompareFieldType == 'blob'
      ) {
        throw new Error(
          '源实体比较字段与目标实体比较字段类型不不支持，请检查配置！'
        )
      }
      if (!isCompareAllow) {
        throw new Error(
          '源实体比较字段与目标实体比较字段类型不兼容，请检查配置！'
        )
      }

      let result = params['result']
      let isSave = result['isSave']
      let isClearSaveData = result['isClearSaveData']
      let saveDataSource = result['saveDataSource']
      let mappings = result['mappings']

      if (
        vds.string.isEmpty(srcDataSource) ||
        vds.string.isEmpty(destDataSource)
      ) {
        throw new Error('源实体或物理表及查询不能为空，请检查配置！')
      }

      if (srcDataSource != destDataSource) {
        let errorMsg = null
        if (matchFields == null || matchFields.length == 0) {
          errorMsg = '匹配字段不能为空，请检查配置！'
        }
        for (let i = 0; i < matchFields.length; i++) {
          let obj = matchFields[i]
          if (obj == null) {
            errorMsg = '匹配字段不能为空，请检查配置！'
            break
          }
          if (vds.string.isEmpty(obj['srcField'])) {
            errorMsg = '匹配源字段不能为空，请检查配置！'
            break
          }
          if (vds.string.isEmpty(obj['destField'])) {
            errorMsg = '匹配目标字段不能为空，请检查配置！'
            break
          }
        }
        if (errorMsg != null) {
          throw new Error(errorMsg)
        }
      }

      if (isSave) {
        if (vds.string.isEmpty(saveDataSource)) {
          throw new Error('存储实体不能为空，请检查配置！')
        }
        if (mappings == null || mappings.length == 0) {
          throw new Error('存储实体字段映射不能为空，请检查配置！')
        }
        if (
          saveDataSource == srcDataSource ||
          saveDataSource == destDataSource
        ) {
          throw new Error('存储实体不能为源实体或目标实体，请检查配置！')
        }
      }
      if (
        srcDataSource == destDataSource &&
        srcCompareField == destCompareField
      ) {
        throw new Error('源实体与目标实体相同时比较字段不能相同，请检查配置！')
      }
      let srcRecords = getFilterRecords(
        srcDataSource,
        srcFilterCondition,
        ruleContext
      )
      let destRecords = getFilterRecords(destDataSource, '', ruleContext)
      if (
        srcRecords == null ||
        srcRecords.length == 0 ||
        destRecords == null ||
        destRecords.length == 0
      ) {
        if (isSave && isClearSaveData) {
          let ds = vds.ds.lookup(saveDataSource)
          ds.clear()
        }
        setBusinessRuleResult(ruleContext, true)
        resolve()
        return true
      }

      let finalResults = []

      //源实体和目标实体相同时
      if (srcDataSource == destDataSource) {
        for (let i = 0; srcRecords != null && i < srcRecords.length; i++) {
          let srcCompareFieldVal = srcRecords[i][srcCompareField]
          let destCompareFieldVal = srcRecords[i][destCompareField]
          let compareRst = exeCompare(
            isCompareBothNumber,
            srcCompareFieldVal,
            operator,
            destCompareFieldVal
          )
          if (compareRst) {
            finalResults.push(srcRecords[i])
          }
        }
      } else {
        let isAllMatchData = true //存在的匹配数据全部都对比通过
        let isExistMatchData = false //是否存在匹配数据
        let srcMatchFields = []
        let destMatchFields = []
        for (let i = 0; i < matchFields.length; i++) {
          srcMatchFields.push(matchFields[i].srcField)
          destMatchFields.push(matchFields[i].destField)
        }
        let srcRecordsMap = getRecordsMapByGroupFields(
          srcRecords,
          srcMatchFields,
          false
        )
        try {
          let destRecordsMap = getRecordsMapByGroupFields(
            destRecords,
            destMatchFields,
            true
          )
          for (let srcGroupKey in srcRecordsMap) {
            let srcValues = srcRecordsMap[srcGroupKey]
            let destGroupKey = getDestGroupKeyStr(srcGroupKey, matchFields)
            let destValues = destRecordsMap[destGroupKey]

            if (
              srcValues == null ||
              srcValues.length == 0 ||
              destValues == null ||
              destValues.length == 0
            ) {
              continue
            } else {
              isExistMatchData = true
            }
            let destCompareFieldVal = destValues[0][destCompareField]
            for (let j = 0; j < srcValues.length; j++) {
              let srcCompareFieldVal = srcValues[j][srcCompareField]
              if (srcValues.length > 1 && isMergeRepeatData) {
                if (
                  !vds.string.isInArray(srcCompareFieldType, numberTypeArray)
                ) {
                  throw new Error(
                    '源实体匹配记录有重复，比较字段不是整数或浮点类型，不能执行合并操作，请检查配置！'
                  )
                }
                srcCompareFieldVal = getSumValue(srcValues, srcCompareField)
              }
              let compareRst = exeCompare(
                isCompareBothNumber,
                srcCompareFieldVal,
                operator,
                destCompareFieldVal
              )
              if (compareRst) {
                let combineRecord = combineTwoRecord(
                  srcDataSource,
                  srcValues[j],
                  destDataSource,
                  destValues[0]
                )
                finalResults.push(combineRecord)
              } else {
                isAllMatchData = false
              }
            }
          }
        } catch (e) {
          throw new Error('目标实体匹配记录不能重复，请检查配置！')
        }
      }

      if (isSave) {
        if (isClearSaveData) {
          let ds = vds.ds.lookup(saveDataSource)
          ds.clear()
        }
        //获取构造的存储实体数据
        if (finalResults != null && finalResults.length > 0) {
          let newSaveRecords = getCopyRecordsByMapping(
            saveDataSource,
            finalResults,
            mappings
          )
          let datasource = vds.ds.lookup(saveDataSource)
          datasource.insertRecords(newSaveRecords)
        }
      }

      //@ts-ignore
      if (finalResults != null && isAllMatchData && isExistMatchData)
        bussinessReturnValue = true
      else bussinessReturnValue = false
      setBusinessRuleResult(ruleContext, bussinessReturnValue)

      resolve()

      return true
    } catch (ex) {
      reject(ex)
    }
  })
}

function setBusinessRuleResult(ruleContext: RuleContext, result: any) {
  if (ruleContext.setResult) {
    ruleContext.setResult('isMatchCompare', result)
  }
}

let getDestGroupKeyStr = function (
  srcGroupKeyStr: string,
  matchFields: Array<Record<string, any>>
) {
  let destGrouKeyStr = srcGroupKeyStr
  for (let i = 0; i < matchFields.length; i++) {
    destGrouKeyStr = destGrouKeyStr.replace(
      matchFields[i].srcField,
      matchFields[i].destField
    )
  }
  return destGrouKeyStr
}

let combineTwoRecord = function (
  srcDataSource: string,
  srcRecord: Record<string, any>,
  destDataSource: string,
  destRecord: Record<string, any>
) {
  let newRecord: Record<string, any> = {}
  let fields = ''
  for (let field1 in srcRecord) {
    let fieldName = field1
    if (field1.indexOf('.') < 0) fieldName = srcDataSource + '.' + field1
    newRecord[fieldName] = srcRecord[field1]
    fields += fieldName + ','
  }
  for (let field2 in destRecord) {
    let fieldName = field2
    if (field2.indexOf('.') < 0) fieldName = destDataSource + '.' + field2

    if (fields.indexOf(fieldName) >= 0) continue
    newRecord[fieldName] = destRecord[field2]
  }
  return newRecord
}

let getCopyRecordsByMapping = function (
  dataSource: Record<string, any>,
  records: Array<Record<string, any>>,
  mappingFields: Array<Record<string, any>>
) {
  let datasource = vds.ds.lookup(dataSource)
  let copyRecords = []
  for (let i = 0; i < records.length; i++) {
    let obj = datasource.createRecord()
    for (let j = 0; j < mappingFields.length; j++) {
      let resultFieldVal = records[i][mappingFields[j].resultField]
      if (resultFieldVal == null) {
        resultFieldVal = records[i][getFieldName(mappingFields[j].resultField)]
      }
      obj.set(getFieldName(mappingFields[j].saveField), resultFieldVal)
    }
    copyRecords.push(obj)
  }
  return copyRecords
}

let getFieldTypeByDataSource = function (
  dataSource: Record<string, any>,
  fieldName: string
) {
  let datasource = vds.ds.lookup(dataSource)
  let metadata = datasource.getMetadata()
  let fields = metadata.getFields()
  if (fields != null) {
    for (let i = 0; i < fields.length; i++) {
      let metaFieldName = fields[i].getCode()
      let b = fieldName.split('.')
      if (metaFieldName == fieldName) {
        return fields[i].getType()
      }
      if (b.length == 2 && metaFieldName == b[1]) {
        return fields[i].getType()
      }
    }
  }
  return ''
}

let exeCompare = function (
  isCompareBothNumber: boolean,
  val1: string | number,
  operator: string,
  val2: string | number
) {
  if (isCompareBothNumber) {
    if (val1 == null) val1 = 0
    if (val2 == null) val2 = 0
  } else {
    if (val1 == null) val1 = ''
    if (val2 == null) val2 = ''
  }
  if (operator == '=') return val1 == val2
  if (operator == '!=') return val1 != val2
  if (operator == '>') return val1 > val2
  if (operator == '>=') return val1 >= val2
  if (operator == '<') return val1 < val2
  if (operator == '<=') return val1 <= val2
  throw new Error('不支持的操作符' + operator)
}

let getSumValue = function (
  records: Array<Record<string, any>>,
  fieldName: string
) {
  let sum = 0
  for (let i = 0; records != null && i < records.length; i++) {
    let val = records[i][fieldName]
    if (val != null) sum += val
  }
  return sum
}

let getRecordsMapByGroupFields = function (
  records: Array<Record<string, any>>,
  groupFieldNames: Array<string>,
  isCheckRepeat: boolean
) {
  let map: Record<string, any> = {}
  if (
    records != null &&
    groupFieldNames != null &&
    groupFieldNames.length > 0
  ) {
    for (let i = 0; i < records.length; i++) {
      let key = getGroupValueStr(records[i], groupFieldNames)
      if (key == null || key == '') continue
      let objs = map[key]
      if (objs == null) {
        objs = new Array()
      } else if (isCheckRepeat) {
        vds.log.error('数据存在重复')
        throw new Error('数据存在重复')
      }
      objs.push(records[i])
      map[key] = objs
    }
  }
  return map
}

let getGroupValueStr = function (
  record: Record<string, any>,
  groupFieldNames: Array<string>
) {
  let groupVal = ''
  if (record != null && groupFieldNames != null && groupFieldNames.length > 0) {
    for (let i = 0; i < groupFieldNames.length; i++) {
      groupVal += groupVal.length > 0 ? ',' : ''
      let fieldVal = record[getFieldName(groupFieldNames[i])]
      groupVal += groupFieldNames[i] + '=' + fieldVal
    }
  }

  return groupVal
}

/**
 *	根据源实体名称及拷贝类型来获取要拷贝的行数据
 *  @param	dataSource	源实体名称
 *  @param	condition	源实体条件
 */
let getFilterRecords = function (
  dataSource: Record<string, any>,
  condition: string,
  ruleContext: RuleContext
) {
  let outputRecords = []
  let datasource = vds.ds.lookup(dataSource)
  let records = datasource.getAllRecords()
  if (records) records = records.toArray()
  if (condition == null || condition == '') return _genDataMaps(records)
  if (records && records.length > 0) {
    for (let index = 0; index < records.length; index++) {
      let record = records[index]
      let ret = vds.expression.execute(condition, {
        ruleContext: ruleContext,
        records: [record]
      })
      if (typeof ret != 'boolean') {
        vds.log.error('条件必须返回布尔类型，请检查')
        continue
      }
      if (ret == true) {
        outputRecords.push(record.toMap())
      }
    }
  }
  return outputRecords
}

let getFieldName = function (fieldName: string) {
  if (fieldName != null && fieldName.indexOf('.') > 0)
    return fieldName.split('.')[1]
  return fieldName
}

let _genDataMaps = function (records: Array<Record<string, any>>) {
  if (!records || records.length == 0) return null

  let result = []
  for (let i = 0, len = records.length; i < len; i++)
    result.push(records[i].toMap())

  return result
}

export { main }
