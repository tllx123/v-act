/**
 * 数据源管理模块
 * @desc 提供数据层相关接口，使用前请先import：vds.import("vds.ds.*")
 * @namespace vds/ds
 * @module ds
 * @catalog 数据源/数据源管理
 * @example
 * vds.import("vds.ds.*");
 * var ds = vds.ds.lookup("ds1");
 * var record = ds.createRecord();
 */
window.vds = window.vds || {}
window.vds.ds = window.vds.ds || {}

var ds = window.vds.ds

exports = ds

var dsManager,
  Datasource,
  dsFactory,
  Where,
  dbUtil,
  uuid,
  Record,
  ResultSet,
  WhereRestrict,
  Criteria,
  NewCriteria
var engine, ExpressionContext, Metadata

export function initModule(sBox) {
  dsManager = sBox.getService(
    'vjs.framework.extension.platform.services.model.manager.datasource.DatasourceManager'
  )
  dsFactory = sBox.getService(
    'vjs.framework.extension.platform.interface.model.datasource.DatasourceFactory'
  )
  dbUtil = sBox.getService(
    'vjs.framework.extension.platform.services.domain.datasource.DatasourcePusher'
  )
  uuid = sBox.getService('vjs.framework.extension.util.UUID')
  Datasource = require('vjs/framework/extension/platform/services/integration/vds/ds/Datasource')
  Record = require('vjs/framework/extension/platform/services/integration/vds/ds/Record')
  Metadata = require('vjs/framework/extension/platform/services/integration/vds/ds/Metadata')
  ResultSet = require('vjs/framework/extension/platform/services/integration/vds/ds/ResultSet')
  Criteria = sBox.getService(
    'vjs.framework.extension.platform.interface.model.datasource.Criteria'
  )
  Where = require('vjs/framework/extension/platform/services/integration/vds/ds/Where')
  NewCriteria = require('vjs/framework/extension/platform/services/integration/vds/ds/Criteria')
  WhereRestrict = sBox.getService(
    'vjs.framework.extension.platform.services.where.restrict.WhereRestrict'
  )
  engine = sBox.getService(
    'vjs.framework.extension.platform.services.engine.expression.ExpressionEngine'
  )
  ExpressionContext = sBox.getService(
    'vjs.framework.extension.platform.services.engine.expression.ExpressionContext'
  )
}

/**
 * 枚举项
 *
 * */
exports.enums = {
  IdField: true
}
/**
 * 条件类型
 * @enum
 * */
exports.WhereType = {
  Query: 'Query',
  Table: 'Table'
}

/**
 * 查找数据源
 * @desc 根据数据源编号查找数据源实例，如果数据源不存在，则返回null
 * @param {String} code 数据源编号
 * @returns {@link Datasource} 数据源实例
 * @example
 * var ds = vds.ds.lookup("ds1");
 */
export function lookup(code) {
  var ds = dsManager.lookup({
    datasourceName: code
  })
  if (ds) {
    return new Datasource(ds)
  }
  return null
}

/**
 * 注册数据源实例
 * @desc 注册现有的数据源实例；注册时，当前上下文中如果不存在该名称的数据源，则返回true，否则返回false。
 * @param {String} code 数据源编码
 * @param {Datasource} datasource 数据源实例
 * @returns Boolean
 * @example
 * vds.ds.register("ds1",datasource);//true:注册成功,false:注册失败
 */
export function register(code, datasource) {
  return dsManager.register({
    datasourceName: code,
    datasource: datasource._get()
  })
}

/**
 * 销毁现有的数据源实例；如果当前上下文中不存在该数据源实例，则返回false，否则返回true
 * @param {String} code 数据源编号
 * @returns Boolean
 * @example
 * vds.ds.unRegister("ds1");//true:销毁成功,false:销毁失败
 */
export function unRegister(code) {
  return dsManager.unRegister({
    datasourceName: code
  })
}

/**
 * 判断当前上下文中是否存在指定的数据源，存在返回true，否则返回false。
 * @param {String} code 数据源编码
 * @returns Boolean
 * @example
 * vds.ds.exists("ds1");//true:存在,false:不存在
 */
export function exists(code) {
  return dsManager.exists({
    datasourceName: code
  })
}

/**
	 * 提供mock数据源接口，方便开发人员进行测试验证；<br>
	 * 接口内部逻辑会将根据第一条数据源数据窗体数据源元信息，根据数据中属性值类型确定字段类型；<br>
	 * 其中数据源数据中必须包含id字段，且保证id字段值唯一（即id字段为主键）。<br>
	 * @param {Object} datas 数据源数据
	 * @returns {@link Datasource}
	 * @example
	 * var datasource = vds.ds.mock([{
	"id":"4028809a78b4d1110179405f04e017cd",
	"name":"张三",
	"sex":"male",
	"age":35
},{
	"id":"4028809a78b4d2110109405f04e018ae",
	"name":"李四",
	"sex":"female",
	"age":26
}]);
vds.ds.register("persion",datasource);
	 */
