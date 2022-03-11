/**
 * 表间数据复制<code>
 * {
 *	"condition" : [{
 *				"columnType" : "1",
 *				"field" : "my_products_consume.productName",
 *				"fieldType" : "1",
 *				"leftBracket" : null,
 *				"logicOperation" : "",
 *				"operation" : " = ",
 *				"rightBracket" : null,
 *				"value" : "花生",
 *				"valueType" : "5"
 *			}],
 *	"destTableID" : "c9d600009fa444daa32bb500f0fabf96",
 *	"destTableName" : "my_products",
 *	"equalFields" : [{
 *				"checkRepeat" : "True",
 *				"destField" : "my_products.productName",
 *				"sourceField" : "my_products_consume.productName",
 *				"sourcetype" : "4"
 *			}, {
 *				"checkRepeat" : "False",
 *				"destField" : "my_products.totalSale",
 *				"sourceField" : "my_products_consume.amount"
 *			}],
 *	"repeatType" : "1",
 *	"sourceTableID" : "87f340420d55430bb43b510433521295",
 *	"sourceTableName" : "my_products_consume"
 * }
 * </code>
 */

import * as component from '@v-act/vjs.framework.extension.platform.services.integration.vds.component'
import * as ds from '@v-act/vjs.framework.extension.platform.services.integration.vds.ds'
import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'
import * as expression from '@v-act/vjs.framework.extension.platform.services.integration.vds.expression'
import * as log from '@v-act/vjs.framework.extension.platform.services.integration.vds.log'
import * as message from '@v-act/vjs.framework.extension.platform.services.integration.vds.message'
import * as rpc from '@v-act/vjs.framework.extension.platform.services.integration.vds.rpc'
import { RuleContext } from '@v-act/vjs.framework.extension.platform.services.integration.vds.rule'
import * as string from '@v-act/vjs.framework.extension.platform.services.integration.vds.string'
import * as widget from '@v-act/vjs.framework.extension.platform.services.integration.vds.widget'
import * as window from '@v-act/vjs.framework.extension.platform.services.integration.vds.window'
import { DatasourceManager as manager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'

interface mapping {
  sourcetype?: string
  sourceField?: string
  destField?: string
}

const vds = {
  component,
  ds,
  exception,
  expression,
  log,
  message,
  rpc,
  string,
  widget,
  window
}

function main(ruleContext: RuleContext) {
  return new Promise<void>(function (resolve, reject) {
    try {
      let inParamObj = ruleContext.getVplatformInput()
      if (!check(inParamObj)) {
        resolve()
        return
      }

      // 处理查询条件
      let condCfgs = inParamObj.condition
      let wrParam = {
        type: vds.ds.WhereType.Query,
        methodContext: ruleContext.getMethodContext()
      }
      let where = vds.ds.createWhere(wrParam)
      if (condCfgs != null && condCfgs.length > 0) {
        where.addCondition(condCfgs)
      }

      //查询参数配置
      let sourceType = inParamObj['sourceType']
      let dsQueryParam
      if (sourceType == 'Query') {
        dsQueryParam = inParamObj['queryParam']
        if (dsQueryParam != null && dsQueryParam.length > 0) {
          dsQueryParam = genCustomParams(dsQueryParam, ruleContext)
        }
      }
      where.addParameters(dsQueryParam)
      const itemsConverted: Array<Record<string, any>> = []

      let params = {
        condSql: where.toWhere(), //查询条件
        condParams: where.toParameters() || {}, //查询参数
        //equalFields: [], //字段对应关系数组
        equalFields: itemsConverted,
        sourceTableName: '',
        destTableName: '',
        repeatType: '',
        condition: ''
      }

      //处理字段对应关系中的参数:组件变量/系统变量/自定义值
      let result = ParamField(inParamObj.equalFields, {}, ruleContext)
      params.equalFields = result.itemsConverted
      params.condParams != null &&
        Object.assign(params.condParams, result.paramMap)
      params.condition = inParamObj['condition']
      params.sourceTableName = inParamObj['sourceTableName']
      params.destTableName = inParamObj['destTableName']
      params.repeatType = inParamObj['repeatType']

      let callback = ruleContext.genAsynCallback(function (
        responseObj: Record<string, any>
      ) {
        let success = responseObj.Success
        if (!success) {
          vds.exception.newSystemException('表间数据复制执行异常！')
        }
        resolve()
        return success
      })

      let commitParams = [
        {
          code: 'InParams',
          typeype: 'char',
          value: vds.string.toJson(params)
        }
      ]
      let reObj = {
        command: 'CommonRule_CopyDataBetweenTables',
        datas: commitParams,
        params: { isAsyn: true, ruleContext: ruleContext }
      }
      let promise = vds.rpc.callCommand(
        reObj.command,
        reObj.datas,
        reObj.params
      )
      promise.then(callback).catch(reject)
    } catch (ex) {
      reject(ex)
    }
  })
}

/**
 * 配置检查
 */
function check(inParamObj: Record<string, any>) {
  if (!checkEqualFields(inParamObj)) return false
  return true
}

/**
 * 要求 非检查重复字段 必须至少有1个
 */
function checkEqualFields(inParamObj: Record<string, any>) {
  let equalFields = inParamObj.equalFields
  if (equalFields == null || equalFields.length == 0) {
    // alert('[表间数据复制]规则配置有误：字段映射关系不能为空！');
    vds.message.info('[表间数据复制]规则配置有误：字段映射关系不能为空！', {
      time: 0
    })
    return false
  }

  //行重复处理方式：忽略=1，追加=2，更新=3
  if (inParamObj.repeatType != '3') {
    return true
  }

  let notCheckedField = false // 非检查重复字段 必须至少有1个
  //行重复处理方式为更新时，字段更新方式：""--忽略，"1"--累加，2--覆盖，3--忽略，4--累减
  let fieldRepeattype: Record<string, any> = {
    '1': '1',
    '2': '2',
    '4': '4'
  }
  for (let i = 0; i < equalFields.length; i++) {
    let field = equalFields[i]
    if (field.checkRepeat.toLowerCase() != 'false') continue
    if (fieldRepeattype[field.treatRepeattype] !== undefined) {
      notCheckedField = true
      break
    }
  }
  if (!notCheckedField) {
    vds.message.info(
      '[表间数据复制]规则配置有误：当行重复处理方式为更新时，字段映射关系中，至少需要配置一个更新字段，并且其重复处理方式不为空或者忽略。',
      { time: 0 }
    )
    return false
  }
  return true
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
  let returnValue: string | boolean | null = ''
  let ds, record
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
        //var propertyCode = value.split("_")[1];
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
          returnValue = ''
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
let getCurrentRecord = function (ds: ds) {
  let datasource = vds.ds.lookup(ds)
  return datasource.getCurrentRecord()
}

let getDsName = function (widgetCode: string) {
  let dsNames = vds.widget.getDatasourceCodes(widgetCode)
  return dsNames[0]
}

//#endregion

//#region ParamFieldUtil 实现

let ParamField = function (
  itemsField: Array<Record<string, any>>,
  mapping: mapping,
  ruleContext: RuleContext
) {
  let itemsConverted: Array<Record<string, any>> = []
  let paramMap = {}

  mapping = mapping || {
    destField: 'destField',
    sourceField: 'sourceField',
    sourcetype: 'sourcetype'
  }

  for (let i = 0; i < itemsField.length; i++) {
    _convertField(itemsField[i], ruleContext, mapping, itemsConverted, paramMap)
  }

  return { itemsConverted: itemsConverted, paramMap: paramMap }
}

/*转换一个字段、并且添加转换后的结果到this变量中*/
let _convertField = function (
  field: Record<string, any>,
  ruleContext: RuleContext,
  mapping: mapping,
  itemsConverted: Array<Record<string, any>>,
  paramMap: Record<string, any>
) {
  let sourceField = _getSourceField(field, mapping)
  let paramValue: string = ''
  switch (_getSourcetype(field, mapping)) {
    case 'tableField': //1--SQL字段
      _pushOldField(field, itemsConverted)
      break
    case '1': //1--SQL字段
      _pushOldField(field, itemsConverted)
      break
    case '2': //2--系统变量
      paramValue = vds.component.getVariant(sourceField)
      _pushParamField(field, paramValue, mapping, itemsConverted, paramMap)
      break
    case '3': //3--组件变量
      paramValue = vds.window.getInput(sourceField)
      _pushParamField(field, paramValue, mapping, itemsConverted, paramMap)
      break
    case '4': //4--SQL表达式
      var newSourceField = vds.expression.execute(sourceField, {
        ruleContext: ruleContext
      })
      _setSourceField(field, newSourceField, mapping)
      _pushOldField(field, itemsConverted)
      break
    case '5': //5--前台表达式
      paramValue = vds.expression.execute(sourceField, {
        ruleContext: ruleContext
      })
      _pushParamField(field, paramValue, mapping, itemsConverted, paramMap)
      break
    case 'expression': //5--前台表达式
      paramValue = vds.expression.execute(sourceField, {
        ruleContext: ruleContext
      })
      _pushParamField(field, paramValue, mapping, itemsConverted, paramMap)
      break
    case '6': //6--实体字段
      let dataSourceName = _getTableName(sourceField)
      let fieldName = _getFieldName(sourceField)
      let datasource = manager.lookup(dataSourceName)
      let record = datasource.getCurrentRecord()
      paramValue = record.get(fieldName)
      _pushParamField(field, paramValue, mapping, itemsConverted, paramMap)
      break
    default:
      _pushOldField(field, itemsConverted)
  }
}

let _pushOldField = function (
  field: Record<string, any>,
  itemsConverted: Array<Record<string, any>>
) {
  itemsConverted.push(Object.assign({}, field))
}

let _pushParamField = function (
  field: Record<string, any>,
  paramValue: string,
  mapping: mapping,
  itemsConverted: Array<Record<string, any>>,
  paramMap: Record<string, any>
) {
  let paramName = _genParamName(_getDestField(field, mapping))
  let item = Object.assign({}, field)
  item[mapping.sourceField || ''] = ':' + paramName
  itemsConverted.push(item)
  paramMap[paramName] = paramValue
}

let _genParamName = function (fieldName: string) {
  var name = fieldName.replace(/[.]/g, '_')
  return name + '_' + vds.string.uuid(undefined)
}

let _getDestField = function (item: Record<string, any>, mapping: mapping) {
  return item[mapping.destField || '']
}

let _getSourceField = function (item: Record<string, any>, mapping: mapping) {
  return item[mapping.sourceField || '']
}

let _setSourceField = function (
  item: Record<string, any>,
  newSourceField: string,
  mapping: mapping
) {
  item[mapping.sourceField || ''] = newSourceField
}

let _getSourcetype = function (item: Record<string, any>, mapping: mapping) {
  return item[mapping.sourcetype || '']
}

let _getTableName = function (field: string) {
  let retvalue = field
  if (field.indexOf('.') != -1) {
    retvalue = field.split('.')[0]
  }
  return retvalue
}

let _getFieldName = function (field: string) {
  let retvalue = field
  if (field.indexOf('.') != -1) {
    retvalue = field.split('.')[1]
  }
  return retvalue
}

//#endregion
export { main }
