import { snapshotManager } from '@v-act/vjs.framework.extension.platform.data.manager.runtime.snapshot'
import { uuid } from '@v-act/vjs.framework.extension.util.uuid'

let primaryKey = 'id',
  each: any

/**
 * @namespace Datasource
 * @catalog 前端实体/普通实体/普通实体
 * @class Datasource
 * @desc 数据源定义<br/>
 * 数据源无法直接创建，请通过普通实体构造工厂服务创建数据源实例<br/>
 * vjs名称：vjs.framework.extension.platform.interface.model.datasource<br/>
 * vjs服务名称：vjs.framework.extension.platform.interface.model.datasource.Datasource<br/>
 */

export default class Datasource {
  constructor(
    public metadata: any,
    public db: any,
    public instanceId?: string,
    public dataAccessObject?: object,
    public bindWidgets?: any,
    /**
     * 事件名称枚举
     * @enum {String}
     */
    public Events: object = {
      /**加载事件*/
      LOAD: 'LOAD',
      /**新增事件*/
      INSERT: 'INSERT',
      /**更新事件*/
      UPDATE: 'UPDATE',
      /**删除事件*/
      DELETE: 'DELETE',
      /**当前行切换事件*/
      CURRENT: 'CURRENT',
      /**记录选择事件*/
      SELECT: 'SELECT',
      /**获取数据事件*/
      FETCH: 'FETCH',
      /**获取数据后事件*/
      FETCHED: 'FETCHED',
      /** 记录处理事件*/
      RECORDPROCESS: 'RECORDPROCESS'
    },
    /**
     * 数据位置枚举
     * @enum {String}
     */
    public Position: object = {
      /**前*/
      BEFORE: 'BEFORE',
      /**后*/
      AFTER: 'AFTER',
      /**最前*/
      TOP: 'TOP',
      /**最后*/
      BOTTOM: 'BOTTOM'
    }
  ) {
    return this
  }

  initModule(sb: any) {
    each = sb.util.collections.each
  }

  _genSnapshotHandler() {
    let _this: any = this
    return function () {
      if (snapshotManager) {
        let snapshot = snapshotManager.getCurrentSnapshot()
        if (snapshot) {
          return snapshot.getDatasourceSnapshot(_this.instanceId)
        }
      }
      return null
    }
  }

  /**
   * 获取数据源实例Id
   * @return String 数据源实例Id
   */
  getInstanceId() {
    return this.instanceId
  }

  /**
   *获取数据源元数据信息
   * @return {@link Metadata}
   */
  getMetadata() {
    return this.metadata
  }

  /**
   * 设置数据源元数据信息
   *
   * @param {Metadata} meta 元数据信息，可通过MetadataFactory.unSerialize(meta)创建
   */
  setMetadata(meta: any) {
    this.metadata = meta
  }

  _processLoadDatas(datas: any) {
    if (datas) {
      let rs: any = []
      each(datas, function (data: any) {
        if (!data.hasOwnProperty(primaryKey)) data[primaryKey] = uuid.generate()
        rs.push(data)
      })
      datas = rs
    }
    return datas
  }

  /**
   *加载数据
   * @param {Object} params 参数信息
   * {
   * 		datas : Array<Object> 加载数据
   * 		dataAmount : Number 记录总数
   * 		isAppend : Boolean 以添加的方式加载数据
   * }
   * @example datasource.load({"datas":[{"field1":"a","field2":"b"},{"field1":"a1","field2":"b2"}],"isAppend":true})
   * @return {@link ResultSet}
   */
  load(params: any) {
    this._processLoadDatas(params.datas)
    return this.db.load(params)
  }

  /**
   *新增记录
   * @param {Object} params 参数信息
   * {
   * 		records : Array<{@link Record}> 新增记录,
   * 		"position": {@link Datasource#Position|Position} 新增记录位置信息
   * 		resetCurrent: Boolean 重新设置当前行,默认值为true
   * }
   * @example
   *  var datasourceFactory = sandbox.getService("vjs.framework.extension.platform.services.model.datasource.datasourceFactory");
   *  var datasource = datasourceFactory.create(metadata);
   *  datasource.insertRecords({
   * 		"records":[...]
   * 		"position" : datasource.Position.BOTTOM
   * });
   * @return {@link ResultSet}
   */
  insertRecords(params: any) {
    return this.db.insertRecords(params)
  }

