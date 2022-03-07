define('./window.renderToVuiContainer', function (require, exports, module) {
  var sandbox,
    scopeManager,
    componentPack,
    WindowContainer,
    windowMapping,
    widgetRenderer,
    windowRelation,
    widgetContext

  export function initModule(sb) {
    sandbox = sb
    scopeManager = sb.getService(
      'vjs.framework.extension.platform.interface.scope.ScopeManager'
    )
    componentPack = require('vjs/framework/extension/platform/implement/domain/window/designer/widget/property/default/handlers/handleComponentPackInfo')
    windowMapping = require('vjs/framework/extension/platform/implement/domain/window/designer/widget/property/default/handlers/handleWindowMapping')
    WindowContainer = sb.getService(
      'vjs.framework.extension.platform.services.view.relation.WindowContainer'
    )
    windowRelation = sb.getService(
      'vjs.framework.extension.platform.services.view.relation.WindowContainerManager'
    )
    widgetRenderer = sb.getService(
      'vjs.framework.extension.platform.services.view.widget.common.action.WidgetRenderer'
    )
    widgetContext = sb.getService(
      'vjs.framework.extension.platform.services.view.widget.common.context.WidgetContext'
    )
  }

  export function getHandlerName() {
    return 'window.renderToVuiContainer'
  }

  /**
   * 触发vue事件
   * @param {Object} params 参数
   * {
   * 		widgetId : 'div控件编码',
   * 		vuiCode : 'vui标签编码',
   * 		eventName : '事件名称',
   * 		params : '需要更新页签的数据'
   * }
   * */
  var fireVueEvent = function (params) {
    var widgetId = params.widgetId
    var vuiCode = params.vuiCode
    var eventName = params.eventName
    var args = params.params
    if (widgetId && vuiCode && eventName) {
      var widget = widgetContext.get(widgetId, 'widgetObj')
      var vue = widget._$getCurrentVue()
      if (vue) {
        vue._$fireVuiTagEvent(vuiCode, eventName, args)
      }
    }
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
    var sandBoxs = sandbox.create()
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

  export function getHandler() {
    return function (property, widgetProperty) {
      var handler = scopeManager.createScopeHandler({
        handler: function (containerCode, params) {
          var componentCode = params.componentCode
          var windowCode = params.windowCode
          //替换构件包映射信息
          var newInfo = componentPack.handleComponentPackInfo(
            componentCode,
            windowCode
          )
          if (newInfo) {
            componentCode = newInfo.componentCode
            windowCode = newInfo.windowCode
          }
          /* 若窗体映射信息不为空的话，则表示是配置相应的映射信息，需替换 */
          var windowMappingInfo = windowMapping.handleWindowMapping(
            componentCode,
            windowCode
          )
          if (windowMappingInfo != null) {
            componentCode = windowMappingInfo.componentCode
            windowCode = windowMappingInfo.windowCode
          }
          var inputParams = params.inputParams
          var callback = params.callback

          var preScopeId = scopeManager.getCurrentScopeId()
          var newScopeId = scopeManager.createWindowScope({
            parentScopeId: preScopeId,
            componentCode: componentCode,
            windowCode: windowCode
          })
          var windowScope = scopeManager.getScope(newScopeId)
          var vjsContext = params ? params.vjsContext : null
          if (vjsContext && windowScope.putVjsContext) {
            for (var key in vjsContext) {
              if (vjsContext.hasOwnProperty(key)) {
                windowScope.putVjsContext(key, vjsContext[key])
              }
            }
          }
          //窗体容器打开窗体的信息
          var container = new WindowContainer({
            scopeId: newScopeId,
            componentCode: componentCode,
            windowCode: windowCode,
            windowType: 'ComponentContainer'
          })
          var windowContainerId = windowRelation.put(container)
          var success = (function (_containerCode, _params, _scopeId) {
            return function () {
              var componentCode = _params.componentCode
              var windowCode = _params.windowCode
              var inputParams = _params.inputParams
              var containerId = _params.containerId
              var callback = _params.callBackFunc
              var type = scopeManager.getProperty('type')
              var renderCallback = function (component, scopeId) {
                scopeManager.openScope(scopeId)
                // 把窗体放到容器里面
                var title = _params.title
                if (title == null || title == undefined) {
                  title = widgetRenderer.executeComponentRenderAction(
                    'getWindowTitle',
                    windowCode
                  )
                }
                var scope = scopeManager.getWindowScope()
                scope.on(
                  scopeManager.EVENTS.DESTROY,
                  scopeManager.createScopeHandler({
                    scopeId: preScopeId,
                    handler: function () {
                      /* 关闭页签信息 */
                      fireVueEvent({
                        widgetId: _params.divCode,
                        vuiCode: _params.containerCode,
                        eventName: 'close',
                        params: {
                          tagIden: containerId
                        }
                      })
                    }
                  })
                )
                scopeManager.openScope(preScopeId)
                /* 更新页签信息 */
                fireVueEvent({
                  widgetId: _params.divCode,
                  vuiCode: _params.containerCode,
                  eventName: 'update',
                  params: {
                    iden: containerId,
                    scopeId: _scopeId,
                    closeback: scopeManager.createScopeHandler({
                      scopeId: _scopeId,
                      handler: function () {
                        var sId = scopeManager.getCurrentScopeId()
                        scopeManager.destroy(sId)
                      }
                    })
                  }
                })
                scopeManager.closeScope()
                widgetRenderer.executeComponentRenderAction(
                  'renderWindowToContainer',
                  component,
                  containerId,
                  false
                )
                scopeManager.closeScope()
              }
              var failCallback = function () {}
              var componentUtil = sandbox.getService(
                'vjs.framework.extension.ui.adapter.init.' + type + '.web.util'
              )
              componentUtil.renderComponentById(
                componentCode,
                windowCode,
                inputParams || {},
                {
                  scopeId: _scopeId,
                  rendered: renderCallback,
                  error: failCallback,
                  inited: function () {
                    /* 强制resize，解决打开普通窗体（设置borderlayout）到容器（定义高度属性）时，窗体不会自适应的问题 */
                    try {
                      $(window).trigger('resize')
                    } catch (e) {}

                    if (typeof callback == 'function') callback(_scopeId)
                  }
                }
              )
            }
          })(containerCode, params, newScopeId)
          var fail = (function (_containerCode, _params) {
            return function () {}
          })(containerCode, params)
          _loadDependency(componentCode, windowCode, newScopeId, success, fail)
          return newScopeId
        }
      })
      widgetProperty[property.code] = handler
    }
  }
})
