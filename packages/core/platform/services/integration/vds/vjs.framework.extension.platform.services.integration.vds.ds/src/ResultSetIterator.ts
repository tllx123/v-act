define('./ResultSetIterator', function (require, exports, module) {
  var Record

  /**
   * 结果集迭代器
   * @constructor
   * @alias ResultSetIterator
   * @catalog 数据源/数据源定义
   */
  function ResultSetIterator(iterator) {
    this.iterator = iterator
  }

  ResultSetIterator.prototype = {
    initModule: function () {
      Record = require('vjs/framework/extension/platform/services/integration/vds/ds/Record')
    },

    /**
     * 当前游标后是否有记录
     * @returns Boolean
     * @example
     * var ds = vds.ds.lookup("ds1");
     * var resultSet = ds.getAllRecords();
     * var iterator = resultSet.iterator();
     * var hasNext = iterator.hasNext();
     */
    hasNext: function () {
      return this.iterator.hasNext()
    },
    /**
     * 下一条记录
     * @returns {@link Record}
     * @example
     * var ds = vds.ds.lookup("ds1");
     * var resultSet = ds.getAllRecords();
     * var iterator = resultSet.iterator();
     * while(iterator.hasNext()){
     * 	var record = iterator.next();
     * 	var val = record.get("fieldCode1");
     * }
     */
    next: function () {
      return new Record(this.iterator.next())
    }
  }

  module.exports = ResultSetIterator
})
