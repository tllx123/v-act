import { uuid as uuidUtil } from '@v-act/vjs.framework.extension.util.uuid'

let WindowContainer = function (params: any) {
  this.id = uuidUtil.generate()
  if (!params) return
  this.ele = params.ele
  this.titleFunc = params.titleFunc
  this.scopeId = params.scopeId
  this.componentCode = params.componentCode
  this.windowCode = params.windowCode
  this.title = params.title
  this.otherInfo = params.otherInfo
  this.windowType = params.windowType //窗体打开的类型
  this.resizeFunc = params.resizeFunc //容器内容大小有变化时执行 ，目前在水印功能里使用
  this.winDomId = params.winDomId //容器里打开的窗体id
  this.recordId = params.recordId //记录id，通过数据源生成容器页签时需要设置
  this.events = params.events || {} //事件列表，格式：key：事件类型，value：事件函数
  this.propertys = params.propertys || {} //自定义属性列表，使用set设置和get获取
}

WindowContainer.prototype = {
  /**
   * 获取窗体容器id
   * */
  getId: function () {
    return this.id
  },

  getEle: function () {
    return this.ele
  },

  setEle: function (ele) {
    this.ele = ele
  },

  getWinDomId: function () {
    if (this.winDomId) {
      return this.winDomId
    } else {
      return this.ele
    }
  },

  setWinDomId: function (winDomId) {
    this.winDomId = winDomId
  },

  /**
   * 注入设置标题函数
   * @param Function func 设置标题函数
   * */
  setTitleFunc: function (func) {
    this.titleFunc = func
  },
  /**
   * 获取设置标题的函数
   * */
  getTitleFunc: function () {
    return this.titleFunc
  },
  /**
   * 设置窗体容器关联的窗体域id
   * @param scopeId String 窗体域id
   * */
  setScopeId: function (scopeId) {
    this.scopeId = scopeId
  },
  /**
   * 获取窗体容器关联的窗体域id
   * */
  getScopeId: function () {
    return this.scopeId
  },
  /**
   * 设置窗体容器打开的构件编码
   * */
  setComponentCode: function (componentCode) {
    this.componentCode = componentCode
  },

  getComponentCode: function () {
    return this.componentCode
  },

  setWindowCode: function (windowCode) {
    this.windowCode = windowCode
  },

  getWindowCode: function () {
    return this.windowCode
  },

  setTitle: function (title) {
    this.title = title
  },

  getTitle: function () {
    return this.title
  },

  setOtherInfo: function (otherInfo) {
    this.otherInfo = otherInfo
  },

  getOtherInfo: function () {
    return this.otherInfo
  },

  getWindowType: function () {
    return this.windowType
  },

  setWindowType: function (windowType) {
    this.windowType = windowType
  },

  getResizeFunc: function () {
    return this.resizeFunc
  },

  setResizeFunc: function (func) {
    this.resizeFunc = func
  },

  /**
   * 复制对象信息
   * */
  clone: function () {
    let newWindowContainer = new WindowContainer({})
    newWindowContainer.id = this.id
    newWindowContainer.ele = this.ele
    newWindowContainer.titleFunc = this.titleFunc
    newWindowContainer.scopeId = this.scopeId
    newWindowContainer.componentCode = this.componentCode
    newWindowContainer.windowCode = this.windowCode
    newWindowContainer.title = this.title
    newWindowContainer.otherInfo = this.otherInfo
    newWindowContainer.windowType = this.windowType //窗体类型
    newWindowContainer.resizeFunc = this.resizeFunc
    newWindowContainer.winDomId = this.winDomId
    newWindowContainer.recordId = this.recordId
    newWindowContainer.events = this.events
    return newWindowContainer
  },

  getRecordId: function () {
    return this.recordId
  },

  setRecordId: function (recordId) {
    this.recordId = recordId
  },

  /**
   * 添加事件
   * @param	{String}	type	事件类型
   * @param	{Function}	event	事件
   * */
  addEvent: function (type, event) {
    if (type && typeof event == 'function') {
      if (!this.events[type]) {
        this.events[type] = []
      }
      this.events[type].push(event)
    }
  },

  /**
   * 根据类型获取事件
   * @param	{String}	type	事件类型
   * */
  getEvent: function (type) {
    return this.events[type]
  },
  /**
   * 移除事件
   * @param	{String}	type	事件类型
   * @param	{Function}	event	事件
   * */
  removeEvent: function (type, event) {
    if (type && typeof event == 'function' && this.events[type]) {
      var events = this.events[type]
      for (var i = 0, len = events.length; i < len; i++) {
        if (event === events[i]) {
          try {
            delete this.events[type][i]
          } catch (e) {}
          return true
        }
      }
    }
  },

  set: function (key, value) {
    this.propertys[key] = value
  },

  get: function (key) {
    return this.propertys[key]
  }
}

export default WindowContainer
