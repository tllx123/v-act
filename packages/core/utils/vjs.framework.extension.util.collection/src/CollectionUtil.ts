import { underscore } from '@v-act/vjs.framework.extension.vendor.underscore'

/**
 *@func each
 * @static
 * @param {Array} list 集合
 * @param {Function} iterate 遍历函数
 * @desc 遍历list中的所有元素，按顺序用遍历输出每个元素。<br/>
 * 调用iteratee都会传递三个参数：(element, index, list)
 */
const each = underscore.each
/**
 *@func map
 * @static
 * @param {Array} list 集合
 * @param {Function} iterate 遍历函数
 * @desc 通过转换函数(iteratee迭代器)映射列表中的每个值产生价值的新数组。<br/>
 * 调用iteratee都会传递三个参数：(value, index, list)
 */
const map = underscore.map
/**
 *@func find
 * @static
 * @param {Array} list 集合
 * @param {Function} predicate 遍历函数
 * @desc 在list中逐项查找，返回第一个通过predicate迭代函数真值检测的元素值。<br/>
 * 如果没有值传递给测试迭代器将返回undefined。 如果找到匹配的元素，函数将立即返回，不会遍历整个list
 */
const find = underscore.find
/**
 *@func where
 * @static
 * @param {Array} list 集合
 * @param {Object} properties 过滤值
 * @desc 遍历list中的每一个值，返回一个数组。<br/>
 * 这个数组包含properties所列出的属性的所有的 键 - 值对
 */
const where = underscore.where
/**
 *@func contains
 * @static
 * @param {Array} list 集合
 * @param {Object} value 匹配值
 * @desc 如果list包含指定的value则返回true（使用===检测）。
 */
const contains = underscore.contains
/**
 *@func max
 * @static
 * @param {Array} list 集合
 * @param {Object} [iteratee]  过滤函数
 * @desc 返回list中的最大值。如果传递iteratee参数。<br/>
 * iteratee将作为list中每个值的排序依据。如果list为空，将返回-Infinity
 */
const max = underscore.max
/**
 *@func min
 * @static
 * @param {Array} list 集合
 * @param {Object} [iteratee]  过滤函数
 * @desc 返回list中的最小值。如果传递iteratee参数。<br/>
 * iteratee将作为list中每个值的排序依据。如果list为空，将返回-Infinity
 */
const min = underscore.min
/**
 *@func sortBy
 * @static
 * @param {Array} list 集合
 * @param {Object} [iteratee]  过滤函数
 * @desc 返回一个排序后的list拷贝副本。<br/>
 * 如果传递iteratee参数，iteratee将作为list中每个值的排序依据。迭代器也可以是字符串的属性的名称进行排序的(比如 length)。
 */
const sortBy = underscore.sortBy

export { contains, each, find, map, max, min, sortBy, where }
