import Metadata from './Metadata'
import Record from './Record'
import ResultSetIterator from './ResultSetIterator'

/**
 * 数据源结果集
 * @constructor
 * @alias ResultSet
 * @catalog 数据源/数据源定义
 */
function ResultSet(resultset) {
  this.resultset = resultset
}

ResultSet.prototype = {
  _to: function (record) {
    return !record ? null : new Record(record)
  },
  /**
   * 获取结果集迭代器
   * @returns {@link ResultSetIterator}
   * @example
   * var ds = vds.ds.lookup("ds1");
   * var resultSet = ds.getAllRecords();
   * var iterator = resultSet.interator();
   */
  iterator: function () {
    return new ResultSetIterator(this.resultset.iterator())
  },
  /**
   * 结果集是否为空
   * @returns Boolean
   * @example
   * var ds = vds.ds.lookup("ds1");
   * var resultSet = ds.getAllRecords();
   * var empty = resultSet.isEmpty();
   */
  isEmpty: function () {
    return this.resultset.isEmpty()
  },
  /**
   * 结果集记录数
   * @returns Boolean
   * @example
   * var ds = vds.ds.lookup("ds1");
   * var resultSet = ds.getAllRecords();
   * var size = resultSet.size();
   */
  size: function () {
    return this.resultset.size()
  },
  /**
   * 将结果集转换成原生数组
   * 注意：当记录数多时，此方法会存在性能隐患
   * @returns Array<{@link Record}>
   * @example
   * var ds = vds.ds.lookup("ds1");
   * var resultSet = ds.getAllRecords();
   * var list = resultSet.toArray();
   */
  toArray: function () {
    var list = this.resultset.toArray()
    var rs = []
    for (var i = 0, l = list.length; i < l; i++) {
      rs.push(this._to(list[i]))
    }
    return rs
  },
  /**
   * 获取数据源元数据定义
   * @returns {@link Metadata}
   * @example
   * var ds = vds.ds.lookup("ds1");
   * var resultSet = ds.getAllRecords();
   * var metadata = resultSet.getMetadata();
   */
  getMetadata: function () {
    return new Metadata(this.resultset.getMetadata())
  },
  /**
   * 获取指定下标的记录
   * @param {Integer} i 记录下标
   * @returns {@link Record}
   * @example
   * var ds = vds.ds.lookup("ds1");
   * var resultSet = ds.getAllRecords();
   * var record = resultSet.index(1);
   */
  index: function (i) {
    return this._to(this.resultset.index(i))
  },

  /**
   * 获取第一条记录
   * @returns {@link Record}
   * @example
   * var ds = vds.ds.lookup("ds1");
   * var resultSet = ds.getAllRecords();
   * var record = resultSet.first();
   */
  first: function () {
    return this._to(this.resulset.first())
  },

  /**
   * 获取最后一条记录
   * @returns {@link Record}
   * @example
   * var ds = vds.ds.lookup("ds1");
   * var resultSet = ds.getAllRecords();
   * var record = resultSet.last();
   */
  last: function () {
    return this._to(this.resulset.last())
  },

  /**
   * 遍历结果集
   * @param {Function} fn 迭代函数，入参定义:1、数据源记录 2、记录下标
   * @example
   * var ds = vds.ds.lookup("ds1");
   * var resultSet = ds.getAllRecords();
   * resultSet.iterate(function(record,index){
   * 		var val = record.get("fieldCode1");
   * });
   */
  iterate: function (fn) {
    var func = (function (f, _t) {
      return function (record, index) {
        return f(_t._to(record), index)
      }
    })(fn, this)
    return this.resultset.iterate(func)
  },
  /**
   * 结果集克隆
   * @returns {@link ResultSet}
   * @example
   * var ds = vds.ds.lookup("ds1");
   * var resultSet = ds.getAllRecords();
   * var rs = resultSet.clone();
   */
  clone: function () {
    var newRes = this.resultset.clone()
    return new ResultSet(newRes)
  }
}

export default ResultSet