export function mock(datas) {
  if (dsFactory.isDatasource(datas)) {
    return new Datasource(datas)
  }
  return new Datasource(dsFactory.createFromDatas(datas))
}

/**
 * 是否为数据源实例
 * @param {Object} ds 判断对象
 * @returns Boolean
 * @example
 * vds.ds.isDatasource(11)//false
 * vds.ds.isDatasource(vds.ds.lookup("ds1"));//true
 */
export function isDatasource(ds) {
  if (ds && ds instanceof Datasource) {
    return true
  }
  return false
}

/**
 * @ignore
 */
export function _genDatasourceByDs(ds) {
  if (ds) {
    return new Datasource(ds)
  }
  return ds
}
/**
 * 平台内部封装数据对象
 * @ignore
 * */
export function _genRecord(record) {
  if (record) {
    return new Record(record)
  }
  return record
}
/**
 * 平台内部封装数据集对象
 * @ignore
 * */
export function _genResultSet(resultset) {
  if (resultset) {
    return new ResultSet(resultset)
  }
  return resultset
}
/**
 * 实体间数据复制
 * @param {Datasource} sourceEntity 来源数据源实例
 * @param {Datasource} destEntity 目标数据源实例
 * @param {Array<Object>} fieldMappings 字段映射
 * {
 *  "sourceValue": {String} 来源值，如果type=field，则是来源数据源的字段编码，如果type=expression，则是表达式
 *  "destField": {String} 目标字段编码
 *  "type":{String} 值类型，枚举：field/expression
 * }
 * @param {Object} params 其他参数（可选）
 * {
 *  "context": {RuleContext} 规则上下文（可选）
 *  "dataFileType":{String} 来源数据过滤类型，枚举：modify:修改过的(新增、修改、删除的数据)，all:(默认)（可选）
 * }
 * */
export function copy(sourceEntity, destEntity, fieldMappings, params) {
  if (
    !exports.isDatasource(sourceEntity) ||
    !exports.isDatasource(destEntity) ||
    !(fieldMappings instanceof Array) ||
    fieldMappings.length < 1
  ) {
    return destEntity
  }
  var sourceDs = sourceEntity._get()
  var destDs = destEntity._get()
  var mappings = []
  for (var i = 0, len = fieldMappings.length; i < len; i++) {
    var fieldMapping = fieldMappings[i]
    mappings.push({
      fieldValue: fieldMapping['sourceValue'],
      fieldValueType: fieldMapping.type == 'field' ? 'field' : 'expression',
      paramEntityField: fieldMapping['destField']
    })
  }
  var routeContext =
    params && params.ruleContext && params.ruleContext.ruleCtx
      ? params.ruleContext.ruleCtx.getRouteContext()
      : null
  var dataFileType =
    params && params.dataFileType == 'modify' ? 'modify' : 'all'
  dbUtil.copyBetweenEntities({
    sourceEntity: sourceDs,
    destEntity: destDs,
    valuesMapping: mappings,
    routeContext: routeContext,
    dataFilterType: dataFileType
  })
  return destEntity
}

/**
 * json对象反序列化为数据源实例
 * @param {Array<Object>} fields
 * [{
 *  "code":{String} 字段编码
 *  "type":{String} 字段类型
 *  "name":{String} 字段名称（可选）
 *  "length":{Integer} 数据长度 type=char或text时有效（可选）
 *  "precision":{Integer} 小数精度（可选）
 *  "defaultValue":{Any} 默认值（可选）
 * }]
 * @param {Object} params 其他参数（可选）
 * {
 *  "dsCode":{String} 数据源编码
 *  "datas":{Array<Object>} 数据源数据
 * }
 * @returns {Datasouce} 数据源实例
 * */
export function unSerialize(fields, params) {
  if (fields instanceof Array) {
    var datas = params && params.datas instanceof Array ? params.datas : []
    var dsCode =
      params && params.dsCode ? params.dsCode : 'freeDB_' + uuid.generate()
    var json = {
      datas: {
        recordCount: datas.length,
        values: datas
      },
      metadata: {
        model: [
          {
            datasource: dsCode,
            fields: fields
          }
        ]
      }
    }
    var ds = dsFactory.unSerialize(json)
    return new Datasource(ds)
  }
}

