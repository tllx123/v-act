let ExpressionContext = function () {
  this.routeContext = null
  this.dataSourceConfig = {
    currentRecord: {},
    recordIndexInfo: {}
  }
  this.params = {}
}

ExpressionContext.prototype = {
  initModule: function (sandbox) {
    ExpressionContext.prototype['sandbox'] = sandbox
  },
  /**
   * 获取vjs服务
   * @param {Object} serviceName 服务名称
   * @param {Object} props 蚕食信息
   */
  getService: function (serviceName, props) {
    if (props) {
      return this.sandbox.getService(serviceName)
    } else {
      return this.sandbox.getService(serviceName, props)
    }
  },
  /**
   * 设置路由上下文
   * @param {Object} ctx
   */
  setRouteContext: function (ctx) {
    this.routeContext = ctx
  },
  /**
   * 获取路由上下文
   */
  getRouteContext: function () {
    return this.routeContext
  },
  /**
   * 设置数据源配置信息
   */
  setRecords: function (records) {
    let cfg = this.dataSourceConfig
    for (let i = 0; i < records.length; i++) {
      let record = records[i]
      let metadata = record.getMetadata()
      let dataSourceName = metadata.getDatasourceName()
      //如果同一实体有多条记录,则以第1条为准
      if (cfg['currentRecord'][dataSourceName] == null)
        cfg['currentRecord'][dataSourceName] = record
    }
    this.dataSourceConfig = cfg
  },
  /**
   * 设置数据源记录索引
   * @param {Object} params 参数信息
   * {
   * 		"datasourceName" : {String}  数据源名称
   * 		"index" : {Integer} 索引
   * }
   */
  setRecordIndex: function (params) {
    let cfg = this.dataSourceConfig
    let dataSourceName = params.datasourceName
    let index = params.index
    if (cfg['recordIndexInfo'][dataSourceName] == null) {
      cfg['recordIndexInfo'][dataSourceName] = index
    }
    this.dataSourceConfig = cfg
  },
  /**
   * 获取数据源配置信息
   */
  getDataSourceConfig: function () {
    return this.dataSourceConfig
  },

  /**
   * 判断是否有指定当前记录
   */
  hasCurrentRecord: function (datasourceName) {
    let cfg = this.dataSourceConfig
    if (cfg && cfg['currentRecord'] && cfg['currentRecord'][datasourceName]) {
      return true
    }
    return false
  },

  /**
   * 判断是否有指定当前记录
   */
  hasRecordIndex: function (datasourceName) {
    let cfg = this.dataSourceConfig
    if (
      cfg &&
      cfg['recordIndexInfo'] &&
      cfg['recordIndexInfo'][datasourceName]
    ) {
      return true
    }
    return false
  },

  /**
   * 获取当前记录
   */
  getCurrentRecord: function (datasourceName) {
    if (!this.hasCurrentRecord(datasourceName))
      throw new Error(
        '[ExpressionContext.getCurrentRecord]获取当前记录失败，表达式上下文中没有设置当前行记录'
      )
    let cfg = this.dataSourceConfig
    return cfg['currentRecord'][datasourceName]
  },

  /**
   * 获取指定记录
   */
  getRecordIndex: function (datasourceName) {
    if (!this.hasRecordIndex(datasourceName))
      throw new Error(
        '[ExpressionContext.getRecordByIndex]获取指定记录失败，表达式上下文中没有设置记录Index'
      )
    let cfg = this.dataSourceConfig
    return cfg['recordIndexInfo'][datasourceName]
  },

  /**
   * 设置变量值
   */
  put: function (key, value) {
    this.params[key] = value
  },

  /**
   * 获取变量值
   */
  get: function (key) {
    return this.params[key]
  }
}

return ExpressionContext
