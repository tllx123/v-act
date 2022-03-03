let Resource = function (params) {
  this.id = 'WindowResource_' + Resource.index++
  this.resources = params.resources || []
  this.success = params.success || false
  this.key = params.key
  this.deps = params.deps
}

Resource.index = 0

Resource.prototype = {
  getId: function () {
    return this.id
  },

  getResources: function () {
    return this.resources
  },

  handleSuccess: function () {
    if (this.success) {
      this.success()
    }
  },

  getKey: function () {
    return this.key
  },

  getDeps: function () {
    return this.deps
  }
}

return Resource
