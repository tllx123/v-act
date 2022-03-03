/**
 * 构件定义
 * @desc 提供与日志相关的一系列接口，使用前请先import：vds.import("vds.component.*")
 * @namespace vds/component
 * @module component
 * @catalog 基础定义/构件定义
 * @example
 * vds.import("vds.component.*");
 * vds.component.getVariant("var1");
 */
define('./index', function (require, exports, module) {
  window.vds = window.vds || {}
  window.vds.component = window.vds.component || {}

  var com = window.vds.component

  exports = com

  var componentParam, scopeManager, componentParamService, componentPackData

  exports.initModule = function (sBox) {
    componentParam = sBox.getService(
      'vjs.framework.extension.platform.data.storage.runtime.param.ComponentParam'
    )
    scopeManager = sBox.getService(
      'vjs.framework.extension.platform.interface.scope.ScopeManager'
    )
    componentPackData = sBox.getService(
      'vjs.framework.extension.platform.global.data.ComponentPackData'
    )
    componentParamService = sBox.getService(
      'vjs.framework.extension.platform.services.param.manager.ComponentParam'
    )
  }

  /**
   * 获取构件变量
   * @param {String} code 构件变量编号
   * @returns {Any}
   * @example
   * vds.component.getVariant("var1");
   */
  exports.getVariant = function (code) {
    return componentParam.getVariant({
      code: code
    })
  }

  /**
   * 刷新构件变量
   * @param {String} code 构件变量编号
   * @param {Array<String>} array 需要刷新构件变量列表
   * @example
   * vds.component.refreshVariant(["code1","code2"]);
   */
  exports.refreshVariant = function (array) {
    componentParamService.refreshVariant({
      codes: array
    })
  }

  /**
   * 给构件变量赋值
   * @param {String} code 构件变量编码
   * @param {String} val 设置的值
   * @example
   * vds.component.setVariant("code1","123");
   */
  exports.setVariant = function (code, val) {
    componentParamService.setVariant({
      code: code,
      value: val
    })
  }
  /**
   * 获取指定范围的构件元信息
   * @param {String} componentCode 构件编码
   * @param {String} domain 范围标识
   * @return {Promise}
   * @example
   * vds.component.getMetadata("v3_example","BizWindowInstanceData");
   * */
  exports.getMetadata = function (componentCode, domain) {
    return new Promise(function (resolve, reject) {
      try {
        var defferend = componentParamService.getMetadata(componentCode, domain)
        defferend.then(resolve).fail(reject)
      } catch (e) {
        reject(e)
      }
    })
  }

  /**
   * 获取当前构件资源的路径
   * @param {String} resourceName 资源名称，带后缀
   * @returns {String}
   * var url = vds.component.getResourceUrl("file.jpg");
   * */
  exports.getResourceUrl = function (resourceName) {
    var scope = scopeManager.getScope()
    if (scope && resourceName) {
      var componentCode = scope.getComponentCode()
      return 'itop/resources/' + componentCode + '_' + resourceName
    }
    return null
  }

  /**
   * 获取当前构件编码
   * @returns {String}
   * @example
   * vds.component.getCode();
   * */
  exports.getCode = function () {
    var scope = scopeManager.getScope()
    if (scope) {
      return scope.getComponentCode()
    }
    return null
  }

  /**
   * 获取构件包信息
   * @param {String} componentCode 构件编码
   * @param {String} methodCode 方法编码
   * @returns {Object}
   * */
  exports.getPack = function (componentCode, methodCode) {
    return new Promise(function (resolve, reject) {
      try {
        var tmpMapping = componentPackData.getMapping({
          componentCode: componentCode,
          code: methodCode
        })
        var result = null
        if (tmpMapping) {
          result = {
            componentCode: tmpMapping.componentCode,
            funcCode: tmpMapping.code
          }
        }
        resolve(result)
      } catch (e) {
        reject(e)
      }
    })
  }

  module.exports = exports
})
