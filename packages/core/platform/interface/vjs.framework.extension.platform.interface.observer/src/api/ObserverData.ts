let ObserverData = function (action, resultSet) {
  this.action = action
  this.resultSet = resultSet
}

ObserverData.prototype = {
  getAction: function () {
    return this.aciton
  },

  getResultSet: function () {
    return this.resultSet
  }
}

return ObserverData
