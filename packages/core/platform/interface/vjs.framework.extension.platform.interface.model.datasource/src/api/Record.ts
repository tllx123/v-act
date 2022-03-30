import { Adapter as dataAdapter } from '@v-act/vjs.framework.extension.platform.data.adapter'
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

export default class Record {
  constructor(
    public metadata: any,
    public orginalData: any,
    public changedData?: any,
    public __recordData__?: any
  ) {
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

    if (null == orginalData) {
      this.initDefaultValue()
    }

    return this
  }

  initDefaultValue() {
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

  initModule(sb: any) {}

  _getOrginalFieldCode(fieldCode: any) {
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

  _processFieldCode(fieldStr: string) {
    let index = fieldStr.indexOf('.')
    return index != -1 ? fieldStr.substring(index + 1) : fieldStr
  }

  get(fieldname: string) {
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

  _getIngoreCase(data: any, field: string) {
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

  set(fieldname: string, value: any) {
    if (typeof fieldname != 'string') {
      throw new Error('[Record.set]传入的字段名必须为字符串!')
    }
    let metadata = this.getMetadata()
    let fieldCode
    let field: any
    if (metadata) {
      fieldname = this._processFieldCode(fieldname)
      field = metadata.getFieldByCode(fieldname)
      if (!field) return
      fieldCode = field.getCode()
    } else {
      fieldCode = fieldname
    }
    let originalFieldValue = this.__recordData__[fieldCode]
    if (dataAdapter) {
      value = dataAdapter.adapt({
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

  getSysId() {
    let oriIdField = this._getOrginalFieldCode('id')
    let sId
    if (this.changedData && this.changedData.hasOwnProperty(oriIdField)) {
      sId = this.changedData[oriIdField]
    } else if (this.__recordData__.hasOwnProperty(oriIdField)) {
      sId = this.__recordData__[oriIdField]
    }
    return sId
  }

  getChangedData() {
    return this.changedData
  }

  setChangedData(changed: any) {
    this.changedData = changed
  }

  getDiff() {
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

  getOriginalData() {
    return this.__recordData__
  }

  _setOriginalData(data: any) {
    this.__recordData__ = data
  }

  setDatas(data: any) {
    if (data) {
      for (let attr in data) {
        this.set(attr, data[attr])
      }
    }
  }

  getMetadata() {
    return this.metadata
  }

  toMap(genAll?: boolean) {
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

  clone() {
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

  isChanged() {
    if (this.changedData) {
      return true
    }
    return false
  }
}
