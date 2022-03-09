import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

import { WidgetContext as widgetContext } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'

import { DatasourceManager as dataSourceManager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'

import { V3ComponentVue as V3ComponentVue } from '@v-act/vjs.framework.extension.platform.plugin.script.vue'

import { V3Vue as V3Vue } from '@v-act/vjs.framework.extension.platform.plugin.script.vue'

export function getHandlerName() {
  return 'vPlatformVue'
}

/**
 * 组装模板脚本参数
 * */
var getWidgetTemplateParams = function (widgetCode) {
  var widgetTemplate = widgetContext.get(widgetCode, 'WidgetTemplate')
  var pros
  if (widgetTemplate == null) {
    //旧配置
    pros = {}
    pros.Entities = widgetContext.get(widgetCode, 'EntityCodes')
    pros.Html = widgetContext.get(widgetCode, 'Html')
    pros.ModuleJavaScript = widgetContext.get(widgetCode, 'ModuleJavaScript')
    pros.Css = widgetContext.get(widgetCode, 'Css')
    pros.JavaScript = widgetContext.get(widgetCode, 'JavaScript')
    pros.ModuleCss = widgetContext.get(widgetCode, 'ModuleCss')
  } else {
    pros = widgetTemplate
  }
  return pros
}

export function getHandler() {
  return function (property, widgetProperty) {
    var handler = scopeManager.createScopeHandler({
      handler: function (el, widgetCode, datas) {
        var vue
        var pros = getWidgetTemplateParams(widgetCode)
        var mode = widgetContext.get(widgetCode, 'Mode')
        var widget = widgetContext.get(widgetCode, 'widgetObj')
        if (mode != null && mode.trim().toLowerCase() == 'simple') {
          var scopeId = scopeManager.getCurrentScopeId()
          var scope = scopeManager.getScope(scopeId)
          var componentCode = scope.getComponentCode()
          var windowCode = scope.getWindowCode()
          /* 获取所有实体列表 */
          var entities = []
          var entityObjs = dataSourceManager.getAll()
          if (entityObjs && entityObjs.length > 0) {
            for (var i = 0, l = entityObjs.length; i < l; i++) {
              var dsName = entityObjs[i].getMetadata().getDatasourceName()
              entities.push(dsName)
            }
          }
          vue = new V3ComponentVue({
            widgetCode: widgetCode,
            element: el,
            componentCode: componentCode,
            windowCode: windowCode,
            events: pros.EventCodes || [],
            entities: entities,
            pros: pros
          })
        } else {
          vue = new V3Vue({
            widgetCode: widgetCode,
            eventTargetCode: widgetCode,
            pros: pros,
            element: el,
            datas: datas
          })
        }

        vue.on({
          eventName: vue.Events.Rendered,
          handler: (function (wd) {
            return function () {
              wd._width = 0
              wd._height = 0
              var templateDIV = $('#' + wd.templateDIVId)[0]
              var element = templateDIV.firstChild
              if (wd.MultiHeight == 'content') {
                resizeDIV(widget, templateDIV, 'height')
              }
              if (wd.MultiWidth == 'content') {
                resizeDIV(widget, templateDIV, 'width')
              }
              var MutationObserver =
                window.MutationObserver ||
                window.WebKitMutationObserver ||
                window.MozMutationObserver
              var observer = new MutationObserver(function (mutations) {
                var _width = parseFloat(
                  getComputedStyle(element).getPropertyValue('width')
                )
                var _height = parseFloat(
                  getComputedStyle(element).getPropertyValue('height')
                )
                if (_width == wd._width && _height == wd._height) {
                  return
                }
                if (wd.MultiHeight == 'content' && _height != wd._height) {
                  resizeDIV(widget, templateDIV, 'height')
                }
                if (wd.MultiWidth == 'content' && _width != wd._width) {
                  resizeDIV(widget, templateDIV, 'width')
                }
                wd._width = _width
                wd._height = _height
              })
              observer.observe(element, {
                attributes: true,
                childList: true,
                subtree: true
              })
            }
          })(widget)
        })
        vue.render()
        if (
          vue.vueInstance &&
          typeof vue.vueInstance._$registerDataLoadedEvent == 'function'
        ) {
          vue.vueInstance._$registerDataLoadedEvent()
        }
        return vue
      }
    })
    widgetProperty[property.code] = handler
  }
}
