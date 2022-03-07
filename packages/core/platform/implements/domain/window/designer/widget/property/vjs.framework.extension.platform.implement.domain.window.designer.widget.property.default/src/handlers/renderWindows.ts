define('./renderWindows', function (require, exports, module) {
  var scopeManager, datasourceFactory

  export function initModule(sb) {
    scopeManager = sb.getService(
      'vjs.framework.extension.platform.interface.scope.ScopeManager'
    )
    datasourceFactory = sb.getService(
      'vjs.framework.extension.platform.interface.model.datasource.DatasourceFactory'
    )
  }

  export function getHandlerName() {
    return 'renderWindows'
  }

  export function getHandler() {
    return function (property, widgetProperty) {
      var handler = scopeManager.createScopeHandler({
        handler: function (windowInfos, params) {
          params = params || {}
          var parentScopeId = scopeManager.getCurrentScopeId()
          var datas = {}
          for (var i = 0, len = windowInfos; i < len; i++) {
            var windowInfo = windowInfos[i]
            var scopeId = scopeManager.createWindowScope({
              parentScopeId: parentScopeId,
              componentCode: windowInfo.componentCode,
              windowCode: windowInfo.windowCode
            })
            windowInfo.scopeId = scopeId
            datas[scopeId] = windowInfo
          }
          var rendered = (function (_datas, _rendered, _parentScopeId) {
            return function (component, preScopeId, conCode, winCode) {
              var data = _datas[preScopeId]
              if (typeof _rendered == 'function') {
                scopeManager.openScope(_parentScopeId)
                try {
                  _rendered(component, _datas[preScopeId])
                } finally {
                  scopeManager.closeScope()
                }
              }
            }
          })(datas, params['rendered'], parentScopeId)
          var type = scopeManager.getProperty('type')
          var componentUtil = sandBox.getService(
            'vjs.framework.extension.ui.adapter.init.' + type + '.web.util'
          )
          //构造组件
          componentUtil.renderWindows(windowInfos, {
            rendered: rendered
          })
        }
      })
      widgetProperty[property.code] = handler
    }
  }
})
