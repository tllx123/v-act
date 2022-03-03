import { Datasource as Datasource } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'

let undefined

let Operation = function (params) {
  this.params = params
  this.destroyed = false
  this.operationPosition = -1
  this.recordPositions = {}
}

Operation.prototype = {
  initModule: function (sb) {},
  setOperationPosition: function (position) {
    this.operationPosition = position
  },
  setRecordPosition: function (record, position) {
    this.recordPositions[record] = position
  },
  getRecordPosition: function (record) {
    return this.recordPositions.hasOwnProperty(record)
      ? this.recordPositions[record]
      : this.operationPosition
  },
  getOperationPosition: function () {
    return this.operationPosition
  },
  //当前动作是否销毁
  isDestroyed: function () {
    return this.destroyed
  },
  //获取参数信息
  getParams: function () {
    return this.params
  },
  //标记动作已销毁
  markDestroy: function () {
    this.destroyed = true
  },
  //合并动作,isBehind为true时，代表operation在当前操作之后
  combine: function (operation, isBehind) {
    let params = operation.getParams()
    let eventName = params.eventName
    switch (eventName) {
      case Datasource.Events.LOAD:
        this._combineLoad(operation, isBehind)
        break
      case Datasource.Events.INSERT:
        this._combineInsert(operation, isBehind)
        break
      case Datasource.Events.UPDATE:
        this._combineUpdate(operation, isBehind)
        break
      case Datasource.Events.DELETE:
        this._combineDelete(operation, isBehind)
        break
      case Datasource.Events.CURRENT:
        this._combineCurrent(operation, isBehind)
        break
      case Datasource.Events.SELECT:
        this._combineSelect(operation, isBehind)
        break
      case Datasource.Events.FETCH:
        this._combineFetch(operation, isBehind)
        break
      case Datasource.Events.FETCHED:
        this._combineFetched(operation, isBehind)
        break
    }
  },

  _combineLoad: function () {},

  _combineCurrent: function () {},

  _combineDelete: function () {},

  _combineFetch: function () {},

  _combineInsert: function () {},

  _combineSelect: function () {},

  _combineUpdate: function () {},
  _combineFetched: function () {}
}

return Operation

export {
  addObserver,
  fire,
  _callAsyncObservers,
  getBindedDatasourceNames,
  destroy,
  addOperation
}
