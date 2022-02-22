import DB from './DB'

let taffy,
  each,
  find,
  contains,
  objectUtil,
  arrays,
  arrayUtil,
  remove,
  nRecord,
  ResultSet,
  uuid
const primaryKey = 'id'

export class Datasource {
  public metadata: object
  public db: DB = new DB()
  public isMultipleSel: boolean = false
  public isDefaultSel: boolean = true
  public dataAmount: number = 0
  public ds = null
  public metadataJson: Object = null
  public _eventPool = {}
  public insertIds: Array<string> = []
  public updateIds: Array<string> = []
  public deleteDatas = []
  public selectIds: Array<string> = []
  public currentId: string = null
  public dataAccessObject: Object = null
  public snapshotHandler: any = null
  public Events
  public Position

  constructor(metadata: string, db: string) {}

  clear() {
    let datas = this.db.getAll()
    if (datas.length > 0) {
      var ids = [],
        temp = []
      for (var i = 0, l = datas.length; i < l; i++) {
        var data = datas[i]
        ids.push(data[primaryKey])
        temp.push(data)
      }
      datas = temp
      //sc数据源获取所有数据时,返回引用值,删除时会同步删除数组中的数据
      if (this.db.clear) {
        this.db.clear()
      } else {
        this.db.remove(ids)
      }
    }
    this.removeRecords(datas, null, true)
    this.reset()
    this.selectIds = []
    var snapshot = this.getSnapshot()
    if (snapshot) {
      snapshot.clearCurrentRecord()
    }
    this.currentId = null
  }

  createRecord() {}

  removeRecords(datas: any, nextRecordId: string, isClear: boolean) {
    var ds = this
    var deleted = []

    datas.some((data) => {
      var id = data['id']
      if (!remove(ds.insertIds, id)) {
        deleted.push(data)
      }
      remove(ds.updateIds, id)
      remove(ds.selectIds, id)
    })

    this.deleteDatas = this.deleteDatas.concat(deleted)
    var rs = new ResultSet(this.metadata, datas)
    if (datas.length > 0) {
      this.fireEvent({
        eventName: this.Events.DELETE,
        resultSet: rs,
        datasource: this.ds,
        isClear: isClear
      })
    }
    if (nextRecordId) {
      var nextRecord = this.getRecordById(nextRecordId)
      this.setCurrentRecord({ record: nextRecord })
    } else {
      var record = this.getRecordByIndex(0)
      if (record) {
        this.setCurrentRecord({ record: record })
      }
    }
    return rs
  }

  reset() {}

  getSnapshot() {
    return this.snapshotHandler ? this.snapshotHandler() : null
  }

  clearCurrentRecord() {}

  deleteRecordByIds(ids: Array<String>) {}

  getAllRecords() {}

  getRecordById(idTemp) {
    var data = this.db.getById(idTemp)
    return data != null ? new nRecord(this.metadata, data) : null
  }

  fireEvent(params) {
    var handlers = []
    var eName = params.eventName
    if (eName == this.Events.RECORDPROCESS) {
      handlers = this.fireRecordProcessEvent(params)
    } else {
      handlers = this._eventPool[eName] || []
    }
    for (var i = 0; i < handlers.length; i++) {
      handlers[i].call(this, params)
    }
  }

  fireRecordProcessEvent(params) {
    var handlers = []
    var eName = params.eventName
    var ePool = this._eventPool[eName]
    if (ePool) {
      var eHandlers = []
      var fieldCode = params.fieldCode
      if (fieldCode) {
        // 指定触发某个或多个字段的事件
        if (arrayUtil.isArray(fieldCode)) {
          for (var i = 0; i < fieldCode.length; i++) {
            var fcode = fieldCode[i]
            eHandlers = eHandlers.concat(this._eventPool[eName][fcode] || [])
          }
        } else {
          eHandlers = eHandlers.concat(this._eventPool[eName][fieldCode] || [])
        }
      } else {
        // 没有指定具体字段，则触发全部事件
        for (fieldCode in ePool) {
          if (ePool[fieldCode])
            eHandlers = eHandlers.concat(ePool[fieldCode] || [])
        }
      }
      for (var i = 0; i < eHandlers.length; i++) {
        if (arrayUtil.contains(handlers, eHandlers[i]) == false) {
          handlers.push(eHandlers[i])
        }
      }
    }
    return handlers
  }

