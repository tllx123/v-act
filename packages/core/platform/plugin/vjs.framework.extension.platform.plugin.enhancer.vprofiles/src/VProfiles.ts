import * as ViewUtil from './View'
import * as EventObserver from './EventObserver'
let sandbox
exports.initModule = function (sb) {
  sandbox = sb
}

const init = function () {
  //渲染工具
  ViewUtil.render()
  //注册事件
  EventObserver.register()
}

export {
  add,
  remove,
  clear,
  clearTreeData,
  genViewTimePoint,
  doStart,
  doStop,
  doClear,
  register,
  isOpenMonitor,
  render,
  init
}
