var scopeManager, ruleEngine, RuleContext, jsonUtils, BaseMock

/**
 * 数据容器
 **/
var DataContainer = function () {
  this.datas = {}
}

DataContainer.prototype = {
  set: function (code, value) {
    this.datas[code] = value
    return this
  },
  get: function (code) {
    if (!code) {
      return this.datas
    }
    return this.datas[code]
  }
}

/**
 * 规则本地测试定义
 * @constructor
 * @alias RuleMock
 * @catalog 本地测试/基础定义
 * @example
 * vds.import(vds.mock.*);
 * vds.mock.init(manifest,function(mock){
 * 	mock.get("ruleCode").then(function(ruleMock){//ruleCode为规则编号
 * 		ruleMock.mockInput("input1",1);
 * 		var promise = ruleMock.exec();
 * 		promise.then(function(){
 * 			var out = ruleMock.getOutput("out1");
 * 		});
 * 	});
 * });
 */
var RuleMock = function (metadata, scopeId, code) {
  BaseMock.call(this, metadata, scopeId, code, '规则')
  this.container = new DataContainer()
}

RuleMock.prototype = {
  initModule: function (sb) {
    RuleContext = require('vjs/framework/extension/platform/services/integration/vds/mock/context/RuleContext')
    BaseMock = require('vjs/framework/extension/platform/services/integration/vds/mock/impl/BaseMock')
    var Extend = require('vjs/framework/extension/platform/services/integration/vds/mock/util/Extend')
    Extend.extend(RuleMock, BaseMock, sb)
    scopeManager = sb.getService(
      'vjs.framework.extension.platform.interface.scope.ScopeManager'
    )
    ruleEngine = sb.getService(
      'vjs.framework.extension.platform.services.engine.rule.RuleEngine'
    )
    jsonUtils = sb.getService('vjs.framework.extension.util.JsonUtil')
  },

  /**
   * 获取所有前端规则编号
   * @ignore
   * @return Array
   */
  _getRuleCodes: function () {
    var codes = this._getFrontendPluginCodes('rule')
    return codes
  },

  _getRuleInputCfg: function (code) {
    return this._getPluginInputCfg(code)
  },

  _checkCfg: function () {
    //此处统一检查整份配置信息必填值的合法性，后续代码不需要额外的判断逻辑
    var config = this._getPluginCfg()
    //....
  },
  /**
   * 执行规则
   * @returns Promise
   * @example
   * vds.import(vds.mock.*);
   * vds.mock.init(manifest,function(mock){
   * 	mock.get("ruleCode").then(function(ruleMock){//ruleCode为规则编号
   * 		ruleMock.mockInput("input1",1);
   * 		ruleMock.mockInputs({
   * 			"input2":2,
   * 			"input3":true
   * 		});
   * 		var promise = ruleMock.exec();
   * 		promise.then(function(){
   * 			var out = ruleMock.getOutput("out1");
   * 		});
   * 	});
   * });
   */
  exec: function () {
    var _this = this
    return new Promise(function (resolve, reject) {
      var code = this.code
      if (!code) {
        var codes = _this._getRuleCodes()
        if (codes.length > 1) {
          reject(new Error('存在多个前端规则定义，请指定执行规则编号！'))
        } else if (codes.length == 0) {
          reject(new Error('不存在前端规则定义，执行结束！'))
        }
        code = codes[0]
      }
      _this.code = code
      var error = _this._checkCfg()
      if (error) {
        reject(new Error(error))
      }
      //生成规则参数
      var pluginCfg = _this._getPluginCfg()
      var ruleInputParams = []
      var inputs = pluginCfg.inputs
      for (var i = 0, len = inputs.length; i < len; i++) {
        var input = inputs[i]
        var map = {}
        var inputCode = input.code
        var inputValue = _this._getInput(inputCode)
        map = {
          paramCode: inputCode,
          paramSourceValue: inputValue
        }
        ruleInputParams.push(map)
      }
      var ruleOutputParams = []
      var outputs = pluginCfg.outputs
      if (outputs) {
        for (var i = 0, len = outputs.length; i < len; i++) {
          var output = outputs[i]
          ruleOutputParams.push({
            srcType: output.type,
            srcCode: output.code
          })
        }
      }
      var ruleConfig = {
        ruleCode: pluginCfg.code,
        ruleName: pluginCfg.name,
        inParams: jsonUtils.obj2json({
          ruleInputParams: ruleInputParams,
          ruleOutputParams: ruleOutputParams
        })
      }
      var ruleContext = new RuleContext(ruleConfig, _this)
      //执行规则
      var promise = ruleEngine.exeExtRule({
        ruleContext: ruleContext,
        mainFunc: pluginCfg.entry
      })
      promise
        .then(function (datas) {
          //					if(datas){
          //						for(var i = 0,len = outputs.length;i<len;i++){
          //							var output = outputs[i];
          //							var code = output.code;
          //							var data = datas[code];
          //						}
          //					}
          resolve()
          scopeManager.closeScope()
        })
        .catch(function () {
          reject.apply(this, arguments)
          scopeManager.closeScope()
        })
    })
  },
  /**
   * 获取规则输出
   * @param {String} code 规则输出编号
   * @returns Any
   */
  getOutput: function (code) {
    return this.container.get(code)
  }
}

//	module.exports = RuleMock;
return RuleMock
