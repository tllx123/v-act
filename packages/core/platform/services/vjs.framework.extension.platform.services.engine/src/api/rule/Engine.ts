/**
 * @module RuleEngine
 * @desc 规则引擎<br/>
 *  vjs名称：vjs.framework.extension.platform.services.engine<br/>
 * vjs服务名称：vjs.framework.extension.platform.services.engine.rule.RuleEngine<br/>
 */

import { ExceptionFactory as exceptionFactory } from '@v-act/vjs.framework.extension.platform.interface.exception'

import RuleContext from './RuleContext'

export function _getMainFunc(funStr) {
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

/**
	 * 执行二次开发扩展规则
	 * @param {Object} params 参数信息
	 * {
	 * 		"ruleContext" : {RuleContext} 规则上下文
	 * 		"mainFunc" : {Function}	规则主入口
	 * 		"mock":{RuleMock} 规则模拟
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
export function exeExtRule(params: any) {
  var ruleCtx = params.ruleContext
  var rs = this._getMainFunc(params.mainFunc)
  if (!rs) {
    ruleCtx.setRuleStatus(false)
    var ruleCfg = ruleCtx.getRuleCfg()
    var detail =
      '【规则】' +
      ruleCfg.ruleName +
      '(' +
      ruleCfg.ruleCode +
      ')执行异常，未找到主入口函数:' +
      params.mainFunc
    ruleCtx.handleException(
      exceptionFactory.create({
        type: exceptionFactory.TYPES.Expected,
        message: '规则执行异常',
        detail: detail,
        error: new Error(detail)
      })
    )
    return
  }
  var ruleCfg = ruleCtx.getRuleCfg()
  var paramStr = ruleCfg['inParams']
  //var paramObj = jsonUtil.json2obj(paramStr);
  var paramObj = [new RuleContext(params.mock)]
  ruleCtx.markRouteExecuteUnAuto()
  try {
    var promise = rs.func.call(rs.caller, paramObj)
    if (promise instanceof Promise) {
      promise
        .then(function (result) {
          ruleCtx.setRuleStatus(true)
          ruleCtx.setBusinessRuleResult(result)
          ruleCtx.fireRouteCallback()
        })
        .catch(function (err) {
          ruleCtx.setRuleStatus(false)
          ruleCtx.handleException(err)
        })
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
