export class Metadata {
  public dataSourceName: string
  public fields: string
  public uppToOrigFldMap: string = null
  public chineseName: string
  constructor(dataSourceName: string, fields: string) {}

  contains(fieldCode: string): boolean {
    if (typeof fieldCode != 'string') {
      throw new Error('[Metadata.isContainField]传入的字段名必须为字符串!')
    }
    var metaField = this.getField(fieldCode)
    return !!metaField
  }
  getCode() {
    return this.dataSourceName
  }
  getField(fieldCode) {
    var map = _getUpperToOriginalFieldMap(this)
    return map[fieldCode.toUpperCase()]
  }
  getFields() {
    return this.fields
  }
}

const _getUpperToOriginalFieldMap = function (metadata) {
  var rs = null
  if (metadata.uppToOrigFldMap) {
    rs = metadata.uppToOrigFldMap
  } else {
    rs = {}
    for (var i = 0, len = metadata.fields.length; i < len; i++) {
      var field = metadata.fields[i]
      var code = field.getCode()
      rs[code.toUpperCase()] = field
    }
    metadata.uppToOrigFldMap = rs
  }
  return rs
}
