/**
 * mock基础对象
 * */

var RuleMock, FunctionMock, WidgetMock, scopeManager, paramRandom, Path

/**
 * 基础mock定义
 * @constructor
 * @alias BaseMock
 * @catalog 本地测试/基础定义
 */
var BaseMock = function (metadata, scopeId, code, name, baseUrl) {
  this.code = code
  this.inputs = {} //输入参数
  this.metadata = metadata
  this.scopeId = scopeId
  this._mockName = name || '插件'
  this.baseUrl = '' || baseUrl
  this.outputs = {} //输入参数
}

BaseMock.prototype = {
  initModule: function (sb) {
    RuleMock = require('vjs/framework/extension/platform/services/integration/vds/mock/impl/RuleMock')
    WidgetMock = require('vjs/framework/extension/platform/services/integration/vds/mock/impl/WidgetMock')
    FunctionMock = require('vjs/framework/extension/platform/services/integration/vds/mock/impl/FunctionMock')
    paramRandom = require('vjs/framework/extension/platform/services/integration/vds/mock/ParamRandom')
    scopeManager = sb.getService(
      'vjs.framework.extension.platform.interface.scope.ScopeManager'
    )
    Path = require('vjs/framework/extension/platform/services/integration/vds/mock/util/Path')
  },

  _toCallback: function (func, resolve, reject) {
    var _this = this
    return function (res, rej) {
      func.call(_this, res, rej)
    }
  },

  _fixCode: function (code) {
    return new Promise(
      this._toCallback(function (resolve, reject) {
        var plugins = this.metadata.plugins
        if (!plugins || plugins.length == 0) {
          return reject(new Error('不存在前端插件定义，执行结束！'))
        } else {
          if (!code) {
            if (plugins.length > 1) {
              return reject(
                new Error('存在多个前端插件定义，请指定执行插件编号！')
              )
            } else {
              var plugin = plugins[0]
              code = plugin.code
            }
          } else {
            var plugin = this._getPlugin(code)
            if (!plugin) {
              return reject(
                new Error('前端插件定义不存在，请检查！ 插件编号：' + code)
              )
            }
          }
        }
        this.code = code
        resolve()
      })
    )
  },
  /**
   * 根据编号获取插件定义
   * @ignore
   */
  _getPlugin: function (code) {
    if (this.metadata && this.metadata.plugins) {
      var plugins = this.metadata.plugins
      for (var i = 0, l = plugins.length; i < l; i++) {
        var plugin = plugins[i]
        if (plugin.code == code) {
          return plugin
        }
      }
    }
    return null
  },
  /**
   * 加载插件定义脚本
   * @ignore
   */
  _loadDefineScript: function () {
    return new Promise(
      this._toCallback(function (resolve, reject) {
        var plugin = this._getPlugin(this.code)
        var defineUrl = plugin.defineUrl
        if (defineUrl) {
          var isLoaded = false
          var resolvePath = Path.join(this.baseUrl, defineUrl)
          var scripts = $('script')
          for (var i = 0, len = scripts.length; i < len; i++) {
            if (scripts[i].src === resolvePath) {
              isLoaded = true
              break
            }
          }
          if (!isLoaded) {
            var oscript = document.createElement('script')
            oscript.src = resolvePath
            oscript.onload = function () {
              resolve()
            }
            document.body.appendChild(oscript)
          } else {
            resolve()
          }
        }
      })
    )
  },
  /**
   * 模拟插件
   * @ignore
   */
  _mockPlugin: function () {
    return new Promise(
      this._toCallback(function (resolve, reject) {
        var plugin = this._getPlugin(this.code)
        var type = plugin.type
        if (this['_' + type + 'Mock']) {
          this['_' + type + 'Mock']()
            .then(function (mock) {
              resolve(mock)
            })
            .catch(function (e) {
              reject(e)
            })
        } else {
          reject(new Error('前端插件类型【' + plugin.type + '】不支持！'))
        }
      })
    )
  },

  _ruleMock: function () {
    return new Promise(
      this._toCallback(function (resolve, reject) {
        var cb = this._toCallback(function () {
          try {
            var mock = new RuleMock(this.metadata, this.scopeId, this.code)
            scopeManager.openScope(this.scopeId)
            resolve(mock)
          } catch (e) {
            reject(e)
          }
        })
        this._loadDefineScript()
          .then(function () {
            //加载规则中新import的vds命名空间
            vds.config({}).ready(cb)
          })
          .catch(function (e) {
            reject(e)
          })
      })
    )
  },

  _functionMock: function () {
    return new Promise(
      this._toCallback(function (resolve, reject) {
        var cb = this._toCallback(function () {
          try {
            var mock = new FunctionMock(this.metadata, this.scopeId, this.code)
            scopeManager.openScope(this.scopeId)
            resolve(mock)
          } catch (e) {
            reject(e)
          }
        })
        this._loadDefineScript()
          .then(function () {
            //加载函数中新import的vds命名空间
            vds.config({}).ready(cb)
          })
          .catch(function (e) {
            reject(e)
          })
      })
    )
  },

  _widgetMock: function () {
    return new Promise(
      this._toCallback(function (resolve, reject) {
        var sandBox = VMetrix.sandbox.create()
        sandBox.use([
          'vjs.framework.extension.platform.plugin.ui.smartclient.core'
        ])
        sandBox.active().done(
          this._toCallback(function () {
            this._loadDefineScript()
              .then(
                this._toCallback(function () {
                  try {
                    var mock = new WidgetMock(
                      this.metadata,
                      this.scopeId,
                      this.code
                    )
                    scopeManager.openScope(this.scopeId)
                    resolve(mock)
                  } catch (e) {
                    reject(e)
                  }
                })
              )
              .catch(function (e) {
                reject(e)
              })
          })
        )
      })
    )
  },

  /**
   * 根据插件编码获取插件对象
   * @param	{String}	code 当manifest中只有一个插件时，可以不传，如果存在多个插件，则需要传入插件编码
   * @return	{Promise}
   * */
  get: function (code) {
    return new Promise(
      this._toCallback(function (resolve, reject) {
        this._fixCode(code)
          .then(
            this._toCallback(function () {
              this._mockPlugin()
                .then(
                  this._toCallback(function (mock) {
                    resolve(mock)
                  })
                )
                .catch(
                  this._toCallback(function (e) {
                    reject(e)
                  })
                )
            })
          )
          .catch(
            this._toCallback(function (e) {
              reject(e)
            })
          )
      })
    )
  },

  /**
   * mock输入配置
   * @param {String} key 配置编号
   * @param {Any} value 配置值
   */
  mockInput: function (key, value) {
    this.inputs[key] = value
    return this
  },

  /**
   * 批量mock输入配置
   * @param {Object} params 配置信息
   */
  mockInputs: function (params) {
    if (params) {
      for (var key in params) {
        if (param.hasOwnerProperty(key)) {
          this.inputs[key] = params[key]
        }
      }
    }
    return this
  },

  /**
   * 运行插件
   * @returns {Promise}
   */
  exec: function () {
    return new Promise(function (resolve, reject) {
      resolve()
      scopeManager.closeScope()
    })
  },

  /*
   * 获取所有前端插件编号
   * @return Array
   */
  _getFrontendPluginCodes: function (targetType) {
    var codes = []
    var types = targetType ? [targetType] : ['rule', 'function']
    var plugins = this.metadata.plugins
    for (var i = 0, l = plugins.length; i < l; i++) {
      var plugin = plugins[i]
      var type = plugin.type
      if (types.indexOf(type) != -1 && plugin.scope == 'client') {
        codes.push(plugin.code)
      }
    }
    return codes
  },

  _getPluginCfg: function () {
    var plugins = this.metadata.plugins
    for (var i = 0, l = plugins.length; i < l; i++) {
      var plugin = plugins[i]
      if (plugin.code == this.code) {
        return plugin
      }
    }
    return null
  },

  _isEntityByInputCode: function (code) {
    var input = this._getPluginInputCfg(code)
    if (input && input.editor.type == 'entity') {
      return true
    }
    return false
  },

  _getPluginInputCfg: function (code) {
    var plugin = this._getPluginCfg()
    var inputs = plugin.inputs
    if (inputs) {
      for (var i = 0, l = inputs.length; i < l; i++) {
        var input = inputs[i]
        if (input.code == code) {
          return input
        }
      }
    }
    return null
  },

  _existInput: function (code) {
    return this.inputs.hasOwnProperty(code)
  },

  _genInput: function (code, inputCfg) {
    var input = inputCfg || this._getPluginInputCfg(code)
    if (input) {
      /*if(input.hasOwnProperty("default")){
					return input["default"];
				}*/
      var type = input.editor ? input.editor.type : input.type
      if (type == 'any') {
        type = 'char'
      }
      var random = paramRandom.random[type]
      if (random) {
        return random(input.editor, input)
      } else {
        throw new Error(
          this._mockName +
            '不支持插件类型【' +
            type +
            '】自动生成入参数据! ' +
            this._mockName +
            '编号:' +
            this.code +
            ', 配置编号:' +
            code
        )
      }
    } else {
      throw new Error(
        '未找到' +
          this._mockName +
          '配置,请检查! ' +
          this._mockName +
          '编号:' +
          this.code +
          ', 配置编号:' +
          code
      )
    }
  },

  _getInput: function (code, input) {
    if (!this._existInput(code)) {
      this.inputs[code] = this._genInput(code, input)
    }
    return this.inputs[code]
  },

  /**
   * 获取输入信息
   * @param {String|Integer} code 输入编号或参数下标
   */
  getInput: function (code) {
    return this._getInput(code)
  },

  /**
   * 获取所有入参信息
   */
  getInputs: function () {
    var pluginCfg = this._getPluginCfg()
    var inputs = pluginCfg.inputs
    var res = {}
    for (var i = 0, l = inputs.length; i < l; i++) {
      var input = inputs[i]
      var code = input.code
      res[code] = this._getInput(code)
    }
    return res
  }
}

export default BaseMock