/**
 * 创建条件对象（适用于后台数据查询）
 * @param {Object} params 条件信息（可选）
 * {
 *  "type":{WhereType} 条件类型,枚举：vds.ds.WhereType.Table(表)，vds.ds.WhereType.Query(查询)， 默认：vds.ds.WhereType.Table（可选）
 *  "methodContext": {MethodContext} methodContext 方法上下文
 * }
 * @returns {Where}
 * @example
 * var where = vds.ds.createWhere({
 *  "type": vds.ds.WhereType.Query,
 *  "methodContext": ruleContext.getMethodContext()
 * });
 * */
export function createWhere(params) {
  if (!params) {
    return WhereRestrict.init()
  }
  var newParams = {
    fetchMode: params.type == vds.ds.WhereType['Query'] ? 'custom' : 'table',
    routeContext:
      params.methodContext && params.methodContext._getRouteContext()
  }
  var where = WhereRestrict.init(newParams)
  return new Where(where)
}
/**
 * 创建条件对象（适用于前台数据源查询）
 * @returns {@link Criteria}
 * @example
 * var criteria = vds.ds.createCriteria();
 * */
export function createCriteria() {
  var criteria = new Criteria()
  return criteria
}

/**
 * 合并类型
 * */
exports.MergeType = {
  /**
   * 加载
   * */
  Load: 'loadRecord',
  /**
   * 更新
   * */
  Update: 'updateRecord',
  /**
   * 新增或更新
   * */
  InsertOrUpdate: 'insertOrUpdateBySameId'
}

/**
 *
 * 操作类型：新增或更新 或 空（"insertOrUpdateBySameId" || ""）<br>
 * 1. 如果来源记录中包含id，则根据id更新目标实体的记录，匹配不上id的记录则新增<br>
 * 2. 新增时，如果来源记录包含id，则把id也新增过去，否则创建一个新的id<br>
 *
 * 操作类型：更新（"updateRecord"）<br>
 * 1. 忽略来源记录中的id字段<br>
 * 2. 不管isClearDatas传什么，强制设置为false（不清空目标实体）<br>
 * 2. 取来源记录中的第一条记录去更新目标实体的当前记录<br>
 * 3. 如果目标实体没有当前记录，则更新其第一条记录<br>
 * 3. 如果目标实体没有任何记录，则不作任何动作<br>
 *
 * 操作类型：加载数据（"loadRecord"）<br>
 * 1. 不管isClearDatas传什么，强制设置为true<br>
 * 2. 把来源记录新增到目标实体中<br>
 * @param {@link Datasource} targetDs 目标实体
 * @param {Array<Object>} records 需要新增或更新到目标实体的记录
 * @param {Array<Object>} mappings 目标数据源与来源记录的字段映射关系
 * {
 *  "code" {String} 目标字段编码
 *  "type" {String} 值类型
 *  "value" {String} 值
 * }
 * @param {@link ds.MergeType} mergeType 合并类型
 * @param {@link MethodContext} methodContext 方法上下文
 * @param {Object} params 其他参数（可选）
 * {
 *  isClear {Boolean} 是否清空目标实体数据，当mergeType = MergeType.InsertOrUpdate有效, 默认false（可选）
 * }
 */
