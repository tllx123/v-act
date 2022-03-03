import * as Scope from './api/Scope'

let undefined
let ScopeManager
let callbackFactory
let sBox
let i18nWindowManager

/**
 * @namespace WindowScope
 * @class WindowScope
 * @extends Scope
 * @desc 窗体域<br/>
 * vjs名称:vjs.framework.extension.platform.interface.scope<br/>
 * 该定义无法直接创建,请通过域管理器创建({@link ScopeManager#createWindowScope|ScopeManager})
 * @author xiedh
 */
let WindowScope = function (instanceId, componentCode, windowCode, series) {
  Scope.call(this, instanceId)
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

WindowScope.prototype = {
  Keys: {
    componentCode: 'componentCode',
    windowCode: 'windowCode',
    type: 'type',
    widgets: 'widgets'
  },

  /**
   * 注入关闭前事件
   * */
  onBeforeClose: function (handle) {
    this.beforeCloseEvents.push(handle)
  },
  /**
   * 注册窗体退出前事件，暂时用于移动窗体物理键返回时注入处理逻辑
   * @param {String} eventName 事件名称
   * @param Function handler
   * */
  registerBeforeExit: function (eventName, handler) {
    if (!this.beforeExitWindowEvents[eventName]) {
      this.beforeExitWindowEvents[eventName] = []
    }
    this.beforeExitWindowEvents[eventName].push(handler)
  },

  /**
   * 触发窗体退出前事件,暂时用于移动窗体物理键返回时注入处理逻辑
   * @param {String} eventName 事件名称
   * */
  fireBeforeExitEvent: function (eventName, success) {
    let events = this.beforeExitWindowEvents[eventName]
    if (events && events.length > 0) {
      let dtds = []
      for (let i = 0, l = events.length; i < l; i++) {
        let event = events[i]
        let dtd = $.Deferred()
        dtds.push(dtd)
        let cb = function () {
          dtd.resolve()
        }
        event.apply(this, [cb])
      }
      $.when.apply($.when, dtds).done(
        (function (cb) {
          return function () {
            if (typeof cb == 'function') {
              cb()
            }
          }
        })(success)
      )
    } else {
      if (typeof success == 'function') {
        success()
      }
    }
  },
  /**
   * 删除关闭前事件，临时方案提供的接口,勿调用。2018-02-08 liangzc
   * */
  deleteBeforeExit: function (eventName) {
    this.beforeExitWindowEvents[eventName] = null
  },

  /**
   * 触发窗体关闭前事件，执行逻辑：
   * 1、获取所有子窗体域
   * 2、触发子窗体窗体关闭前事件
   * 3、触发本窗体关闭前事件
   * 4、获取所有窗体取消关闭状态
   * 5、将窗体状态恢复
   * 6、如果有窗体取消关闭则触发fail回调，否则触发success回调
   * */
  fireBeforeClose: function (success, error) {
    ScopeManager = require('vjs/framework/extension/platform/interface/scope/api/ScopeManager')
    callbackFactory = sBox.getService(
      'vjs.framework.extension.platform.interface.event.callbackFactory'
    )
    i18nWindowManager = sBox.getService(
      'vjs.framework.extension.platform.interface.i18n.window'
    )
    let exeError = false
    let successback = function () {}
    let errorback = function () {
      exeError = true
    }
    //当前窗体域
    let scopeId = this.instanceId
    //获取子窗体域
    let childrenScopes = ScopeManager.getChildrenScopes(scopeId)
    let children_dtds = []
    let finishCb = (function (winScope, successback, errorback) {
      return function () {
        if (!exeError) {
          //如果子窗体已经取消关闭了，就不用再执行本窗体的关闭前事件了。
          let allSuccess = true
          let dtds = []
          //触发本窗体的关闭前事件
          for (let i = 0; i < winScope.beforeCloseEvents.length; i++) {
            let dtd = $.Deferred()
            dtds.push(dtd)
            let cb_success = callbackFactory.create({
              type: callbackFactory.Types.Success,
              handler: function () {
                dtd.resolve()
              }
            })
            let cb_error = callbackFactory.create({
              type: callbackFactory.Types.Fail,
              handler: function () {
                allSuccess = false
                dtd.resolve()
              }
            })
            ScopeManager.openScope(scopeId)
            winScope.beforeCloseEvents[i](cb_success, cb_error)
            ScopeManager.closeScope()
          }
          $.when.apply($.when, dtds).done(
            (function (windowScope, success, error) {
              return function () {
                //判断本窗体是否取消关闭
                if (windowScope.isCancelClose()) {
                  exeError = true
                }
                //恢复窗体默认状态
                windowScope.markToDefault()
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
              }
            })(winScope, successback, errorback)
          )
        }
      }
    })(this, success, error)
    //if(childrenScopes && childrenScopes.length > 0){
    let fun = function () {
      if (childrenScopes && childrenScopes.length > 0) {
        let child = childrenScopes.shift()
        let c_scopeId = child.instanceId
        //触发子窗体的关闭前事件
        if (c_scopeId && ScopeManager.isWindowScope(c_scopeId)) {
          let cb_success = function () {
            fun()
          }
          let cb_error = function () {
            allSuccess = false
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
    /*for(var i = 0;i<childrenScopes.length;i++){
                var children = childrenScopes[i];
                var c_scopeId = children.instanceId;
                //触发子窗体的关闭前事件 
                if(c_scopeId && ScopeManager.isWindowScope(c_scopeId)){
                    var c_dtd = $.Deferred();
                    children_dtds.push(c_dtd);
                    var cb_success = function(){
                        successback();
                        c_dtd.resolve();
                    }
                    var cb_error = function(){
                        allSuccess = false;
                        errorback();
                        c_dtd.resolve();
                    }
                    children.fireBeforeClose(cb_success,cb_error);
                }
            }*/
    //}
    /*$.when.apply($.when,children_dtds).done((function(winScope,successback,errorback){
            return function(){
                if(!exeError){//如果子窗体已经取消关闭了，就不用再执行本窗体的关闭前事件了。
                    var allSuccess = true;
                    var dtds = [];
                    //触发本窗体的关闭前事件
                    for(var i = 0;i<winScope.beforeCloseEvents.length;i++){
                        var dtd = $.Deferred();
                        dtds.push(dtd);
                        var cb_success = callbackFactory.create({"type":callbackFactory.Types.Success,"handler":function(){
                            dtd.resolve();
                        }});
                        var cb_error = callbackFactory.create({"type":callbackFactory.Types.Fail,"handler":function(){
                            allSuccess = false;
                            dtd.resolve();
                        }});
                        ScopeManager.openScope(scopeId);
                        winScope.beforeCloseEvents[i](cb_success,cb_error);
                        ScopeManager.closeScope();
                    }
                    $.when.apply($.when,dtds).done((function(windowScope,success,error){
                        return function(){
                            //判断本窗体是否取消关闭
                            if(windowScope.isCancelClose()){
                                exeError = true;
                            }
                            //恢复窗体默认状态
                            windowScope.markToDefault();
                            //判断是否有取消关闭,或者活动集执行报错
                            if(exeError||!allSuccess){
                                if(typeof(error)=="function"){
                                    error();
                                }
                            }else{
                                if(typeof(success)=="function"){
                                    success();
                                }
                            }
                        }
                    })(winScope,successback,errorback));
                }
            }
        })(this,success,error));*/
  },

  initModule: function (sb) {
    sBox = sb
    var initFunc = Scope.prototype.initModule
    if (initFunc) {
      initFunc.call(this, sb)
    }
    var prototype = Object.create(Scope.prototype)
    prototype.constructor = WindowScope
    sb.util.object.extend(prototype, WindowScope.prototype)
    WindowScope.prototype = prototype
  },
  /**
   * 获取构件编号
   * @return String
   */
  getComponentCode: function () {
    return this.get(this.Keys.componentCode)
  },

  /**
   * 获取窗体编号
   * @return String
   */
  getWindowCode: function () {
    return this.get(this.Keys.windowCode)
  },

  /**
   * 获取窗体插件体系
   * @return String
   */
  getSeries: function () {
    ScopeManager = require('vjs/framework/extension/platform/interface/scope/api/ScopeManager')
    let scope = this
    let hasChild = true
    while (hasChild) {
      let childId = scope.childId
      if (childId != null) {
        scope = ScopeManager.getScope(childId)
      } else {
        hasChild = false
      }
    }
    return scope.get(scope.Keys.type)
    //			return this.get(this.Keys.type);
  },

  /**
   * 设置属性值
   * @param {String} key 属性名称
   * @param {Any} val 属性值
   */
  set: function (key, val) {
    /*if(this.Keys.hasOwnProperty(key)){
            throw Error("[WindowScope.set]"+key+"为内部属性，无法设置，请更改属性名称！");
        }*/
    this.properties[key] = val
  },

  /**
   * 将窗体标记为默认状态
   * */
  markToDefault: function () {
    this.cancelCloseIden = false
  },

  /**
   * 是否取消关闭窗体
   * */
  isCancelClose: function () {
    return this.cancelCloseIden
  },

  /**
   * 设置为取消窗体关闭
   * */
  cancelClose: function () {
    this.cancelCloseIden = true
  },

  /**
   * 设置来源窗体的标题
   * */
  setOriginalTitle: function (title) {
    this.originalTitle = title
  },

  /**
   * 获取来源窗体的标题
   * */
  getOriginalTitle: function () {
    return this.originalTitle
  },

  /**
   * 是否退出窗体
   * */
  isExitWindow: function () {
    return this.exitWindow
  },

  /**
   * 退出窗体属性设置为 false 不退出
   * */
  setNotExitWindow: function () {
    this.exitWindow = false
  },

  /**
   * 退出窗体属性设置为默认值
   * */
  setDefaultExitWindow: function () {
    this.exitWindow = true
  },

  getExtendId: function () {
    return this.extendId
  },

  setExtendId: function (extendId) {
    this.extendId = extendId
  },

  getChildId: function () {
    return this.childId
  },

  setChildId: function (id) {
    return (this.childId = id)
  },

  getWaterMark: function () {
    return this.waterMark
  },

  setWaterMark: function (waterMark) {
    this.waterMark = waterMark === true ? true : false
  },

  setWidget: function (widgetId, propertyName, propertyValue) {
    let widgets = this.properties[this.Keys.widgets]
    if (!widgets[widgetId]) {
      widgets[widgetId] = {}
    }
    widgets[widgetId][propertyName] = propertyValue
  },

  getWidget: function (widgetId, propertyName) {
    let widgets = this.properties[this.Keys.widgets][widgetId]
    if (!propertyName) {
      return widgets
    }
    if (widgets) {
      return widgets[propertyName]
    }
    return null
  },

  getWidgets: function () {
    return this.properties[this.Keys.widgets]
  },

  getTitle: function () {
    //获取显示的标题
    let windowCode = this.properties[this.Keys.windowCode]
    let widgets = this.properties[this.Keys.widgets][windowCode]
    let defaultTitle = ''
    if (widgets) {
      defaultTitle = widgets['SimpleChineseTitle']
      if (null == defaultTitle || '' == null) {
        defaultTitle = widgets.Name //模态窗体标题
      }
    }
    let params = {
      componentCode: this.properties[this.Keys.componentCode],
      windowCode: windowCode,
      code: 'name',
      defaultVal: defaultTitle
    }
    if (null == i18nWindowManager) {
      i18nWindowManager = sBox.getService(
        'vjs.framework.extension.platform.interface.i18n.window'
      )
    }
    return i18nWindowManager.get(params)
  },
  setDivWindowType: function (isSimple) {
    //设置div窗体类型
    if (true === isSimple) {
      this.isSimple = true
    } else {
      this.isSimple = false
    }
  },
  isSimpleDivWindow: function () {
    //是否是simple的div窗体
    return this.isSimple
  },
  setOpenMode: function (mode) {
    //设置窗体打开模式
    this.openMode = mode
  },
  getOpenMode: function () {
    //获取窗体打开模式
    return this.openMode
  }
}

return WindowScope

export {
  createScope,
  createWindowScope,
  createComponentScope,
  isWindowScope,
  isComponentScope,
  getWindowScope,
  openScope,
  getCurrentScopeId,
  getParentScopeId,
  closeScope,
  getChildrenScopes,
  destroy,
  isDestroy,
  on,
  getScope,
  getProperty,
  getPropertyById,
  setProperty,
  hasProperty,
  removeProperty,
  _getInstanceIds,
  createScopeHandler,
  checkEntity,
  getChildWindowScope,
  getParentWindowScope
}
