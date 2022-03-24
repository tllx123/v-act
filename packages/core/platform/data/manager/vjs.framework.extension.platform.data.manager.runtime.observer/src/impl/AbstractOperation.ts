import { Datasource } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'

let Operation = function (params: any) {
  // @ts-ignore
  this.params = params
  // @ts-ignore
  this.destroyed = false
  // @ts-ignore
  this.operationPosition = -1
  // @ts-ignore
  this.recordPositions = {}
}

Operation.prototype = {
  initModule: function (sb: any) {},
  setOperationPosition: function (position: string) {
    this.operationPosition = position
  },
  setRecordPosition: function (record: any, position: string) {
    this.recordPositions[record] = position
  },
  getRecordPosition: function (record: any) {
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
  combine: function (operation: any, isBehind: boolean) {
    let params = operation.getParams()
    let eventName = params.eventName
    switch (eventName) {
      // @ts-ignore
      case Datasource.Events.LOAD:
        this._combineLoad(operation, isBehind)
        break
      // @ts-ignore
      case Datasource.Events.INSERT:
        this._combineInsert(operation, isBehind)
        break
      // @ts-ignore
      case Datasource.Events.UPDATE:
        this._combineUpdate(operation, isBehind)
        break
      // @ts-ignore
      case Datasource.Events.DELETE:
        this._combineDelete(operation, isBehind)
        break
      // @ts-ignore
      case Datasource.Events.CURRENT:
        this._combineCurrent(operation, isBehind)
        break
      // @ts-ignore
      case Datasource.Events.SELECT:
        this._combineSelect(operation, isBehind)
        break
      // @ts-ignore
      case Datasource.Events.FETCH:
        this._combineFetch(operation, isBehind)
        break
      // @ts-ignore
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

export default Operation
