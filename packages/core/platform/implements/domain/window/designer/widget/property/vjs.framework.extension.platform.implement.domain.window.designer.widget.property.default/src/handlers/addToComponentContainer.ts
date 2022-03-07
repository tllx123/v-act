define('./addToComponentContainer', function (require, exports, module) {
  var sandBox,
    scopeManager,
    widgetContext,
    componentPack,
    windowMapping,
    windowParam,
    widgetRenderer
  var WindowContainer,
    windowRelation,
    eventManager,
    widgetAction,
    ScopeTask,
    resourcePackage
  var widgetRenderer, containerRelation, exceptionFactory

  export function initModule(sBox) {
    sandBox = sBox
    scopeManager = sBox.getService(
      'vjs.framework.extension.platform.interface.scope.ScopeManager'
    )
    widgetContext = sBox.getService(
      'vjs.framework.extension.platform.services.view.widget.common.context.WidgetContext'
    )
    componentPack = require('vjs/framework/extension/platform/implement/domain/window/designer/widget/property/default/handlers/handleComponentPackInfo')
    windowMapping = require('vjs/framework/extension/platform/implement/domain/window/designer/widget/property/default/handlers/handleWindowMapping')
    windowParam = sBox.getService(
      'vjs.framework.extension.platform.services.param.manager.WindowParam'
    )
    widgetRenderer = sBox.getService(
      'vjs.framework.extension.platform.services.view.widget.common.action.WidgetRenderer'
    )
    WindowContainer = sBox.getService(
      'vjs.framework.extension.platform.services.view.relation.WindowContainer'
    )
    windowRelation = sBox.getService(
      'vjs.framework.extension.platform.services.view.relation.WindowContainerManager'
    )
    eventManager = sBox.getService(
      'vjs.framework.extension.platform.services.view.event.EventManager'
    )
    widgetAction = sBox.getService(
      'vjs.framework.extension.platform.services.view.widget.common.action.WidgetAction'
    )
    ScopeTask = sBox.getService(
      'vjs.framework.extension.platform.global.task.ScopeTask'
    )
    TaskManager = sBox.getService(
      'vjs.framework.extension.platform.global.task.TaskManager'
    )
    resourcePackage = sBox.getService(
      'vjs.framework.extension.ui.adapter.resourcepackage'
    )
    exceptionFactory = sBox.getService(
      'vjs.framework.extension.platform.interface.exception.ExceptionFactory'
    )
    widgetRenderer = sBox.getService(
      'vjs.framework.extension.platform.services.view.widget.common.action.WidgetRenderer'
    )
    containerRelation = sBox.getService(
      'vjs.framework.extension.ui.common.plugin.services.container.ContainerRelation'
    )
  }

  // 设置语言
  var _setCurLanguage = function (newScopeId, preScopeId, componentCode) {
    // 设置当前语言
    resourcePackage.setWindowCurrentResourceCode(
      newScopeId,
      preScopeId,
      componentCode
    )
  }

  /**
   * 复制参数信息
   * */
  var copyParamsInfo = function (params) {
    var result = {}
    for (var key in params) {
      if (params.hasOwnProperty(key)) {
        result[key] = params[key]
      }
    }
    return result
  }

  /*
   * 在ui上增加tab
   * @private
   */
  var addTabButtonNew = function (params) {
    var widgetCode = params.widgetCode
    var widget = widgetContext.get(widgetCode, 'widgetObj')
    params.callback = function (params) {
      var canvas = params.canvas,
        tab = params.tab,
        container = params.container,
        newScopeId = params.newScopeId,
        newWindowCode = params.newWindowCode,
        _containerCode = params.containerCode,
        _oldScopeId = params.oldScopeId,
        closeFunc = params.closeFunc,
        readyFunc = params.readyFunc
      scopeManager.openScope(newScopeId)

      //建立窗体与组件容器关系
      var containerCode = canvas.getCanvasName()
      var property = {
        windowCode: newWindowCode,
        scopeId: _oldScopeId,
        type: 'ComponentContainer'
      }
      containerRelation.register(_containerCode, containerCode, property)
      if (tab) {
        tab.pane.windowScopeId = newScopeId
        var func = (function (sId, cCode) {
          return function (tabButton) {
            if (sId == tabButton.pane.windowScopeId) {
              closeFunc(cCode)
            }
          }
        })(newScopeId, containerCode)
        container.on('closeClick', func)
      }
      readyFunc(
        canvas,
        containerCode,
        (function () {
          return function () {
            if (container.tabSetObj) container.tabSetObj.removeTab(tab)
          }
        })(),
        {
          tab: tab
        }
      )
      scopeManager.closeScope()
    }
    widget.addComponent(params)
  }

  /**
   * 加载插件体系资源
   */
  var _loadDependency = function (
    componentCode,
    windowCode,
    scopeId,
    callback,
    fail
  ) {
    var sandBoxs = sandBox.create()
    sandBoxs.use({
      'vjs.framework.extension.ui.adapter.dependency': null
    })
    sandBoxs.active().done(function () {
      var dependency = sandBoxs.getService(
        'vjs.framework.extension.ui.adapter.dependency'
      )
      dependency.loadResources(
        componentCode,
        windowCode,
        sandBoxs,
        scopeId,
        callback,
        fail
      )
    })
  }

  /**
   * 复制参数信息
   * */
  var copyParamsInfo = function (params) {
    var result = {}
    for (var key in params) {
      if (params.hasOwnProperty(key)) {
        result[key] = params[key]
      }
    }
    return result
  }

  /**
   * 获取窗体输出参数
   * */
  var getWindowOutputParams = function (scopeId) {
    return scopeManager.createScopeHandler({
      scopeId: scopeId,
      handler: function () {
        var windowScope = scopeManager.getWindowScope()
        //退出规则里设置
        var closeIden = windowScope.get('CloseIden')
        var datas = {
          selectConfirm: closeIden ? true : false
        }
        var componentCode = windowScope.getComponentCode()
        var windowCode = windowScope.getWindowCode()
        var allOutputDefine = windowParam.getOutputDefines(
          componentCode,
          windowCode
        )
        var outParams = {}
        if (allOutputDefine) {
          var params = {
            componentCode: componentCode,
            windowCode: windowCode
          }
          for (var i = 0, len = allOutputDefine.length; i < len; i++) {
            var code = allOutputDefine[i].code
            params.code = code
            outParams[code] = windowParam.getOutput(params)
          }
        }
        datas.outParams = outParams
        return datas
      }
    })()
  }

  /**
   * 失败回调
   * */
  var errorCallback = function (exception, params) {
    if (exception) {
      var widgetCode = params.widgetCode,
        newComponentCode = params.newComponentCode,
        newWindowCode = params.newWindowCode,
        preScopeId = params.preScopeId,
        newScopeId = params.newScopeId,
        windowContainerId = params.windowContainerId,
        isSingle = params.isSingle,
        addTabParams = params.addTabParams
      scopeManager.openScope(preScopeId)
      var canvasName
      var tmp_addTabParams = copyParamsInfo(addTabParams)
      tmp_addTabParams['title'] = '错误信息'
      tmp_addTabParams['readyFunc'] = function (
        container,
        containerCode,
        closeFunc,
        extraParams
      ) {
        ScopeManager.openScope(preScopeId)
        var oldScopeId = widgetAction.executeComponentAction(
          'getContainerScopeId',
          containerCode
        )
        if (oldScopeId) {
          //销毁原有的窗体
          scopeManager.openScope(oldScopeId)
          widgetAction.executeComponentAction('closeComponent')
          scopeManager.closeScope()
        }
        scopeManager.closeScope()

        scopeManager.openScope(preScopeId)
        var scope = scopeManager.getWindowScope()
        var prewindowCode = scope.getWindowCode()
        var property = {
          windowCode: newWindowCode,
          scopeId: preScopeId,
          type: 'Component'
        }
        canvasName =
          newComponentCode +
          '_' +
          newWindowCode +
          '_' +
          newWindowCode +
          '_' +
          newScopeId
        containerRelation.register(containerCode, canvasName, property)
        // 在容器中存储新窗体的信息
        widgetAction.executeComponentAction(
          'updateContainerInfo',
          containerCode,
          newScopeId,
          newComponentCode,
          newWindowCode
        )
        // 容器关闭的时候寻找当前容器内部的窗体进行销毁
        eventManager.addEventHandler(containerCode, 'OnClose', function () {
          var innerScopeId = widgetAction.executeComponentAction(
            'getContainerScopeId',
            containerCode
          )
          scopeManager.openScope(innerScopeId)

          try {
            scopeManager.createScopeHandler({
              scopeId: preScopeId,
              handler: function () {
                //删除组件容器中打开的窗体信息
                var component = widgetContext.get(widgetCode, 'widgetObj')
                if (component) {
                  component._componentEvent_deleteWindowInfo(windowContainerId)
                }
              }
            })()
          } catch (e) {
            //
          }

          widgetAction.executeComponentAction('closeWindow')
          $('#' + containerCode).empty()
          scopeManager.closeScope()
          //$("#"+containerCode).remove();
        })

        if (!isSingle) {
          // 容器关闭的时候，需要把页签进行关闭。
          eventManager.addEventHandler(containerCode, 'OnClose', function () {
            closeFunc() // 销毁UI，UI操作不需要关注域
          })
        }

        eventManager.addEventHandler(containerCode, 'OnClose', function () {
          scopeManager.openScope(preScopeId)
          unbindControlContainerRelation(widgetCode, windowContainerId)
          //添加关系
          containerRelation.unregister(prewindowCode, containerCode)
          scopeManager.closeScope()
        })
        exception.handle({
          container: $('#' + container.getCanvasName())
        })
        scopeManager.closeScope()
      }
      addTabButtonNew(tmp_addTabParams)
      if (exceptionFactory.isException(exception)) {
        exception.handle()
      } else {
        throw exception
      }
      scopeManager.closeScope()
    }
  }

  /**
   * 解绑控件与窗体容器的关系
   * @param String widgetId 控件编码
   * @param String containerId 窗体容器id，如果此值为空，则解绑该控件关联的所有窗体容器
   * */
  var unbindControlContainerRelation = function (widgetId, containerId) {
    var controlContainerRelation = widgetContext.get(
      widgetId,
      'ControlContainerRelation'
    )
    if (controlContainerRelation) {
      if (containerId) {
        var index = controlContainerRelation.indexOf(containerId)
        if (index != -1) {
          controlContainerRelation.splice(index, 1)
        }
      } else {
        controlContainerRelation = null
      }
      widgetContext.put(
        widgetId,
        'ControlContainerRelation',
        controlContainerRelation
      )
    }
  }

  /*
   * 在ui上增加tab
   * @private
   */
  var addTabButtonNew = function (params) {
    var widgetCode = params.widgetCode
    var widget = widgetContext.get(widgetCode, 'widgetObj')
    params.callback = function (params) {
      var canvas = params.canvas,
        tab = params.tab,
        container = params.container,
        newScopeId = params.newScopeId,
        newWindowCode = params.newWindowCode,
        _containerCode = params.containerCode,
        _oldScopeId = params.oldScopeId,
        closeFunc = params.closeFunc,
        readyFunc = params.readyFunc
      scopeManager.openScope(newScopeId)

      //建立窗体与组件容器关系
      var containerCode = canvas.getCanvasName()
      var scope = scopeManager.getScope()
      var windowCode = scope.getWindowCode()
      var property = {
        windowCode: newWindowCode,
        scopeId: _oldScopeId,
        type: 'ComponentContainer'
      }
      containerRelation.register(_containerCode, containerCode, property)
      var containerInstanceId = container.ID
      if (tab) {
        tab.pane.windowScopeId = newScopeId
        var func = (function (sId, cCode) {
          return function (tabButton) {
            if (sId == tabButton.pane.windowScopeId) {
              closeFunc(cCode)
            }
          }
        })(newScopeId, containerCode)
        container.on('closeClick', func)
      }
      readyFunc(
        canvas,
        containerCode,
        (function () {
          return function () {
            if (container.tabSetObj) container.tabSetObj.removeTab(tab)
          }
        })(),
        {
          tab: tab
        }
      )
      scopeManager.closeScope()
    }
    widget.addComponent(params)
  }

  export function getHandlerName() {
    return 'addToComponentContainer'
  }

  export function getHandler() {
    return function (property, widgetProperty) {
      var handler = scopeManager.createScopeHandler({
        handler: function (widgetCode, cfg) {
          // 兼容传参，因为后续有赋值整个参数传递到别的方法处理，先此处做兼容
          if (cfg.windowCode) {
            cfg.id = cfg.windowCode
          }
          var vjsContext = cfg.vjsContext
          if (cfg.inputParam) {
            cfg.componentVariable = cfg.inputParam
          }
          var flag = cfg.isComponent

          // 处理 MenuEvent 回调
          var cbFunc = cfg.cbFunc
          cbFunc && typeof cbFunc === 'function' && cbFunc()
          var errorFunc = cfg.errorFunc
          //获取当前组件容器信息
          var _componentContainer = widgetContext.get(widgetCode, 'widgetObj')
          if (flag) {
            // 新窗体的信息
            var newWindowCode = cfg.id // windowCode
            var newComponentCode = cfg.componentCode // componentCode
            //替换构件包映射信息
            var newInfo = componentPack.handleComponentPackInfo(
              newComponentCode,
              newWindowCode
            )
            if (newInfo) {
              newComponentCode = newInfo.componentCode
              newWindowCode = newInfo.windowCode
            }
            /* 获取窗体映射信息 */
            var windowMappingInfo = windowMapping.handleWindowMapping(
              newComponentCode,
              newWindowCode
            )
            /* 若窗体映射信息不为空的话，则表示是配置相应的映射信息，需替换 */
            if (windowMappingInfo != null) {
              newComponentCode = windowMappingInfo.componentCode
              newWindowCode = windowMappingInfo.windowCode
            }
            var preScopeId = scopeManager.getCurrentScopeId()
            //窗体关闭后
            var closedCallback = cfg.closed
            if (typeof closedCallback == 'function') {
              closedCallback = scopeManager.createScopeHandler({
                scopeId: preScopeId,
                handler: closedCallback
              })
            }
            //窗体渲染后回调
            var renderedCallback = cfg.rendered
            var newScopeId = scopeManager.createWindowScope({
              parentScopeId: preScopeId,
              componentCode: newComponentCode,
              windowCode: newWindowCode
            })
            var windowScope = scopeManager.getScope(newScopeId)
            if (vjsContext && windowScope.putVjsContext) {
              for (var key in vjsContext) {
                if (vjsContext.hasOwnProperty(key)) {
                  windowScope.putVjsContext(key, vjsContext[key])
                }
              }
            }
            var isSingle = _componentContainer.isSingleContainer()
            if (isSingle) {
              //单页容器
              //删除组件容器中打开的窗体信息
              var component = widgetContext.get(widgetCode, 'widgetObj')
              if (component) {
                component._componentEvent_deleteWindowInfo()
              }
              _componentContainer.unbindControlContainerRelation() //解绑所有跟控件有关的窗体容器id
            }
            var inputParam = cfg.componentVariable
            var callback = cfg.callback
            var completedCallback = cfg.completed
            //获取当前组件容器的父容器
            var info = widgetRenderer.executeComponentRenderAction(
              'getParentContainerInfo'
            )
            // 获取标题名字
            var title = cfg.title
            var otherInfo = cfg.otherInfo
            //窗体容器打开窗体的信息
            var container = new WindowContainer({
              scopeId: newScopeId,
              componentCode: newComponentCode,
              windowCode: newWindowCode,
              title: title,
              windowType: 'ComponentContainer',
              propertys: {
                //窗体设计器支持显示容器中的窗体，用于子窗体查找父窗体
                parentCode: widgetCode
              }
            })
            //把当前打开到组件容器的信息保存一份到窗体容器上面，这份信息不更新（即使打开的窗体内进行当前窗体跳转），并且判断是否打开以组件容器上面的信息为准。
            var newContainer = container.clone()
            _componentContainer._componentEvent_addWindowInfo(newContainer)

            var windowContainerId = windowRelation.put(container)
            var identityId = windowContainerId
            //绑定控件跟窗体容器的关系
            _componentContainer.bindControlContainerRelation(
              widgetCode,
              windowContainerId
            )
            var _HeightSet = _componentContainer.HeightSet

            var addTabParams = {
              widgetCode: widgetCode,
              identityId: identityId,
              newComponentCode: newComponentCode,
              newWindowCode: newWindowCode,
              newScopeId: newScopeId,
              containerCode: _componentContainer.getCanvasName(),
              oldScopeId: info.scopeId,
              containerId: windowContainerId,
              closeFunc: function (containerCode) {
                //点击页签×关闭时触发
                setTimeout(function () {
                  // 模态窗口关闭按钮触发的事件
                  try {
                    scopeManager.createScopeHandler({
                      scopeId: preScopeId,
                      handler: function () {
                        //删除组件容器中打开的窗体信息
                        var component = widgetContext.get(
                          widgetCode,
                          'widgetObj'
                        )
                        if (component) {
                          component._componentEvent_deleteWindowInfo(
                            windowContainerId
                          )
                        }
                        //数据源创建的窗体，需要移除实体记录
                        var windowContainerObj =
                          windowRelation.get(windowContainerId)
                        if (windowContainerObj) {
                          var removeRecordFun =
                            windowContainerObj.get('removeRecord')
                          if (typeof removeRecordFun == 'function') {
                            removeRecordFun()
                          }
                        }
                        windowRelation.destroy(windowContainerId)
                        _componentContainer.unbindControlContainerRelation(
                          windowContainerId
                        )
                        eventManager.fireEvent(containerCode, 'OnClose')()
                      }
                    })()
                  } catch (e) {
                    //
                  }
                }, 1)
              },
              destroyCallback: function () {
                //销毁窗体回调
                try {
                  //如果全为sc控件，因sc会自动销毁子窗体资源，因此此处可能会报错
                  /* 必须从窗体容器上面获取域ID，因为普通窗体组件容器内部的网页窗体跳转时，域ID会变化 */
                  var _relation = windowRelation.get(identityId)
                  var _newScopeId = _relation.getScopeId()
                  scopeManager.openScope(_newScopeId)
                  widgetAction.executeComponentAction('closeComponent')
                  scopeManager.closeScope()
                  scopeManager.destroy(_newScopeId)
                } catch (e) {}
              }
            }
            var failCBParam = {
              widgetCode: widgetCode,
              newComponentCode: newComponentCode,
              newWindowCode: newWindowCode,
              preScopeId: preScopeId,
              newScopeId: newScopeId,
              windowContainerId: windowContainerId,
              isSingle: isSingle,
              addTabParams: addTabParams
            }
            var scopeTask = new ScopeTask(
              newScopeId,
              false,
              (function () {
                return function (
                  container,
                  containerCode,
                  closeFunc,
                  extraParams
                ) {
                  var success = function () {
                    var type = scopeManager.getProperty('type')
                    var componentUtil = sandBox.getService(
                      'vjs.framework.extension.ui.adapter.init.' +
                        type +
                        '.web.util'
                    )
                    // 设置语言
                    if (!(inputParam && inputParam.resourcePackage)) {
                      if (!inputParam) inputParam = new Object()

                      if (!inputParam.resourcePackage) {
                        var tmpResourcePackages = new Array()
                        inputParam.resourcePackage = tmpResourcePackages
                      }
                    }
                    _setCurLanguage(newScopeId, preScopeId, newComponentCode)
                    var renderCallback = function (component, scopeId) {
                      try {
                        container._innerComponent = component
                        if (
                          container.jgComponentContainer.MultiHeight ==
                            'content' &&
                          container._innerComponent &&
                          typeof container._innerComponent == 'string'
                        ) {
                          container.jgComponentContainer.tabSetObj &&
                            container.jgComponentContainer.tabSetObj.setHeight(
                              container.jgComponentContainer._height
                            )
                          container.jgComponentContainer.setHeight(
                            container.jgComponentContainer._height
                          )
                        }
                        $('#' + containerCode).css('overflow', 'auto')
                        var _pScope = scopeManager.getScope(preScopeId)
                        var parentCloseMode = _pScope.getCloseMode()
                        var isFrameScope = _pScope.get('_$FrameWindow')
                        scopeManager.openScope(newScopeId)
                        var currentScope = scopeManager.getWindowScope()
                        if (isFrameScope && parentCloseMode) {
                          //如果存在关闭模式，并且是框架窗体
                          currentScope.setCloseMode(
                            scopeManager.CloseMode.CustomFunc
                          )
                          var _$ccf = (function (pId) {
                            return function () {
                              scopeManager.destroy(pId)
                            }
                          })(preScopeId)
                          currentScope.setCustomCloseFunc(_$ccf)
                        }
                        if (title == null || title == undefined) {
                          //标题设置为空，且组件需要显示标题
                          if (!isSingle) {
                            title = currentScope.getTitle()
                          }
                          //保存窗体的源标题
                          currentScope.setOriginalTitle(title)
                        }
                        var setTitleFunc = function (newTitle, contitions) {
                          if (!isSingle) {
                            //单页容器不能设置标题
                            if (typeof contitions == 'object') {
                              //按照信息修改标题
                              _componentContainer.setTabTitleByCondition(
                                newTitle,
                                contitions
                              )
                            } else {
                              _componentContainer.setSelectTabTitle(newTitle)
                            }
                          }
                        }
                        //更新窗体容器的信息
                        windowRelation.updateWindowInfo(windowContainerId, {
                          ele: containerCode,
                          titleFunc: setTitleFunc,
                          title: title
                        })
                        //拿到当前的scope对象，把他的组件容器id保存进去
                        currentScope.setProKeys(
                          currentScope.ProKeys.ContainerId,
                          containerCode
                        )

                        // 把窗体放到容器里面
                        widgetRenderer.executeComponentRenderAction(
                          'renderWindowToContainer',
                          component,
                          containerCode,
                          _HeightSet != 'AutoHeight'
                        )

                        // 让新窗体记住自己所在的容器
                        widgetRenderer.executeComponentRenderAction(
                          'setParentContainerInfo',
                          newWindowCode,
                          {
                            scopeId: preScopeId,
                            containerCode: containerCode
                          }
                        )
                        scopeManager.closeScope()

                        scopeManager.openScope(preScopeId)
                        var scope = scopeManager.getWindowScope()
                        //注册容器
                        var prewindowCode = scope.getWindowCode()
                        var property = {
                          windowCode: newWindowCode,
                          scopeId: preScopeId,
                          type: 'Component'
                        }
                        var canvasName = ''
                        if (typeof component == 'string') {
                          canvasName =
                            newComponentCode +
                            '_' +
                            newWindowCode +
                            '_' +
                            newWindowCode +
                            '_' +
                            newScopeId
                        } else {
                          canvasName = component.getCanvasName()
                        }
                        containerRelation.register(
                          containerCode,
                          canvasName,
                          property
                        )

                        // 在容器中存储新窗体的信息
                        widgetAction.executeComponentAction(
                          'updateContainerInfo',
                          containerCode,
                          newScopeId,
                          newComponentCode,
                          newWindowCode
                        )

                        // 容器关闭的时候寻找当前容器内部的窗体进行销毁
                        eventManager.addEventHandler(
                          containerCode,
                          'OnClose',
                          function () {
                            var innerScopeId =
                              widgetAction.executeComponentAction(
                                'getContainerScopeId',
                                containerCode
                              )
                            scopeManager.openScope(innerScopeId)
                            try {
                              scopeManager.createScopeHandler({
                                scopeId: preScopeId,
                                handler: function () {
                                  //删除组件容器中打开的窗体信息
                                  var component = widgetContext.get(
                                    widgetCode,
                                    'widgetObj'
                                  )
                                  if (component) {
                                    component._componentEvent_deleteWindowInfo(
                                      windowContainerId
                                    )
                                  }
                                }
                              })()
                            } catch (e) {
                              //
                            }
                            widgetAction.executeComponentAction('closeWindow')
                            if (typeof closedCallback == 'function') {
                              closedCallback(
                                getWindowOutputParams(innerScopeId)
                              )
                            }
                            //$("#"+containerCode).empty();;统一门户，存在用url打开窗体，执行该语句会清空其dom结构
                            scopeManager.closeScope()
                            //$("#"+containerCode).remove();
                          }
                        )
                        if (!isSingle) {
                          // 容器关闭的时候，需要把页签进行关闭。
                          eventManager.addEventHandler(
                            containerCode,
                            'OnClose',
                            function () {
                              closeFunc() // 销毁UI，UI操作不需要关注域
                            }
                          )
                        }
                        eventManager.addEventHandler(
                          containerCode,
                          'OnClose',
                          function () {
                            scopeManager.openScope(preScopeId)
                            _componentContainer.unbindControlContainerRelation(
                              windowContainerId
                            )
                            //添加关系
                            containerRelation.unregister(
                              prewindowCode,
                              containerCode
                            )
                            scopeManager.closeScope()
                          }
                        )
                        scopeManager.closeScope()
                        if (typeof renderedCallback == 'function') {
                          scopeManager.createScopeHandler({
                            scopeId: newScopeId,
                            handler: renderedCallback
                          })({
                            preScopeId: preScopeId, //父级域，移除记录需要
                            containerId: windowContainerId,
                            tab: extraParams ? extraParams.tab : null,
                            tabCloseFunc: closeFunc //页签关闭事件
                          })
                        }
                      } catch (e) {}
                    }
                    var failCallback = function (exception) {
                      failCBParam['containerCode'] = containerCode
                      errorCallback(exception, failCBParam)
                    }
                    //设置窗体打开模式
                    if (
                      inputParam &&
                      inputParam.variable &&
                      inputParam.variable.formulaOpenMode
                    ) {
                      var _nowScope = scopeManager.getScope(newScopeId)
                      if (_nowScope.getOpenMode && !_nowScope.getOpenMode()) {
                        scopeManager
                          .getScope(newScopeId)
                          .setOpenMode(inputParam.variable.formulaOpenMode)
                      }
                    }
                    componentUtil.renderComponentById(
                      newComponentCode,
                      newWindowCode,
                      inputParam || {},
                      {
                        scopeId: newScopeId,
                        rendered: renderCallback,
                        error: failCallback,
                        completed: function () {
                          if (typeof completedCallback == 'function')
                            completedCallback(newScopeId)
                        },
                        inited: function () {
                          if (typeof callback == 'function')
                            callback(newScopeId)
                          if (container && container.jgComponentContainer) {
                            container.jgComponentContainer._changeTabPosition =
                              true
                            container.jgComponentContainer._resizeTabbarScroll() //重新补偿一次：新增页签使得右侧功能区显示时不会跳转到最后
                          }
                        }
                      }
                    )
                  }
                  var fail = function (exception) {
                    //删除组件容器中打开的窗体信息，避免下次点击打不开
                    var component = widgetContext.get(widgetCode, 'widgetObj')
                    if (component) {
                      component._componentEvent_deleteWindowInfo(
                        windowContainerId
                      )
                    }
                    /* 有问题的页签需要手动关闭，暂不使用自动关闭，如果后续需要自动关闭，需要调用异常回调使得最开始触发事件的控件恢复使能状态 */
                    //            	                    if(extraParams.tab){
                    //            	                    	component.tabSetObj.removeTabs([extraParams.tab]);
                    //            	                    }
                    component.unbindControlContainerRelation(windowContainerId)
                    /* 设置异常打开到指定的容器中 */
                    if (
                      typeof exception.setContainerId == 'function' &&
                      typeof component.$rv == 'function'
                    ) {
                      //            	                    	exception.setContainerId(component.$rv());/* getCanvasName返回的是当前的dom id，但是没有高度，导致异常遮挡层没显示，$rv方法返回的是父级（带高度）的id */
                      exception.setContainerId(containerCode)
                    }
                    var _tab = extraParams.tab
                    if (
                      _tab &&
                      typeof exception.setModalClosedHandler == 'function'
                    ) {
                      component.tabSetObj.setTabTitle(_tab, '出错了！')
                      var _tabUUID = _tab.uucode
                      /* 异常弹框关闭回调 */
                      var exceptionModalCloseHandle = (function (_exeception) {
                        return function () {
                          /* 只关闭页签，没有正常关闭异常，需要调用异常回调使得最开始触发事件的控件恢复使能状态 */
                          if (
                            _exeception &&
                            _exeception.isTiped === true &&
                            typeof _exeception.getModalClosedHandler ==
                              'function'
                          ) {
                            var execb = _exeception.getModalClosedHandler()
                            if (typeof execb == 'function') {
                              execb()
                            }
                          }
                        }
                      })(exception)
                      /* 注册页签关闭前的异常回调事件，使得直接关闭页签时，最开始触发事件的按钮能够恢复使能 */
                      if (!component._tabBeforeCloseMap) {
                        component._tabBeforeCloseMap = {}
                      }
                      component._tabBeforeCloseMap[_tabUUID] =
                        exceptionModalCloseHandle
                      /* 设置异常弹框关闭事件，注销上面注册的事件 */
                      exception.setModalClosedHandler(
                        (function (_com, _tabs, _iden) {
                          return function () {
                            try {
                              /*
                               * 属于正常关闭异常弹框，此时页签还没关闭，需要删除页签关闭时触发的异常回调
                               *  */
                              if (
                                component._tabBeforeCloseMap &&
                                component._tabBeforeCloseMap[_iden]
                              ) {
                                delete component._tabBeforeCloseMap[_iden]
                              }
                              /* 暂无需求需要在异常弹框关闭后自动关闭有问题的页签 */
                              //            	                    				_com.tabSetObj.removeTabs(_tabs);
                            } catch (e) {} /* 避免多次移除页签出现异常 */
                          }
                        })(component, [extraParams.tab], _tabUUID)
                      )
                    }
                    if (typeof errorFunc == 'function') {
                      errorFunc(exception)
                    } else {
                      errorCallback(exception, failCBParam)
                    }
                  }
                  _loadDependency(
                    newComponentCode,
                    newWindowCode,
                    newScopeId,
                    success,
                    fail
                  )
                }
              })()
            )
            var taskId = TaskManager.addTask(scopeTask)
            var tmp_addTabParams = copyParamsInfo(addTabParams)
            tmp_addTabParams['title'] = title
            tmp_addTabParams['readyFunc'] = function (
              container,
              containerCode,
              closeFunc,
              extraParams
            ) {
              TaskManager.execTaskById(taskId, [
                container,
                containerCode,
                closeFunc,
                extraParams
              ])
            }
            tmp_addTabParams['beforeOpen'] = function (
              oldScopeId,
              successback
            ) {
              //单页页签打开时调用
              //执行步骤，先执行就窗体的关闭前事件，如果成功了，再执行后续逻辑
              var success = function () {
                scopeManager.destroy(oldScopeId)
                scopeManager.createScopeHandler({
                  scopeId: preScopeId,
                  handler: function () {
                    //删除组件容器中打开的窗体信息
                    var component = widgetContext.get(widgetCode, 'widgetObj')
                    if (component) {
                      component._componentEvent_deleteWindowInfo(
                        windowContainerId
                      )
                    }
                    component.unbindControlContainerRelation(windowContainerId)
                    if (typeof successback == 'function') successback()
                  }
                })()
              }
              var error = function () {}
              scopeManager.openScope(oldScopeId)
              var winScope = scopeManager.getWindowScope()
              if (winScope) {
                winScope.fireBeforeClose(success, error)
              } else {
                success()
              }
              scopeManager.closeScope()
            }
            var sId = scopeManager.getCurrentScopeId()
            tmp_addTabParams['beforeClose'] = (function (_tabParams) {
              //页签在关闭前调用
              return function (successback, errorback) {
                scopeManager.openScope(sId)
                var component = widgetContext.get(widgetCode, 'widgetObj')
                if (
                  component._tabBeforeCloseMap &&
                  typeof component._tabBeforeCloseMap[_tabParams.identityId] ==
                    'function'
                ) {
                  /* 页签关闭时，需要触发关闭前事件，目前异常情况下会设置此值：手动关闭异常的页签需要恢复最开始触发事件的按钮的使能状态 */
                  component._tabBeforeCloseMap[_tabParams.identityId]()
                }
                var nowScopeId = windowRelation.getScopeId(windowContainerId)
                scopeManager.closeScope()
                if (!nowScopeId) nowScopeId = newScopeId
                scopeManager.openScope(nowScopeId)
                var success = function () {
                  if (typeof successback == 'function') successback()
                }
                var error = function () {
                  if (typeof errorback == 'function') errorback()
                }
                var winScope = scopeManager.getWindowScope()
                if (winScope) {
                  winScope.fireBeforeClose(success, error)
                } else {
                  success()
                }
                scopeManager.closeScope()
              }
            })(tmp_addTabParams)
            addTabButtonNew(tmp_addTabParams)
          } else {
            var title = cfg.title
            var otherInfo = cfg.url
            var isSingle = _componentContainer.isSingleContainer()
            if (isSingle) {
              //单页容器
              //删除组件容器中打开的窗体信息
              var component = widgetContext.get(widgetCode, 'widgetObj')
              if (component) {
                component._componentEvent_deleteWindowInfo()
              }
              component.unbindControlContainerRelation() //解绑所有跟控件有关的窗体容器id
            }
            //更新窗体容器的信息
            var container = new WindowContainer({
              title: title,
              otherInfo: otherInfo
            })
            var windowContainerId = windowRelation.put(container)
            var identityId = windowContainerId
            var params = copyParamsInfo(cfg)
            params['uucode'] = identityId
            //绑定控件跟窗体容器的关系
            _componentContainer.bindControlContainerRelation(
              widgetCode,
              windowContainerId
            )
            //关闭之后，需要解绑依赖关系
            var scopeId = scopeManager.getCurrentScopeId()
            params.beforeClose = function (windowContainerId) {
              try {
                scopeManager.createScopeHandler({
                  scopeId: scopeId,
                  handler: function () {
                    //删除组件容器中打开的窗体信息
                    var component = widgetContext.get(widgetCode, 'widgetObj')
                    if (component) {
                      component._componentEvent_deleteWindowInfo(
                        windowContainerId
                      )
                    }
                    component.unbindControlContainerRelation(
                      widgetCode,
                      windowContainerId
                    )
                  }
                })()
              } catch (e) {
                //
              }
            }
            return _componentContainer.addTabs(params)
          }
        }
      })
      widgetProperty[property.code] = handler
    }
  }
})
