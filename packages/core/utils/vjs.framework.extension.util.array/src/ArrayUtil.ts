let arraysUtils
exports.initModule = function (sBox) {
  if (sBox) {
    arraysUtils = sBox.util.arrays
  }
}
/**
 *查找下标
 */
let indexOf = function (array, obj, pos, endPos) {
  if (pos == null) pos = 0
  if (endPos == null) endPos = array.length - 1
  for (let i = pos; i <= endPos; i++) if (array[i] == obj) return i
  return -1
}

const contains = function (array, val) {
  return indexOf(array, val) != -1
}

const remove = function (array, obj) {
  let index = indexOf(array, obj)
  if (index == -1) return false
  for (let i = index; i < array.length; i++) array[i] = array[i + 1]
  array.length = array.length - 1
  return true
}

const isArray = function (object) {
  return Object.prototype.toString.call(object) === '[object Array]'
}

const union = function () {
  let args = arguments
  let params = []
  for (let i = 0, len = args.length; i < len; i++) {
    let arr = args[i]
    if (arr && arr.length > 0) {
      params.push(arr)
    }
  }
  if (params.length > 0) {
    params = arraysUtils.union.apply(this, params)
  }
  return params
}

export { contains, remove, isArray, union }
