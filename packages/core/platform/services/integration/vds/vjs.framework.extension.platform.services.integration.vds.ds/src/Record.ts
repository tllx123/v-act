/**
 * 数据源记录定义
 * @constructor
 * @alias Record
 * @catalog 数据源/数据源定义
 */
var Record = function (record) {
  this.record = record
}

Record.prototype = {
  _get: function () {
    return this.record
  },

  /**
   * 获取字段值
   * @param {String} fieldCode 字段编号
   * @returns Any
   * @example
   * var ds = vds.ds.lookup("ds1");
   * var record = ds.getCurrentRecord();
   * var val = record.get("fieldCode1");
   */
  get: function (fieldCode) {
    return this.record.get(fieldCode)
  },
  /**
   * 设置字段值
   * @param {String} fieldCode 字段编号
   * @param {Any} value 字段值
   * @example
   * var ds = vds.ds.lookup("ds1");
   * var record = ds.getCurrentRecord();
   * record.set("fieldCode1",120);
   */
  set: function (fieldCode, value) {
    return this.record.set(fieldCode, value)
  },

  /**
   * 批量设置字段值
   * @param {Object} data 字段值
   * @example
   * var ds = vds.ds.lookup("ds1");
   * var record = ds.getCurrentRecord();
   * record.setData({
   *      "fieldCode1":120,
   *      "fieldCode2":true
   * });
   */
  setData: function (data) {
    return this.record.setDatas(data)
  },

  /**
   * 将数据源记录转换成原生Object
   * @returns Object
   * @example
   * var ds = vds.ds.lookup("ds1");
   * var record = ds.getCurrentRecord();
   * var map = record.toMap();
   */
  toMap: function () {
    return this.record.toMap()
  },

  /**
   * 获取主键值
   * @returns String
   * @example
   * var ds = vds.ds.lookup("ds1");
   * var record = ds.getCurrentRecord();
   * var id = record.getSysId();
   */
  getSysId: function () {
    return this.record.getSysId()
  },

  /**
   * 数据源记录克隆
   * @returns {@link Record}
   * @example
   * var ds = vds.ds.lookup("ds1");
   * var record = ds.getCurrentRecord();
   * var rd = record.clone();
   */
  clone: function () {
    return new Record(this.record.clone())
  },

  /**
   * 获取已变化的字段值
   * @returns Object
   * @example
   * var ds = vds.ds.lookup("ds1");
   * var record = ds.getCurrentRecord();
   * var diff = record.getDiff();
   */
  getDiff: function () {
    return this.record.getDiff()
  }
}

export default Record
