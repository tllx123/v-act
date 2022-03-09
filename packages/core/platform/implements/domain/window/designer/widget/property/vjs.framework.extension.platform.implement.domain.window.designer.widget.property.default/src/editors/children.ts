/**
 * 处理子控件属性，如JGTabControl
 * */
var eventManager, eventHandler

export function initModule(sb) {}

export function getType() {
  return 'children'
}

var getChildProperty = function (define, propertys) {
  var defines = define
  if (!defines) {
    return
  }
  if (!(defines instanceof Array)) {
    defines = [defines]
  }
  for (var i = 0, len = defines.length; i < len; i++) {
    var define = defines[i]
    if (!define) {
      return
    }
    var type = define.code
    if (!propertys[type]) {
      propertys[type] = {}
    }
    var property = propertys[type]
    var props = define.properties
    if (props instanceof Array) {
      for (var j = 0, l = props.length; j < l; j++) {
        var prop = props[j]
        if (prop.editor && prop.editor.define) {
          getChildProperty(prop.editor.define, propertys)
        } else if (undefined != prop['default']) {
          var code = prop.code
          var compatible = prop.compatible
          if (compatible && compatible.target) {
            code = compatible.target
          }
          property[code] = prop['default']
        }
      }
    }
  }
}

export function getHandler() {
  return function (property, widgetProperty) {
    var editor = property.editor
    var widgetCode = widgetProperty.Code
    var code = property.code
    var childs = widgetProperty[code]
    if (!editor || !childs) {
      return
    }
    var defines = editor.define
    var childProperty = {}
    var childrenType = {
      JGTabControl: 'JGTabPage'
    }
    getChildProperty(defines, childProperty)
    for (var i = 0, len = childs.length; i < len; i++) {
      var child = childs[i]
      var defaultProps =
        childProperty[child.type || childrenType[widgetProperty.type]] //页签页没有类型数据
      if (defaultProps) {
        for (var key in defaultProps) {
          if (defaultProps.hasOwnProperty(key) && !child.hasOwnProperty(key)) {
            child[key] = defaultProps[key]
          }
        }
      }
    }
  }
}
