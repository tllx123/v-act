import { Datasource as Datasource } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'
import * as undefined from './impl/CurrentOperation'
import * as undefined from './impl/DeleteOperation'
import * as undefined from './impl/LoadOperation'
import * as undefined from './impl/FetchOperation'
import * as undefined from './impl/FetchedOperation'
import * as undefined from './impl/InsertOperation'
import * as undefined from './impl/SelectOperation'
import * as undefined from './impl/UpdateOperation'
import * as UnknowOperation from './impl/UnknowOperation'

let contructors = {}

exports.initModule = function (sb) {}

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
  addObserver,
  fire,
  _callAsyncObservers,
  getBindedDatasourceNames,
  destroy,
  addOperation,
  create
}
