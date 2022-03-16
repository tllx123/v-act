/**
 *
 * @authors liangzc
 * @date    2017-10-30 13:25:03
 */
/**
 * vue 全局对象
 */
//@ts-ignore
let _$vue = window._$V3Vue
/**
 * 生成uuId
 */
_$vue.genUUID = function () {
  let S4 = function () {
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
_$vue.registerEvent = function (handle: Function) {
  let key = this.genUUID()
  let _storage = this.getEventStorage()
  _storage[key] = handle
  return key
}
/**
 * 是否有事件
 * id {String} 事件id
 */
_$vue.hasEvent = function (id: string) {
  let _storage = this.getEventStorage()
  //if (_storage[key]) {
  if (_storage[id]) {
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
_$vue.fireEvent = function (id: string, params: Record<string, any>) {
  let _storage = this.getEventStorage()
  //let func = _storage[key]
  let func = _storage[id]
  if (typeof func == 'function') {
    func.apply(this, params)
  }
}
