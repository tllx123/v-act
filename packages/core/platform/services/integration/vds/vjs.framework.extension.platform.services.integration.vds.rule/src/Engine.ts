import * as exceptionFactory from '@v-act/vjs.framework.extension.platform.interface.exception.ExceptionFactory'
import * as datasourceFactory from '@v-act/vjs.framework.extension.platform.interface.model.datasource.DatasourceFactory'
import * as ExpressionContext from '@v-act/vjs.framework.extension.platform.services.engine.expression.ExpressionContext'
import * as engine from '@v-act/vjs.framework.extension.platform.services.engine.expression.ExpressionEngine'
import * as manager from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource.DatasourceManager'
import * as baseVarOperation from '@v-act/vjs.framework.extension.platform.services.window.variable.operation.BaseVarOperation'
import * as entityVarOperation from '@v-act/vjs.framework.extension.platform.services.window.variable.operation.EntityVarOperation'
import * as jsonUtil from '@v-act/vjs.framework.extension.util.JsonUtil'
import * as logUtil from '@v-act/vjs.framework.extension.util.log'

import RuleContext from './RuleContext'

export function _getMainFunc(funStr: string) {
  if (funStr) {
    var namespaces = funStr.split('.')
    var caller = window
    var func = window
    while (namespaces.length > 0) {
      var namespace = namespaces.splice(0, 1)
      func = func[namespace]
      if (namespaces.length > 0) {
        caller = func
      }
      if (!func) {
        return null
      }
    }
    return {
      caller: caller,
      func: func
    }
  }
  return null
}

var VarType = {
  ENTITY: 'entity', //界面实体
  WINDOWVARIANT: 'windowVariant', //窗体输入变量
  WINDOWOUTPUT: 'windowOutput', //窗体输出变量
  RULESETINPUT: 'ruleSetInput', //方法输入变量
  RULESETVARIANT: 'ruleSetVariant', //方法变量
  RULESETOUTPUT: 'ruleSetOutput', //方法输出变量
  SYSTEMVARIANT: 'systemVariant', //构件变量
  EXPRESSION: 'expression' //表达式
}

/**
 * 二次开发mock调试使用
 * */
var exeExtRuleMock = function (params) {
  var _this = this
  return new Promise(function (resolve, reject) {
    var ruleCtx = params.ruleContext
    var rs = _this._getMainFunc(params.mainFunc)
    var ruleCfg = ruleCtx._getRuleCfg()
    if (!rs) {
      var detail =
        '【规则】' +
        ruleCfg.ruleName +
        '(' +
        ruleCfg.ruleCode +
        ')执行异常，未找到主入口函数:' +
        params.mainFunc
      throw Error(detail)
    }
    var promise = rs.func.call(rs.caller, new RuleContext(ruleCtx))
    if (promise instanceof Promise) {
      promise
        .then(function (dataContainer) {
          var datas = dataContainer ? dataContainer.get() : {}
          resolve(datas)
        })
        .catch(function (err) {
          reject(err)
        })
      return promise
    }
  })
}
/**
	 * 执行二次开发扩展规则
	 * @param {Object} params 参数信息
	 * {
	 * 		"ruleContext" : {RuleContext} 规则上下文
	 * 		"mainFunc" : {Function}	规则主入口
	 * }
	 * 规则实例配置格式：
	 * {
  			"ruleInputParams": [{//规则输入
      			"paramCode": "inputEntity",//参数编号
      			"paramSourceValue": "fdfd",//参数来源
      			"paramSourceType": "entity",//来源类型：界面实体（entity），窗体输入（windowVariant）方法输入（ruleSetInput），方法变量（ruleSetVariant）
      			"paramFieldMapping": [{
	      				"paramEntityField": "inputfiled1", //规则输入实体字段
	      				"fieldValueType": "field", //枚举有expression，field
	      				"fieldValue": "fdfd" //来源值
      				},
      				....
      			]
    		},{
      			"paramCode": "inputEntity",
      			"paramSourceValue": "fdfd",
      			"paramSourceType": "expression" //非实体的入参 
    		}],
  			"ruleOutputParams": [{//规则输出
      			"destType": "ruleSetVariant",//实体（entity），控件（control），窗体输入（windowVariant），窗体输出（windowOutput），方法输出（ruleSetOutput），方法变量（ruleSetVariant），构件变量（systemVariant）
      			"dest": "fdfd", //上下文Code
      			"srcType": "returnValue", //来源类型 returnValue，expression 
      			"srcCode": "dsdsads", //来源编码 如果是returnValue类型则就是规则输出
      			"destFieldMapping": [{
		          "destField": "fdfd",
		          "destType": "",
		          "srcValueType": "field", //来源的类型 expression ，field
		          "srcValue": "dsds"
		        },
		        {
		          "destField": "fdfd",
		          "destType": "",
		          "srcValueType": "expression",
		          "srcValue": "\"ffd\""
		        }]
		    },
		    {
		      "destType": "ruleSetVariant",
		      "dest": "result",
		      "srcType": "expression",
		      "srcCode": "ss",
		      "destFieldMapping": null
		    }
		  ]
		}
	 */
