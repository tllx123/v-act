let DatasourceObserver = function (datasourceName) {
  this.datasourceName = datasourceName
  this.stack = []
}

DatasourceObserver.prototype = {
  /**
   * 添加数据源操作
   * @param {DatasourceOperation} operation 数据源操作
   */
  addOperation: function (operation) {
    let index = this.stack.length
    this.stack.push(operation)
    operation.setOperationPosition(index)
  },

  _removeByIndex: function (index) {
    if (index < this.stack.length) {
      for (let i = index; i < this.stack.length; i++) {
        this.stack[i] = this.stack[i + 1]
      }
      this.stack.length = this.stack.length - 1
    }
  },

  /**
   * 数据源操作合并
   */
  combine: function () {
    for (let i = 0; i < this.stack.length; i++) {
      let o = this.stack[i]
      for (let j = 0; j < this.stack.length; j++) {
        let o1 = this.stack[j]
        if (o !== o1) {
          o.combine(o1)
          if (o1.isDestroyed()) {
            this._removeByIndex(j)
            j--
          }
          if (o.isDestroyed()) {
            this._removeByIndex(i)
            i--
            break
          }
        }
      }
    }
  },

  getOperations: function () {
    return this.stack
  },

  /**
   * 清空数据源操作
   */
  clear: function () {
    this.stack = []
  }
}

return DatasourceObserver
export {
  addObserver,
  fire,
  _callAsyncObservers,
  getBindedDatasourceNames,
  destroy,
  addOperation
}
