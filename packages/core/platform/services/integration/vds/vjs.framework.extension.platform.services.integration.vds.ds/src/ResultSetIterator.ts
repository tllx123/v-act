import Record from './Record'

/**
 * 结果集迭代器
 * @constructor
 * @alias ResultSetIterator
 * @catalog 数据源/数据源定义
 */
class ResultSetIterator {
  iterator: any
  constructor(iterator: any) {
    this.iterator = iterator
  }

  /**
   * 当前游标后是否有记录
   * @returns Boolean
   * @example
   * var ds = vds.ds.lookup("ds1");
   * var resultSet = ds.getAllRecords();
   * var iterator = resultSet.iterator();
   * var hasNext = iterator.hasNext();
   */
  hasNext() {
    return this.iterator.hasNext()
  }
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
  next() {
    return new Record(this.iterator.next())
  }
}

export default ResultSetIterator
