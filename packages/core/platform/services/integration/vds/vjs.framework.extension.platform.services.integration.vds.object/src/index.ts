/**
 * object相关工具方法
 * @desc 提供一系列object相关的工具方法，使用前请先import：vds.import("vds.object.*")
 * @namespace vds/object
 * @module object
 * @catalog 工具方法/对象
 * @example
 * vds.import("vds.object.*");
 * var rs = vds.object.isArray("ds1");
 */
window.vds = window.vds || {}
window.vds.object = window.vds.object || {}

var methods = [
  /**
   * 获取对象中所有属性名称
   * @func keys
   * @param {Object} object object对象
   * @returns Array<{@link String}>
   * @example
   * var obj = {one: 1, two: 2, three: 3};
   * var rs = vds.object.keys(obj);
   * //rs => [1, 2, 3]
   */
  'keys',
  /**
   * 获取所有属性值
   * @func values
   * @param {Object} object object对象
   * @returns Array<{@link Any}>
   * @example
   * var obj = {one: 1, two: 2, three: 3};
   * var rs = vds.object.keys(obj);
   * //rs => [1, 2, 3]
   */
  'values',
  /**
   * 将对象转换成二维数组
   * @func pairs
   * @param {Object} object object对象
   * @returns Array<{@link Array}>
   * @example
   * var obj = {one: 1, two: 2, three: 3};
   * var rs = vds.object.pairs(obj);
   * //rs => [["one", 1], ["two", 2], ["three", 3]]
   */
  'pairs',
  /**
   * 将对象中属性和属性值对调
   * @func invert
   * @param {Object} object object对象
   * @returns Object
   * @example
   * var obj = {one: 1, two: 2, three: 3};
   * var rs = vds.object.invert(obj);
   * //rs => {1: "one", 2: "two", 3: "three"}
   */
  'invert',
  /**
   * 获取对象中所有方法名称
   * @func functions
   * @param {Object} object object对象
   * @returns Array<{@link String}>
   * @example
   * var obj = {one: function(){return 1;}, two: 2, three: 3};
   * var rs = vds.object.functions(obj);
   * //rs => ["one"]
   */
  'functions',
  /**
   * 对象属性合并，如果目标对象存在该属性值，则被覆盖。支持多个对象。
   * @func extend
   * @param {...Object} object object对象
   * @returns Object
   * @example
   * var obj = {one: 1, two: 2, three: 3};
   * var obj1 = {four: 4, five: 5};
   * var rs = vds.object.extend(obj,obj1);
   * //rs => {one: 1, two: 2, three: 3, four: 4, five: 5}
   * //obj === rs => true
   */
  'extend',
  /**
   * 从对象中挑选属性并返回新对象
   * @func pick
   * @param {Object} object object对象
   * @param {...String} attr 属性编号
   * @returns Object
   * @example
   * var obj = {one: 1, two: 2, three: 3};
   * var rs = vds.object.pick(obj,"one","two");
   * //rs => {one: 1, two: 2}
   */
  'pick',
  /**
   * 从对象中忽略指定属性并返回新对象
   * @func omit
   * @param {Object} object object对象
   * @param {...String|Function} attr 属性编号或过滤函数
   * @returns Object
   * @example
   * var obj = {one: 1, two: 2, three: 3};
   * var rs = vds.object.omit(obj,"one","two");
   * //rs => {three: 3}
   * var rs = vds.object.pick(obj,function(val,key,obj){
   * 	return key.charAt(0) == "o";
   * });
   * //rs => {two: 2, three: 3}
   */
  'omit',
  /**
   * 对象属性合并，如果目标对象存在该属性值，则被忽略。支持多个对象
   * @func defaults
   * @param {...Object} object object对象
   * @returns Object
   * @example
   * var obj = {one: 1, two: 2, three: 3};
   * var obj1 = {four: 4, five: 5};
   * var obj2 = {one: 4,six: 6};
   * var rs = vds.object.defaults(obj,obj1,obj2);
   * //rs => {one: 1, two: 2, three: 3, four: 4, five: 5,six: 6}
   * //obj === rs => true
   */
  'defaults',
  /**
   * 创建一个浅拷贝的克隆对象。任何嵌套的对象或数组都通过引用拷贝，不会复制
   * @func clone
   * @param {Object} object object对象
   * @returns Object
   * @example
   * var obj = {one: 1, two: 2, three: 3};
   * var rs = vds.object.clone(obj);
   * //rs => {one: 1, two: 2, three: 3}
   * //obj === rs => false
   */
  'clone',
  /**
   * 对象是否包含给定的属性
   * @func has
   * @param {Object} object object对象
   * @returns Boolean
   * @example
   * var obj = {one: 1, two: 2, three: 3};
   * var rs = vds.object.has(obj,"one")
   * //rs => true
   */
  'has',
  /**
   * 对两个对象进行深度比较，确定是否相等
   * @func isEqual
   * @param {Object} object object对象
   * @param {Object} object object对象
   * @returns Boolean
   * @example
   * var obj = {name: '张三', luckyNumbers: [13, 16, 59]};
   * var obj1  = {name: '张三', luckyNumbers: [13, 16, 59]};
   * var rs = vds.object.isEqual(obj,obj1);
   * //rs =》 true
   */
  'isEqual',
  /**
   * 判断对象是否为空
   * @func isEmpty
   * @param {Object} object object对象
   * @returns Boolean
   * @example
   * var obj = {};
   * var rs = vds.object.isEmpty(obj)
   * //rs => true
   */
  'isEmpty',
  /**
   * 判断指定的对象是否为DOM元素
   * @func isElement
   * @param {Object} object object对象
   * @returns Boolean
   * @example
   * var obj = {};
   * var rs = vds.object.isElement(document.body)
   * //rs => true
   */
  'isElement',
  /**
   * 判断给定的对象是否为数组
   * @func isArray
   * @param {Object} object object对象
   * @returns Boolean
   * @example
   * var arr = [1,2,3];
   * var rs = vds.object.isArray(arr);
   * //rs => true
   */
  'isArray',
  /**
   * 判断是否为Object对象
   * @func isObject
   * @param {Object} object object对象
   * @returns Boolean
   * @example
   * vds.object.isObject({});//true
   * vds.object.isObject(1);//false
   */
  'isObject',
  /**
   * 判断是否为参数对象
   * @func isArguments
   * @param {Object} object object对象
   * @returns Boolean
   * @example
   * vds.object.isArguments({});//false
   * (function(){return vds.object.isArguments(arguments);})();//true
   */
  'isArguments',
  /**
   * 判断是否为函数
   * @func isFunction
   * @param {Object} object object对象
   * @returns Boolean
   * @example
   * vds.object.isFunction(window.alert);//true
   */
  'isFunction',
  /**
   * 判断是否为字符串
   * @func isString
   * @param {Object} object object对象
   * @returns Boolean
   * @example
   * vds.object.isString("abc");//true
   * vds.object.isString(123);//false
   */
  'isString',
  /**
   * 判断是否为数值
   * @func isNumber
   * @param {Object} object object对象
   * @returns Boolean
   * @example
   * vds.object.isNumber("abc");//false
   * vds.object.isNumber(123);//true
   */
  'isNumber',
  /**
   * 判断是否为布尔值
   * @func isBoolean
   * @param {Object} object object对象
   * @returns Boolean
   * @example
   * vds.object.isBoolean(true);//true
   * vds.object.isBoolean("abc");//false
   */
  'isBoolean',
  /**
   * 判断是否为Date
   * @func isDate
   * @param {Object} object object对象
   * @returns Boolean
   * @example
   * vds.object.isDate("abc");//false
   * vds.object.isDate(new Date());//true
   */
  'isDate',
  /**
   * 判断是否为正则表达式
   * @func isRegExp
   * @param {Object} object object对象
   * @returns Boolean
   * @example
   * vds.object.isRegExp(/abc/);//true
   * vds.object.isRegExp("abc");//false
   */
  'isRegExp',
  /**
   * 判断给定的值是否为null
   * @func isNull
   * @param {Object} object object对象
   * @returns Boolean
   * @example
   * vds.object.isNull("");//false
   * vds.object.isNull(null);//true
   */
  'isNull',
  /**
   * 字符串转对象
   * @func stringify
   * @param {String} str 需要转对象的字符串
   * @returns {Object}
   * @example
   * vds.import("vds.object.*");
   * vds.object.stringify('{"key1":"value1","key2":true}')//{key1:"value1",key2:true}
   */
  'stringify',
  /**
   * 判断给定的值是否为undefined
   * @func isUndefined
   * @param {Object} object object对象
   * @returns Boolean
   * @example
   * vds.object.isUndefined(undefined);//true
   * vds.object.isUndefined(111);//false
   */
  'isUndefined'
]

export function initModule(sb) {
  var utils = sb.getService('vjs.framework.extension.util.ObjectUtil')
  for (var i = 0, l = methods.length; i < l; i++) {
    var methodName = methods[i]
    var define = utils[methodName]
    if (!define) {
      continue
    }
    window.vds.object[methodName] = (function (func) {
      return function () {
        return func.apply(utils, arguments)
      }
    })(define)
  }
}

/**
 *
 * 判断给定的值是否为undefined或null
 * @func isUndefOrNull
 * @param {Object} object object对象
 * @returns Boolean
 * @example
 * vds.object.isUndefOrNull(undefined);//true
 * vds.object.isUndefOrNull(111);//false
 */
window.vds.object.isUndefOrNull = function (obj) {
  return window.vds.object.isNull(obj) || window.vds.object.isUndefined(obj)
}

/**
 * 字符串转对象
 * @param {String} str 需要转对象的字符串
 * @returns {Object}
 * @example
 * vds.import("vds.object.*");
 * vds.object.stringify('{"key1":"value1","key2":true}')//{key1:"value1",key2:true}
 */
window.vds.object.stringify = function (str) {
  return JSON.parse(str)
}
