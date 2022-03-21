import * as EventObserver from './EventObserver'
import * as ViewUtil from './View'

const init = function () {
  //渲染工具
  ViewUtil.render()
  //注册事件
  EventObserver.register()
}

export { init }
