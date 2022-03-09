import { callbackFactory } from '@v-act/vjs.framework.extension.platform.interface.event'
import { i18nWindowManager } from '@v-act/vjs.framework.extension.platform.interface.i18n'

import Scope from './Scope'
import * as ScopeManager from './ScopeManager'

/**
 * @namespace WindowScope
 * @class WindowScope
 * @extends Scope
 * @desc 窗体域<br/>
 * vjs名称:vjs.framework.extension.platform.interface.scope<br/>
 * 该定义无法直接创建,请通过域管理器创建({@link ScopeManager#createWindowScope|ScopeManager})
 * @author xiedh
 */
class WindowScope extends Scope {
  cancelCloseIden: boolean = false

  beforeCloseEvents: Array<(...args: any[]) => void>

  originalTitle: string | null = null
  //是否退出窗体，默认为true，场景：移动端物理键退出时，需要用户确认后才退出。
  exitWindow: boolean = true
  //浏览器点击返回时触发的事件，目前暂时用于移动窗体
  beforeExitWindowEvents: {
    [eventName: string]: null | Array<(...args: any[]) => void>
  } = {}
  //保存映射的父窗体id
  extendId: string | null = null
  //保存映射的子窗体id
  childId: string | null = null
  //是否有水印
  waterMark: boolean = false
  //是否简约窗体
  isSimple = false
  //打开模式，locationHref（跳转），dialog（模态），retrunValues（模态），container（组件容器），vuiWindowContainer（vui容器）
  openMode: string | null = null

  Keys = {
    componentCode: 'componentCode',
    windowCode: 'windowCode',
    type: 'type',
    widgets: 'widgets'
  }

  constructor(
    instanceId: string,
    componentCode: string,
    windowCode: string,
    series: string
  ) {
    super(instanceId)
    this.properties[this.Keys.componentCode] = componentCode
    this.properties[this.Keys.windowCode] = windowCode
    this.properties[this.Keys.type] = series
    this.properties[this.Keys.widgets] = {} //保存控件上下文的信息
    this.cancelCloseIden = false //是否取消关闭窗体
    this.beforeCloseEvents = [] //在关闭之前处理的逻辑，目前暂时用于注入窗体关闭前事件
    this.originalTitle = null
    this.exitWindow = true //是否退出窗体，默认为true，场景：移动端物理键退出时，需要用户确认后才退出。
    this.beforeExitWindowEvents = {} //浏览器点击返回时触发的事件，目前暂时用于移动窗体
    this.extendId = null //保存映射的父窗体id
    this.childId = null //保存映射的子窗体id
    this.waterMark = false //是否有水印
    this.isSimple = false //是否简约窗体
    this.openMode = null //打开模式，locationHref（跳转），dialog（模态），retrunValues（模态），container（组件容器），vuiWindowContainer（vui容器）
  }

  /**
   * 注入关闭前事件
   * */
  onBeforeClose(handle: (...args: any[]) => void) {
    this.beforeCloseEvents.push(handle)
  }
  /**
   * 注册窗体退出前事件，暂时用于移动窗体物理键返回时注入处理逻辑
   * @param {String} eventName 事件名称
   * @param Function handler
   * */
  registerBeforeExit(eventName: string, handler: (...args: any[]) => void) {
    let handlers = this.beforeExitWindowEvents[eventName]
    if (!handlers) {
      handlers = []
    }
    handlers.push(handler)
    this.beforeExitWindowEvents[eventName] = handlers
  }

  /**
   * 触发窗体退出前事件,暂时用于移动窗体物理键返回时注入处理逻辑
   * @param {String} eventName 事件名称
   * */
  fireBeforeExitEvent(eventName: string, success: (...args: any[]) => void) {
    const events = this.beforeExitWindowEvents[eventName]
    if (events && events.length > 0) {
      const promises = []
      for (let i = 0, l = events.length; i < l; i++) {
        const event = events[i]
        const promise = new Promise<void>(
          (resolve: () => void, reject: (e: any) => void) => {
            event.apply(this, [
              () => {
                resolve()
              }
            ])
          }
        )
        promises.push(promise)
      }
      Promise.all(promises).then(() => {
        if (typeof success == 'function') {
          success()
        }
      })
    } else {
      if (typeof success == 'function') {
        success()
      }
    }
  }
  /**
   * 删除关闭前事件，临时方案提供的接口,勿调用。2018-02-08 liangzc
   * */
  deleteBeforeExit(eventName: string) {
    this.beforeExitWindowEvents[eventName] = null
  }

