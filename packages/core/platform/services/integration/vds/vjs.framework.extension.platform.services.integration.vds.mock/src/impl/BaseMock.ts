/**
 * mock基础对象
 * */

import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { $ } from '@v-act/vjs.framework.extension.vendor.jquery'

import * as paramRandom from '../ParamRandom'
import * as Path from '../util/Path'
import FunctionMock from './FunctionMock'
import RuleMock from './RuleMock'
import WidgetMock from './WidgetMock'

/**
 * 基础mock定义
 * @constructor
 * @alias BaseMock
 * @catalog 本地测试/基础定义
 */
class BaseMock {
  code: string
  inputs: Record<string, any>
  metadata: any
  scopeId: string
  _mockName: string
  baseUrl: any
  outputs: Record<string, any>

  constructor(
    metadata: any,
    scopeId: string,
    code: string,
    name?: string,
    baseUrl?: string
  ) {
    this.code = code
    this.inputs = {} //输入参数
    this.metadata = metadata
    this.scopeId = scopeId
    this._mockName = name || '插件'
    this.baseUrl = '' || baseUrl
    this.outputs = {} //输入参数
  }

  _toCallback(func: Record<string, any>) {
    var _this = this
    return function (res: any, rej: any) {
      func.call(_this, res, rej)
    }
  }

  _fixCode(code: string) {
    return new Promise(
      this._toCallback((resolve: () => void, reject: (arg0: Error) => any) => {
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
  }
  /**
   * 根据编号获取插件定义
   * @ignore
   */
  _getPlugin(code: string) {
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
  }
  /**
   * 加载插件定义脚本
   * @ignore
   */
  _loadDefineScript() {
    return new Promise(
      this._toCallback((resolve: () => void) => {
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
  }
  /**
   * 模拟插件
   * @ignore
   */
  _mockPlugin() {
    return new Promise(
      this._toCallback(
        (resolve: (arg0: any) => void, reject: (arg0: Error) => void) => {
          var plugin = this._getPlugin(this.code)
          var type = plugin.type
          if (this['_' + type + 'Mock']) {
            this['_' + type + 'Mock']()
              .then(function (mock: any) {
                resolve(mock)
              })
              .catch(function (e: any) {
                reject(e)
              })
          } else {
            reject(new Error('前端插件类型【' + plugin.type + '】不支持！'))
          }
        }
      )
    )
  }

  _ruleMock() {
    return new Promise(
      this._toCallback(
        (
          resolve: (arg0: RuleMock) => void,
          reject: (arg0: unknown) => void
        ) => {
          var cb = this._toCallback(() => {
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
        }
      )
    )
  }

  _functionMock() {
    return new Promise(
      this._toCallback(
        (
          resolve: (arg0: FunctionMock) => void,
          reject: (arg0: unknown) => void
        ) => {
          var cb = this._toCallback(() => {
            try {
              var mock = new FunctionMock(
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
          this._loadDefineScript()
            .then(function () {
              //加载函数中新import的vds命名空间
              vds.config({}).ready(cb)
            })
            .catch(function (e) {
              reject(e)
            })
        }
      )
    )
  }

  _widgetMock() {
    return new Promise(
      //@ts-ignore
      this._toCallback(function (resolve, reject) {
        //@ts-ignore
        var sandBox = VMetrix.sandbox.create()
        sandBox.use([
          'vjs.framework.extension.platform.plugin.ui.smartclient.core'
        ])
        sandBox.active().done(
          //@ts-ignore
          this._toCallback(function () {
            //@ts-ignore
            this._loadDefineScript()
              .then(
                //@ts-ignore
                this._toCallback(function () {
                  try {
                    var mock = new WidgetMock(
                      //@ts-ignore
                      this.metadata,
                      //@ts-ignore
                      this.scopeId,
                      //@ts-ignore
                      this.code
                    )
                    //@ts-ignore
                    scopeManager.openScope(this.scopeId)
                    resolve(mock)
                  } catch (e) {
                    reject(e)
                  }
                })
              )
              //@ts-ignore
              .catch(function (e) {
                reject(e)
              })
          })
        )
      })
    )
  }

  /**
   * 根据插件编码获取插件对象
   * @param	{String}	code 当manifest中只有一个插件时，可以不传，如果存在多个插件，则需要传入插件编码
   * @return	{Promise}
   * */
  //@ts-ignore
  get(code) {
    return new Promise(
      //@ts-ignore
      this._toCallback(function (resolve, reject) {
        //@ts-ignore
        this._fixCode(code)
          .then(
            //@ts-ignore
            this._toCallback(function () {
              //@ts-ignore
              this._mockPlugin()
                .then(
                  //@ts-ignore
                  this._toCallback(function (mock) {
                    resolve(mock)
                  })
                )
                .catch(
                  //@ts-ignore
                  this._toCallback(function (e) {
                    reject(e)
                  })
                )
            })
          )
          .catch(
            //@ts-ignore
            this._toCallback(function (e) {
              reject(e)
            })
          )
      })
    )
  }

  /**
   * mock输入配置
   * @param {String} key 配置编号
   * @param {Any} value 配置值
   */
  mockInput(key: string | number, value: any) {
    this.inputs[key] = value
    return this
  }

  /**
   * 批量mock输入配置
   * @param {Object} params 配置信息
   */
  mockInputs(params: any) {
    if (params) {
      for (var key in params) {
        if (params.hasOwnerProperty(key)) {
          this.inputs[key] = params[key]
        }
      }
    }
    return this
  }

  /**
   * 运行插件
   * @returns {Promise}
   */
  exec(...vals: any) {
    return new Promise<void>(function (resolve, reject) {
      resolve()
      scopeManager.closeScope()
    })
  }

  /*
   * 获取所有前端插件编号
   * @return Array
   */
  _getFrontendPluginCodes(targetType: string) {
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
  }

  _getPluginCfg() {
    var plugins = this.metadata.plugins
    for (var i = 0, l = plugins.length; i < l; i++) {
      var plugin = plugins[i]
      if (plugin.code == this.code) {
        return plugin
      }
    }
    return null
  }

  _isEntityByInputCode(code: any) {
    var input = this._getPluginInputCfg(code)
    if (input && input.editor.type == 'entity') {
      return true
    }
    return false
  }

  _getPluginInputCfg(code: any) {
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
  }

  _existInput(code: any) {
    return this.inputs.hasOwnProperty(code)
  }

  _genInput(code: string, inputCfg: any) {
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
  }

  _getInput(code: string, input?: any) {
    if (!this._existInput(code)) {
      this.inputs[code] = this._genInput(code, input)
    }
    return this.inputs[code]
  }

  /**
   * 获取输入信息
   * @param {String|Integer} code 输入编号或参数下标
   */
  getInput(code: string) {
    return this._getInput(code)
  }

  /**
   * 获取所有入参信息
   */
  getInputs() {
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
