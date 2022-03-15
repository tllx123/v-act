/**
 *界面实体与物理表数据比较
 *
 */

import * as component from '@v-act/vjs.framework.extension.platform.services.integration.vds.component'
import * as ds from '@v-act/vjs.framework.extension.platform.services.integration.vds.ds'
import * as expression from '@v-act/vjs.framework.extension.platform.services.integration.vds.expression'
import * as log from '@v-act/vjs.framework.extension.platform.services.integration.vds.log'
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as rpc from '@v-act/vjs.framework.extension.platform.services.integration.vds.rpc'
// 规则主入口(必须有)
import { RuleContext } from '@v-act/vjs.framework.extension.platform.services.integration.vds.rule'
import * as string from '@v-act/vjs.framework.extension.platform.services.integration.vds.string'
import * as widget from '@v-act/vjs.framework.extension.platform.services.integration.vds.widget'
import * as window from '@v-act/vjs.framework.extension.platform.services.integration.vds.window'

const vds = {
  component,
  ds,
  expression,
  log,
  object,
  rpc,
  string,
  widget,
  window
}

const main = function (ruleContext: RuleContext) {
  return new Promise<void>(function (resolve, reject) {
    try {
      // 当任何一条匹配数据不满足比较条件时，返回false，否则返回true(包括两种情况：不存在匹配数据或所有匹配数据都满足比较条件)；
      let bussinessReturnValue = true

      let params = ruleContext.getVplatformInput()
      let srcDataSource = params['srcDataSource']
      let srcFilterCondition = params['srcFilterCondition']
      let destDataSource = params['destDataSource']
      let destIsQuery = params['destIsQuery']
      let destFilterCondition = params['destFilterCondition']
      let destQueryParams = params['destQueryParams']

      let matchFields = params['matchFields']

      let compareCondition = params['compareCondition']

      if (compareCondition == null) {
        throw new Error('比较条件配置不能为空，请检查配置！')
      }

      let srcCompareField = compareCondition['srcField']
      let destCompareField = compareCondition['destField']
      let isMergeRepeatData = compareCondition['isMergeRepeatData']
      let operator = compareCondition['compareOperator']

      if (operator == null || operator == '') {
        throw new Error('比较操作符不能为空，请检查配置！')
      }
      if (srcCompareField == null || srcCompareField == '') {
        throw new Error('源实体比较字段不能为空，请检查配置！')
      }
      if (destCompareField == null || destCompareField == '') {
        throw new Error('目标实体比较字段不能为空，请检查配置！')
      }

      // 源实体比较字段类型必须与目标实体比较字段类型兼容
      let numberTypeArray = ['integer', 'number']
      let srcCompareFieldType = getFieldByDataSource(
        srcDataSource,
        srcCompareField
      ).getType()

      if (!vds.string.isInArray(srcCompareFieldType, numberTypeArray)) {
        throw new Error('源实体比较字段必须为整数或数字类型，请检查配置！')
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
      try {
        validSaveMapping(isSave, mappings)
      } catch (e) {
        throw new Error('存储实体字段映射不能为空，请检查配置！')
      }

      if (isSave) {
        if (vds.string.isEmpty(saveDataSource)) {
          throw new Error('存储实体不能为空，请检查配置！')
        }
        if (saveDataSource == srcDataSource) {
          throw new Error('存储实体不能为源实体，请检查配置！')
        }
      }

      let srcRecords = getFilterRecords(
        srcDataSource,
        srcFilterCondition,
        ruleContext
      )
      if (srcRecords == null || srcRecords.length == 0) {
        setBusinessRuleResult(ruleContext, true)
        if (isSave && isClearSaveData) {
          let ds = vds.ds.lookup(saveDataSource)
          ds.clear()
        }
        resolve()
        return true
      }

      let destQueryCond: Record<string, any> = {}
      destQueryCond.srcDataSource = srcDataSource
      destQueryCond.destDataSource = destDataSource
      destQueryCond.destIsQuery = destIsQuery

      let fetchMode = destIsQuery
        ? vds.ds.WhereType.Query
        : vds.ds.WhereType.Table
      let wrParam = {
        type: fetchMode,
        methodContext: ruleContext.getMethodContext()
      }
      let w = vds.ds.createWhere(wrParam)

      // 组装设置的加载条件
      if (destFilterCondition && destFilterCondition.length > 0) {
        w.addCondition(destFilterCondition)
      }
      if (destQueryParams != null && destQueryParams.length > 0) {
        let tmpparams = genCustomParams(destQueryParams, ruleContext)
        w.addParameters(tmpparams)
      }
      let condition = w.toWhere()
      let valueParamMap = w.toParameters()
      destQueryCond.destWhere = condition
      destQueryCond.destQueryParams = valueParamMap

      destQueryCond.srcValues = srcRecords
      destQueryCond.matchFields = matchFields

      let cloneCompareCondition = cloneObj(compareCondition)
      let srcField = getFieldByDataSource(srcDataSource, srcCompareField)
      cloneCompareCondition.srcColumnTypeName = srcField.getType()
      destQueryCond.compareCondition = cloneCompareCondition

      let callback = function (responseObj: Record<string, any>) {
        let success = responseObj.IsSuccess
        if (!success) {
          vds.log.error('错误信息：' + result.msg)
          let exception = new Error('数据比较执行异常！')
          reject(exception)
        } else {
          let finalResultsValue = responseObj.CompareResults
          let finalResults = vds.object.stringify(finalResultsValue)
          if (isSave) {
            if (isClearSaveData) {
              let ds = vds.ds.lookup(saveDataSource)
              ds.clear()
            }

            // 获取构造的存储实体数据
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
          if (finalResults != null && finalResults.length == srcRecords.length)
            bussinessReturnValue = true
          else bussinessReturnValue = false

          setBusinessRuleResult(ruleContext, bussinessReturnValue)
          resolve()
        }
      }

      let sConfig = {
        command: 'CommonRule_CompareEntityAndTableData',
        datas: [
          {
            code: 'InParams',
            type: 'char',
            value: vds.string.toJson(destQueryCond)
          }
        ],
        params: { isAsyn: true, ruleContext: ruleContext }
      }
      //  调用后台活动集
      let promise = vds.rpc.callCommand(
        sConfig.command,
        sConfig.datas,
        sConfig.params
      )
      //@ts-ignore
      promise.then(callback).catch(reject)
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

let validSaveMapping = function (
  isSave: boolean,
  mappings: Array<Record<string, any>>
) {
  if (!isSave) return
  if (mappings == null || mappings.length == 0) {
    throw new Error('比较结果存储映射不能为空')
  }
  for (let i = 0; i < mappings.length; i++) {
    if (mappings[i].saveField == null || mappings[i].saveField == '') {
      throw new Error('比较结果存储字段不能为空')
    }
    if (mappings[i].resultField == null || mappings[i].resultField == '') {
      throw new Error('比较结果源或目标表及查询字段不能为空')
    }
  }
}

let cloneObj = function (obj: Record<string, any>) {
  let clone: Record<string, any> = {}
  for (let prop in obj) {
    clone[prop] = obj[prop]
  }
  return clone
}

let getFieldName = function (fieldName: string) {
  if (fieldName != null && fieldName.indexOf('.') > 0)
    return fieldName.split('.')[1]
  return fieldName
}

let getCopyRecordsByMapping = function (
  dataSource: Record<string, any>,
  records: Array<Record<string, any>>,
  mappingFields: Array<Record<string, any>>
) {
  let datasource = vds.ds.lookup(dataSource)
  let emptyRecord = datasource.createRecord()

  let copyRecords = []
  for (let i = 0; i < records.length; i++) {
    let tempRecord = emptyRecord.clone()
    if (datasource.getMetadata().contains('id')) {
      tempRecord.set('id', vds.string.uuid())
    }
    let obj = tempRecord

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

let getFieldByDataSource = function (
  dataSource: Record<string, any>,
  fieldName: string
) {
  let datasource = vds.ds.lookup(dataSource)
  let metadata = datasource.getMetadata()
  let fields = metadata.getFields()

  let field = null
  if (fields != null) {
    for (let i = 0; i < fields.length; i++) {
      let metaFieldName = fields[i].getCode()
      let b = fieldName.split('.')
      if (metaFieldName == fieldName) {
        field = fields[i]
      }
      if (b.length == 2 && metaFieldName == b[1]) {
        field = fields[i]
      }
    }
  }
  return field
}

/**
 *	根据源实体名称及拷贝类型来获取要拷贝的行数据
 *  @param	dataSource	源实体名称
 *  @param	condition		    源实体条件
 */
let getFilterRecords = function (
  dataSource: Record<string, any>,
  condition: string,
  ruleContext: RuleContext
) {
  let outputRecords = []
  let datasource = vds.ds.lookup(dataSource)
  let records = datasource.getAllRecords().toArray()

  if (condition == null || condition == '') {
    let resultData = []
    if (records && records.length > 0) {
      for (let i = 0; i < records.length; i++) {
        let record = records[i]
        resultData.push(record.toMap())
      }
    }
    return resultData
  }

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

//#region genCustomParams 方法

let genCustomParams = function (
  paramDefines: Array<Record<string, any>>,
  ruleContext: RuleContext
) {
  let rs: Record<string, any> = {}
  if (paramDefines && paramDefines.length > 0) {
    for (let i = 0; i < paramDefines.length; i++) {
      let define = paramDefines[i]
      let key = define['queryfield']
      if (!key) {
        key = define['Queryfield']
      }
      let valueDefine = define['queryfieldValue']
      if (!valueDefine) {
        valueDefine = define['QueryfieldValue']
      }
      let type = define['type']
      let componentControlID = define['componentControlID']
      let value = getCustomParamValue(
        valueDefine,
        type,
        componentControlID,
        ruleContext
      )
      rs[key] = value
    }
  }
  return rs
}
/**
 * 获取自定义参数的值
 * @param queryfieldValue 参数值
 * @param type 参数类源类型(参数值类型1表字段，2系统变量，3组件变量，4固定值，5自定义，6面板参数，8控件的值, 9表达式)
 * @param componentControlId 参数来源控件
 */
let getCustomParamValue = function (
  queryfieldValue: string,
  type: string,
  componentControlId: string,
  ruleContext: RuleContext
) {
  let returnValue: string | null | boolean = ''
  let record, ds
  switch (vds.string.trim(type + '')) {
    case '1':
      if (queryfieldValue.indexOf('.') == -1) {
        vds.log.warn(queryfieldValue + ' 格式必须为表名.字段名')
        break
      }
      ds = queryfieldValue.split('.')[0]
      let fieldName = queryfieldValue.split('.')[1]
      record = getCurrentRecord(ds)
      returnValue = record.get(fieldName)
      break
    case '2':
      returnValue = vds.component.getVariant(queryfieldValue)
      break
    case '3':
      returnValue = vds.window.getInput(queryfieldValue)
      break
    case '4':
      // returnValue = queryfieldValue;
      // 固定值(0:假，1:真，2:空)
      switch ((queryfieldValue + '').toLowerCase()) {
        case '0':
          returnValue = false
          break
        case '1':
          returnValue = true
          break
        case '2':
          returnValue = null
          break
        default:
          returnValue = queryfieldValue
          break
      }
      break
    case '5':
      returnValue = queryfieldValue
      break
    case '6':
      let valueQueryControlID = componentControlId
      let value = queryfieldValue
      let storeType = vds.widget.getStoreType(valueQueryControlID)
      let storeTypes = vds.widget.StoreType
      // 按照控件不同的属性类型，获取参数值
      ds = getDsName(valueQueryControlID)
      record = getCurrentRecord(ds)
      if (storeTypes.Set == storeType) {
        // 集合类控件，组装表名.字段名进行取值
        if (record) {
          let field = value.split('_')[1]
          returnValue = record.get(field)
        } else {
          vds.log.error(
            '集合控件:' + valueQueryControlID + ' 无选中行，无法获取其参数值'
          )
        }
      } else if (storeTypes.SingleRecordMultiValue == storeType) {
        // 单记录多值控件，按照控件属性名字取得关联的标识，再进行取值
        //let propertyCode = value.split("_")[1];
        let propertyCode = ''
        // 目前认为使用-分隔，也可以使用_分隔
        if (value.indexOf('-') != -1) {
          propertyCode = value.split('-')[1]
        } else {
          propertyCode = value.split('_')[1]
        }
        let fieldCode = vds.widget.getProperty(
          valueQueryControlID,
          propertyCode
        )
        returnValue = record.get(fieldCode)
      } else if (storeTypes.SingleRecord == storeType) {
        // 单值控件，直接取值
        let fieldCode = vds.widget.getFieldCodes(ds, valueQueryControlID)[0]
        returnValue = record.get(fieldCode)
        if (null == returnValue || undefined == returnValue) {
          returnValue = ''
        }
      }
      break
    case '8':
    case '9':
    default:
      if (!queryfieldValue) {
        // modify by xiedh 2016-04-26,预先校验，防止执行表达式报错
        if (null == queryfieldValue || undefined == queryfieldValue) {
          returnValue = null
        } else {
          returnValue = queryfieldValue
        } //end modify
      } else {
        returnValue = vds.expression.execute(queryfieldValue, {
          ruleContext: ruleContext
        })
      }
      break
  }
  //todo
  if (queryfieldValue !== '""' && returnValue === '') {
    return null
  }
  // 统一输出为字符串
  //return (null == returnValue || undefined == returnValue ? "" : returnValue);
  return undefined == returnValue ? null : returnValue
}
let getCurrentRecord = function (ds: string) {
  let datasource = vds.ds.lookup(ds)
  return datasource.getCurrentRecord()
}

let getDsName = function (widgetCode: string) {
  let dsNames = vds.widget.getDatasourceCodes(widgetCode)
  return dsNames[0]
}

//#endregion
export { main }
