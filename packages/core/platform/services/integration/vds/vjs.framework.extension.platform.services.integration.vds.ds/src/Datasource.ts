var Record, arrayUtil, Metadata, ResultSet

/**
 * 数据源定义
 * @constructor
 * @alias Datasource
 * @catalog 数据源/数据源定义
 */
var Datasource = function (ds) {
  this.ds = ds
}

Datasource.prototype = {
  initModule: function (sb) {
    Record = require('vjs/framework/extension/platform/services/integration/vds/ds/Record')
    Metadata = require('vjs/framework/extension/platform/services/integration/vds/ds/Metadata')
    ResultSet = require('vjs/framework/extension/platform/services/integration/vds/ds/ResultSet')
    arrayUtil = sb.getService('vjs.framework.extension.util.ArrayUtil')
  },

  _toRe: function (record) {
    if (arrayUtil.isArray(record)) {
      var res = []
      for (var i = 0, l = record.length; i < l; i++) {
        if (record[i]._get) res.push(record[i]._get())
        else res.push(record[i])
      }
      return res
    } else {
      return record._get()
    }
  },

  _get: function () {
    return this.ds
  },

  /**
   * 记录位置枚举
   * @enum {String}
   * @example
   * var ds = vds.ds.lookup("ds1");
   * ds.insertRecords([ds.createRecord()],ds.Position.Before);
   */
  Position: {
    /**当前记录前*/
    Before: 'Before',
    /**当前记录后*/
    After: 'After',
    /**最顶端*/
    Top: 'Top',
    /**最底端*/
    Bottom: 'Bottom'
  },

  /**
   * 数据源事件枚举
   * @ignore
   * @enum {String}
   */
  Event: {
    /**新增后事件*/
    Insert: 'Insert',
    /**更新后事件*/
    Update: 'Update',
    /**删除后事件*/
    Delete: 'Delete',
    /**当前行切换后事件*/
    Current: 'Current'
  },
  /**
   * 创建实体记录,会自动创建主键id值,如果需指定记录的主键值,请使用实体记录的set接口设置.
   * @returns {@link Record}
   * @example
   * var ds = vds.ds.lookup("ds1");
   * var record = ds.createRecord();
   */
  createRecord: function () {
    return new Record(this.ds.createRecord())
  },
  /**
   * 批量加载记录到数据源
   * @param {Array<Record>} 记录列表
   * @param {Object} param 其他参数（可选）
   * {
   *  "isAppend":{Boolean} 是否以添加的方式加载，默认false（可选）
   * }
   * */
  loadRecords: function (records, params) {
    if (!vds.object.isArray(records) || records.length == 0) {
      return
    }
    var isAppend = params && params.isAppend === true ? true : false
    var map = []
    for (var i = 0, len = records.length; i < len; i++) {
      var newRecord = records[i]
      if (newRecord instanceof Record) {
        newRecord = newRecord._get().toMap()
      }
      map.push(newRecord)
    }
    return this.ds.load({
      datas: map,
      isAppend: isAppend
    })
  },
  /**
   * 批量新增实体记录,如果实体记录中有id跟数据源中现有数据id相同,则抛出异常.
   * @param {Record[]} records 新增记录
   * @param {Datasource#Position=}[position={@link Datasource#Position|After}] position 新增位置
   * @param {Boolean=} [resetCurrent=true] 重新设置当前行
   * @example
   * var ds = vds.ds.lookup("ds1");
   * var record = ds.createRecord();
   * ds.insertRecords([record],ds.Position.Top);
   */
  insertRecords: function (records, position, resetCurrent) {
    return this.ds.insertRecords({
      records: this._toRe(records),
      position: position ? position.toUpperCase() : null,
      resetCurrent: resetCurrent
    })
  },
  /**
   * 批量更新实体记录
   * @param {Array<Record>} records 更新记录
   * @example
   * var ds = vds.ds.lookup("ds1");
   * var record = ds.getRecordById("1");
   * record.set("name","张三");
   * ds.updateRecords([record]);
   */
  updateRecords: function (records) {
    if (records && records.length > 0) {
      var insertRecordIds = []
      var insertRecords = this._get().getInsertedRecords().toArray()
      if (insertRecords) {
        for (var i = 0, len = insertRecords.length; i < len; i++) {
          insertRecordIds.push(insertRecords[i].getSysId())
        }
      }
      for (var i = 0, l = records.length; i < l; i++) {
        var record = records[i]
        var changed = record._get().getChangedData()
        //新增记录不需要判断是否更新id
        if (
          changed &&
          changed.hasOwnProperty('id') &&
          insertRecordIds.indexOf(changed['id']) == -1
        ) {
          throw Error('更新记录失败，不能更改主键id值！')
        }
      }
      return this.ds.updateRecords({
        records: this._toRe(records)
      })
    }
  },
  /**
   * 根据id批量删除记录
   * @param {Array<String>} ids 记录id
   * @example
   * var ds = vds.ds.lookup("ds1");
   * ds.deleteRecordByIds(["1"]);
   */
  deleteRecordByIds: function (ids) {
    return this.ds.removeRecordByIds({
      ids: ids
    })
  },
  /**
   * 根据主键值获取实体记录,如未找到实体记录,则返回null
   * @param {String} id 实体记录id值
   * @returns {@link Record}
   * @example
   * var ds = vds.ds.lookup("ds1");
   * var record = ds.getRecordById("1");
   */
  getRecordById: function (id) {
    var rd = this.ds.getRecordById(id)
    if (rd) {
      return new Record(rd)
    }
    return null
  },
  /**
   * 根据下标获取实体记录,如果下标不正确或超出总记录数,将返回值null
   * @param {Integer} index 下标值
   * @returns {@link Record}
   * @example
   * var ds = vds.ds.lookup("ds1");
   * var record = ds.getRecordByIndex(0);
   */
  getRecordByIndex: function (index) {
    var rd = this.ds.getRecordByIndex(index)
    if (rd) {
      return new Record(rd)
    }
    return null
  },
  /**
   * 清空实体记录,如果数据源不为空,将触发实体记录删除后事件.
   * @param {Boolean} fireEvent 是否触发删除后事件
   * @example
   * var ds = vds.ds.lookup("ds1");
   * ds.clear();
   */
  clear: function (fireEvent) {
    fireEvent = typeof fireEvent == 'boolean' ? fireEvent : true
    return this.ds.clear({
      fireEvent: fireEvent
    })
  },
  /**
   * 设置当前行
   * @param {@link Record} record 需要设置为当前行的记录对象
   * @example
   * var ds = vds.ds.lookup("entityCode");
   * var record = ds.getRecordById("3");
   * ds.setCurrentRecord(record);
   * */
  setCurrentRecord: function (record) {
    if (record) {
      this.ds.setCurrentRecord({
        record: record._get()
      })
    }
  },
  /**
   * 获取当前行记录,如果数据源无实体记录,则返回null
   * @returns {@link Record}
   * @example
   * var ds = vds.ds.lookup("ds1");
   * var record = ds.getCurrentRecord();
   */
  getCurrentRecord: function () {
    var rd = this.ds.getCurrentRecord()
    if (rd) {
      return new Record(rd)
    }
    return null
  },
  /**
   * 获取元数据
   * @returns {@link Metadata}
   * @example
   * var ds = vds.ds.lookup("ds1");
   * var metadata = ds.getMetadata();
   */
  getMetadata: function () {
    return new Metadata(this.ds.getMetadata())
  },

  /**
   * 获取所有记录
   * @returns {@link ResultSet}
   */
  getAllRecords: function () {
    return new ResultSet(this.ds.getAllRecords())
  },
  /**
   * 获取所有选中记录
   * @returns {@link ResultSet}
   */
  getSelectedRecords: function () {
    return new ResultSet(this.ds.getSelectedRecords())
  },
  /**
   * 实体对象序列化
   */
  serialize: function () {
    return this.ds.serialize()
  },
  /**
   * 获取新增的记录列表
   * @returns {@link ResultSet}
   * */
  getInsertedRecords: function () {
    var ruleset = this.ds.getInsertedRecords()
    return new ResultSet(ruleset)
  },
  /**
   * 获取更新的记录列表
   * @returns {@link ResultSet}
   * */
  getUpdatedRecords: function () {
    var ruleset = this.ds.getUpdatedRecords()
    return new ResultSet(ruleset)
  },
  /**
   * 获取删除的记录列表
   * @returns {@link ResultSet}
   * */
  getDeletedRecords: function () {
    var ruleset = this.ds.getDeletedRecords()
    return new ResultSet(ruleset)
  },
  /**
   * 批量选中实体记录
   * @param {Array<Record>} records 更新记录
   * @example
   * var ds = vds.ds.lookup("ds1");
   * var record = ds.getRecordById("1");
   * ds.selectRecords([record]);
   */
  selectRecords: function (records) {
    if (records instanceof Array && records.length > 0) {
      var array = []
      for (var i = 0, len = records.length; i < len; i++) {
        array.push(records[i]._get())
      }
      this.ds.selectRecords({
        records: array,
        isSelect: true
      })
    }
  },
  /**
   * 批量取消选中实体记录
   * @param {Array<Record>} records 更新记录
   * @example
   * var ds = vds.ds.lookup("ds1");
   * var record = ds.getRecordById("1");
   * ds.unSelectRecords([record]);
   */
  unSelectRecords: function (records) {
    if (records instanceof Array && records.length > 0) {
      var array = []
      for (var i = 0, len = records.length; i < len; i++) {
        array.push(records[i]._get())
      }
      this.ds.selectRecords({
        records: array,
        isSelect: false
      })
    }
  },
  /**
   * 查询记录
   * @param {Object} params 参数信息
   * {
   * 		"criteria" : {@link Criteria} 条件
   * }
   * @return {@link ResultSet}
   * @example
   * var ds = vds.ds.lookup("ds1");
   * var criteria = vds.ds.createCriteria();
   * criteria.eq("code1","a");
   * ds.queryRecord(criteria);
   */
  queryRecord: function (criteria) {
    var resultSet = this._get().queryRecord({
      criteria: criteria
    })
    return new ResultSet(resultSet)
  },
  /**
   * 获取数据总数，一般用于分页场景
   * @returns {Integer}
   * @example
   * var ds = vds.ds.lookup("ds1");
   * var num = ds.getDataAmount();
   * */
  getDataAmount: function () {
    return this._get().getDataAmount()
  },
  /**
   * 是否为已选中记录
   * @param {Record} record 记录
   * @return Boolean
   */
  isSelectedRecord: function (record) {
    return this._get().isSelectedRecord({
      record: record._get()
    })
  },
  /**
   * 标记数据源为多选数据源
   * @example
   * var ds = vds.ds.lookup("ds1");
   * ds.markMultipleSelect();
   * */
  markMultipleSelect: function () {
    this._get().markMultipleSelect()
  }
}

return Datasource
