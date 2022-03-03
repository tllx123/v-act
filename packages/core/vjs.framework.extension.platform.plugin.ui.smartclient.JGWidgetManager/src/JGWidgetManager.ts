exports.initModule = function (sBox) {
  isc.ClassFactory.defineClass('JGWidgetManager')

  isc.JGWidgetManager.addClassProperties({
    _widgetContainer: {},
    _widgetContainerForTest: {}
  })

  isc.JGWidgetManager.addClassMethods({
    getWidget: function (widgetId) {
      return isc.JGWidgetManager._widgetContainer[widgetId]
    },
    putWidget: function (widgetId, obj) {
      isc.JGWidgetManager._widgetContainer[widgetId] = obj
      isc.JGWidgetManager._widgetContainerForTest[obj.Code] = obj
    },
    //通过控件编码获取控件信息，适用于单页面控件
    getWidgetByWidgetCode: function (widgetCode) {
      return isc.JGWidgetManager._widgetContainerForTest[widgetCode]
    },
    destroy: function (widgetId) {
      delete isc.JGWidgetManager._widgetContainer[widgetId]
    }
  })

  isc.Page.addClassMethods({
    loadStyleSheet: function (styleSheetURL, wd, callback) {
      let url = isc.Page.getURL(styleSheetURL)
      let doc = this.getDocument()
      let elem = doc.createElement('link')
      elem.rel = 'stylesheet'
      elem.type = 'text/css'
      elem.href = url
      let element = doc.body || doc.head
      element.appendChild(elem)
    }
  })

  isc.Page.setAppImgDir('')
}