export function merge(
  targetDs,
  records,
  mappings,
  mergeType,
  methodContext,
  params
) {
  var routeContext = methodContext && methodContext._getRouteContext()
  // 如果目标不是一个数据源对象
  if (!targetDs)
    throw vds.exception.newBusinessException('目标数据源不存在，请检查')
  var destEntity = targetDs._get()
  var isClearDatas = params && params.isClear === true
  if (mergeType == 'updateRecord' && isClearDatas == true) isClearDatas = false

  if (mergeType == 'loadRecord' && isClearDatas == false) isClearDatas = true

  if (isClearDatas) {
    destEntity.clear()
  }
  var extraParams = params && params.extraParams //未明参数
  var isNotFieldEntity = !extraParams || extraParams.sourceType != 'fieldEntity'
  if (
    undefined != records &&
    null != records &&
    typeof records.toArray == 'function'
  ) {
    records = records.toArray()
  }
  if (
    !records ||
    (vds.object.isArray(records) && records.length < 1) ||
    !mappings ||
    (vds.object.isArray(mappings) && mappings.length < 1)
  ) {
    return
  }

  var updateRecords = []
  var insertRecords = []
  var epImpInfo = extraParams ? extraParams.epImpInfo : {}
  for (var i = 0; i < records.length; i++) {
    var record = records[i]
    var oldRecord = null
    var newRecord = null

    var hasId = false
    var tmpObj = {}
    for (var index = 0; index < mappings.length; index++) {
      // 来源值类型,returnValue:返回值，expression:表达式
      var srcValueType = mappings[index]['type']
      var srcValue = mappings[index]['value']
      // 前台目标实体字段
      var destField = mappings[index]['code']
      // srcField = jsTool.getFieldName(srcField);
      var value
      if (!isNotFieldEntity) {
        if (srcValueType == 'expression') {
          var context = new ExpressionContext()
          context.setRouteContext(routeContext)
          value = engine.execute({
            expression: srcValue,
            context: context
          })
        } else if (epImpInfo.hasOwnProperty(srcValue)) {
          value = epImpInfo[srcValue]
        } else if (
          extraParams &&
          extraParams.returnDatas &&
          extraParams.returnDatas.hasOwnProperty(srcValue)
        ) {
          value = extraParams.returnDatas[srcValue]
        }
      } else if (srcValue.indexOf('#') != -1) {
        value = epImpInfo[srcValue]
      } else {
        value = _getValueByMapping(record, srcValueType, srcValue, routeContext)
      }
      if (destField.indexOf('.') != -1) {
        var destFieldArray = destField.split('.')
        destField = destFieldArray[destFieldArray.length - 1]
      }

      tmpObj[destField] = value
      if (destField.toLocaleLowerCase() == 'id') {
        hasId = true
        if (value != null && value != '') {
          oldRecord = destEntity.getRecordById(value)
        }
      }
    }

    // 为更新当前记录时只取第一个返回值
    if (mergeType == 'updateRecord') {
      // 操作类型为更新时，如果目标实体没有当前行，则取其第一行
      oldRecords = []
      oldRecords = destEntity.getSelectedRecords().toArray()
      if (oldRecords.length < 1)
        if (destEntity.getAllRecords().toArray().length > 0)
          oldRecords.push(destEntity.getRecordByIndex(0))
      // 如果操作类型为更新，并且获取不到目标实体的当前选中记录或第一条记录，则跳出
      if (oldRecords.length < 1) break
      // 把新记录的值赋值到旧记录中，id不会赋值过去
      for (var j = 0; j < oldRecords.length; j++) {
        if (undefined == oldRecords[j] || null == oldRecords[j]) continue
        for (proName in tmpObj) {
          if (proName.toLocaleLowerCase() != 'id')
            oldRecords[j].set(proName, tmpObj[proName])
        }
        updateRecords.push(oldRecords[j])
      }
    } else {
      var isOldRecordDeleted = false
      if (undefined != oldRecord && null != oldRecord) {
        isOldRecordDeleted = destEntity.isDeletedRecord({
          record: oldRecord
        })
      }
      if (oldRecord != null && isOldRecordDeleted) {
        // 如果id匹配的记录为删除状态，则报错。
        throw vds.exception.newBusinessException(
          '返回实体不能更新已经删除的记录!'
        )
      }
      // 如果获取不到目标实体的记录，则新增
      if (oldRecord == null) newRecord = destEntity.createRecord()
      for (proName in tmpObj) {
        if (oldRecord == null) newRecord.set(proName, tmpObj[proName])
        else if (proName.toLocaleLowerCase() != 'id')
          oldRecord.set(proName, tmpObj[proName])
      }
      if (oldRecord == null) insertRecords.push(newRecord)
      else updateRecords.push(oldRecord)
    }

    // 如果操作类型为更新，则只更新一条记录，所以在处理完第一条记录后跳出循环
    if (mergeType == 'updateRecord') break
  }

  if (updateRecords != null && updateRecords.length > 0) {
    destEntity.updateRecords({
      records: updateRecords
    })
  }

  if (insertRecords != null && insertRecords.length > 0) {
    if (mergeType == 'loadRecord') {
      var datas = []
      for (var i = 0; i < insertRecords.length; i++) {
        datas.push(insertRecords[i].toMap())
      }
      destEntity.load({
        datas: datas,
        isAppend: false
      })
    } else {
      destEntity.insertRecords({
        records: insertRecords
      })
    }
  }
}

var _getValueByMapping = function (
  record,
  srcColumnType,
  srcColumn,
  routeContext
) {
  // 来源字段类型,returnValue:返回值，expression:表达式
  var value = null
  // srcColumnType为空时应该是旧数据，兼容处理下
  if (srcColumnType == 'expression') {
    var context = new ExpressionContext()
    context.setRecords([record])
    context.setRouteContext(routeContext)
    value = engine.execute({
      expression: srcColumn,
      context: context
    })
  } else {
    value = record.get(srcColumn)
  }
  if (value == undefined) {
    value = null
  }
  return value
}
/**
 * 平台内部封装元数据
 * @ignore
 * */
export function _genMetadata(metadata) {
  return new Metadata(metadata)
}

module.exports = exports
