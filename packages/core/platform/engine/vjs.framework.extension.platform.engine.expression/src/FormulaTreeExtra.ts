com.toone.itop.formula.FormulaTreeExtra = {
  VARIABLE_VALUE_KEY: '_VERIABLE_VALUE_KEY_',
  saveVariableValue: function (content, key, value) {
    var vv = content.get(
      com.toone.itop.formula.FormulaTreeExtra.VARIABLE_VALUE_KEY
    )
    if (!vv) {
      vv = {}
      content.put(
        com.toone.itop.formula.FormulaTreeExtra.VARIABLE_VALUE_KEY,
        vv
      )
    }
    vv[key] = value
  }, // 临时方案,解决无法单独获取表达式中的“变量-值”对的问题

  evaluateSystemVariable: function (context, v) {
    var name = v.getText().substring(2, v.getText().length)
    // 目前传入变量为@@xxx
    var ctx = context.get('expressionContext')
    var componentParam = ctx.getService(
      'vjs.framework.extension.platform.services.param.manager.ComponentParam'
    )
    var scopeManager = ctx.getService(
      'vjs.framework.extension.platform.interface.scope.ScopeManager'
    )
    var scope = scopeManager.getScope()
    var componentCode = scope.getComponentCode()
    var cvar
    try {
      cvar = componentParam.getVariant({
        componentCode: componentCode,
        code: name
      })
    } catch (e) {
      cvar = componentParam.getOption({
        componentCode: componentCode,
        code: name
      })
    }

    if (typeof cvar == 'undefine') {
      throw new Error('[' + name + ']' + '没有对应的系统变量')
    }
    // 临时方案,解决无法单独获取表达式中的“变量-值”对的问题
    com.toone.itop.formula.FormulaTreeExtra.saveVariableValue(
      context,
      v.getText(),
      cvar
    )
    return cvar
  },
  evaluateNumber: function (context, v) {
    return Number(v)
  },

  evaluateAdd: function (context, v1, v2) {
    if (!isNaN(v1) && !isNaN(v2)) {
      var ctx = context.get('expressionContext')
      var mathUtil = ctx.getService('vjs.framework.extension.util.Math')
      var val = mathUtil.add(v1, v2)
      return Number(val)
    } else {
      throw new Error(v1 + ',' + v2 + ' add type is wrong')
      //$value = com.toone.itop.formula.FormulaTreeExtra.evaluateVariable(this._getContext(),v1)+com.toone.itop.formula.FormulaTreeExtra.evaluateVariable(this._getContext(),v2)
    }
  },

  evaluateSub: function (context, v1, v2) {
    if (!isNaN(v1) && !isNaN(v2)) {
      var ctx = context.get('expressionContext')
      var mathUtil = ctx.getService('vjs.framework.extension.util.Math')
      var val = mathUtil.subtract(v1, v2)
      return Number(val)
    } else {
      throw new Error(v1 + ',' + v2 + ' sub type is wrong')
    }
  },

  evaluateMult: function (context, v1, v2) {
    if (!isNaN(v1) && !isNaN(v2)) {
      var ctx = context.get('expressionContext')
      var mathUtil = ctx.getService('vjs.framework.extension.util.Math')
      var val = mathUtil.multiply(v1, v2)
      return Number(val)
    } else {
      throw new Error(v1 + ',' + v2 + ' Mult type is wrong')
    }
  },

  evaluateDiv: function (context, v1, v2) {
    if (!isNaN(v1) && !isNaN(v2)) {
      var ctx = context.get('expressionContext')
      var mathUtil = ctx.getService('vjs.framework.extension.util.Math')
      var val = mathUtil.divide(v1, v2)
      return Number(val)
    } else {
      throw new Error(v1 + ',' + v2 + ' Div type is wrong')
    }
  },

  evaluatePercent: function (context, v) {
    var ctx = context.get('expressionContext')
    var mathUtil = ctx.getService('vjs.framework.extension.util.Math')
    var val = mathUtil.divide(v, 100)
    return Number(val)
  },

  evaluateComponentVariable: function (context, v) {
    var name = v.getText().substring(1, v.getText().length)
    // 目前传入变量为@xxx
    var ctx = context.get('expressionContext')
    var windowParam = ctx.getService(
      'vjs.framework.extension.platform.services.param.manager.WindowParam'
    )
    var cvar = windowParam.getInput({ code: name })
    //var viewContext = context.get("viewContext");
    //var cvar = viewContext.getVariableValue(name);

    // 临时方案,解决无法单独获取表达式中的“变量-值”对的问题
    com.toone.itop.formula.FormulaTreeExtra.saveVariableValue(
      context,
      v.getText(),
      cvar
    )
    return cvar
  },

  evaluateWindowFieldVariable: function (context, v) {
    var text = v.getText()
    var param = text.split('.')
    var tablename = param[0].substring(2, param[0].length - 1)
    var fieldname = param[1].substring(1, param[1].length - 1)
    var ctx = context.get('expressionContext')

    var windowParam = ctx.getService(
      'vjs.framework.extension.platform.services.param.manager.WindowParam'
    )
    var datasource = windowParam.getInput({
      code: tablename
    })

    var row
    if (ctx.hasCurrentRecord(tablename)) row = ctx.getCurrentRecord(tablename)
    else if (ctx.hasRecordIndex(tablename))
      row = datasource.getRecordById(ctx.getRecordIndex(tablename))
    else row = datasource.getCurrentRecord()

    // 如果上面都取不到记录，则取数据源的第一行记录
    row = row ? row : datasource.getRecordByIndex(0)

    if (row) {
      var cvar = row ? row.get(fieldname) : null
      // 临时方案,解决无法单独获取表达式中的“变量-值”对的问题
      com.toone.itop.formula.FormulaTreeExtra.saveVariableValue(
        context,
        v.getText(),
        cvar
      )
      return cvar
    }
    return null
  },

  evaluateUserVar: function (context, v) {
    var name = v.getText().substring(1, v.getText().length)
    // 传入变量为#xxx ,暂时没有业务规则 此规则非彼规则

    // 临时方案,解决无法单独获取表达式中的“变量-值”对的问题
    com.toone.itop.formula.FormulaTreeExtra.saveVariableValue(
      context,
      v.getText(),
      1
    )

    return 1
  },

  evaluateArray: function (context, v) {
    // 临时方案,解决无法单独获取表达式中的“变量-值”对的问题
    com.toone.itop.formula.FormulaTreeExtra.saveVariableValue(
      context,
      v.getText(),
      v.getText()
    )

    return v.getText()
  },

  evaluateQuery: function (context, v) {
    return v.getText()
  },

  evaluateBrOutRule: function (context, v) {
    var text = v.getText()
    var param = text.split('.')
    var code = param[1]
    var key = param[2]
    var ctx = context.get('expressionContext')
    var routeContext = ctx.getRouteContext()
    if (routeContext) {
      return routeContext.getBusinessRuleResult(code, key)
    } else {
      throw Error(
        '[ExpressionEngine.evaluateBrOutRule]获取规则业务返回值失败！路由上下文不存在，规则编号：' +
          code
      )
    }
  },
  //获取活动集输入参数值
  evaluateBrIn: function (context, v) {
    var text = v.getText()
    var param = text.split('.')
    var paramName = param[1]
    var ctx = context.get('expressionContext')
    var routeContext = ctx.getRouteContext()
    if (routeContext) {
      return routeContext.getInputParam(paramName)
    } else {
      throw Error(
        '[ExpressionEngine.evaluateBrIn]获取活动集输入参数失败！路由上下文不存在，参数名称：' +
          paramName
      )
    }
  },
  //获取活动集输入实体参数的字段值
  //格式：BR_IN_PARENT.[入參英文名字].[字段名称]
  evaluateBrInFieldVariable: function (context, v) {
    var ctx = context.get('expressionContext')
    var routeContext = ctx.getRouteContext()
    var text = v.getText()
    var param = text.split('.')
    var tablename = param[1].substring(1, param[1].length - 1)
    var fieldname = param[2].substring(1, param[2].length - 1)
    if (routeContext) {
      var datasource = routeContext.getInputParam(tablename)
      if (datasource) {
        var row
        if (ctx.hasCurrentRecord(tablename))
          row = ctx.getCurrentRecord(tablename)
        else if (ctx.hasRecordIndex(tablename))
          row = datasource.getRecordById(ctx.getRecordIndex(tablename))
        else row = datasource.getCurrentRecord()
        row = row ? row : datasource.getRecordByIndex(0)
        return row ? row.get(fieldname) : null
      } else {
        throw Error(
          '[ExpressionEngine.evaluateBrInFieldVariable]获取活动集输入实体参数的字段值失败！活动集输入参数实体不存在，数据源名称：' +
            tablename +
            ',字段名称:' +
            fieldname
        )
      }
    } else {
      throw Error(
        '[ExpressionEngine.evaluateBrInFieldVariable]获取活动集输入实体参数的字段值失败！路由上下文不存在，数据源名称：' +
          tablename +
          ',字段名称:' +
          fieldname
      )
    }
  },
  //获取活动集输出参数值
  evaluateBrOut: function (context, v) {
    var expContext = context.get('expressionContext')
    var routeContext = expContext.getRouteContext()
    var text = v.getText()
    var param = text.split('.')
    var paramName = param[1]
    if (routeContext) {
      return routeContext.getOutPutParam(paramName)
    } else {
      throw Error(
        '[ExpressionEngine.evaluateBrOut]获取活动集输出参数失败！路由上下文不存在，参数名称：' +
          paramName
      )
    }
  },
  //获取活动集输出实体参数的字段值
  //格式：BR_OUT_PARENT.[变量英文名称].[字段名称]
  evaluateBrOutFieldVariable: function (context, v) {
    var ctx = context.get('expressionContext')
    var routeContext = ctx.getRouteContext()
    if (routeContext) {
      var text = v.getText()
      var param = text.split('.')
      var tablename = param[1].substring(1, param[1].length - 1)
      var fieldname = param[2].substring(1, param[2].length - 1)
      var datasource = routeContext.getOutPutParam(tablename)
      if (datasource) {
        var row
        if (ctx.hasCurrentRecord(tablename))
          row = ctx.getCurrentRecord(tablename)
        else if (ctx.hasRecordIndex(tablename))
          row = datasource.getRecordById(ctx.getRecordIndex(tablename))
        else row = datasource.getCurrentRecord()

        // 如果上面都取不到记录，则取数据源的第一行记录
        row = row ? row : datasource.getRecordByIndex(0)
        return row ? row.get(fieldname) : null
      }
    }
    return null
  },
  //获取活动集输出实体参数的字段值
  //格式：BR_OUT_PARENT.[变量英文名称].[字段名称]
  evaluateOutParentVariable: function (context, v) {
    var ctx = context.get('expressionContext')
    var routeContext = ctx.getRouteContext()
    if (routeContext) {
      var text = v.getText()
      var param = text.split('.')
      var tablename = param[1].substring(1, param[1].length - 1)
      var fieldname = param[2].substring(1, param[2].length - 1)
      var datasource = routeContext.getOutPutParam(tablename)
      if (datasource) {
        var row
        if (ctx.hasCurrentRecord(tablename))
          row = ctx.getCurrentRecord(tablename)
        else if (ctx.hasRecordIndex(tablename))
          row = datasource.getRecordById(ctx.getRecordIndex(tablename))
        else row = datasource.getCurrentRecord()

        // 如果上面都取不到记录，则取数据源的第一行记录
        row = row ? row : datasource.getRecordByIndex(0)
        return row ? row.get(fieldname) : null
      }
    }
    return null
  },
  //获取活动集的上下文变量
  evaluateBrVar: function (context, v) {
    var expContext = context.get('expressionContext')
    var routeContext = expContext.getRouteContext()
    var text = v.getText()
    var param = text.split('.')
    var paramName = param[1]
    if (routeContext) {
      return routeContext.getVariable(paramName)
    } else {
      throw Error(
        '[ExpressionEngine.evaluateBrVar]获取活动集上下文变量失败！路由上下文不存在，参数名称：' +
          paramName
      )
    }
  },

  //获取活动集上下文实体变量的字段值
  //格式：BR_VAR_PARENT.[变量英文名称].[字段名称]
  evaluateBrVarFieldVariable: function (context, v) {
    var ctx = context.get('expressionContext')
    var routeContext = ctx.getRouteContext()
    if (routeContext) {
      var text = v.getText()
      var param = text.split('.')
      var tablename = param[1].substring(1, param[1].length - 1)
      var fieldname = param[2].substring(1, param[2].length - 1)
      var datasource = routeContext.getVariable(tablename)
      if (datasource) {
        var row
        if (ctx.hasCurrentRecord(tablename))
          row = ctx.getCurrentRecord(tablename)
        else if (ctx.hasRecordIndex(tablename))
          row = datasource.getRecordById(ctx.getRecordIndex(tablename))
        else row = datasource.getCurrentRecord()

        // 如果上面都取不到记录，则取数据源的第一行记录
        row = row ? row : datasource.getRecordByIndex(0)
        return row ? row.get(fieldname) : null
      }
    }
    return null
  },

  //处理报表实体变量  格式 BR_REPORT.a.a1
  evaluateBrReport: function (context, v) {
    var ctx = context.get('expressionContext')
    var routeContext = ctx.getRouteContext()
    if (routeContext) {
      var text = v.getText()
      var param = text.split('.')
      var reportEntityName = param[1]
      var field = param[2]
      var reportEntity = ctx.get('Report@@Entity')
      if (reportEntity != null) {
        var fieldName = reportEntityName + '.' + field
        return reportEntity[fieldName]
      }
    } else {
      throw Error(
        '[ExpressionEngine.evaluateBrReport]获取规则业务返回值失败！路由上下文不存在，规则编号：' +
          code
      )
    }
    return null
  },

  evaluateTableChain: function (context, v) {
    var ctx = context.get('expressionContext')
    //var viewModel = context.get("viewModel");
    var name = v.getText()
    // 传入变量为[tablename].[tablename](....省略无数个table....).[字段名]
    // 取当前页面中选定状态的行数据
    // 目前只支持一种[表名].[字段名]
    // 如果出现多个表的数据源，那一定会疯掉，yes
    var t = name.split('.')
    var tablename = t[0].substring(1, t[0].length - 1)
    var fieldname = t[1].substring(1, t[1].length - 1)
    var datasourceManager = ctx.getService(
      'vjs.framework.extension.platform.services.model.manager.datasource.DatasourceManager'
    )
    var datasource = datasourceManager.lookup({ datasourceName: tablename })

    var row
    if (ctx.hasCurrentRecord(tablename)) row = ctx.getCurrentRecord(tablename)
    else if (ctx.hasRecordIndex(tablename))
      row = datasource.getRecordById(ctx.getRecordIndex(tablename))
    else row = datasource.getCurrentRecord()

    // 如果上面都取不到记录，则取数据源的第一行记录
    row = row ? row : datasource.getRecordByIndex(0)

    if (row) {
      var fieldValue = ''
      fieldValue = row.get(fieldname)
      // 临时方案,解决无法单独获取表达式中的“变量-值”对的问题
      com.toone.itop.formula.FormulaTreeExtra.saveVariableValue(
        context,
        v.getText(),
        fieldValue
      )
      return fieldValue
    }
    return null
  },

  evaluateControlProperty: function (context, v) {
    // CC.控件Code.控件属性
    var name = v.getText().substring(3, v.getText().length)
    var strArr = name.split('.')
    if (strArr.length == 2) {
      var propertyName = strArr[1]
      var widgetId = strArr[0]
      var ctx = context.get('expressionContext')
      var widgetProperty = ctx.getService(
        'vjs.framework.extension.platform.services.view.widget.common.action.WidgetProperty'
      )
      var propertyValue = widgetProperty.get(widgetId, propertyName)
      return propertyValue
    } else {
      throw new Error('表达式【' + v.getText() + '】设置的控件属性信息不正确！')
    }
  },

  evaluateKeyBoards: function (context, v) {
    var expContext = context.get('expressionContext')
    if (expContext) {
      var routeContext = expContext.getRouteContext()
      var expression = v.getText()
      var name = expression.substring(5, expression.length)
      var keyboardKeys = expContext.getService(
        'vjs.framework.extension.platform.interface.enum.KeyboardKeys'
      )
      return keyboardKeys[name]
    }
  },

  evaluateEventAction: function (context, v) {
    var ctx = context.get('expressionContext')
    var routeContext = ctx.getRouteContext()
    if (routeContext) {
      var expression = v.getText()
      var name = expression.substring(3, expression.length)
      return routeContext.getEventArgument(name)
    }
  },

  evaluateI18NVariable: function (context, v) {
    // 格式以 "I18N." 开头
    var langName = v.getText().substr(5)
    var ctx = context.get('expressionContext')
    if (ctx) {
      var scopeManager = ctx.getService(
        'vjs.framework.extension.platform.interface.scope.ScopeManager'
      )
      var scopeId = scopeManager.getCurrentScopeId()
      var scope = scopeManager.getScope(scopeId)
      var params
      if (scopeManager.isComponentScope(scopeId)) {
        var language = ctx.getService(
          'vjs.framework.extension.platform.interface.i18n.component'
        )
        params = { componentCode: scope.getComponentCode(), code: langName }
        if (language.hasExpLanguage(params)) {
          return language.getExpLanguage(params)
        }
      } else {
        var language = ctx.getService(
          'vjs.framework.extension.platform.interface.i18n.window'
        )
        params = {
          componentCode: scope.getComponentCode(),
          windowCode: scope.getWindowCode(),
          code: langName
        }
        if (language.hasExpLanguage(params)) {
          return language.getExpLanguage(params)
        }
      }
      var resourcePackage = ctx.getService(
        'vjs.framework.extension.ui.adapter.resourcepackage'
      )
      return resourcePackage.getLanguageItem(langName)
    }
    return ''
  },

  //获取foreach循环变量的值
  //格式：LV.[变量英文名称].[字段名称]
  evaluateForEachVar: function (context, v) {
    var routeContext = context.get('expressionContext').getRouteContext()
    var str = v.getText().split('.')
    if (str && str.length == 3) {
      var code = str[1]
      var field = str[2]
      var record = routeContext.getForEachVarValue(code)
      return record.get(field)
    } else {
      throw Error('循环变量表达式取值格式不正确: [' + str + ']')
    }
  },

  callFunction: function (stream, f, argTree, context) {
    var expContext = context.get('expressionContext')
    var handlerName = f.getText().substring(0, f.getText().length - 1)

    // 解析表达式方法参数
    var args = []
    for (var index = 0; index < argTree.length; index++) {
      var walker = new com.toone.itop.formula.FormulaTreeJSExtend(
        context,
        new org.antlr.runtime.tree.CommonTreeNodeStream(argTree[index])
      )
      var cur = walker.eval()

      if (cur == null) {
        if (
          ',' == argTree[index].getText() ||
          ')' == argTree[index].getText()
        ) {
        } else {
          args.push(null)
        }
      } else {
        args.push(cur)
      }
    }

    //判断是否执行表达式
    if (context.get('_isExecutable')) {
      // 获取表达式方法执行器
      var executor = expContext.getService(
        'vjs.framework.extension.platform.engine.function.FunctionEngine'
      )
      var FunctionContext = expContext.getService(
        'vjs.framework.extension.platform.interface.function.FunctionContext'
      )
      //		var executor = context.get("executor");
      if (executor) {
        return executor.execute({
          functionName: handlerName,
          context: new FunctionContext(args, expContext.getRouteContext())
        })
      }
    }
  },

  lt: function (left, right) {
    if (typeof left == 'number' && typeof right == 'number') {
      return Number(left) < Number(right)
    } else {
      if (left == null || right == null) {
        return false
      }
      return String(left) < String(right)
    }
  },

  lteq: function (left, right) {
    if (typeof left == 'number' && typeof right == 'number') {
      return Number(left) <= Number(right)
    } else {
      if (left == null || right == null) {
        return false
      }
      return String(left) <= String(right)
    }
  },

  gt: function (left, right) {
    if (typeof left == 'number' && typeof right == 'number') {
      return Number(left) > Number(right)
    } else {
      if (left == null || right == null) {
        return false
      }
      return String(left) > String(right)
    }
  },

  gteq: function (left, right) {
    if (typeof left == 'number' && typeof right == 'number') {
      return Number(left) >= Number(right)
    } else {
      if (left == null || right == null) {
        return false
      }
      return String(left) >= String(right)
    }
  },

  eq: function (left, right) {
    if (typeof left == 'number' && typeof right == 'number') {
      return Number(left) == Number(right)
    } else {
      if (left == null && right == null) {
        return true
      } else if (left == null || right == null) {
        return false
      }
      return String(left) == String(right)
    }
  },

  noteq: function (left, right) {
    if (typeof left == 'number' && typeof right == 'number') {
      return Number(left) != Number(right)
    } else {
      if (left == null && right == null) {
        return false
      } else if (left == null || right == null) {
        return true
      }
      return String(left) != String(right)
    }
  }
}

