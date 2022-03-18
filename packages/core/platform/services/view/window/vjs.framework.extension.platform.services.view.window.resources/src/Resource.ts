class Resource {
  id = ''
  index = 0
  resources = []
  success = false
  key = ''
  deps = ''
  constructor(params) {
    this.id = 'WindowResource_' + this.index++
    this.resources = params.resources || []
    this.success = params.success || false
    this.key = params.key
    this.deps = params.deps
  }

  getId() {
    return this.id
  }

  getResources() {
    return this.resources
  }

  handleSuccess() {
    if (this.success) {
      // 2022-3-17 没有此方法，暂时注释掉
      //this.success()
    }
  }

  getKey() {
    return this.key
  }

  getDeps() {
    return this.deps
  }
}

export default Resource
