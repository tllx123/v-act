import * as component from '@v-act/vjs.framework.extension.platform.services.integration.vds.component'
import * as ds from '@v-act/vjs.framework.extension.platform.services.integration.vds.ds'
import * as expression from '@v-act/vjs.framework.extension.platform.services.integration.vds.expression'
import * as log from '@v-act/vjs.framework.extension.platform.services.integration.vds.log'
import * as rpc from '@v-act/vjs.framework.extension.platform.services.integration.vds.rpc'
import { RuleContext } from '@v-act/vjs.framework.extension.platform.services.integration.vds.rule'
import * as string from '@v-act/vjs.framework.extension.platform.services.integration.vds.string'
import * as widget from '@v-act/vjs.framework.extension.platform.services.integration.vds.widget'
import * as window from '@v-act/vjs.framework.extension.platform.services.integration.vds.window'
/**
 * 树形结构复制
 */
import { DatasourceManager as manager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'

interface mapping {
  sourcetype?: string
  sourceField?: string
  destField?: string
}
const vds = { component, ds, expression, log, rpc, string, widget, window }

function main(ruleContext: RuleContext) {
  return new Promise<void>(function (resolve, reject) {
    try {
      let inParamObj = ruleContext.getVplatformInput()
      if (!check(inParamObj)) {
        resolve()
        return
      }

      const condSqls: Array<string> = []
      const condParams: Array<Record<string, any>> = []
      const itemsField: Array<Record<string, any>> = []
      const items: Array<Record<string, any>> = []
      const treeStruct: any = ''

      let params = {
        //condSqls: [], //查询条件
        condSqls: condSqls,
        //condParams: [], //查询参数
        condParams: condParams,
        //itemsField: [], //字段对应关系--对于系统变量、组件变量、前台表达式、实体字段参数要解析实际的值
        itemsField: itemsField,
        currId: '', //当前选中节点(要插入的目标节点Id)
        treeStruct: treeStruct,
        items: items
      }

      for (let i = 0; i < inParamObj.items.length; i++) {
        //处理查询参数
        let condParams: Record<string, any> = {}
        let isSourceQuery = inParamObj.items[i].isSourceQuery
        if (isSourceQuery == true || isSourceQuery == 'true') {
          let dsQueryParam = inParamObj.items[i].dsQueryParam
          if (dsQueryParam != null && dsQueryParam.length > 0) {
            condParams = genCustomParams(dsQueryParam, ruleContext)
          }
        }

        // 处理查询条件
        let condCfgs = inParamObj.items[i].dsWhere
        let condSqls = ''
        if (condCfgs != null && condCfgs.length > 0) {
          let wrParam = {
            type: vds.ds.WhereType.Query,
            methodContext: ruleContext.getMethodContext()
          }
          let where = vds.ds.createWhere(wrParam)
          where.addCondition(condCfgs)
          where.addParameters(condParams)
          condSqls = where.toWhere()
          condParams = where.toParameters()
        }
        params.condSqls.push(condSqls)
        params.condParams.push(condParams)

        //处理字段对应关系
        let itemsField = inParamObj.items[i].itemsField
        let result = ParamField(itemsField, {}, ruleContext)
        params.itemsField.push(...result.itemsConverted)
        if (condParams != null) {
          let paramMap = result.paramMap
          Object.assign(condParams, paramMap)
        }

        //对于主表来说，处理当前选中节点
        let isInsertCurrentNode = inParamObj.items[i].isInsertCurrentNode
        if (isInsertCurrentNode === true || isInsertCurrentNode === 'true') {
          let datasource = vds.ds.lookup(inParamObj.items[i].destTableName)
          let currRow = datasource.getCurrentRecord()
          //假如没有选中的节点，则复制到根节点下
          if (currRow) {
            params.currId = currRow.getSysId()
          }
        }
      }
      params.treeStruct = inParamObj['treeStruct']
      params.items = inParamObj['items']

      // 调用完活动集之后的回调方法
      let callback = function (responseObj: any) {
        if (responseObj.Success == false) {
          //throw new Error('树形结构表间数据复制执行异常:' + result.msg)
          throw new Error('树形结构表间数据复制执行异常:')
        }
        resolve()
      }

      let sConfig = {
        command: 'CommonRule_CopyTreeDataBetweenTables',
        datas: [
          {
            code: 'InParams',
            type: 'char',
            value: vds.string.toJson(params)
          }
        ],
        params: { isAsyn: false, ruleContext: ruleContext }
      }
      let promise = vds.rpc.callCommand(
        sConfig.command,
        sConfig.datas,
        sConfig.params
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
  if (!checkMasterIdField(inParamObj)) return false
  else return true
}

/**
 * 要求 对于从表来说，必须指定目标表的外键字段(维持目标表主从关系时需要知道)
 *
 * 目前的配置方式，没有指定从表目标表的外键字段，从表的外键字段是通过itemsField获取的；
 * 这种配置方式不明显，很容易使人遗漏，所以特别检查并提示。
 */
function checkMasterIdField(inParamObj: Record<string, any>) {
  let items = inParamObj.items
  for (let i = 0; i < items.length; i++) {
    // 主表或者某一个从表的规则配置
    let config = items[i]
    if (config.isMasterTable == true || config.isMasterTable == 'true') {
      //主表不需要检查
      continue
    }

    if (!checkItemsFieldContainsSrcRefFK(config.itemsField, config.refFK)) {
      alert(
        '[树形结构表间数据复制]规则配置有误：\n目标从表' +
          config.destTableName +
          '的外键字段必须指定。\n请在字段映射关系列表中进行配置。'
      )
      return false
    }
  }

  return true
}

/**
 * 检查ItemsField中，源表是否包含指定的名称
 */
function checkItemsFieldContainsSrcRefFK(
  itemsField: Array<Record<string, any>>,
  srcRefFK: string
) {
  for (let i = 0; i < itemsField.length; i++) {
    if (itemsField[i].sourceField == srcRefFK) return true
  }
  return false
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
        //let  propertyCode = value.split("_")[1];
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
  let paramValue
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
      let newSourceField = vds.expression.execute(sourceField, {
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
  paramValue: any,
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
  let name = fieldName.replace(/[.]/g, '_')
  return name + '_' + vds.string.uuid()
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
