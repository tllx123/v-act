import { Log as log } from '@v-act/vjs.framework.extension.util.logutil'

/**
 * @namespace Record
 * @class Record
 * @catalog 前端实体/普通实体/实体记录
 * @desc 记录对象<br/>
 * 无法根据定义类创建记录实例,请使用Datasource.createRecord接口创建<br/>
 * vjs名称：vjs.framework.extension.platform.interface.model.datasource<br/>
 * vjs服务名称：vjs.framework.extension.platform.interface.model.datasource.Record<br/>
 * @author xiedh
 */
function Record(metadata, orginalData) {
  //数据源名称(表名)
  this.metadata = metadata

  //原生记录object
  this.__recordData__ = orginalData

  if (!this.__recordData__) {
    //add by xiedh 2018-04-19  新创建记录时，为每个字段创建null值
    this.__recordData__ = {}
    let fields = this.metadata.getFields()
    for (let i = 0; i < fields.length; i++) {
      let field = fields[i]
      let fieldCode = field.getCode()
      this.__recordData__[fieldCode] = null
    }
  }

  //修改数据
  this.changedData = null

  // 记录标识
  //this._ds_id_ = null;

  // 记录状态
  //this._ds_state_ = null;

  // 如果没有指定orginalData，则证明该Record是新建的，则需要初始化各字段的默认值
  if (undefined == orginalData || null == orginalData) this.initDefaultValue()
}
/**
 * 初始化Record各字段的默认值
 */
Record.prototype.initDefaultValue = function () {
  if (!this.metadata) return
  let datasourceName = this.metadata.getDatasourceName()
  let fields = this.metadata.getFields()
  for (let i = 0; i < fields.length; i++) {
    let field = fields[i]
    let fieldCode = field.getCode()
    let defaultValue = field.getDefaultValue()
    if (typeof defaultValue == 'object') {
      for (let defaultValueField in defaultValue) {
        if (
          undefined != defaultValue[defaultValueField] &&
          null != defaultValue[defaultValueField]
        )
          this.set(defaultValueField, defaultValue[defaultValueField])
      }
    } else {
      if (undefined != defaultValue && null != defaultValue)
        this.set(field.code, defaultValue)
    }
  }
}

Record.prototype.initModule = function (sb) {}

Record.prototype._getOrginalFieldCode = function (fieldCode) {
  let metadata = this.getMetadata()
  if (!metadata) return fieldCode //如果不存在元数据信息，则直接返回：无数据源情况下直接创建Record
  fieldCode = this._processFieldCode(fieldCode)
  let field = metadata.getFieldByCode(fieldCode)
  if (!field) {
    log.warn(
      '[Record._getOrginalFieldCode]获取的字段[' +
        fieldCode +
        ']，在实体[' +
        metadata.getDatasourceName() +
        ']中不存在!'
    )
    return null
  }
  return field.getCode()
}

Record.prototype._processFieldCode = function (fieldStr) {
  let index = fieldStr.indexOf('.')
  return index != -1 ? fieldStr.substring(index + 1) : fieldStr
}

/**
 * 获取字段值
 * @param {String} fieldname 字段编号
 * @return Object
 */
Record.prototype.get = function (fieldname) {
  if (typeof fieldname != 'string') {
    throw new Error('[Record.get]传入的字段名必须为字符串!')
  }
  let fieldCode = this._getOrginalFieldCode(fieldname)
  if (fieldCode == null) {
    return null
  }
  if (this.changedData && this.changedData.hasOwnProperty(fieldCode)) {
    return this.changedData[fieldCode]
  } else {
    return this._getIngoreCase(this.__recordData__, fieldCode)
  }
}

/**
 * @private
 * 获取值忽略大小写
 */
Record.prototype._getIngoreCase = function (data, field) {
  let f = [field, field.toLowerCase(), field.toUpperCase()]
  let index = 0,
    pro
  while (true) {
    pro = f[index]
    if (index == f.length || data.hasOwnProperty(pro)) {
      break
    } else {
      index++
    }
  }
  return data[pro]
}

/**
 * 赋值字段值
 * @param {String} fieldCode 字段编号
 * @param {Object} value 字段值
 * @return {@link Record}
 */
