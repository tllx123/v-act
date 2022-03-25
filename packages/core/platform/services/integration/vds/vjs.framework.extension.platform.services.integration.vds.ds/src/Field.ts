/**
 * 字段定义
 * @constructor
 * @alias Field
 * @catalog 数据源/数据源定义
 */

class Field {
  field: any
  constructor(field: any) {
    this.field = field
  }

  /**
   * 获取编号
   * @returns {String}
   * @example
   * var ds = vds.ds.lookup("ds1");
   * var metadata = ds.getMetadata();
   * var field = metadata.getField("fieldCode1");
   * var code = field.getCode();
   */
  getCode() {
    return this.field.getCode()
  }

  /**
   * 获取名称
   * @returns String
   * @example
   * var ds = vds.ds.lookup("ds1");
   * var metadata = ds.getMetadata();
   * var field = metadata.getField("fieldCode1");
   * var name = field.getName();
   */
  getName() {
    return this.field.getName()
  }
  /**
   * 获取默认值
   * @returns Any
   * @example
   * var ds = vds.ds.lookup("ds1");
   * var metadata = ds.getMetadata();
   * var field = metadata.getField("fieldCode1");
   * var defaultVal = field.getDefaultValue();
   */
  getDefaultValue() {
    return this.field.getDefaultValue()
  }

  /**
   * 获取字段长度
   * @returns Integer
   * @example
   * var ds = vds.ds.lookup("ds1");
   * var metadata = ds.getMetadata();
   * var field = metadata.getField("fieldCode1");
   * var len = field.getLength();
   */
  getLength() {
    return this.field.getLength()
  }

  /**
   * 获取类型
   * @returns String
   * @example
   * var ds = vds.ds.lookup("ds1");
   * var metadata = ds.getMetadata();
   * var field = metadata.getField("fieldCode1");
   * var type = field.getType();
   */
  getType() {
    return this.field.getType()
  }
}

export default Field
