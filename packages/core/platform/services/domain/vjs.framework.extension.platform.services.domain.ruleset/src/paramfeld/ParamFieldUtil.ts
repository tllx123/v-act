import { datasource } from '@v-act/vjs.framework.extension.platform.binding.data'
import { ComponentParam } from '@v-act/vjs.framework.extension.platform.data.storage.runtime.param'
import { RouteContext } from '@v-act/vjs.framework.extension.platform.interface.route'
import {
  ExpressionContext,
  ExpressionEngine as ExpressEngine
} from '@v-act/vjs.framework.extension.platform.services.engine'
import { WindowParam } from '@v-act/vjs.framework.extension.platform.services.param.manager'
import { jsonUtil as jsTool } from '@v-act/vjs.framework.extension.util.jsonutil'
import { uuid } from '@v-act/vjs.framework.extension.util.uuid'
import { $ } from '@v-act/vjs.framework.extension.vendor.jquery'

let getInstance = function (itemsField: any, mapping: any, routeContext: any) {
  return new ParamFieldUtil(itemsField, mapping, routeContext)
}

/**
 * mapping是itemsField中的属性如果命名不一致的话，可以另外传进来命名的对应关系
 * 例如：mapping: {destField : 'destName', sourceField : 'sourceName', sourcetype: 'sourcetype'}
 */
class ParamFieldUtil {
  itemsField: any
  itemsConverted: any[]
  paramMap: Record<string, any>
  routeContext: RouteContext
  mapping: Record<string, any>

  constructor(
    itemsField: any,
    mapping: Record<string, any>,
    routeContext: RouteContext
  ) {
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

  _init() {
    for (let i = 0; i < this.itemsField.length; i++) {
      this._convertField(this.itemsField[i])
    }
  }

  /*转换一个字段、并且添加转换后的结果到this变量中*/
  _convertField(field: any) {
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
        // var dataSourceName = jsTool.getTableName(sourceField)
        //@ts-ignore
        var fieldName = jsTool.getFieldName(sourceField)
        // var datasource = manager.lookup({ datasourceName: dataSourceName })
        var record = datasource.getCurrentRecord()
        var paramValue = record.get(fieldName)
        this._pushParamField(field, paramValue)
        break
      default:
        this._pushOldField(field)
    }
  }

  /*添加一个原始字段到this，不需要转换*/
  _pushOldField(field: string) {
    this.itemsConverted.push($.extend({}, field))
  }

  /*添加一个命名参数字段到this*/
  _pushParamField(field: string, paramValue: string) {
    let paramName = this._genParamName(this._getDestField(field))
    let item = $.extend({}, field)
    item[this.mapping.sourceField] = ':' + paramName
    this.itemsConverted.push(item)
    this.paramMap[paramName] = paramValue
  }

  /* 生成参数名称*/
  _genParamName(fieldName: string) {
    let name = fieldName.replace(/[.]/g, '_')
    return name + '_' + uuid.generate()
  }

  toItemsConverted() {
    return this.itemsConverted
  }

  toParamMap(paramMap: null | string) {
    if (paramMap == null) return this.paramMap
    else return $.extend(paramMap, this.paramMap)
  }

  _getDestField(item: string) {
    return item[this.mapping.destField]
  }

  _getSourceField(item: string) {
    return item[this.mapping.sourceField]
  }

  _setSourceField(item: any[], newSourceField: string[]) {
    item[this.mapping.sourceField] = newSourceField
  }

  _getSourcetype(item: string[]) {
    return item[this.mapping.sourcetype]
  }
}

export { getInstance }
