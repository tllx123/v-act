/**
 * v3 vue 组件信息
 * @author liangzc
 *
 * */
var _$vue = window._$V3Vue
/**
 * 组件存储位置
 * */
_$vue.V3VueComponents = []
/**
 * 组件
 * */
_$vue.V3VueComponent = function (params) {
  this.alias = null
  this.componentName = params.componentName
  this.dataProp = params.dataProp
  this.dataType = params.dataType
  this.treeStructProp = params.treeStructProp
  this._init()
}
/**
 * 组件
 * */
_$vue.V3VueComponent.prototype = {
  _init: function () {
    var buff = []
    for (var i = 0, l = this.componentName.length; i < l; i++) {
      var c = this.componentName.charAt(i)
      if ('A' <= c && c <= 'Z' && i != 0) {
        buff.push('-')
      }
      buff.push(c)
    }
    var str = buff.join('')
    this.alias = str.toLowerCase()
  },

  getComponentName: function () {
    return this.componentName
  },

  getDataProp: function () {
    return this.dataProp
  },

  getDataType: function () {
    return this.dataType
  },

  getTreeStructProp: function () {
    return this.treeStructProp
  },

  getAlias: function () {
    return this.alias
  },

  isMatch: function (tagName) {
    return tagName == this.componentName || tagName.toLowerCase() == this.alias
  }
}
/**
 * 注册组件的方法
 * */
_$vue.registerComponent = function (param) {
  var component = new this.V3VueComponent(param)
  this.V3VueComponents.push(component)
}
/**
 * 根据组件名称获取组件配置信息
 * */
;(_$vue._getComponents = function (componentName) {
  //
  var result = []
  var components = _$V3Vue.V3VueComponents
  for (var i = 0, l = components.length; i < l; i++) {
    var component = components[i]
    if (component.isMatch(componentName)) {
      result.push(component)
    }
  }
  return result
}),
  /**
   * 注册组件 vui-table
   * */
  _$vue.registerComponent({
    componentName: 'vui-table',
    dataProp: 'data',
    dataType: 'Array'
  })
/**
 * 注册组件 vui-tree
 * */
_$vue.registerComponent({
  componentName: 'vui-tree',
  dataProp: 'data',
  dataType: 'Tree',
  treeStructProp: 'fieldMapping'
})
/**
 * 注册组件 vui-container
 * */
_$vue.registerComponent({
  componentName: 'vui-container',
  dataProp: 'data',
  dataType: 'Array'
})
/**
 * 注册组件 vui-grid
 * */
_$vue.registerComponent({
  componentName: 'vui-grid',
  dataProp: 'data-source',
  dataType: 'Array'
})
/**
 * 注册组件 vui-tree-grid
 * */
_$vue.registerComponent({
  componentName: 'vui-tree-grid',
  dataProp: 'data-source',
  dataType: 'Array'
})

/**
 * 注册组件 vui-combo-box
 * */
_$vue.registerComponent({
  componentName: 'vui-combo-box',
  dataProp: 'item-source',
  dataType: 'Array'
})

/**
 * 注册组件 vui-tree-grid
 * */
_$vue.registerComponent({
  componentName: 'vui-combo-box',
  dataProp: 'data-source',
  dataType: 'Object'
})
/**
 * 注册组件 vui-dropdown
 * */
_$vue.registerComponent({
  componentName: 'vui-dropdown-list',
  dataProp: 'data-source',
  dataType: 'Array'
})
/**
 * 注册组件 vui-record-navigator
 * */
_$vue.registerComponent({
  componentName: 'vui-record-navigator',
  dataProp: 'data-source',
  dataType: 'Array'
})

/**
 * 注册组件 vui-checkbox-list
 * */
_$vue.registerComponent({
  componentName: 'vui-checkbox-list',
  dataProp: 'data-source',
  dataType: 'Object'
})

/**
 * 注册组件 vui-checkbox-list
 * */
_$vue.registerComponent({
  componentName: 'vui-checkbox-list',
  dataProp: 'item-source',
  dataType: 'Array'
})

/**
 * 注册组件 vui-checkbox-list
 * */
_$vue.registerComponent({
  componentName: 'vui-radio-list',
  dataProp: 'data-source',
  dataType: 'Object'
})

/**
 * 注册组件 vui-checkbox-list
 * */
_$vue.registerComponent({
  componentName: 'vui-radio-list',
  dataProp: 'item-source',
  dataType: 'Array'
})

/**
 * 注册组件 vui-checkbox-list
 * */
_$vue.registerComponent({
  componentName: 'vui-dict-box',
  dataProp: 'data-source',
  dataType: 'Object'
})

/*
define("./V3VueComponent", function(require, exports, module) {
	
	var V3VueComponent = function(params){
		this.alias = null;
		this.componentName = params.componentName;
		this.dataProp = params.dataProp;
		this.dataType = params.dataType;
		this.treeStructProp = params.treeStructProp;
		this._init();
	}
	
	V3VueComponent.prototype = {
			
		_init : function(){
			var buff = [];
			for(var i=0,l=this.componentName.length;i<l;i++){
				var c = this.componentName.charAt(i);
				if('A'<=c&&c<='Z'&&i!=0){
					buff.push('-');
				}
				buff.push(c);
			}
			var str = buff.join('');
			this.alias = str.toLowerCase();
		},
			
		getComponentName : function(){
			return this.componentName;
		},
		
		getDataProp : function(){
			return this.dataProp;
		},
		
		getDataType : function(){
			return this.dataType;
		},
		
		getTreeStructProp : function(){
			return this.treeStructProp;
		},
		
		getAlias : function(){
			return this.alias;
		},
		
		isMatch : function(tagName){
			return tagName==this.componentName||tagName.toLowerCase()==this.alias;
		}
			
	}
	
	return V3VueComponent;
	
});*/
