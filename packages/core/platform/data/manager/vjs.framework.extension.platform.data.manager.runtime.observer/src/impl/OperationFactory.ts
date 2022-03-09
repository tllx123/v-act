import * as CurrentOperation from './CurrentOperation'
import * as DeleteOperation from './DeleteOperation'
import * as FetchedOperation from './FetchedOperation'
import * as FetchOperation from './FetchOperation'
import * as InsertOperation from './InsertOperation'
import * as LoadOperation from './LoadOperation'
import * as SelectOperation from './SelectOperation'
import * as UnknowOperation from './UnknowOperation'
import * as UpdateOperation from './UpdateOperation'

let contructors = {
  CurrentOperation,
  DeleteOperation,
  LoadOperation,
  FetchOperation,
  FetchedOperation,
  InsertOperation,
  SelectOperation,
  UpdateOperation,
  UnknowOperation
}

export function initModule(sb) {}

const create = function (params) {
  let eventName = params.eventName
  let Contructor = contructors[eventName]
  Contructor = Contructor ? Contructor : UnknowOperation
  /**
   * 处理错误场景：当使用窗体集成时，父窗体数据源被子窗子控件绑定，
   * 此时数据源Observer存在两个（父、子窗体），
   * 当进行动作合并时，事件参数是引用关系，会操作到resultSet，导致另外一个窗体拿到的数据不正确引发问题
   * 解决方案：将resultSet克隆
   */
  let paramObj = Object.create(params)
  if (paramObj.resultSet) {
    paramObj.resultSet = paramObj.resultSet.clone()
  }
  return new Contructor(paramObj)
}

export {
  _callAsyncObservers,
  addObserver,
  addOperation,
  create,
  destroy,
  fire,
  getBindedDatasourceNames
}