com.toone.itop.formula.Map = function () {
  /** Map 大小 * */
  this._size = 0
  /** 对象 * */
  this.entry = new Object()
}

com.toone.itop.formula.Map.prototype = {
  _def_perfix: 'Context_KEY_',

  /** 存 * */
  put: function (key, value) {
    if (!this.containsKey(key)) {
      this._size++
    }
    this.entry[this._def_perfix + key] = value
  },

  /** 取 * */
  get: function (key) {
    return this.containsKey(key) ? this.entry[this._def_perfix + key] : null
  },

  /** 删除 * */
  remove: function (key) {
    if (this.containsKey(key) && delete this.entry[this._def_perfix + key]) {
      this._size--
    }
  },

  /** 是否包含 Key * */
  containsKey: function (key) {
    if (this.entry[this._def_perfix + key]) {
      return true
    } else {
      return false
    }
  },

  /** 是否包含 Value * */
  containsValue: function (value) {
    for (var prop in this.entry) {
      if (this.entry[prop] == value) {
        return true
      }
    }
    return false
  },

  /** 所有 Value * */
  values: function () {
    var values = new Array()
    for (var prop in this.entry) {
      if (this.entry.hasOwnProperty(prop)) {
        values.push(this.entry[prop])
      }
    }
    return values
  },

  /** 所有 Key * */
  keys: function () {
    var keys = new Array()
    for (var prop in this.entry) {
      if (this.entry.hasOwnProperty(prop)) {
        keys.push(prop)
      }
    }
    return keys
  },

  /** Map Size * */
  size: function () {
    return this._size
  },

  /* 清空 */
  clear: function () {
    this._size = 0
    entry = new Object()
  }
}
