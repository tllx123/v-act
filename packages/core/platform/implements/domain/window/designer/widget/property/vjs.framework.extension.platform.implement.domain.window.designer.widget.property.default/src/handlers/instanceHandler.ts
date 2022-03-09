import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

export function getHandlerName() {
  return 'instanceHandler'
}

export function getHandler() {
  return function (property, widgetProperty) {
    var instId = scopeManager.getCurrentScopeId()
    var handler = function (callback, scopeId) {
      scopeId = scopeId || instId
      if (typeof callback != 'function') {
        throw Error('参数传递不正确，需要传递Function！')
      }
      var scopeHandler = (function (sId, cb) {
        return function () {
          try {
            scopeManager.openScope(sId)
            return cb.apply(this, arguments)
          } finally {
            scopeManager.closeScope()
          }
        }
      })(scopeId, callback)
      return scopeHandler
    }
    widgetProperty[property.code] = handler
  }
}