  setCurrentRecord(params: any) {
    var snapshot = this.getSnapshot()
    if (snapshot) {
      //TODO
      snapshot.setCurrentRecord(params)
    }
    var record = params.record
    if (record) {
      var id = record.getSysId()
      if (this.currentId != id) {
        var preRecord = this.getRecordById(this.currentId)
        this.currentId = id
        if (!this.isMultipleSelect()) {
          //单选db，当前行和选中行同步
          this.updateSelectedRecords({ records: [record] })
        }
        //注意：需要放置在选择记录之后，否则造成记录变更事件中无法获取已选中记录
        this.fireEvent({
          eventName: this.Events.CURRENT,
          currentRecord: record,
          preCurrentRecord: preRecord,
          datasource: this.ds
        })
      }
    }
  }

  updateSelectedRecords(params: any) {
    var rds = params.records,
      ids = params.ids,
      selectedIds = this.selectIds
    var iter = []
    if (rds) {
      iter = iter.concat(rds)
    }
    if (ids) {
      iter = iter.concat(ids)
    }
    if (!this.isMultipleSelect()) {
      //单选
      if (iter.length == 0) {
        var currentId
        var snapshot = this.getSnapshot()
        if (snapshot) {
          var record = snapshot.getCurrentRecord()
          currentId = record.getSysId()
        } else {
          currentId = this.currentId
        }
        if (currentId != null) {
          var rd = this.getRecordById(currentId)
          this.currentId = null
          if (snapshot) {
            snapshot.clearCurrentRecord()
          }
          var resultSet = this.r2rs([rd])
          this.fireEvent({
            eventName: this.Events.SELECT,
            resultSet: resultSet,
            isSelect: false,
            datasource: this.ds
          })
        }
      } else {
        var rd = iter[iter.length - 1],
          unSelected = []
        rd = rd instanceof nRecord ? rd : this.getRecordById(rd)
        this.setCurrentRecord({ record: rd })
        var id = rd.getSysId()
        var isSel = false
        var db = this
        each(selectedIds, function (selectedId) {
          if (selectedId == id) {
            isSel = true
          } else {
            unSelected.push(db.getRecordById(selectedId))
          }
        })
        this.selectIds = [id]
        if (!isSel) {
          var resultSet = this._ids2rs([id])
          this.fireEvent({
            eventName: this.Events.SELECT,
            resultSet: resultSet,
            isSelect: true,
            datasource: this.ds
          })
        }
        if (unSelected.length > 0) {
          var resultSet = this.r2rs(unSelected)
          this.fireEvent({
            eventName: this.Events.SELECT,
            resultSet: resultSet,
            isSelect: false,
            datasource: this.ds
          })
        }
      }
    } else {
      each(iter, function (record, index) {
        var id = record instanceof nRecord ? record.getSysId() : record
        iter[index] = id
      })
      var toSel = arrays.difference(iter, selectedIds),
        unSel = arrays.difference(selectedIds, iter)
      this.selectIds = iter
      if (unSel && unSel.length > 0) {
        this.fireEvent({
          eventName: this.Events.SELECT,
          resultSet: this._ids2rs(unSel),
          isSelect: false,
          datasource: this.ds
        })
      }
      if (toSel && toSel.length > 0) {
        this.fireEvent({
          eventName: this.Events.SELECT,
          resultSet: this._ids2rs(toSel),
          isSelect: true,
          datasource: this.ds
        })
      }
    }
  }

  _ids2rs(ids) {
    var datas = [],
      _this = this
    each(ids, function (id) {
      datas.push(_this.db.getById(id))
    })
    var rs = new ResultSet(this.metadata, datas)
    return rs
  }

  r2rs(records: any) {
    return new ResultSet(this.metadata, records)
  }

  isMultipleSelect() {
    return this.isMultipleSel
  }

  getRecordByIndex(index) {
    var data = this.db.getByIndex(index)
    return data ? new nRecord(this.metadata, data) : null
  }
}
