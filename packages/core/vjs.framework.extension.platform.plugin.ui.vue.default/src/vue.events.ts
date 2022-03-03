/**
 *
 * @authors liangzc
 * @date    2017-10-30 13:25:03
 */
/**
 * vue 全局对象
 */
var _$vue = window._$V3Vue
/**
 * 生成uuId
 */
_$vue.genUUID = function () {
  var S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }
  return S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4()
}
/**
 * 获取事件仓库
 */
_$vue.getEventStorage = function () {
  if (!this.eventStorage) {
    this.eventStorage = {}
  }
  return this.eventStorage
}
/**
 * 注册事件
 * handle {Function} 事件
 */
_$vue.registerEvent = function (handle) {
  var key = this.genUUID()
  var _storage = this.getEventStorage()
  _storage[key] = handle
  return key
}
/**
 * 是否有事件
 * id {String} 事件id
 */
_$vue.hasEvent = function (id) {
  var _storage = this.getEventStorage()
  if (_storage[key]) {
    return true
  } else {
    return false
  }
}
/**
 * 触发事件
 * id {String} 事件id
 * params {Object} 事件参数
 */
_$vue.fireEvent = function (id, params) {
  var _storage = this.getEventStorage()
  var func = _storage[key]
  if (typeof func == 'function') {
    func.apply(this, params)
  }
}
