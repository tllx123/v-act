import { ComponentParam } from '@v-act/vjs.framework.extension.platform.data.storage.runtime.param'
import {
  ExpressionContext,
  ExpressionEngine as ExpressEngine
} from '@v-act/vjs.framework.extension.platform.services.engine'
import { DatasourceManager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { WindowParam } from '@v-act/vjs.framework.extension.platform.services.param.manager'
import { jsonUtil as jsTool } from '@v-act/vjs.framework.extension.util.jsonutil'
import { uuid } from '@v-act/vjs.framework.extension.util.uuid'

export function initModule(sBox) {}

let getInstance = function (itemsField, mapping, routeContext) {
  return new ParamFieldUtil(itemsField, mapping, routeContext)
}

/**
 * mapping是itemsField中的属性如果命名不一致的话，可以另外传进来命名的对应关系
 * 例如：mapping: {destField : 'destName', sourceField : 'sourceName', sourcetype: 'sourcetype'}
 */
function ParamFieldUtil(itemsField, mapping, routeContext) {
  this.itemsField = itemsField //原始字段映射关系数组
  this.itemsConverted = [] //转换后的字段映射关系
  this.paramMap = {}
  this.routeContext = routeContext
  this.mapping = mapping || {
    destField: 'destField',
    sourceField: 'sourceField',
    sourcetype: 'sourcetype'
  }
  this._init()
}

ParamFieldUtil.prototype._init = function () {
  for (let i = 0; i < this.itemsField.length; i++) {
    this._convertField(this.itemsField[i])
  }
}

/*转换一个字段、并且添加转换后的结果到this变量中*/
ParamFieldUtil.prototype._convertField = function (field) {
  let sourceField = this._getSourceField(field)
  let context = new ExpressionContext()
  if (this.routeContext) {
    context.setRouteContext(this.routeContext)
  }
  switch (this._getSourcetype(field)) {
    case 'tableField': //1--SQL字段
      this._pushOldField(field)
      break
    case '1': //1--SQL字段
      this._pushOldField(field)
      break
    case '2': //2--系统变量
      var paramValue = ComponentParam.getVariant({ code: sourceField })
      this._pushParamField(field, paramValue)
      break
    case '3': //3--组件变量
      var paramValue = WindowParam.getInput({ code: sourceField })
      this._pushParamField(field, paramValue)
      break
    case '4': //4--SQL表达式
      var newSourceField = ExpressEngine.execute({
        expression: sourceField,
        context: context
      })
      this._setSourceField(field, newSourceField)
      this._pushOldField(field)
      break
    case '5': //5--前台表达式
      var paramValue = ExpressEngine.execute({
        expression: sourceField,
        context: context
      })
      this._pushParamField(field, paramValue)
      break
    case 'expression': //5--前台表达式
      var paramValue = ExpressEngine.execute({
        expression: sourceField,
        context: context
      })
      this._pushParamField(field, paramValue)
      break
    case '6': //6--实体字段
      var dataSourceName = jsTool.getTableName(sourceField)
      var fieldName = jsTool.getFieldName(sourceField)
      var datasource = manager.lookup({ datasourceName: dataSourceName })
      var record = DatasourceManager.getCurrentRecord()
      var paramValue = record.get(fieldName)
      this._pushParamField(field, paramValue)
      break
    default:
      this._pushOldField(field)
  }
}

/*添加一个原始字段到this，不需要转换*/
ParamFieldUtil.prototype._pushOldField = function (field) {
  this.itemsConverted.push($.extend({}, field))
}

/*添加一个命名参数字段到this*/
ParamFieldUtil.prototype._pushParamField = function (field, paramValue) {
  let paramName = this._genParamName(this._getDestField(field))
  let item = $.extend({}, field)
  item[this.mapping.sourceField] = ':' + paramName
  this.itemsConverted.push(item)
  this.paramMap[paramName] = paramValue
}

/* 生成参数名称*/
ParamFieldUtil.prototype._genParamName = function (fieldName) {
  let name = fieldName.replace(/[.]/g, '_')
  return name + '_' + uuid.generate()
}

ParamFieldUtil.prototype.toItemsConverted = function () {
  return this.itemsConverted
}

ParamFieldUtil.prototype.toParamMap = function (paramMap) {
  if (paramMap == null) return this.paramMap
  else return $.extend(paramMap, this.paramMap)
}

ParamFieldUtil.prototype._getDestField = function (item) {
  return item[this.mapping.destField]
}

ParamFieldUtil.prototype._getSourceField = function (item) {
  return item[this.mapping.sourceField]
}

ParamFieldUtil.prototype._setSourceField = function (item, newSourceField) {
  item[this.mapping.sourceField] = newSourceField
}

ParamFieldUtil.prototype._getSourcetype = function (item) {
  return item[this.mapping.sourcetype]
}

export { getInstance }
