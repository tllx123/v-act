let sandbox:any

export function initModule(sb:any) {
  sandbox = sb
}

/**
 * 更新容器信息
 */
let updateContainerInfo = function (
  tabContentCode:string,
  scopeId:string,
  componentCode:string,
  windowCode:string
) {
  let widgetContext = sandbox.getService(
    'vjs.framework.extension.widget.manager.widgetContext'
  )
  widgetContext.put(tabContentCode, 'ContainerScopeId', scopeId)
  widgetContext.put(tabContentCode, 'ComponentCode', componentCode)
  widgetContext.put(tabContentCode, 'WindowCode', windowCode)
}

/**
 * 获取容器内部域ID
 */
let getContainerScopeId = function (tabContentCode:string) {
  let widgetContext = sandbox.getService(
    'vjs.framework.extension.widget.manager.widgetContext'
  )
  return widgetContext.get(tabContentCode, 'ContainerScopeId')
}

/**
 * 获取容器内部窗体Code
 */
let getContainerWindowCode = function (tabContentCode:string) {
  let widgetContext = sandbox.getService(
    'vjs.framework.extension.widget.manager.widgetContext'
  )
  return widgetContext.get(tabContentCode, 'WindowCode')
}

/**
 * 存放父容器的信息
 * {scopeId:"",containerCode:""}
 */
let setParentContainerInfo = function (windowCode:string, obj:any) {
  if (windowCode == null || windowCode == undefined) {
    //windowCode = viewContext.getModuleId()
    throw new Error('未识别异常，请联系系统管理员处理')
  }
  let widgetContext = sandbox.getService(
    'vjs.framework.extension.widget.manager.widgetContext'
  )
  widgetContext.put(windowCode, '_ParentContainerInfo', obj)
}

/**
 * 获取父容器的信息
 * {scopeId:"",containerCode:""}
 */
let getParentContainerInfo = function (windowCode:string) {
  if (windowCode == null || windowCode == undefined) {
    //windowCode = viewContext.getModuleId()
    throw new Error('未识别异常，请联系系统管理员处理')
  }
  let widgetContext = sandbox.getService(
    'vjs.framework.extension.widget.manager.widgetContext'
  )
  return widgetContext.get(windowCode, '_ParentContainerInfo')
}

export {
  //register,
 // unregister,
 // getParent,
 // getChild,
  //getChildComponent,
  updateContainerInfo,
  getContainerScopeId,
  getContainerWindowCode,
  setParentContainerInfo,
  getParentContainerInfo
}