Record.prototype.set = function (fieldname, value, adapteValueCallbackFunc) {
  if (typeof fieldname != 'string') {
    throw new Error('[Record.set]传入的字段名必须为字符串!')
  }
  let metadata = this.getMetadata()
  let fieldCode
  if (metadata) {
    fieldname = this._processFieldCode(fieldname)
    let field = metadata.getFieldByCode(fieldname)
    if (!field) return
    fieldCode = field.getCode()
  } else {
    fieldCode = fieldname
  }
  let originalFieldValue = this.__recordData__[fieldCode]
  if (this.dataAdapter) {
    value = this.dataAdapter.adapt({
      type: field.getType(),
      value: value,
      length: field.getLength(),
      precision: field.getPrecision()
    })
  }
  if (originalFieldValue !== value) {
    if (
      (originalFieldValue == undefined || originalFieldValue == null) &&
      (value == undefined || value == null)
    ) {
      this.__recordData__[fieldCode] = null //设值为null，防止计算时拿到undefined值报错
    }
    if (!this.changedData) {
      this.changedData = {}
    }
    this.changedData[fieldCode] = value
  } else {
    if (this.changedData && this.changedData.hasOwnProperty(fieldCode)) {
      delete this.changedData[fieldCode]
    }
  }
  return this
}

/**
 * 获取id值
 * @return String
 */
Record.prototype.getSysId = function () {
  let oriIdField = this._getOrginalFieldCode('id')
  let sId
  if (this.changedData && this.changedData.hasOwnProperty(oriIdField)) {
    sId = this.changedData[oriIdField]
  } else if (this.__recordData__.hasOwnProperty(oriIdField)) {
    sId = this.__recordData__[oriIdField]
  }
  return sId
}

/**
 * 获取变更的字段值，即该记录中哪些字段被更改过，如果已经经过与数据源进行记录更新，则该结果与数据源中的记录值一致
 * @return Object
 */
Record.prototype.getChangedData = function () {
  return this.changedData
}

Record.prototype.setChangedData = function (changed) {
  this.changedData = changed
}
/**
 * 获取差异字段值，即该记录与数据源中原始记录的差异字段值集合
 * @return Object
 */
Record.prototype.getDiff = function () {
  if (this.changedData) {
    let rs = {}
    for (let f in this.changedData) {
      if (
        this.changedData.hasOwnProperty(f) &&
        this.changedData[f] !== this.__recordData__[f]
      ) {
        rs[f] = this.changedData[f]
      }
    }
    return rs
  }
  return null
}

Record.prototype.getOriginalData = function () {
  return this.__recordData__
}

Record.prototype._setOriginalData = function (data) {
  this.__recordData__ = data
}

/**
 * 批量设置字段值
 * @param {Object} data
 */
Record.prototype.setDatas = function (data) {
  if (data) {
    for (let attr in data) {
      this.set(attr, data[attr])
    }
  }
}

/**
 *数据元数据信息
 * @return {@link Metadata}
 */
Record.prototype.getMetadata = function () {
  return this.metadata
}

/**
 * 返回Record对象的数据map {key1:value1,key2:value2,...,keyn:valuen}
 * @return Object
 */
Record.prototype.toMap = function (genAll) {
  let map = {}
  let metadata = this.getMetadata()
  for (let key in this.__recordData__) {
    if (!metadata || metadata.isContainField(key)) {
      map[key] = this.__recordData__[key]
    }
  }
  if (this.changedData) {
    for (let key in this.changedData) {
      if (!metadata || metadata.isContainField(key)) {
        map[key] = this.changedData[key]
      }
    }
  }
  if (genAll === true) {
    let fields = this.metadata.getFields()
    for (let i = 0; i < fields.length; i++) {
      let field = fields[i]
      let fieldCode = field.getCode()
      if (!map.hasOwnProperty(fieldCode)) {
        map[fieldCode] = null
      }
    }
  }
  return map
}

/**
 * 克隆，返回新的Record对象
 * @return {@link Record}
 */
Record.prototype.clone = function () {
  let cloneRecord = new Record(this.metadata, this.__recordData__)
  let changedData = this.changedData
  if (changedData) {
    let cloneObj = {}
    for (let changedDataField in changedData) {
      cloneObj[changedDataField] = changedData[changedDataField]
    }
    cloneRecord.changedData = cloneObj
  }
  // 构建新的Record对象，并进行赋值
  //cloneRecord.__setState__(state);
  return cloneRecord
}

/**
 * 判断记录是否已经改变
 * @return true表示记录已经变化，false表示记录没变化
 * */
Record.prototype.isChanged = function () {
  if (this.changedData) {
    return true
  }
  return false
}

/**
 * 设置数据适配器
 *
 * @param {Object} adapter 数据适配器
 */
Record.putDataAdapter = function (adapter) {
  Record.prototype.dataAdapter = adapter
}

export default Record