export function exeExtRule(params) {
  var ruleCtx = params.ruleContext
  if (typeof ruleCtx._isMock == 'function') {
    return exeExtRuleMock.apply(this, [params])
  }
  var rs = this._getMainFunc(params.mainFunc)
  var ruleCfg = ruleCtx.getRuleCfg()
  if (!rs) {
    ruleCtx.setRuleStatus(false)
    var detail =
      '【规则】' +
      ruleCfg.ruleName +
      '(' +
      ruleCfg.ruleCode +
      ')执行异常，未找到主入口函数:' +
      params.mainFunc
    ruleCtx.handleException(
      exceptionFactory.create({
        type: exceptionFactory.TYPES.System,
        message: detail,
        detail: detail,
        error: new Error(detail)
      })
    )
    return
  }
  var paramStr = ruleCfg['inParams']
  var paramObj = jsonUtil.json2obj(paramStr)
  ruleCtx.markRouteExecuteUnAuto()
  try {
    var inputParams = handleInput(paramObj.ruleInputParams, ruleCtx)
    var promise = rs.func.call(rs.caller, new RuleContext(ruleCtx))
    if (promise instanceof Promise) {
      var success = function () {
        var result = (ruleCtx.__getOutputs && ruleCtx.__getOutputs()) || {}
        ruleCtx.setRuleStatus(true)
        handleOutput(result, paramObj.ruleOutputParams, ruleCtx)
        //                    ruleCtx.setBusinessRuleResult(result);//规则返回值通过ruleContext.setResult设置
        ruleCtx.fireRouteCallback()
      }
      var error = function (err) {
        var error = err
        //兼容json类的异常
        if (
          err &&
          !(err instanceof Error) &&
          !exceptionFactory.isException(err) &&
          err.success === false
        ) {
          error = exceptionFactory.create(err)
        }
        ruleCtx.setRuleStatus(false)
        ruleCtx.handleException(error)
      }
      if (Promise._isFinish && Promise._isFinish(promise)) {
        //解决两个同步规则执行完成后取值不正确的问题
        if (
          typeof Promise._isError == 'function' &&
          Promise._isError(promise)
        ) {
          //发生异常的同步规则
          var args =
            typeof Promise._getErrorParam == 'function'
              ? Promise._getErrorParam(promise)
              : null
          error.apply(this, args)
        } else {
          var args =
            typeof Promise._getSuccessParam == 'function'
              ? Promise._getSuccessParam(promise)
              : null
          success.apply(this, args)
        }
      } else {
        promise.then(success).catch(error)
      }
    } else {
      ruleCtx.setRuleStatus(false)
      var ruleCfg = ruleCtx.getRuleCfg()
      var detail =
        '【规则】' +
        ruleCfg.ruleName +
        '(' +
        ruleCfg.ruleCode +
        ')执行异常，未返回Promise实例'
      ruleCtx.handleException(
        exceptionFactory.create({
          type: exceptionFactory.TYPES.Expected,
          message: '规则执行异常',
          detail: detail,
          error: new Error(detail)
        })
      )
    }
  } catch (err) {
    ruleCtx.setRuleStatus(false)
    ruleCtx.handleException(err)
  }
}

