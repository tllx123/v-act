/**
 * @namespace MapStorage
 * @class MapStorage
 * @desc Map型存储仓库<br/>
 * vjs名称：vjs.framework.extension.platform.interface.storage<br/>
 * 该实例无法直接创建，请通过存储仓库管理器({@link StorageManager#newInstance|StorageManager})创建
 */
let MapStorage = function () {
  this.size = 0
  this.pool = {}
}

MapStorage.prototype = {
  /**
   * 包含数据量
   * @return Integer
   */
  size: function () {
    return this.size
  },

  /**
   * 是否为空
   * @return Boolean
   */
  isEmpty: function () {
    return this.size == 0
  },

  /**
   * 是否包含指定key
   * @param {String} key
   * @return Boolean
   */
  containsKey: function (key) {
    return this.pool.hasOwnProperty(key)
  },

  /**
   * 是否包含指定值
   * @param {Any} val
   * @return Boolean
   */
  containsValue: function (val) {
    for (let key in this.pool) {
      if (val == this.pool[key]) {
        return true
      }
    }
    return false
  },

  /**
   * 获取值
   * @param {String} key
   * @return Any
   */
  get: function (key) {
    return this.pool[key]
  },

  /**
   * 添加值
   * @param {Object} key
   * @param {Any} value
   * @return Boolean
   */
  put: function (key, value) {
    if (!this.containsKey(key)) {
      this.size++
    }
    this.pool[key] = value
  },

  /**
   * 移除指定key
   * @param {String} key
   */
  remove: function (key) {
    try {
      delete this.pool[key]
    } catch (e) {}
  },

  /**
   * 批量添加值
   * @param {Object} map
   */
  putAll: function (map) {
    for (let key in map) {
      this.put(key, map[key])
    }
  },

  /**
   * 获取全部数据
   * */
  getAll: function () {
    return this.pool
  },

  /**
   * 清空数据
   */
  clear: function () {
    this.size = 0
    this.pool = {}
  },

  /**
   * 遍历
   * @param {Function} fn 遍历函数
   * fn传递参数：1、key
   * 						2、value
   */
  iterate: function (fn) {
    for (let key in this.pool) {
      if (this.pool.hasOwnProperty(key)) {
        fn(key, this.pool[key])
      }
    }
  }
}

return MapStorage
export { get, destory, exists, newInstance }
