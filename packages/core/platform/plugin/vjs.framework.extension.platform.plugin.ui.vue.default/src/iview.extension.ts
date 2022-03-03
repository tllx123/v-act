var _$iview_componentStr =
  'Panel,Icon,Dropdown,DropdownMenu,DropdownItem,Row,Col,Tabs,TabPane,Card,ButtonGroup,Button,Checkbox,Form,FormItem'
var _$iview_prefix = 'vui'
var _$iview_components = _$iview_componentStr.split(',')
var _$iview_dealComponentName = function (name) {
  return name.charAt(0).toUpperCase() + name.substring(1)
}
for (var i = 0, l = _$iview_components.length; i < l; i++) {
  var component = _$iview_components[i]
  //此句代码会导致window上的FormItem的值变成window对象（原因未明），导致sc里面去获取FormItem报错的问题，需要去掉
  //	var name = _$iview_components_mapping[component] ? _$iview_components_mapping[component]:component;
  Vue.component(
    _$iview_prefix + _$iview_dealComponentName(component),
    Vue.component(component)
  )
}
