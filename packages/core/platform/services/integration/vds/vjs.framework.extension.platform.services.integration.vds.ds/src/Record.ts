/**
 * 数据源记录定义
 * @constructor
 * @alias Record
 * @catalog 数据源/数据源定义
 */
class Record {
  record: any
  constructor(record: any) {
    this.record = record
  }

  _get() {
    return this.record
  }

  /**
   * 获取字段值
   * @param {String} fieldCode 字段编号
   * @returns Any
   * @example
   * var ds = vds.ds.lookup("ds1");
   * var record = ds.getCurrentRecord();
   * var val = record.get("fieldCode1");
   */
  get(fieldCode: string) {
    return this.record.get(fieldCode)
  }
  /**
   * 设置字段值
   * @param {String} fieldCode 字段编号
   * @param {Any} value 字段值
   * @example
   * var ds = vds.ds.lookup("ds1");
   * var record = ds.getCurrentRecord();
   * record.set("fieldCode1",120);
   */
  set(fieldCode: string, value: string) {
    return this.record.set(fieldCode, value)
  }

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
  setData(data: any) {
    return this.record.setDatas(data)
  }

  /**
   * 将数据源记录转换成原生Object
   * @returns Object
   * @example
   * var ds = vds.ds.lookup("ds1");
   * var record = ds.getCurrentRecord();
   * var map = record.toMap();
   */
  toMap() {
    return this.record.toMap()
  }

  /**
   * 获取主键值
   * @returns String
   * @example
   * var ds = vds.ds.lookup("ds1");
   * var record = ds.getCurrentRecord();
   * var id = record.getSysId();
   */
  getSysId() {
    return this.record.getSysId()
  }

  /**
   * 数据源记录克隆
   * @returns {@link Record}
   * @example
   * var ds = vds.ds.lookup("ds1");
   * var record = ds.getCurrentRecord();
   * var rd = record.clone();
   */
  clone() {
    return new Record(this.record.clone())
  }

  /**
   * 获取已变化的字段值
   * @returns Object
   * @example
   * var ds = vds.ds.lookup("ds1");
   * var record = ds.getCurrentRecord();
   * var diff = record.getDiff();
   */
  getDiff() {
    return this.record.getDiff()
  }
}

export default Record
