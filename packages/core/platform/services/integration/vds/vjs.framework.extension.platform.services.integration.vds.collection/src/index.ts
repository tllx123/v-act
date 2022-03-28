/**
 * collection相关工具方法
 * @desc 提供一系列collection相关的工具方法，使用前请先import：vds.import("vds.collection.*")
 * @namespace vds/collection
 * @module collection
 * @catalog 工具方法/集合
 * @example
 * vds.import("vds.collection.*");
 * vds.collection.each([1,2,3],function(item,index){
 * 	console.log("item:"+item+",index:"+index);
 * });
 */
// window.vds = window.vds || {}
// window.vds.collection = window.vds.collection || {}

var methods = [
  /**
   * 遍历集合中所有元素，按顺序用元素作为参数执行回调函数
   * @func each
   * @param {Array} array 数组
   * @example
   * vds.collection.each([1,2,3],function(item,index){
   * 	console.log("item:"+item+",index:"+index);
   * });
   * //item:1,index:0
   * //item:2,index:1
   * //item:3,index:2
   * vds.collection.each({one: 1,two: 2,three: 3},function(val,key){
   * 	console.log("key:"+key+",value:"+val);
   * });
   * //key:one,value:1
   * //key:two,value:2
   * //key:threee,value:3
   */
  'each',
  /**
   * 遍历集合中所有元素，执行回调函数，并生成与之相对应的数组
   * @func map
   * @param {Array} array 数组
   * @returns Array
   * @example
   * var rs = vds.collection.map([1,2,3],function(item,index){
   * 	return item * 2;
   * });
   * //rs => [2,4,6]
   * var rs = vds.collection.map({one: 1, two: 2, three: 3},function(value,key){
   * 	return value * 2;
   * });
   * // rs => [2,4,6]
   */
  'map',
  /**
   * 在集合中逐项查找，执行回调函数，如果回调返回值为true，则立即返回，中断遍历；如果遍历完成回调函数都没有返回true，则返回值为undefined
   * @func find
   * @param {Array} array 数组
   * @returns Any
   * @example
   * var rs = vds.collection.find([1,2,3],function(item,index){
   * 	return item%2 == 0;
   * });
   * //rs => 2
   * var rs = vds.collection.find([1,2,3],function(item,index){
   * 	return item == 4;
   * });
   * //rs => undefined
   */
  'find',
  /**
   * 根据指定的条件过滤数组
   * @func where
   * @param {Array} array 数组
   * @returns Array
   * @example
   * var players = [{name:"张三",sex:"男",age:25},{name:"李四",sex:"女",age:18}];
   * var rs = vds.collection.where(players,{sex:"男"});
   * //rs => [{
   * //	name:"张三",
   * //	sex:"男",
   * //	age:25
   * //}]
   */
  'where',
  /**
   * 判断集合中是否有指定的元素
   * @func contains
   * @param {Array} array 数组
   * @returns Boolean
   * @example
   * var rs = vds.collection.contains([1,2,3],3);
   * //rs => true
   */
  'contains',
  /**
   * 返回集合中最大值
   * @func max
   * @param {Array} array 数组
   * @returns Any
   * @example
   * var persons = [{name: '张三', age: 40}, {name: '李四', age: 50}, {name: '王五', age: 60}];
   * var rs = vds.collection.max(persons, function(person){
   * 	return person.age;
   * });
   * //rs => {name: '王五', age: 60};
   */
  'max',
  /**
   * 返回集合中最小值
   * @func min
   * @param {Array} array 数组
   * @returns Any
   * @example
   * var persons = [{name: '张三', age: 40}, {name: '李四', age: 50}, {name: '王五', age: 60}];
   * var rs = vds.collection.min(persons, function(person){
   * 	return person.age;
   * });
   * //rs => {name: '张三', age: 40};
   */
  'min',
  /**
   * 根据指定函数排序
   * @func sortBy
   * @param {Array} array 数组
   * @param {Function|String} func 排序函数或属性编号
   * @returns Array
   * @example
   * var rs = vds.collection.sortBy([1, 2, 3, 4, 5, 6], function(num){
   * 	return Math.sin(num);
   * });
   * //rs => [5, 4, 6, 3, 1, 2]
   * var persons = [{name: '王五', age: 60},{name: '张三', age: 40}, {name: '李四', age: 50}, ];
   * var rs = vds.collection.sortBy(persons, 'age');
   * //rs => [{name: '张三', age: 40}, {name: '李四', age: 50}, {name: '王五', age: 60}]
   */
  'sortBy'
]

// export function initModule(sb) {
// var utils = sb.util.collections
let utils: any[] = []
for (let i = 0, l = methods.length; i < l; i++) {
  var methodName = methods[i]
  var define = utils[methodName]
  window.vds.collection[methodName] = (function (func) {
    return function () {
      return func.apply(utils, arguments)
    }
  })(define)
}
// }