  /**
   *更新记录
   * @param {Object} params 参数信息
   * {
   * 		records : Array<{@link Record}> 新增记录
   * }
   * @return {@link ResultSet}
   */
  updateRecords(params: any) {
    return this.db.updateRecords(params)
  }

  /**
   * 根据主键值移除记录
   * @param {Object} params 参数信息
   * {
   * 		ids : Array<String> 主键值集合
   * }
   * @return {@link ResultSet}
   */
  removeRecordByIds(params: any) {
    return this.db.removeRecordByIds(params)
  }

  /**
   * 清空数据源记录 ,只清空记录
   */
  clear() {
    this.db.clear()
  }
  /**
   *清楚已删除数据
   */
  clearRemoveDatas() {
    this.db.clearRemoveDatas()
  }

  reset() {
    this.db.reset()
  }

  /**
   * 根据数据源创建一条记录
   * @return {@link Record}
   */
  createRecord() {
    return this.db.createRecord()
  }

  /**
   * 根据主键值获取记录
   * @param {String} id 主键值
   * @return {@link Record}
   */
  getRecordById(id: string) {
    return this.db.getRecordById(id)
  }

  /**
   * 根据下标顺序获取记录
   * @param  {Number} index 记录下标(下标从0开始)
   * @return {@link Record}
   */
  getRecordByIndex(index: number) {
    return this.db.getRecordByIndex(index)
  }

  /**
   * 获取所有记录
   * @return {@link ResultSet}
   */
  getAllRecords() {
    return this.db.getAllRecords()
  }
  /**
   * 是否为空数据源
   * @return Boolean
   */
  isEmpty() {
    return this.db.isEmpty()
  }

  /**
   * 获取新增记录
   * @return {@link ResultSet}
   */
  getInsertedRecords() {
    return this.db.getInsertedRecords()
  }

  /**
   * 获取更新记录
   * @return {@link ResultSet}
   */
  getUpdatedRecords() {
    return this.db.getUpdatedRecords()
  }

  /**
   * 获取已删除记录
   * @return {@link ResultSet}
   */
  getDeletedRecords() {
    return this.db.getDeletedRecords()
  }
  /**
   * 获取数据源中所有已选中记录
   * @return {@link ResultSet}
   */
  getSelectedRecords() {
    return this.db.getSelectedRecords()
  }
  /**
   * 获取数据源中当前行记录
   * @return {@link Record}
   */
  getCurrentRecord() {
    return this.db.getCurrentRecord()
  }

  /**
   * 是否为已选中记录
   * @param {Object} params 参数信息
   * {
   * 		record : {@link Record} 记录
   * }
   * @return Boolean
   * @see
   * Record 请参考vjs.framework.extension.platform.interface.model.datasource模块中Record定义
   */
  isSelectedRecord(params: any) {
    return this.db.isSelectedRecord(params)
  }

  /**
   * 是否为已当前行记录
   * @param {Object} params 参数信息
   * {
   * 		record : {@link Record} 记录
   * }
   * @return Boolean
   * @see
   * Record 请参考vjs.framework.extension.platform.interface.model.datasource模块中Record定义
   */
  isCurrentRecord(params: any) {
    return this.db.isCurrentRecord(params)
  }
  /**
   * 记录是否已删除
   * @param {Object} params 参数信息
   * {
   * 	 "record" :　{@link Record} 记录
   * }
   */
  isDeletedRecord(params: any) {
    return this.db.isDeletedRecord(params)
  }

  /**
   * 获取前台实体与之关联的后台数据源信息
   * @return DataAccessor
   */
  getDataAccessor() {
    return this.dataAccessObject
  }

  /**
   * 设置前台实体与之关联的后台数据源信息
   * @param {Object} params 参数信息
   * {
   * 		accessor : DataAccessor
   * }
   */
  setDataAccessor(params: any) {
    this.dataAccessObject = params.accessor
  }

  /**
   * 更新选中记录(只选中给出的记录，其他已选中的记录将被取消选中)
   * @param {Object} params 参数信息
   * {
   * 		ids : Array<String> 记录id集合
   *      records : Array<{@link Record}> 记录集合
   * }
   */
  updateSelectedRecords(params: any) {
    this.db.updateSelectedRecords(params)
  }

