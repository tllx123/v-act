exports.initModule = function (sBox) {
  if (sBox) {
    arraysUtils = sBox.util.arrays
  }
}
/**
 *查找下标
 */
const indexOf = function (
  array: Array<any>,
  obj: any,
  pos?: number,
  endPos?: number
) {
  if (pos == null || pos == undefined) pos = 0
  if (endPos == null || pos == undefined) endPos = array.length - 1
  for (let i = pos; i <= endPos; i++) if (array[i] == obj) return i
  return -1
}

const contains = function (array: Array<any>, val: any) {
  return indexOf(array, val) != -1
}

const remove = function (array: Array<any>, obj: any) {
  let index = indexOf(array, obj)
  if (index == -1) return false
  for (let i = index; i < array.length; i++) array[i] = array[i + 1]
  array.length = array.length - 1
  return true
}

const isArray = function (object: any) {
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

export { contains, isArray, remove, union }
