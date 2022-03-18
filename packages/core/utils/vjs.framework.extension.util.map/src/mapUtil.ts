export class MapUtil {
  elements: any[]

  constructor(elements: any[] = []) {
    this.elements = elements
  }

  // 获取Map元素个数
  size(): number {
    return this.elements.length
  }

  // 判断Map是否为空
  isEmpty(): boolean {
    return this.elements.length < 1
  }

  // 删除Map所有元素
  clear() {
    this.elements = new Array()
  }

  // 向Map中增加元素（key, value)
  put(_key: string, _value: any) {
    if (this.containsKey(_key)) {
      if (this.containsValue(_value)) {
        if (this.remove(_key)) {
          this.elements.push({
            key: _key,
            value: _value
          })
        }
      } else {
        this.elements.push({
          key: _key,
          value: _value
        })
      }
    } else {
      this.elements.push({
        key: _key,
        value: _value
      })
    }
  }

  // 删除指定key的元素，成功返回true，失败返回false
  remove(_key: string): boolean {
    let bln = false
    try {
      for (let i = 0; i < this.elements.length; i++) {
        if (this.elements[i].key == _key) {
          this.elements.splice(i, 1)
          return true
        }
      }
    } catch (e) {
      bln = false
    }
    return bln
  }

  // 获取指定key的元素值value，失败返回null
  get(_key: string): any {
    try {
      for (let i = 0; i < this.elements.length; i++) {
        if (this.elements[i].key == _key) {
          return this.elements[i].value
        }
      }
    } catch (e) {
      return null
    }
  }

  // 获取指定索引的元素
  element(_index: number): any {
    if (_index < 0 || _index >= this.elements.length) {
      return null
    }
    return this.elements[_index]
  }

  // 判断Map中是否含有指定key的元素
  containsKey(_key: string): boolean {
    let bln = false
    try {
      for (let i = 0; i < this.elements.length; i++) {
        if (this.elements[i].key == _key) {
          bln = true
        }
      }
    } catch (e) {
      bln = false
    }
    return bln
  }

  // 判断Map中是否含有指定value的元素
  containsValue(_value: any): boolean {
    let bln = false
    try {
      for (let i = 0; i < this.elements.length; i++) {
        if (this.elements[i].value == _value) {
          bln = true
        }
      }
    } catch (e) {
      bln = false
    }
    return bln
  }

  //  获取Map中所有key的数组（array）
  keys(): string[] {
    let arr = new Array()
    for (let i = 0; i < this.elements.length; i++) {
      arr.push(this.elements[i].key)
    }
    return arr
  }

  //  获取Map中所有value的数组（array）
  values() {
    let arr = new Array()
    for (let i = 0; i < this.elements.length; i++) {
      arr.push(this.elements[i].value)
    }
    return arr
  }
}
