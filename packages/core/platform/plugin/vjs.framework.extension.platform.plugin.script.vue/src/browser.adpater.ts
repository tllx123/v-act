//ie9 classList属性不支持问题兼容
if (!('classList' in document.documentElement)) {
  Object.defineProperty(HTMLElement.prototype, 'classList', {
    get: function () {
      var self = this
      function update(fn: Function) {
        return function (value: any) {
          var classes = self.className.split(/\s+/g),
            index = classes.indexOf(value)

          fn(classes, index, value)
          self.className = classes.join(' ')
        }
      }

      return {
        add: update(function (classes: Array<any>, index: number, value: any) {
          if (!~index) classes.push(value)
        }),

        remove: update(function (classes: Array<any>, index: number) {
          if (~index) classes.splice(index, 1)
        }),

        toggle: update(function (
          classes: Array<any>,
          index: number,
          value: any
        ) {
          if (~index) classes.splice(index, 1)
          else classes.push(value)
        }),

        contains: function (value: any) {
          return !!~self.className.split(/\s+/g).indexOf(value)
        },

        item: function (i: number) {
          return self.className.split(/\s+/g)[i] || null
        }
      }
    }
  })
}

var __isOpera =
  navigator.appName == 'Opera' || navigator.userAgent.indexOf('Opera') != -1
var __isIE =
  (navigator.appName == 'Microsoft Internet Explorer' && !__isOpera) ||
  navigator.userAgent.indexOf('Trident/') != -1
// 修复IE10及以下版本不支持dataset属性的问题，兼容transfer-dom.js中使用了dataset的问题
if (__isIE && window.HTMLElement) {
  if (
    Object.getOwnPropertyNames(HTMLElement.prototype).indexOf('dataset') === -1
  ) {
    Object.defineProperty(HTMLElement.prototype, 'dataset', {
      get: function () {
        var attributes = this.attributes
        var name = [],
          value = []
        var obj: Record<string, any> = {}
        for (var i = 0; i < attributes.length; i++) {
          if (attributes[i].nodeName.slice(0, 5) == 'data-') {
            name.push(attributes[i].nodeName.slice(5))
            value.push(attributes[i].nodeValue)
          }
        }
        for (var j = 0; j < name.length; j++) {
          obj[name[j]] = value[j]
        }
        return obj
      }
    })
  }
}
