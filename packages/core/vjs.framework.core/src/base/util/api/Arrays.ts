let i,
  df = require('vjs/framework/core/base/util/impl/underscore'),
  e = exports,
  m = [
    'first',
    'last',
    'initial',
    'rest',
    'union',
    'intersection',
    'difference',
    'object',
    'indexOf',
    'lastIndexOf',
    'range',
    'compact',
    'flatten',
    'without',
    'partition',
    'uniq',
    'zip',
    'sortedIndex'
  ]

e._gi = function () {
  return i || df
}

e._si = function (it) {
  i = it
}

for (let n = 0, d; (d = m[n]); n++) {
  e[d] = (function (l) {
    return function () {
      var s = e._gi()
      return s[l].apply(s, arguments)
    }
  })(d)
}

/**
 *  返回数组中第一个元素，如果指定n，则返回前面n个元素
 *  例：first([3,2,1]) -> 3
 *     first([3,2,1],2) -> [3,2]
 * @param Array array
 * @param Integer<可选> n 

exports.first = function(array,n){
    
}
     */
/**
 *  返回数组中最后一个元素，如果指定n，则返回最后面n个元素
 *  例：last([3,2,1])  -> 1
 *      last([3,2,1],2) -> [2,1]
 * @param Array arrray
 * @param Integer<可选> n

exports.last = function(array,n){
    
}
 */
/**
 * 返回所有数组元素，除了最后一个；如果指定n值，则返回所有数据元素，除了最后n个元素
 * 例：initial([3,2,1])   -> [3,2]
 *     initial([3,2,1],2) -> [3]
 * @param Array array
 * @param Integer<可选> n 

exports.initial = function(array,n){
    
}
 */
/**
 * 返回数据中所有元素，除了第一个；如果指定n值，则返回所有元素，除去前面n个元素
 * 例：rest([3,2,1])  -> [2,1]
 *     rest([3,2,1],2)-> [1]
 * @param Array array
 * @param Integer<可选> n 

exports.rest = function(array,n){
    
}
 */
/**
 * 返回所有数组元素的并集部分
 * 例： union([3,2,1],[5,6,7],[3,4,9]) -> [3,2,1,5,6,7,4,9]
 
exports.union = function(){
    
}
*/
/**
 *返回所有数组中的交集部分 
 * 例：intersection([3,1,4],[3,1,6],[3,6,7]) -> [3]
 
exports.intersection = function(){
    
}
*/
/**
 * 返回指定数组中与其他数据不同部分
 * 例： difference([3,2,1],[3,4,6],[6,7,8]) -> [2,1]
 
exports.difference = function(){
    
}
*/
/**
 * 将数组转换成Obejct
 * 例：object(['moe', 'larry', 'curly'], [30, 40, 50]); -> {moe: 30, larry: 40, curly: 50}
       object([['moe', 30], ['larry', 40], ['curly', 50]]);-> {moe: 30, larry: 40, curly: 50} 
 
exports.object = function(){
    
}

exports.indexOf = function(){
    
}

exports.lastIndexOf = function(){
    
}

exports.range = function(){
    
}

exports.compact = function(){
    
}

exports.flatten = function(){
    
}

exports.without = function(){
    
}

exports.partition = function(){
    
}

exports.uniq = function(){
    
}

exports.zip = function(){
    
}

exports.sortedIndex = function(){
    
}*/
