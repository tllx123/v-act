;(function (ctx) {
  var vdk = ctx.vdk
  if (!vdk) {
    vdk = {}
    ctx.vdk = vdk
  }
  var namespace = 'postMsg'
  var postMsg = vdk[namespace]
  if (!vdk.postMsg) {
    vdk.postMsg = {
      _SANDBOX: null,
      _Version: '1.0',
      _PMIDEN: 'vplatform_pm_' + new Date().getTime(), //每个页面的pm标识
      _PMPARENDIDEN: null, //父级页面pm标识，如果为空标识没有父级
      _VJSLIST: [
        'vjs.framework.extension.platform.services.view.modal',
        'vjs.framework.extension.platform.interface.scope',
        'vjs.framework.extension.ui.adapter.resourcepackage',
        'vjs.framework.extension.platform.services.view.widget.common.action',
        'vjs.framework.extension.platform.interface.event',
        'vjs.framework.extension.platform.data.manager.runtime.window.iframe',
        'vjs.framework.extension.ui.adapter.dependency'
      ],
      _OPENIDEN: {}, //打开窗体的标识，用于区分是跳转的场景：打开A、打开B，B跳转A
      _OPENMAPPING: {}, //打开的窗体映射信息
      _STATE: null, //当前接口状态
      _REGISTERCROSSEVENT: false, //是否注册跨域事件
      _STACK: [], //请求结束后回调
      _MissUpdateInfo: [],
      _LOG: function (content, type) {
        var type = !type ? 'log' : type
        if (window.console && window.console[type]) {
          window.console[type](content)
        }
      },
      _addMissInfo: function (info) {
        //保存跳转后无法更新打开信息的信息
        this._MissUpdateInfo.push(info)
      },
      _clearMissInfo: function () {
        var scopeManager = this._SANDBOX.getService(
          'vjs.framework.extension.platform.interface.scope.ScopeManager'
        )
        var missInfo = this._MissUpdateInfo
        if (missInfo) {
          //补偿跳转后无法更新信息而导致窗体无法销毁的问题
          for (var i = 0, len = missInfo.length; i < len; i++) {
            var mi = missInfo[i]
            if (mi.scopeId) scopeManager.destroy(mi.scopeId)
          }
        }
        this._MissUpdateInfo = []
      },
      _getCount: function () {
        var count = 0
        for (var key in this._OPENMAPPING) {
          count++
        }
        return count
      },
      getVersion: function () {
        return this._Version
      },
      getPMIden: function () {
        //获取当前postMsg标识
        if (null == this._PMIDEN) {
          this._PMIDEN = 'vplatform_pm_' + new Date().getTime()
        }
        return this._PMIDEN
      },
      setParentPMIden: function (parentPM) {
        this._PMPARENDIDEN = parentPM
      },
      _getKey: function (componentCode, windowCode, _urlObj) {
        var paramKey = ''
        if (
          _urlObj &&
          _urlObj.params &&
          _urlObj.params.token &&
          _urlObj.params.token.variable
        ) {
          var paramKeyArr = []
          var variable = _urlObj.params.token.variable
          for (var key in variable) {
            paramKeyArr.push(key + ':' + variable[key])
          }
          if (paramKeyArr.length > 0) {
            paramKey = VMetrix._fn.md5(paramKeyArr.join(','))
          }
        }
        var preKey = componentCode + '$_$' + windowCode
        var iden = VMetrix._fn.md5(preKey)
        var returnKey = iden + '$_$' + paramKey
        this._OPENIDEN[returnKey] = preKey
        return returnKey
      },
      _getInfo: function (componentCode, windowCode, _urlObj) {
        //获取打开映射信息
        var key = this._getKey(componentCode, windowCode, _urlObj)
        var openmappings = this._OPENMAPPING
        for (var k in openmappings) {
          var openmapping = openmappings[k]
          if (openmapping.iden == key) {
            return openmapping
          }
        }
        return false
        //				var key = this._getKey(componentCode,windowCode, _urlObj);
        //				var info = this._OPENMAPPING[key];
        //				if(!this._OPENMAPPING[key]){
        //					this._LOG("没有找到窗体-["+windowCode+"]打开的标识，窗体所属构件: " + componentCode, "warn");
        //					return false;
        //				}
        //				return info;
      },
      putAllInfo: function (params) {
        var key = this._getKey(
          params.componentCode,
          params.windowCode,
          params._$urlObj
        )
        var info = this._OPENMAPPING[key]
        if (info) {
          for (var k in params) {
            if (params.hasOwnProperty(k)) {
              info[k] = params[k]
            }
          }
        }
      },
      _updateInfo: function (params) {
        //更新打开的映射信息，需要先销毁原来的那个窗体后才更新，另：此为跳转接口专用
        var key = this._getKey(
          params.componentCode,
          params.windowCode,
          params._$urlObj
        )
        var openmappings = this._OPENMAPPING
        var targetInfo
        for (var iden in openmappings) {
          var openmapping = openmappings[iden]
          if (openmapping.iden == key) {
            params.iden = key
            targetInfo = openmapping
          }
        }
        if (targetInfo) {
          targetInfo.componentCode = params.newComponentCode
          targetInfo.windowCode = params.newWindowCode
          targetInfo.scopeId = params.scopeId
          targetInfo.destroy = false
        } else {
          this._addMissInfo(params)
        }
        //				var key = this._getKey(params.componentCode,params.windowCode,params._$urlObj);
        //				var info = this._OPENMAPPING[key];
        //				var newInfo = {};
        //				for(var k in info){
        //					if(info.hasOwnProperty(k)){
        //						newInfo[k] = info[k];
        //					}
        //				}
        //				var newComponentCode = params.newComponentCode;
        //				var newWindowCode = params.newWindowCode;
        //				newInfo.componentCode = newComponentCode;
        //				newInfo.windowCode = newWindowCode;
        //				newInfo.scopeId = params.scopeId;
        //				newInfo.destroy = false;
        //				try{
        //					delete this._OPENMAPPING[key];
        //				}catch(e){ }
        //				this._OPENMAPPING[this._getKey(newComponentCode,newWindowCode,params._$urlObj)] = newInfo;
      },
      updateInfoByScopeId: function (scopeId, params) {
        var infos = this._OPENMAPPING
        if (infos && params) {
          for (var key in infos) {
            if (!infos.hasOwnProperty(key)) {
              continue
            }
            var info = infos[key]
            if (info.scopeId != scopeId) {
              continue
            }
            for (var k in params) {
              if (!params.hasOwnProperty(k)) {
                continue
              }
              info[k] = params[k]
            }
            if (params._$urlObj) {
              //重新更新key，如果是链接地址，那么激活时需要参数校验
              var newKey = this._getKey(
                info.componentCode,
                info.windowCode,
                params._$urlObj
              )
              if (newKey != key) {
                try {
                  delete infos[key]
                } catch (e) {}
                infos[newKey] = info
              }
            }
            break
          }
        }
      },
      _removeInfo: function (componentCode, windowCode, _urlObj, sourceInfo) {
        //移除打开的映射信息
        var key
        if (sourceInfo && sourceInfo.iden) {
          key = sourceInfo.iden
        } else {
          key = this._getKey(componentCode, windowCode, _urlObj)
        }
        var info = this._OPENMAPPING[key]
        try {
          delete this._OPENMAPPING[key]
        } catch (e) {}
        var eventManager = this._SANDBOX.getService(
          'vjs.framework.extension.platform.interface.event.EventManager'
        )
        //通知父级退出了窗体
        eventManager.fireCrossDomainEvent({
          eventName: eventManager.CrossDomainEvents.CustomEvent,
          eventInfo: {
            parentPM: this._PMPARENDIDEN,
            type: 'CloseWindow'
          },
          params: {
            componentCode: componentCode,
            windowCode: windowCode,
            _urlObj: info ? info['_$urlObj'] : null,
            iden: this.getPMIden()
          }
        })
      },
      _closeModal: function (info) {
        //iframe内部通知外面关闭模态框 组件容器打开也会调用？
        var eventManager = this._SANDBOX.getService(
          'vjs.framework.extension.platform.interface.event.EventManager'
        )
        var closeParams = {
          pmIden: this.getPMIden()
        }
        var scopeManager = this._SANDBOX.getService(
          'vjs.framework.extension.platform.interface.scope.ScopeManager'
        )
        var closeIden = scopeManager.getWindowScope().get('CloseIden')
        closeParams.isClickConfirm = closeIden //是否确认关闭
        if (true === closeIden) {
          var wParamManager = this._SANDBOX.getService(
            'vjs.framework.extension.platform.services.param.manager.WindowParam'
          )
          var tmpOutputs = wParamManager.getOutputs()
          var outputs = {}
          if (tmpOutputs) {
            for (var code in tmpOutputs) {
              if (!tmpOutputs.hasOwnProperty(code)) {
                continue
              }
              var value = tmpOutputs[code]
              if (value && typeof value.getMetadata == 'function') {
                //暂不支持实体
                continue
              }
              outputs[code] = value
            }
          }
          closeParams.outputs = outputs
        }
        //通知父级关闭模态框
        eventManager.fireCrossDomainEvent({
          eventName: eventManager.CrossDomainEvents.CustomEvent,
          eventInfo: {
            parentPM: this._PMPARENDIDEN,
            type: 'CloseModal'
          },
          params: closeParams
        })
        if (info) {
          var count = 0
          for (var key in this._OPENMAPPING) {
            var domInfo = this._OPENMAPPING[key]
            if (domInfo.iden == info.iden) {
              delete this._OPENMAPPING[key]
            } else {
              count++
            }
          }
        } else {
          this._OPENMAPPING = {}
        }
        this._clearMissInfo()
      },
      _removeAll: function () {
        //清除全部打开信息，当前窗体跳转使用
        this._resetState()
        var newInfo = {}
        var scopeManager = this._SANDBOX.getService(
          'vjs.framework.extension.platform.interface.scope.ScopeManager'
        )
        var count = 0
        for (var key in this._OPENMAPPING) {
          count++
          var domInfo = this._OPENMAPPING[key]
          scopeManager.destroy(domInfo.scopeId)
        }
        if (count == 0) {
          this._closeModal()
        }
        this._clearMissInfo()
      },
      _resetState: function () {
        this._STATE = null
        this._STACK = []
      },
      _getNextTask: function () {
        //获取下一个回调
        if (this._STACK.length < 1) {
          this._resetState()
          return
        }
        this._STATE = null
        var call = this._STACK.splice(0, 1)
        if (call.length > 0) {
          this._exeCallback(call[0])
        }
      },
      _exeCallback: function (callback) {
        if (this._STATE) {
          this._STACK.push(callback)
          return
        }
        this._STATE = 'LoadVjs'
        var _this = this
        callback(this._SANDBOX)
        return
        //				var call = function(app_sandbox){
        //					var list = requireVjs ? requireVjs : _this._VJSLIST;
        //					var sandbox = app_sandbox.create({
        //						extensions: list
        //					});
        //					sandbox.active().done(function(){
        //						callback(sandbox);
        //					});
        //				}
        //				if(null == this._APP_SANDBOX){
        //					var _this = this;
        //					var vjsList = _this._VJSLIST;
        //					ctx.VMetrix.loadBundles(vjsList, function (bundles) {
        //						var App = ctx.VMetrix.getVJSApp();
        //						var app = new App({
        //							name : ""
        //						});
        //						app.start().done(function(){
        //							_this._APP_SANDBOX = app.sandboxes;
        //							call(_this._APP_SANDBOX);
        //						});
        //					},function(error){
        //						this._resetState();
        //						throw Error("无法获取vjs资源,vjs列表： " + vjsList.join(","));
        //					});
        //				}else{
        //					call(_this._APP_SANDBOX);
        //				}
      },
      /**
       * 判断当前vdk上的标识是否一致
       * */
      isMySelf: function (iden) {
        if (this.getPMIden() === iden) {
          return true
        }
        return false
      },
      /**
       * 是否同源，用于鉴别是否同一个iframe
       * @param	{String}	iden	域名经过md5的结果
       * */
      isSimpleOrgin: function (iden) {
        if (
          !iden ||
          iden !=
            VMetrix._fn.md5(
              window.location.protocol + '//' + window.location.host
            )
        ) {
          return false
        }
        return true
      },
      /**
       * 是否注册跨域事件
       * */
      isRegisterCrossEvent: function () {
        return this._REGISTERCROSSEVENT
      },
      /**
       * 是否注册跨域事件
       * */
      setRegisterCrossEvent: function () {
        this._REGISTERCROSSEVENT = true
      },
      /**
       * 初始化页面监听事件
       * @param	{Object}	params	参数
       * {
       * 	"scope"		:		窗体域
       * }
       * */
      init: function (params) {
        var _this = this
        this._SANDBOX = params.sandbox
        var callback = function (sandbox) {
          var eventManager = sandbox.getService(
            'vjs.framework.extension.platform.interface.event.EventManager'
          )
          if (!_this.isRegisterCrossEvent()) {
            _this.setRegisterCrossEvent()
            var crossEvent = {
              OpenWindow: function (params) {
                _this.openWindow(params)
              },
              ActiveWindow: function (params) {
                _this.active(params)
              },
              CloseWindow: function (params) {
                _this.close(params)
              }
            }
            for (var eName in crossEvent) {
              eventManager.onCrossDomainEvent({
                eventName: eventManager.CrossDomainEvents[eName],
                eventInfo: {
                  condition: "nowPM='" + _this.getPMIden() + "'"
                },
                handler: crossEvent[eName]
              })
            }
          }
          var scope = params.scope
          if (scope) {
            var scopeManager = sandbox.getService(
              'vjs.framework.extension.platform.interface.scope.ScopeManager'
            )
            var iframeManager = sandbox.getService(
              'vjs.framework.extension.platform.data.manager.runtime.window.iframe.VPlatfromIframeManager'
            )
            var url = params.url
            if (url && '' != url) {
              url = iframeManager.parseUrl(url)
            }
            var scopeId = scope.getInstanceId()
            var componentCode = scope.getComponentCode()
            var windowCode = scope.getWindowCode()
            var _parmas = {
              iden: vdk.postMsg._getKey(componentCode, windowCode, url),
              componentCode: componentCode,
              windowCode: windowCode,
              modalCode: $('body').attr('id'),
              scopeId: scopeId,
              _$urlObj: url
            }
            vdk.postMsg._putRoot(_parmas)
            if (scope.get('type') == 'bootstrap') {
              scope.on(
                scopeManager.EVENTS.DESTROY,
                (function (comCode, winCode) {
                  return function () {
                    var info = _this._getInfo(comCode, winCode)
                    if (info && info.modalCode) {
                      $('#' + info.modalCode).remove()
                    }
                  }
                })(componentCode, windowCode)
              )
            }
            var removeModalFunc = scope.get('RemoveModalFunc')
            if (typeof removeModalFunc == 'function') {
              scope.un(scopeManager.EVENTS.DESTROY, removeModalFunc)
            }
            var cf = (function (_p) {
              return function () {
                _this._closeModal(_p)
              }
            })(_parmas)
            scope.on(scopeManager.EVENTS.DESTROY, cf)
            /* 删除模态窗口的函数  模态窗体里执行打开链接地址的当前窗体跳转后需要使用 */
            scope.set('RemoveModalFunc', cf)
            var removeopeninfo = (function (comCode, winCode, _url) {
              return function () {
                _this._removeInfo(comCode, winCode, _url) //移除映射信息
              }
            })(componentCode, windowCode, url)
            scope.set('RemoveOpenInfo', removeopeninfo)
            scope.on(scopeManager.EVENTS.DESTROY, removeopeninfo)
          }
          vdk.postMsg._getNextTask()
        }
        _this._exeCallback(callback)
      },
      /**
       * 打开最大化窗体
       * @param	{Object}	params	窗体信息
       * {
       * 		componentCode	{String}	'构件编码',
       * 		windowCode		{String}	'窗体编码',
       * 		inputParams		{Object}	'输入参数',
       * 		renderedFunc	{Function}	'输入参数',
       * 		closeFunc		{Function}	'窗体关闭调用
       * }
       * */
      openWindow: function (params) {
        var componentCode = params.componentCode
        var windowCode = params.windowCode
        //链接地址打开会传入
        var _$urlObj = params._$urlObj
        //当前窗体标识
        var key = this._getKey(componentCode, windowCode, _$urlObj)
        var domInfo = this._OPENMAPPING[key]
        //已经打开的窗体变成激活
        if (domInfo) {
          if (!domInfo.isRoot || !domInfo.destroy) {
            //如果不是根，或者是根并且没有被销毁的话，就激活
            this.active(params)
            return
          }
        }
        var inputParams = params.inputParams
        var renderedFunc = params.renderedFunc //窗体渲染完成调用的方法
        var closeFunc = params.closeFunc //窗体关闭调用的方法
        var _this = this
        var callback = function (sandbox) {
          if (!sandbox) {
            _this._LOG('无法获取vjs服务')
            this._resetState()
            return
          }
          _this._STATE = 'CreateModal'
          //					if(false && _this._getCount() == 0){//如果没有打开页面，默认就是根，不可行：因为没有插件体系，不知道调用哪个
          //						_this._STATE = null;
          ////						var browser = sandbox.getService("vjs.framework.extension.platform.services.browser.Browser");
          //						var actionHandler = sandbox.getService("vjs.framework.extension.platform.services.view.widget.common.action.WidgetAction");
          //						actionHandler.executeComponentAction("loadComponent", componentCode, windowCode, inputParams,{
          //							missCloseEvent : true
          //						})
          ////						browser.redirectModule({
          ////							"componentCode": componentCode,
          ////							"windowCode": windowCode,
          ////							"params": {
          ////								inputParam: inputParams
          ////							}
          ////						});
          //						return;
          //					}
          var modalUtil = sandbox.getService(
            'vjs.framework.extension.platform.services.view.modal.Modal'
          )
          var ScopeManager = sandbox.getService(
            'vjs.framework.extension.platform.interface.scope.ScopeManager'
          )
          var preScopeId = null
          var newScopeId = ScopeManager.createWindowScope({
            parentScopeId: preScopeId,
            componentCode: componentCode,
            windowCode: windowCode
          })
          var isRoot = _this._getCount() == 0 ? true : false
          var progressbar = sandbox.getService(
            'vjs.framework.extension.ui.common.plugin.services.progressbar.ProgressBarUtil'
          )
          if (!isRoot) {
            var i18n = sandbox.getService(
              'vjs.framework.extension.platform.interface.i18n.platform'
            )
            var showMsg = i18n.get(
              '数据加载中，请稍候...',
              '打开模态窗体时进度条显示的文字'
            )
            if (!showMsg) {
              showMsg = '数据加载中，请稍候...'
            }
            progressbar.showProgress(showMsg)
            ScopeManager.getScope(newScopeId).setOpenMode(
              ScopeManager.OpenMode.ModalCommon
            )
          }
          var loadResourceCallback = ScopeManager.createScopeHandler({
            scopeId: newScopeId,
            handler: function () {
              var resourcePackage = sandbox.getService(
                'vjs.framework.extension.ui.adapter.resourcepackage'
              )
              resourcePackage.setWindowCurrentResourceCode(
                newScopeId,
                preScopeId,
                componentCode
              )
              var type = ScopeManager.getProperty('type')
              var componentUtil = sandbox.getService(
                'vjs.framework.extension.ui.adapter.init.' + type + '.web.util'
              )
              componentUtil.renderComponentById(
                componentCode,
                windowCode,
                inputParams || {},
                {
                  scopeId: newScopeId,
                  inited: function () {
                    /* IE下，修改浏览器地址会导致后面的请求会挂起*/
                    var urlServer = _this._SANDBOX.getService(
                      'vjs.framework.extension.platform.services.url'
                    )
                    // 重新组装 url
                    urlServer.rebuildUrl(
                      _this._getCount() == 0,
                      windowCode,
                      componentCode,
                      inputParams
                    )
                  },
                  rendered: ScopeManager.createScopeHandler({
                    scopeId: newScopeId,
                    handler: function (component, scopeId) {
                      //判断是否根节点
                      var isRoot = _this._getCount() == 0 ? true : false
                      /**
                       * 渲染回调
                       * */
                      var rendered = ScopeManager.createScopeHandler({
                        scopeId: newScopeId,
                        handler: function (
                          containerCode,
                          closeFunc,
                          setTitleFunc,
                          renderParams
                        ) {
                          var scope = ScopeManager.getWindowScope()
                          var newInfos
                          if (isRoot) {
                            newInfos = {
                              modalCode: containerCode,
                              scopeId: newScopeId,
                              isRoot: true,
                              componentCode: componentCode,
                              windowCode: windowCode,
                              _$urlObj: _$urlObj,
                              isShow: true
                            }
                            var removeModalFunc = scope.get('RemoveModalFunc')
                            if (typeof removeModalFunc == 'function') {
                              scope.un(
                                ScopeManager.EVENTS.DESTROY,
                                removeModalFunc
                              )
                            }
                            var cf = (function (info) {
                              return function () {
                                _this._closeModal(info)
                              }
                            })(newInfos)
                            scope.on(ScopeManager.EVENTS.DESTROY, cf)
                            /* 删除模态窗口的函数  模态窗体里执行打开链接地址的当前窗体跳转后需要使用 */
                            scope.set('RemoveModalFunc', cf)
                            //移除映射信息
                            var removeopeninfo = (function (
                              _componentCode,
                              _windowCode
                            ) {
                              return function () {
                                _this._removeInfo(componentCode, windowCode) //移除映射信息
                              }
                            })(componentCode, windowCode)
                            scope.on(
                              ScopeManager.EVENTS.DESTROY,
                              removeopeninfo
                            )
                            if (scope.get('type') == 'bootstrap') {
                              var containId = $(component).attr('id')
                              newInfos.modalCode = containId
                              scope.on(
                                ScopeManager.EVENTS.DESTROY,
                                (function (conId) {
                                  return function () {
                                    $('#' + conId).remove()
                                  }
                                })(containId)
                              )
                            }
                          } else {
                            for (var _id in _this._OPENMAPPING) {
                              _this._OPENMAPPING[_id].isShow = false
                            }
                            newInfos = {
                              modalCode: renderParams.modalCode,
                              hideFunc: renderParams.hideFunc,
                              showFunc: renderParams.showFunc,
                              scopeId: newScopeId,
                              componentCode: componentCode,
                              windowCode: windowCode,
                              isRoot: false,
                              _$urlObj: _$urlObj,
                              isShow: true
                            }
                            var removemodalfunc = function () {
                              if (typeof closeFunc == 'function') {
                                closeFunc() //关闭模态
                              }
                            }
                            scope.on(
                              ScopeManager.EVENTS.DESTROY,
                              removemodalfunc
                            )
                            //移除打开信息
                            var removeopeninfo = (function (
                              _componentCode,
                              _windowCode,
                              _urlObj
                            ) {
                              return function () {
                                _this._removeInfo(
                                  _componentCode,
                                  _windowCode,
                                  _urlObj
                                ) //移除映射信息
                              }
                            })(componentCode, windowCode, _$urlObj)
                            scope.on(
                              ScopeManager.EVENTS.DESTROY,
                              removeopeninfo
                            )
                            scope.set('RemoveModalFunc', removemodalfunc)
                            scope.set('RemoveOpenInfo', removeopeninfo)
                          }
                          //设置为模态容器打开
                          scope.setOpenMode(
                            ScopeManager.OpenMode.ModalContaniner
                          )
                          $('#' + containerCode).css('overflow', 'auto')
                          var widgetRenderer = sandbox.getService(
                            'vjs.framework.extension.platform.services.view.widget.common.action.WidgetRenderer'
                          )
                          widgetRenderer.executeComponentRenderAction(
                            'renderWindowToContainer',
                            component,
                            containerCode,
                            !isRoot
                          )
                          //												var sourceInfos = _this._OPENMAPPING[key];
                          //												if(sourceInfos && sourceInfos.isRoot){//如果是存在，并且是根
                          //													newInfos.isRoot = true;//根
                          //													newInfos.destroy = false;//没销毁
                          //													newInfos.toModal = true;//没销毁
                          //												}
                          var eventManager = sandbox.getService(
                            'vjs.framework.extension.platform.interface.event.EventManager'
                          )
                          eventManager.fireCrossDomainEvent({
                            eventName:
                              eventManager.CrossDomainEvents.CustomEvent,
                            eventInfo: {
                              type: 'SetTitle',
                              parentPM: _this._PMPARENDIDEN
                            },
                            params: {
                              title: scope.getTitle(),
                              isInit: true //标记当前属于页面初始化时修改标题，为了区分动态修改标题的情况
                            }
                          })
                          newInfos.iden = _this._getKey(
                            newInfos.componentCode,
                            newInfos.windowCode,
                            newInfos._$urlObj
                          )
                          _this._OPENMAPPING[key] = newInfos
                          if (!isRoot) progressbar.hideProgress()
                          _this._getNextTask() //下一个任务
                        }
                      })

                      var bgColor
                      var sourceInfos = _this._OPENMAPPING[key]
                      if (isRoot) {
                        //如果是存在，并且是根
                        bgColor = 'background-color:#eff0f4;' //内容背景色
                        var rootContainer = $('body').attr('id')
                        rendered(rootContainer)
                      } else {
                        modalUtil.create({
                          title: '打开页面',
                          width: 100,
                          height: 100,
                          rendered: rendered,
                          //											closed : function(){},
                          //											resized : function(){},
                          formBorderStyle: 'None',
                          windowState: 'Maximized',
                          //											bgColor : bgColor,//内容背景色
                          maximizeBox: false
                        })
                      }
                    }
                  })
                },
                function (exception) {
                  _this._resetState()
                  exception.markTiped()
                  _this._LOG(
                    '无法打开窗体[' +
                      windowCode +
                      '],所属构件: ' +
                      componentCode,
                    'error'
                  )
                  throw exception
                }
              )
            }
          })
          var dependency = sandbox.getService(
            'vjs.framework.extension.ui.adapter.dependency'
          )
          dependency.loadResources(
            componentCode,
            windowCode,
            sandbox,
            newScopeId,
            loadResourceCallback,
            function (error) {
              _this._STATE = null
              _this._LOG(
                '无法打开窗体[' + windowCode + '],所属构件: ' + componentCode,
                'error'
              )
            }
          )
        }
        this._exeCallback(callback)
      },
      /**
       * 激活窗体
       * @param	{Object}	params	窗体信息
       * {
       * 		componentCode	:	'构件编码',
       * 		windowCode		:	'窗体编码',
       * }
       * */
      active: function (params) {
        var componentCode = params.componentCode
        var windowCode = params.windowCode
        var _urlObj = params._$urlObj
        var tmpInfo = this._getInfo(componentCode, windowCode, _urlObj)
        if (!tmpInfo) {
          this._LOG(
            '获取不到打开的窗体[' +
              componentCode +
              ']信息, 所属构件: ' +
              windowCode +
              ', 已忽略处理.',
            'warn'
          )
          return
        }
        var iden = tmpInfo.iden
        var mapping = this._OPENMAPPING
        if (tmpInfo.isShow) {
          return //已激活状态
        }
        var activeInfo
        for (var key in mapping) {
          var info = mapping[key]
          if (iden == info.iden) {
            info.isShow = true
            if (!info.isRoot || info.toModal) {
              activeInfo = info
              continue
            }
          } else {
            info.isShow = false
            if (!info.isRoot || info.toModal) {
              info.hideFunc(info.modalCode, null, true)
            }
          }
        }
        if (activeInfo) {
          activeInfo.showFunc(activeInfo.modalCode, null)
        }
      },
      /**
       * 关闭窗体
       * @param	{Object}	params	窗体信息
       * {
       * 		componentCode	:	'构件编码',
       * 		windowCode		:	'窗体编码'，
       * 		closeAll		:	false//是否关闭全部
       * }
       * */
      close: function (params) {
        var callback
        var _this = this
        if (params.closeAll) {
          callback = function () {
            _this._removeAll()
            _this._getNextTask()
          }
        } else {
          var _urlObj = params._$urlObj
          var info = this._getInfo(
            params.componentCode,
            params.windowCode,
            _urlObj
          )
          if (!info) {
            return
          }
          var scopeId = info.scopeId
          callback = function (sandbox) {
            var ScopeManager = sandbox.getService(
              'vjs.framework.extension.platform.interface.scope.ScopeManager'
            )
            ScopeManager.destroy(scopeId)
            _this._getNextTask()
          }
        }
        this._exeCallback(callback)
      },
      _putRoot: function (params) {
        var componentCode = params.componentCode
        var windowCode = params.windowCode
        var key = this._getKey(componentCode, windowCode, params._$urlObj)
        if (!this._OPENMAPPING.hasOwnProperty(key)) {
          this._OPENMAPPING[key] = {
            iden: key,
            scopeId: params.scopeId,
            componentCode: componentCode,
            windowCode: windowCode,
            isRoot: true,
            isShow: true
          }
        }
      }
    }
  }
})(window)
