import { StorageManager } from '@v-act/vjs.framework.extension.platform.interface.storage'

let Scope_Instance_Storage_Token = 'Window_Container_Storage_Token'

/**
 * 获取窗体容器仓库
 */
let _getWindowContainerStorage = function () {
  return StorageManager.get(
    StorageManager.TYPES.MAP,
    Scope_Instance_Storage_Token
  )
}

/**
 * 根据窗体容器id获取窗体容器对象
 * */
const get = function (containerId: string) {
  let storage = _getWindowContainerStorage()
  if (storage.containsKey(containerId)) {
    return storage.get(containerId)
  }
  return null
}

/**
 * 根据窗体容器id获取关联的窗体域id
 * */
const getScopeId = function (containerId: string) {
  let storage = _getWindowContainerStorage()
  if (storage.containsKey(containerId)) {
    let params = storage.get(containerId)
    return params['scopeId']
  }
  return null
}

/**
 * 更新窗体容器id关联的数据(没有对应的容器id会自动创建)
 * @params WindowContainer container 窗体容器实例
 * */
const put = function (container: any) {
  let id = container.getId()
  let storage = _getWindowContainerStorage()
  storage.put(id, container)
  return id
}

/**
 * 根据窗体域id获取窗体容器实例id
 * @params String scopeId 窗体域id
 * @return  窗体容器实例id
 */
const getByScopeId = function (scopeId: string) {
  let storage = _getWindowContainerStorage()
  let containerId
  storage.iterate(function (id: string, container: any) {
    if (container.getScopeId() == scopeId) {
      containerId = id
      return false
    }
  })
  return containerId
}
/**
 * 根据条件获取窗体容器实例
 * */
exports.getByConditions = function (conditions) {
  var storage = _getWindowContainerStorage()
  var targetContainer
  storage.iterate(function (id, container) {
    if (targetContainer) {
      return false
    }
    targetContainer = container
    for (var key in conditions) {
      if (conditions[key] != container[key]) {
        targetContainer = null
        break
      }
    }
    if (targetContainer) {
      return targetContainer
    }
  })
  return targetContainer
}
/**
 * 根据窗体域id获取窗体容器实例
 * @params String scopeId 窗体域id
 * @return  窗体容器实例
 */
let _getContainerByScopeId = function (scopeId: string) {
  let storage = _getWindowContainerStorage()
  let tmpContainer = null
  storage.iterate(function (id: string, container: any) {
    if (container.getScopeId() == scopeId) {
      tmpContainer = container
      return true
    }
  })
  return tmpContainer
}

const updateTitleByScopeId = function (scopeId: string, newTitle: string) {
  let container = _getContainerByScopeId(scopeId)
  if (container) {
    if (container.getWindowType() == 'ComponentContainer') {
      let alerter = sandbox.getService(
        'vjs.framework.extension.platform.interface.alerter.FrontEndAlerter'
      )
      alerter.error({
        title: '操作异常',
        msg: '组件容器中暂时不支持修改窗体标题',
        msgHeader: '修改标题异常',
        detailed: '暂无更多异常信息'
      })
      return false
    }
    let titleFunc = container.titleFunc
    if (typeof titleFunc == 'function') {
      titleFunc(newTitle)
      return true
    }
  }
  return false
}

/**
 * 根据窗体域id获取窗体容器实例id
 * @params String scopeId 窗体域id
 * @return  窗体容器实例id
 */
const getScopeIdByContainerId = function (containerId: string) {
  let storage = _getWindowContainerStorage()
  let sId
  let container = storage.get(containerId)
  return container.getScopeId()
}

/**
 * 销毁窗体容器id
 * */
const destroy = function (containerId: string) {
  let storage = _getWindowContainerStorage()
  var container = storage.get(containerId)
  if (container) {
    var events = container.getEvent(exports.EVENTS.DESTROY)
    if (events) {
      for (var i = 0, len = events.length; i < len; i++) {
        var event = events[i]
        if (typeof event == 'function') {
          event()
        }
      }
    }
  }
  return storage.remove(containerId)
}

/**
 * 更新窗体容器打开的窗体信息，如果参数包含标题，就会调用更新标题函数
 * @param	{String}	containerId	窗体容器id或者容器对象
 * @params params
 * {
 * 	'componentCode' : 'newComponentCode',
 * 	'windowCode' : 'newWindowCode',
 * 	'title' : 'newTitle',
 * 	'scopeId' : 'newScopeId',
 * 	'titleFunc' : {Function},
 * 	'ele' : 'newEle',
 * 	'resizeFunc' : {Function}
 * 	'funParams' : {Object} 设置title的函数参数
 * }
 * */
const updateWindowInfo = function (containerId: string, params) {
  if (!params || !containerId) {
    return
  }
  var container = containerId
  if (typeof containerId == 'string') {
    container = _getWindowContainerStorage().get(containerId)
  }
  if (container) {
    for (var key in params) {
      if (params.hasOwnProperty(key)) {
        container[key] = params[key]
      }
    }
    if (params.title) {
      var newTitle = params.title
      var titleFunc = container.getTitleFunc()
      if (typeof titleFunc == 'function') {
        titleFunc(newTitle, params.funParams)
      }
    }
  }
}

const existWindowInfo = function (params) {
  let storage = _getWindowContainerStorage()
  let containerId
  let componentCode = params.componentCode
  let windowCode = params.windowCode
  let title = params.title
  storage.iterate(function (id, container) {
    if (
      container.getComponentCode() == params.componentCode &&
      container.getWindowCode() == params.componentCode
    ) {
      containerId = id
      return false
    }
  })
  return containerId
}

const fireResize = function (windowContainerId) {
  let container = get(windowContainerId)
  if (container) {
    let resizeFunc = container.getResizeFunc()
    if (typeof resizeFunc == 'function') {
      resizeFunc()
    }
  }
}

/**
 * 容器里面窗体的打开方式
 * @enum {String}
 */

const OPENTYPE = {
  //组件容器
  CONTAINER: 'ComponentContainer', //旧配置~
  //模态
  MOADL: 'modal',
  //默认：直接浏览器打开
  DEFAULT: 'default'
}

const getOpenType = function (scopeId: string) {
  let container = _getContainerByScopeId(scopeId)
  if (null != container) {
    let openType = container.getWindowType()
    if (openType == OPENTYPE.CONTAINER || openType == OPENTYPE.MOADL) {
      return openType
    }
  }
  return OPENTYPE.DEFAULT
}

export {
  destroy,
  existWindowInfo,
  fireResize,
  get,
  getByScopeId,
  getOpenType,
  getScopeId,
  getScopeIdByContainerId,
  OPENTYPE,
  put,
  updateTitleByScopeId,
  updateWindowInfo
}
