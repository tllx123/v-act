import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { WidgetRenderer as widgetRenderer } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { Dependency as dependency } from '@v-act/vjs.framework.extension.ui.adapter.dependency'
import { ResourcePackage as resourcePackage } from '@v-act/vjs.framework.extension.ui.adapter.resourcepackage'
import { ContainerRelation as containerRelation } from '@v-act/vjs.framework.extension.ui.common.plugin.services.container'

import * as windowMapping from './handleWindowMapping'

export function getHandlerName() {
  return 'window.renderToElement'
}

export function getHandler() {
  return function (property, widgetProperty) {
    var handler = scopeManager.createScopeHandler({
      handler: function (
        newComponentCode,
        newWindowCode,
        newWindowInputParams,
        targetContainerId
      ) {
        if (newComponentCode && newWindowCode) {
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
          var newScopeId = scopeManager.createWindowScope({
            parentScopeId: preScopeId,
            componentCode: newComponentCode,
            windowCode: newWindowCode
          })
          var newSandBox = sandbox.create()
          newSandBox.active().done(function () {
            dependency.loadResources(
              newComponentCode,
              newWindowCode,
              newSandBox,
              newScopeId,
              function () {
                scopeManager.openScope(newScopeId)
                var type = scopeManager.getProperty('type')
                var componentUtil = newSandBox.getService(
                  'vjs.framework.extension.ui.adapter.init.' +
                    type +
                    '.web.util'
                )
                resourcePackage.setWindowCurrentResourceCode(
                  newScopeId,
                  preScopeId,
                  newComponentCode
                )
                componentUtil.renderComponentById(
                  newComponentCode,
                  newWindowCode,
                  newWindowInputParams || {},
                  {
                    scopeId: newScopeId,
                    rendered: function (component, scopeId) {
                      var containerCode = targetContainerId
                      scopeManager.openScope(newScopeId)
                      widgetRenderer.executeComponentRenderAction(
                        'renderWindowToContainer',
                        component,
                        containerCode,
                        true
                      )
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
                      var property = {
                        windowCode: newWindowCode,
                        scopeId: preScopeId,
                        type: 'Component'
                      }
                      var canvasName = ''
                      if (typeof component == 'string')
                        canvasName =
                          newComponentCode +
                          '_' +
                          newWindowCode +
                          '_' +
                          newWindowCode +
                          '_' +
                          newScopeId
                      else canvasName = component.getCanvasName()
                      containerRelation.register(
                        containerCode,
                        canvasName,
                        property
                      )
                      scopeManager.openScope(newScopeId)
                      var widgetAction = newSandBox.getService(
                        'vjs.framework.extension.platform.services.view.widget.common.action.WidgetAction'
                      )
                      widgetAction.executeComponentAction(
                        'updateContainerInfo',
                        containerCode,
                        newScopeId,
                        newComponentCode,
                        newWindowCode
                      )
                      scopeManager.closeScope()
                      scopeManager.closeScope()
                    },
                    error: function () {}
                  }
                )
                scopeManager.closeScope()
              },
              function () {}
            )
          })
          return newScopeId
        }
      }
    })
    widgetProperty[property.code] = handler
  }
}
