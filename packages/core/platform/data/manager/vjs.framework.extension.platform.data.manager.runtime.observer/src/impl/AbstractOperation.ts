import { Datasource } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'

class Operation {
  destroyed = false
  operationPosition = -1
  recordPositions = {}
  params: any

  constructor(params: any) {
    this.params = params
  }

  setOperationPosition(position: number) {
    this.operationPosition = position
  }
  setRecordPosition(record: any, position: string) {
    this.recordPositions[record] = position
  }
  getRecordPosition(record: any) {
    return this.recordPositions.hasOwnProperty(record)
      ? this.recordPositions[record]
      : this.operationPosition
  }
  getOperationPosition() {
    return this.operationPosition
  }
  //当前动作是否销毁
  isDestroyed() {
    return this.destroyed
  }
  //获取参数信息
  getParams() {
    return this.params
  }
  //标记动作已销毁
  markDestroy() {
    this.destroyed = true
  }
  //合并动作,isBehind为true时，代表operation在当前操作之后
  combine(operation: any, isBehind: boolean) {
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
  }

  _combineLoad(operation: any, isBehind?: boolean) {}

  _combineCurrent(operation: any, isBehind?: boolean) {}

  _combineDelete(operation: any, isBehind?: boolean) {}

  _combineFetch(operation: any, isBehind?: boolean) {}

  _combineInsert(operation: any, isBehind?: boolean) {}

  _combineSelect(operation: any, isBehind?: boolean) {}

  _combineUpdate(operation: any, isBehind?: boolean) {}
  _combineFetched(operation: any, isBehind?: boolean) {}
}

export default Operation
