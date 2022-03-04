define('./Where', function (require, exports, module) {
  /**
   * 数据源记录条件定义
   * @constructor
   * @alias Where
   * @catalog 数据源/条件定义
   */
  var Where = function (where) {
    this.where = where
    this.nullFilterWhere = where.clone()
  }

  Where.prototype = {
    _get: function () {
      return this.where
    },
    _getNullFilterWhere: function () {
      return this.nullFilterWhere
    },
    /**
     * 排序类型
     * @enum
     * */
    OrderType: {
      /**
       * 升序
       * */
      ASC: 'Asc',
      /**
       * 降序
       * */
      DESC: 'Desc'
    },

    /**
     * 条件节点类型
     * @enum
     * */
    NodeType: {
      /**
       * 相等条件
       * */
      EQ: 'Eq'
    },

    toParameters: function () {
      return this.where.toParameters()
    },
    toWhere: function () {
      return this.where.toWhere()
    },
    toOrderBy: function () {
      return this.where.toOrderBy()
    },
    /**
     * 添加and条件
     * @param {Object} condition 过滤条件
     * */
    addCondition: function (condition) {
      //对接原来的andExtraCondition
      var mode = this.where.fetchMode === 'custom' ? 'custom' : 'table'
      var res = this.where.andExtraCondition(condition, mode)
      this.nullFilterWhere.andExtraCondition(condition, mode)
      return res
    },

    /**
     * 追加字符串条件
     * @param {String} condition 字符串条件
     * */
    andConditionString: function (condition) {
      this.where.andConditionString(condition)
    },
    /**
     * 添加参数
     * @param {Object} params 参数
     * */
    addParameters: function (params) {
      if (params) {
        this.where.addExtraParameters(params)
        this.nullFilterWhere.addExtraParameters(params)
      }
    },
    addExtraParameters: function (params) {
      this.addParameters(params)
    },
    /**
     * 添加排序字段
     * @param {String} orderCode 排序字段编码
     * @param {OrderType} type 排序类型：OrderType.DESC(降序)，OrderType.ASC(升序，默认)（可选）
     * */
    addOrderBy: function (orderCode, type) {
      if (this.OrderType.DESC === type) {
        this.where.addOrderByDesc(orderCode)
        this.nullFilterWhere.addOrderByDesc(orderCode)
      } else {
        this.where.addOrderBy(orderCode)
        this.nullFilterWhere.addOrderBy(orderCode)
      }
    },
    /**
     * 添加或条件
     * @param {Array<String>} conditions 条件信息
     * {
     *  "code" : {String} 编码
     *  "value" : {String} 值
     * }
     * @param {@link Where.NodeType} 条件节点类型
     * */
    addOrConditions: function (conditions, nodetype) {
      if (!vds.object.isArray(conditions) || !nodetype) {
        return
      }
      var eqnodes = []
      for (var i = 0, len = conditions.length; i < len; i++) {
        var condition = conditions[i]
        var code = condition.code
        var value = condition.value
        if (!code || value === null || value === undefined) {
          continue
        }
        eqnodes.push(this.where.eq(code, value))
      }
      this.where.or(eqnodes)
    }
  }

  module.exports = Where
})
