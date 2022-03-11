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

const get = function (containerId: string) {
  let storage = _getWindowContainerStorage()
  if (storage.containsKey(containerId)) {
    return storage.get(containerId)
  }
  return null
}

const getScopeId = function (containerId: string) {
  let storage = _getWindowContainerStorage()
  if (storage.containsKey(containerId)) {
    let params = storage.get(containerId)
    return params['scopeId']
  }
  return null
}

const put = function (container: any) {
  let id = container.getId()
  let storage = _getWindowContainerStorage()
  storage.put(id, container)
  return id
}

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

const getScopeIdByContainerId = function (containerId: string) {
  let storage = _getWindowContainerStorage()
  let sId
  let container = storage.get(containerId)
  return container.getScopeId()
}

const destroy = function (containerId: string) {
  let storage = _getWindowContainerStorage()
  return storage.remove(containerId)
}

const updateWindowInfo = function (containerId: string, params) {
  let storage = _getWindowContainerStorage()
  if (params && storage.containsKey(containerId)) {
    let container = storage.get(containerId)
    for (let key in params) {
      if (params.hasOwnProperty(key)) {
        container[key] = params[key]
      }
    }
    if (params.title) {
      let newTitle = params.title
      let titleFunc = container.getTitleFunc()
      if (typeof titleFunc == 'function') {
        titleFunc(newTitle)
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

export { OPENTYPE }

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
  put,
  updateTitleByScopeId,
  updateWindowInfo
}