  /**
   * 触发窗体关闭前事件，执行逻辑：
   * 1、获取所有子窗体域
   * 2、触发子窗体窗体关闭前事件
   * 3、触发本窗体关闭前事件
   * 4、获取所有窗体取消关闭状态
   * 5、将窗体状态恢复
   * 6、如果有窗体取消关闭则触发fail回调，否则触发success回调
   * */
  fireBeforeClose(
    success: (...args: any[]) => void,
    error: (...args: any[]) => void
  ) {
    let exeError = false
    const errorback = () => {
      exeError = true
    }
    //当前窗体域
    const scopeId = this.instanceId
    //获取子窗体域
    const childrenScopes = ScopeManager.getChildrenScopes(scopeId)
    const finishCb = () => {
      if (!exeError) {
        //如果子窗体已经取消关闭了，就不用再执行本窗体的关闭前事件了。
        let allSuccess = true
        const promises = []
        //触发本窗体的关闭前事件
        for (let i = 0; i < this.beforeCloseEvents.length; i++) {
          const promise = new Promise<void>((resolve: () => void) => {
            const cb_success = callbackFactory.create({
              type: callbackFactory.Types.Success,
              handler: function () {
                resolve
              }
            })
            const cb_error = callbackFactory.create({
              type: callbackFactory.Types.Fail,
              handler: function () {
                allSuccess = false
                resolve
              }
            })
            ScopeManager.openScope(scopeId)
            this.beforeCloseEvents[i](cb_success, cb_error)
            ScopeManager.closeScope()
          })
          promises.push(promise)
        }
        Promise.all(promises).then(() => {
          //判断本窗体是否取消关闭
          if (this.isCancelClose()) {
            exeError = true
          }
          //恢复窗体默认状态
          this.markToDefault()
          //判断是否有取消关闭,或者活动集执行报错
          if (exeError || !allSuccess) {
            if (typeof error == 'function') {
              error()
            }
          } else {
            if (typeof success == 'function') {
              success()
            }
          }
        })
      }
    }
    const fun = function () {
      if (childrenScopes && childrenScopes.length > 0) {
        const child = childrenScopes.shift()
        const c_scopeId = child.instanceId
        //触发子窗体的关闭前事件
        if (c_scopeId && ScopeManager.isWindowScope(c_scopeId)) {
          const cb_success = function () {
            fun()
          }
          const cb_error = function () {
            errorback()
          }
          child.fireBeforeClose(cb_success, cb_error)
        } else {
          fun()
        }
      } else {
        finishCb()
      }
    }
    fun()
  }

  /**
   * 获取构件编号
   * @return String
   */
  getComponentCode() {
    return this.get(this.Keys.componentCode)
  }

  /**
   * 获取窗体编号
   * @return String
   */
  getWindowCode() {
    return this.get(this.Keys.windowCode)
  }

  /**
   * 获取窗体插件体系
   * @return String
   */
  getSeries() {
    let scope = this
    let hasChild = true
    while (hasChild) {
      const childId = scope.childId
      if (childId != null) {
        scope = ScopeManager.getScope(childId)
      } else {
        hasChild = false
      }
    }
    return scope.get(scope.Keys.type)
    //			return this.get(this.Keys.type);
  }

  /**
   * 设置属性值
   * @param {String} key 属性名称
   * @param {Any} val 属性值
   */
  set(key: string, val: any) {
    /*if(this.Keys.hasOwnProperty(key)){
            throw Error("[WindowScope.set]"+key+"为内部属性，无法设置，请更改属性名称！");
        }*/
    this.properties[key] = val
  }

  /**
   * 将窗体标记为默认状态
   * */
  markToDefault() {
    this.cancelCloseIden = false
  }

  /**
   * 是否取消关闭窗体
   * */
  isCancelClose() {
    return this.cancelCloseIden
  }

  /**
   * 设置为取消窗体关闭
   * */
  cancelClose() {
    this.cancelCloseIden = true
  }

  /**
   * 设置来源窗体的标题
   * */
  setOriginalTitle(title: string) {
    this.originalTitle = title
  }

  /**
   * 获取来源窗体的标题
   * */
  getOriginalTitle() {
    return this.originalTitle
  }

  /**
   * 是否退出窗体
   * */
  isExitWindow() {
    return this.exitWindow
  }

  /**
   * 退出窗体属性设置为 false 不退出
   * */
  setNotExitWindow() {
    this.exitWindow = false
  }

  /**
   * 退出窗体属性设置为默认值
   * */
  setDefaultExitWindow() {
    this.exitWindow = true
  }

  getExtendId() {
    return this.extendId
  }

  setExtendId(extendId: string) {
    this.extendId = extendId
  }

  getChildId() {
    return this.childId
  }

  setChildId(id: string) {
    return (this.childId = id)
  }

  getWaterMark() {
    return this.waterMark
  }

  setWaterMark(waterMark: boolean) {
    this.waterMark = waterMark === true ? true : false
  }

  setWidget(widgetId: string, propertyName: string, propertyValue: any) {
    const widgets = this.properties[this.Keys.widgets]
    if (!widgets[widgetId]) {
      widgets[widgetId] = {}
    }
    widgets[widgetId][propertyName] = propertyValue
  }

  getWidget(widgetId: string, propertyName: string) {
    const widgets = this.properties[this.Keys.widgets][widgetId]
    if (!propertyName) {
      return widgets
    }
    if (widgets) {
      return widgets[propertyName]
    }
    return null
  }

  getWidgets() {
    return this.properties[this.Keys.widgets]
  }

  getTitle() {
    //获取显示的标题
    const windowCode = this.properties[this.Keys.windowCode]
    const widgets = this.properties[this.Keys.widgets][windowCode]
    let defaultTitle = ''
    if (widgets) {
      defaultTitle = widgets['SimpleChineseTitle']
      if (null == defaultTitle || '' == null) {
        defaultTitle = widgets.Name //模态窗体标题
      }
    }
    const params = {
      componentCode: this.properties[this.Keys.componentCode],
      windowCode: windowCode,
      code: 'name',
      defaultVal: defaultTitle
    }
    return i18nWindowManager.get(params)
  }
  setDivWindowType(isSimple: boolean) {
    //设置div窗体类型
    if (true === isSimple) {
      this.isSimple = true
    } else {
      this.isSimple = false
    }
  }
  isSimpleDivWindow() {
    //是否是simple的div窗体
    return this.isSimple
  }
  setOpenMode(mode: string) {
    //设置窗体打开模式
    this.openMode = mode
  }
  getOpenMode() {
    //获取窗体打开模式
    return this.openMode
  }
}

export default WindowScope