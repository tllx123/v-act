import { UUID as uuidUtil } from '@v-act/vjs.framework.extension.util'

let undefined

let WindowContainer = function (params) {
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
}

WindowContainer.prototype = {
  initModule: function (sb) {},
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
    return newWindowContainer
  }
}

return WindowContainer
