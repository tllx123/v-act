/**
 * @namespace MapStorage
 * @class MapStorage
 * @desc Map型存储仓库<br/>
 * vjs名称：vjs.framework.extension.platform.interface.storage<br/>
 * 该实例无法直接创建，请通过存储仓库管理器({@link StorageManager#newInstance|StorageManager})创建
 */
class MapStorage {
  len: number = 0
  pool: { [key: string]: any } = {}
  /**
   * 包含数据量
   * @return Integer
   */
  size() {
    return this.len
  }

  /**
   * 是否为空
   * @return Boolean
   */
  isEmpty() {
    return this.len == 0
  }

  /**
   * 是否包含指定key
   * @param {String} key
   * @return Boolean
   */
  containsKey(key: string) {
    return this.pool.hasOwnProperty(key)
  }

  /**
   * 是否包含指定值
   * @param {Any} val
   * @return Boolean
   */
  containsValue(val: any) {
    for (let key in this.pool) {
      if (val == this.pool[key]) {
        return true
      }
    }
    return false
  }

  /**
   * 获取值
   * @param {String} key
   * @return Any
   */
  get(key: string) {
    return this.pool[key]
  }

  /**
   * 添加值
   * @param {Object} key
   * @param {Any} value
   * @return Boolean
   */
  put(key: string, value: any) {
    if (!this.containsKey(key)) {
      this.len++
    }
    this.pool[key] = value
  }

  /**
   * 移除指定key
   * @param {String} key
   */
  remove(key: string) {
    try {
      delete this.pool[key]
    } catch (e) {}
  }

  /**
   * 批量添加值
   * @param {Object} map
   */
  putAll(map: { [key: string]: any }) {
    for (let key in map) {
      this.put(key, map[key])
    }
  }

  /**
   * 获取全部数据
   * */
  getAll() {
    return this.pool
  }

  /**
   * 清空数据
   */
  clear() {
    this.len = 0
    this.pool = {}
  }

  /**
   * 遍历
   * @param {Function} fn 遍历函数
   * fn传递参数：1、key
   * 						2、value
   */
  iterate(fn: (key: string, val: any) => void) {
    for (let key in this.pool) {
      if (this.pool.hasOwnProperty(key)) {
        fn(key, this.pool[key])
      }
    }
  }
}

export default MapStorage
