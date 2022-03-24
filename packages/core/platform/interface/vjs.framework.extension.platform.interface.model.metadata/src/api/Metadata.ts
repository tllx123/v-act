import field from '../api/Field'

interface uppToOrigFldMap {
  [key: string]: field
}

interface model {
  [key: string]: string | field[]
}

export default class Metadata {
  constructor(
    public dataSourceName: string,
    public fields: field[],
    public uppToOrigFldMap?: uppToOrigFldMap,
    public chineseName?: string
  ) {
    return this
  }

  _getUpperToOriginalFieldMap() {
    let rs: uppToOrigFldMap
    if (this.uppToOrigFldMap) {
      rs = this.uppToOrigFldMap
    } else {
      rs = {}
      for (let i = 0, len = this.fields.length; i < len; i++) {
        let field = this.fields[i]
        let code = field.getCode()
        rs[code.toUpperCase()] = field
      }
      this.uppToOrigFldMap = rs
    }
    return rs
  }

  getFieldByCode(fieldCode: string) {
    let map = this._getUpperToOriginalFieldMap()
    return map[fieldCode.toUpperCase()]
  }

  getFields() {
    return this.fields
  }

  getFieldCodes() {
    let codes = []
    for (let i = 0, l = this.fields.length; i < l; i++) {
      codes.push(this.fields[i].getCode())
    }
    return codes
  }

  isContainField(fieldCode: string) {
    if (typeof fieldCode != 'string') {
      throw new Error('[Metadata.isContainField]传入的字段名必须为字符串!')
    }
    let metaField = this.getFieldByCode(fieldCode)
    return !!metaField
  }

  getDatasourceName() {
    return this.dataSourceName
  }

  setDatasourceName(dsName: string) {
    this.dataSourceName = dsName
  }

  setChineseName(chineseName: string) {
    this.chineseName = chineseName
  }

  getChineseName() {
    return this.chineseName
  }

  serialize() {
    let model: model = {}
    model.datasourceName = this.getDatasourceName()
    let fieldCfg: Array<field> = []
    let fields = this.getFields()
    for (let i = 0; i < fields.length; i++) {
      let fieldTemp = new field(fields[i].code, fields[i].name, fields[i].type)

      fieldCfg.push(fieldTemp.serialize())
      // fieldCfg.push(fieldTemp.serialize())
    }
    model.fields = fieldCfg
    return { model: [model] }
  }
}