var handleInput = function (params, ruleCtx) {
  var routeContext = ruleCtx.getRouteContext()
  var datas = {}
  if (params) {
    var context = new ExpressionContext()
    context.setRouteContext(routeContext)
    for (var i = 0, len = params.length; i < len; i++) {
      var param = params[i]
      var code = param.paramCode
      var sourceValue = param.paramSourceValue
      var sType = param.paramSourceType
      if (!sourceValue) {
        //兼容
        continue
      }
      var value
      var isDs = false
      var ds
      var prefix = undefined
      switch (sType) {
        case VarType.ENTITY: //界面实体
          isDs = true
          ds = manager.lookup({
            datasourceName: sourceValue
          })
          break
        case VarType.WINDOWVARIANT: //窗体输入变量
          prefix = '@'
          break
        case VarType.RULESETINPUT: //方法输入
          prefix = 'BR_IN_PARENT.'
          break
        case VarType.RULESETVARIANT: //方法变量
          prefix = 'BR_VAR_PARENT.'
          break
        case VarType.EXPRESSION: //表达式
          prefix = ''
          break
      }
      if (undefined != prefix) {
        try {
          value = engine.execute({
            expression: prefix + sourceValue,
            context: context
          })
        } catch (e) {
          logUtil.error(
            '执行表达式错误,请检查配置,类型：' +
              sType +
              ',表达式：' +
              sourceValue
          )
        }
        if (value && datasourceFactory.isDatasource(value)) {
          isDs = true
          ds = value
        }
      }
      if (isDs) {
        if (ds) {
          var mapping = param.paramFieldMapping
          var valMap = {}
          if (mapping) {
            for (var j = 0, _l = mapping.length; j < _l; j++) {
              var map = mapping[j]
              var value = undefined
              if (map.fieldValueType == 'expression') {
                try {
                  value = engine.execute({
                    expression: map.fieldValue,
                    context: context
                  })
                } catch (e) {
                  logUtil.error(
                    '执行表达式错误,请检查配置,表达式：' + map.fieldValue
                  )
                }
              }
              valMap[map.paramEntityField] = value
            }
          }
          var records = ds.getAllRecords().toArray()
          var recordMaps = []
          for (var j = 0, _l = records.length; j < _l; j++) {
            var map = records[j].toMap()
            var newMap = {}
            if (mapping) {
              for (var key in valMap) {
                //过滤映射的字段
                if (valMap[key] != undefined) {
                  newMap[key] = valMap[key] //表达式
                } else {
                  newMap[key] = map[key]
                }
              }
            } else {
              for (var key in map) {
                //过滤映射的字段
                newMap[key] = map[key] //表达式
              }
            }
            recordMaps.push(newMap)
          }
          value = recordMaps
        } else {
          value = []
        }
      }
      ruleCtx.__setMockInput && ruleCtx.__setMockInput(code, value, ds)
      datas[code] = value
    }
  }
  return datas
}

