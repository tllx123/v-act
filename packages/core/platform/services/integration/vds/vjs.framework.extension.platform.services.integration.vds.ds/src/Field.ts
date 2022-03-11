/**
 * 字段定义
 * @constructor
 * @alias Field
 * @catalog 数据源/数据源定义
 */
function Field(field) {
  this.field = field
}

Field.prototype = {
  /**
   * 获取编号
   * @returns {String}
   * @example
   * var ds = vds.ds.lookup("ds1");
   * var metadata = ds.getMetadata();
   * var field = metadata.getField("fieldCode1");
   * var code = field.getCode();
   */
  getCode: function () {
    return this.field.getCode()
  },

  /**
   * 获取名称
   * @returns String
   * @example
   * var ds = vds.ds.lookup("ds1");
   * var metadata = ds.getMetadata();
   * var field = metadata.getField("fieldCode1");
   * var name = field.getName();
   */
  getName: function () {
    return this.field.getName()
  },
  /**
   * 获取默认值
   * @returns Any
   * @example
   * var ds = vds.ds.lookup("ds1");
   * var metadata = ds.getMetadata();
   * var field = metadata.getField("fieldCode1");
   * var defaultVal = field.getDefaultValue();
   */
  getDefaultValue: function () {
    return this.field.getDefaultValue()
  },

  /**
   * 获取字段长度
   * @returns Integer
   * @example
   * var ds = vds.ds.lookup("ds1");
   * var metadata = ds.getMetadata();
   * var field = metadata.getField("fieldCode1");
   * var len = field.getLength();
   */
  getLength: function () {
    return this.field.getLength()
  },

  /**
   * 获取类型
   * @returns String
   * @example
   * var ds = vds.ds.lookup("ds1");
   * var metadata = ds.getMetadata();
   * var field = metadata.getField("fieldCode1");
   * var type = field.getType();
   */
  getType: function () {
    return this.field.getType()
  }
}

export default Field
