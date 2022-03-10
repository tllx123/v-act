/**
 * @namespace Metadata
 * @class Metadata
 * @desc 元数据对象,该对象无法直接使用定义类创建实例,请使用{MetadataFactory}创建<br/>
 * vjs名称：vjs.framework.extension.platform.interface.model.metadata<br/>
 * vjs服务名称：vjs.framework.extension.platform.interface.model.metadata.Metadata<br/>
 * @author xiedh
 */
function Metadata(dataSourceName, fields) {
  this.dataSourceName = dataSourceName
  this.fields = fields || []
  //字段编码大写与字段信息配置映射
  this.uppToOrigFldMap = null
}

const _getUpperToOriginalFieldMap = function (metadata) {
  let rs = null
  if (metadata.uppToOrigFldMap) {
    rs = metadata.uppToOrigFldMap
  } else {
    rs = {}
    for (let i = 0, len = metadata.fields.length; i < len; i++) {
      let field = metadata.fields[i]
      let code = field.getCode()
      rs[code.toUpperCase()] = field
    }
    metadata.uppToOrigFldMap = rs
  }
  return rs
}

/**
 * 根据字段code获取字段对象
 * @param {String} fieldCode 字段编码
 * @return {@link Field}
 */
Metadata.prototype.getFieldByCode = function (fieldCode) {
  let map = _getUpperToOriginalFieldMap(this)
  return map[fieldCode.toUpperCase()]
}

/**
 *	获取元数据列名列表
 * @return Array
 */
Metadata.prototype.getFields = function () {
  return this.fields
}
/**
 * 获取元数据列编号集合
 * @return Array
 */
Metadata.prototype.getFieldCodes = function () {
  let codes = []
  for (let i = 0, l = this.fields.length; i < l; i++) {
    codes.push(this.fields[i].getCode())
  }
  return codes
}

/**
 * 判断fieldCode在元数据里是否存在
 * @param {String} fieldCode 字段编码
 * @return Boolean
 */
Metadata.prototype.isContainField = function (fieldCode) {
  if (typeof fieldCode != 'string') {
    throw new Error('[Metadata.isContainField]传入的字段名必须为字符串!')
  }
  let metaField = this.getFieldByCode(fieldCode)
  return !!metaField
}

/**
 *获取数据源名称
 * @return String
 */
Metadata.prototype.getDatasourceName = function () {
  return this.dataSourceName
}

/**
 *设置数据源名称
 * @param {String} dsName 数据源名称
 */
Metadata.prototype.setDatasourceName = function (dsName) {
  this.dataSourceName = dsName
}

/**
 *设置中文名称
 * @param {String} chineseName 数据源名称
 */
Metadata.prototype.setChineseName = function (chineseName) {
  this.chineseName = chineseName
}

/**
 *获取中文名称
 * @return String
 */
Metadata.prototype.getChineseName = function () {
  return this.chineseName
}

/**
 *序列化
 * @return Object 格式
 * @example
 * 返回格式
 * {
 * 	"model":[{
 * 		"object":数据源名称,
 * 		"fields":字段配置
 *  }]
 * }
 */
Metadata.prototype.serialize = function () {
  let model = {}
  model.datasourceName = this.getDatasourceName()
  let fieldCfg = []
  let fields = this.getFields()
  for (let i = 0, field; (field = fields[i]); i++) {
    fieldCfg.push(field.serialize())
  }
  model.fields = fieldCfg
  return { model: [model] }
}

export default Metadata
