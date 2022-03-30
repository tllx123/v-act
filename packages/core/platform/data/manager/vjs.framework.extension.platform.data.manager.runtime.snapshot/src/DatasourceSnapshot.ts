import { Datasource } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'

class Snapshot {
  datasource: Datasource
  currentId: string | null = null
  constructor(datasource: Datasource) {
    //super(datasource.metadata, datasource.db)
    this.datasource = datasource
    let record = datasource.getCurrentRecord()
    if (record) {
      // @ts-ignore
      this.currentId = record.getSysId()
    }
    if (datasource) {
      for (const key in datasource) {
        const element = datasource[key]
        if (typeof element == 'function') {
          this[key] = (...args: any[]) => {
            const ds = this._getDatasource()
            if (ds) {
              element.apply(ds, args)
            }
          }
        }
      }
    }
  }

  _getDatasource() {
    return this.datasource
  }
  /**
   * 清除当前行
   */
  clearCurrentRecord() {
    this.currentId = null
  }

  /**
   * 获取数据源中当前行记录
   * @return {@link Record}
   */
  getCurrentRecord() {
    return this.getRecordById(this.currentId)
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
    let record = params.record
    if (record) {
      let id = this.currentId
      return id == record.get('id')
    }
    return false
  }

  /**
   *设置当前行
   * @param {Object} params 参数信息
   * {
   * 		record : {@link Record} 记录
   * }
   */
  setCurrentRecord(params: any) {
    let record = params.record
    this.currentId = record.getSysId()
  }

  setCurrentId(id: string) {
    this.currentId = id
  }

  isCurrentById(id: string) {
    return id == this.currentId
  }

  getCurrentId() {
    return this.currentId
  }
}

export default Snapshot
