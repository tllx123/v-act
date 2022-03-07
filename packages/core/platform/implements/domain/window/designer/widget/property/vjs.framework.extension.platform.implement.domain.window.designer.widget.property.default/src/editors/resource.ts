import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

export function getType() {
  return 'resource'
}

export function getHandler() {
  return function (property, widgetProperty) {
    var code = property.code
    var resourceValue = widgetProperty[code]
    if (
      resourceValue &&
      !(
        resourceValue.startsWith('itop/resource') ||
        resourceValue.startsWith('/itop/resource')
      )
    ) {
      var windowScope = scopeManager.getWindowScope()
      var componentCode = windowScope.getComponentCode()
      widgetProperty[code] =
        'itop/resource/' +
        componentCode +
        '_' +
        resourceValue +
        '?random=' +
        parseInt(Math.random() * 100)
    }
  }
}
