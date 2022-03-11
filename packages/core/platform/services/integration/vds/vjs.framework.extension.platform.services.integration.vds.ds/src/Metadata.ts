import Field from './Field'

/**
 * 元数据定义
 * @constructor
 * @alias Metadata
 * @catalog 数据源/数据源定义
 */
function Metadata(metadata) {
  this.metadata = metadata
}

Metadata.prototype = {
  /**
   * 获取数据源编码
   * @returns String
   * @example
   * var ds = vds.ds.lookup("ds1");
   * var metadata = ds.getMetadata();
   * var code = metadata.getCode();
   */
  getCode: function () {
    return this.metadata.getDatasourceName()
  },

  /**
   * 获取字段定义
   * @param {String} code 字段编号
   * @returns {@link Field}
   * @example
   * var ds = vds.ds.lookup("ds1");
   * var metadata = ds.getMetadata();
   * var field = metadata.getField("fieldCode1");
   */
  getField: function (code) {
    var field = this.metadata.getFieldByCode(code)
    return field == null ? null : new Field(field)
  },

  /**
   * 获取所有字段定义
   * @returns Array<{@link Field}>
   * @example
   * var ds = vds.ds.lookup("ds1");
   * var metadata = ds.getMetadata();
   * var fields = metadata.getFields();
   */
  getFields: function () {
    var rs = []
    var fields = this.metadata.getFields()
    if (fields && fields.length > 0) {
      for (var i = 0, l = fields.length; i < l; i++) {
        rs.push(new Field(fields[i]))
      }
    }
    return rs
  },

  /**
   * 是否包含自定义编号的字段
   * @returns {Boolean}
   * @example
   * var ds = vds.ds.lookup("ds1");
   * var metadata = ds.getMetadata();
   * var contains = metadata.contains("fieldCode1");
   */
  contains: function (code) {
    return this.metadata.isContainField(code)
  }
}

export default Metadata