var handleOutput = function (output, mappings, ruleContext) {
  if (!output || !mappings || mappings.length < 1) {
    return
  }
  var routeContext = ruleContext.getRouteContext()
  var context = new ExpressionContext()
  context.setRouteContext(routeContext)
  var baseVarSetValue = []
  for (var i = 0, len = mappings.length; i < len; i++) {
    var mapping = mappings[i]
    var sourceCode = mapping.srcCode
    var sourceType = mapping.srcType
    var dest = mapping.dest
    var value
    if (sourceType === VarType.EXPRESSION) {
      value = engine.execute({
        expression: sourceCode,
        context: context
      })
    } else {
      value = output[sourceCode]
    }
    if (value && value instanceof Array) {
      value = genDataSource(value, sourceCode)
      if (value) {
        var targetEntityType
        switch (mapping.destType) {
          case 'entity':
            targetEntityType = entityVarOperation.ENTITY_TYPE.ENTITY
            break
          case 'windowVariant':
            targetEntityType = entityVarOperation.ENTITY_TYPE.WINDOWINPUT
            break
          case 'windowOutput':
            targetEntityType = entityVarOperation.ENTITY_TYPE.WINDOWOUTPUT
            break
          case 'ruleSetOutput':
            targetEntityType = entityVarOperation.ENTITY_TYPE.RULESETOUTPUT
            break
          case 'ruleSetVariant':
            targetEntityType = entityVarOperation.ENTITY_TYPE.RULESETVARIANT
            break
        }
        if (targetEntityType) {
          var destFieldMapping = mapping.destFieldMapping
          if (!destFieldMapping) {
            continue
          }
          var sourceDsName = value.getMetadata().getDatasourceName()
          var items = []
          for (var j = 0, _l = destFieldMapping.length; j < _l; j++) {
            var destField = destFieldMapping[j]
            var sVal = destField.srcValue
            var type = destField.srcValueType
            if (type == 'field') {
              type = entityVarOperation.VALUE_SOURCE_TYPE.ENTITYFIELD
              sVal = sourceDsName + '.' + sVal
            } else {
              type = entityVarOperation.VALUE_SOURCE_TYPE.EXPRESSION
            }
            items.push({
              destName: dest + '.' + destField.destField,
              sourceName: sVal,
              type: type
            })
          }
          var copyParams = {
            sourceDs: value,
            destName: dest,
            destType: targetEntityType,
            copyType: entityVarOperation.COPY_TYPE.ALLRECORDS,
            operationType: entityVarOperation.OPERATOR_TYPE.REPLACE,
            checkItems: [dest + '.id'],
            isAddRecord: true,
            items: items
          }
          entityVarOperation.copyByEntity(copyParams, routeContext)
        }
      }
    } else {
      if (!value) {
        value = ''
      }
      value = '"' + value + '"'
      var targetVarType = null
      switch (mapping.destType) {
        case 'control':
          targetVarType = baseVarOperation.VAR_TYPE.TARGET_CONTROL
          break
        case 'windowVariant':
          targetVarType = baseVarOperation.VAR_TYPE.TARGET_WINDOW_INPUT_VAR
          break
        case 'windowOutput':
          targetVarType = baseVarOperation.VAR_TYPE.TARGET_WINDOW_OUTPUT_VAR
          break
        case 'ruleSetOutput':
          targetVarType = baseVarOperation.VAR_TYPE.TARGET_OUTPUT_VAR
          break
        case 'ruleSetVariant':
          targetVarType = baseVarOperation.VAR_TYPE.TARGET_CONTEXT_VAR
          break
        case 'systemVariant':
          targetVarType = baseVarOperation.VAR_TYPE.TARGET_SYS_VAR
          break
      }
      if (targetVarType) {
        baseVarSetValue.push({
          TargetType: targetVarType,
          Target: dest,
          SourceType: baseVarOperation.VALUE_SOURCE_TYPE.EXPRESSION,
          Source: value
        })
      }
    }
  }
  if (baseVarSetValue.length > 0) {
    baseVarOperation.setVariableValue(baseVarSetValue, routeContext)
  }
}

var genDataSource = function (datas) {
  //字段对应字段类型
  var fieldCodes = {}
  //字段列表
  var fields = []
  for (var i = 0, len = datas.length; i < len; i++) {
    var data = datas[i]
    for (var key in data) {
      if (!data.hasOwnProperty(key)) {
        continue
      }
      if (!fieldCodes.hasOwnProperty(key) || !fieldCodes[key]) {
        fieldCodes[key] = getValueType(data[key]) //根据值判断字段类型
      }
    }
  }
  for (var key in fieldCodes) {
    var type = fieldCodes[key] ? fieldCodes[key] : 'text'
    fields.push({
      code: key,
      name: key,
      type: type
    })
  }
  var datasource = datasourceFactory.createDatasourceFromConfig({
    datas: datas,
    fields: fields
  })
  return datasource
}

var getValueType = function (value) {
  if (null === value || undefined === value) {
    return null
  }
  var type
  switch (typeof value) {
    case 'string':
      type = 'text'
      break
    case 'boolean':
      type = 'boolean'
      break
    case 'number':
      if ((value + '').indexOf('.') == -1) {
        type = 'integer'
      } else {
        type = 'float'
      }
      break
  }
  return type
}