  /**
   * 选中数据源记录
   * 如果数据源为单选，则选中最后一条
   * 如果没有选中记录，则直接返回空结果集
   * @param {Object} params 参数信息
   * {
   * 		records : Array<{@link Record}> 记录数组
   * 		isSelect : Boolean 选中/取消选中
   * }
   * @return {@link ResultSet}
   */
  selectRecords(params: any) {
    return this.db.selectRecords(params)
  }

  /**
   *设置当前行
   * @param {Object} params 参数信息
   * {
   * 		record : {@link Record} 记录
   * }
   */
  setCurrentRecord(params: any) {
    this.db.setCurrentRecord(params)
  }

  /**
   * 注册事件回调
   * @param {Object} params 参数信息
   * {
   * 		"eventName" : {@link Datasource#Events|Events} 事件名称,
   * 		"fieldCode" : String 字段编码,
   * 		"handler" : Function 回调
   * }
   * @example
   *  var datasourceFactory = sandbox.getService("vjs.framework.extension.platform.services.model.datasource.datasourceFactory");
   *  var datasource = datasourceFactory.create(metadata);
   *  datasource.on({
   * 		"eventName":datasource.Events.Load
   * 		"handler" : function(){alert("loaded@");}
   * });
   */
  on(params: any) {
    this.db.on(params)
  }

  /**
   * 是否为多选
   * @return Boolean
   */
  isMultipleSelect() {
    return this.db.isMultipleSelect()
  }
  /**
   * 标记数据源为多选
   */
  markMultipleSelect() {
    this.db.markMultipleSelect()
  }
  /**
   * 标记数据源为单选
   */
  markMultipleSingle() {
    this.db.markMultipleSingle()
  }
  /**
   * 是否默认选中记录
   * @return Boolean
   */
  isDefaultSelect() {
    return this.db.isDefaultSelect()
  }
  /**
   * 设置是否默认选中
   * @param {Object} params 参数信息
   * {
   * 		"defaultSel" : Boolean 是否默认选中
   * }
   */
  setDefaultSelect(params: any) {
    this.db.setDefaultSelect(params)
  }
  /**
   * 数据源序列化
   * @return Object
   * @example
   * 输出格式
   * {
   * 		"datas":{
   * 			"recordCount": {Integer} 数据源记录数
   * 			"values":{Array} 数据源记录集合
   * 		}，
   * 		"metadata":{
   * 			"model":[{
   * 				"datasource":{String} 数据源名称
   * 				"fields":[{
   * 					"code":编码,
   *  				"name":名称,
   *  				"length":长度,
   *  				"type":类型,
   *  				"defaultValue":默认值,
   *  				"precision":精度
   * 				}...]
   * 			}]
   * 		}
   * }
   */
  serialize() {
    let set = this.getAllRecords()
    let values: any = []
    set.iterate(function (record: any) {
      //过滤字段,剔除非数据源中的字段
      values.push(record.toMap())
    })
    return {
      metadata: this.metadata.serialize(),
      datas: {
        values: values,
        recordCount: this.db.getDataAmount()
      }
    }
  }
  /**
   * 标记数据源将要取数据
   */
  markWillToFecth() {
    this.db.markWillToFecth()
  }
  /**
   * 标记数据已加载过
   */
  markFecthed() {
    this.db.markFecthed()
  }
  /**
   * 查询记录
   * @param {Object} params 参数信息
   * {
   * 		"criteria" : {@link Criteria} 条件
   * }
   * @return {@link ResultSet}
   */
  queryRecord(params: any) {
    return this.db.queryRecord(params)
  }
  /**
   * 获取db数据量
   * @return Integer
   */
  getDataAmount() {
    return this.db.getDataAmount()
  }

  getOrginalDatasource() {
    return this.db
  }

  /**
   * 根据id获取数据下标值,如果记录不存在,则返回-1
   * @param {String} id 记录id值
   * @return Integer
   */
  getIndexById(id: any) {
    return this.db.getIndexById(id)
  }

  /**
   * 获取当前实体数据量
   */
  getCurrentDataAmount() {
    return this.db.getCurrentDataAmount()
  }

  destroy() {
    if (this.bindWidgets) {
      this.bindWidgets = null
    }
  }
}
