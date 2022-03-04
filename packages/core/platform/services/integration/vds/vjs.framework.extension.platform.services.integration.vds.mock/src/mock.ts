/**
 * 本地测试模拟模块
 * @desc 提供一系列接口供开发人员本地验证，使用前请先import：vds.import("vds.mock.*")
 * @namespace vds/mock
 * @module mock
 * @catalog 本地测试
 * @example
 * vds.import("vds.mock.*");
 * vds.mock.init(manifest,function(){
 *
 * });
 */
define('./mock', function (require, exports, module) {
  var BaseMock, scopeManager, Path, environment

  window.vds = window.vds || {}
  window.vds.mock = window.vds.mock || {}

  exports = window.vds.mock

  exports.initModule = function (sb) {
    BaseMock = require('vjs/framework/extension/platform/services/integration/vds/mock/impl/BaseMock')
    scopeManager = sb.getService(
      'vjs.framework.extension.platform.interface.scope.ScopeManager'
    )
    Path = require('vjs/framework/extension/platform/services/integration/vds/mock/util/Path')
    environment = sb.getService(
      'vjs.framework.extension.platform.interface.environment.Environment'
    )
  }

  var showNotSupportHtml = function () {
    var style = document.createElement('style')
    style.innerHTML =
      'html,body{width:100%;height:100%;border:0;margin:0;padding:0;overflow:hidden;}'
    window.document.head.appendChild(style)
    var html =
      "<div style='text-align: center;'><img src='" +
      vds._serverUrl +
      "itop/v3/integration/page/img/notFound.png'></div>"
    html += '<p style="text-align: center;">初始化插件元数据失败！</p>'
    html +=
      '<p style="text-align: center;">当前浏览器不支持访问本地json文件，请使用以下方式初始化元数据</p>'
    html +=
      '<div style="width:450px;text-align: left;margin: 0 auto;border: 1px solid #d3d3d3;padding: 8px;background-color: #efefef;"><p>var metadata = {};//元数据信息</p><p>vds.mock.init(metdata);</p></div>'
    window.document.body.innerHTML = html
  }

  var show404Html = function (relativePath) {
    var style = document.createElement('style')
    style.innerHTML =
      'html,body{width:100%;height:100%;border:0;margin:0;padding:0;overflow:hidden;}'
    window.document.head.appendChild(style)
    var html =
      "<div style='text-align: center;'><img src='" +
      vds._serverUrl +
      "itop/v3/integration/page/img/notFound.png'></div>"
    html += '<p style="text-align: center;">初始化插件元数据失败！</p>'
    var path = Path.join(location.href, '../', relativePath)
    html +=
      '<div style="width:700px;text-align: left;margin: 0 auto;"><p>1、浏览器开启访问本地文件权限：浏览器快捷方式目标中添加 --allow-file-access-from-files配置</p><p>2、检查元数据文件路径是否正确，当前路径为：<a target="blank" href="' +
      path +
      '">' +
      path +
      '</a></p></div>'
    window.document.body.innerHTML = html
  }

  /**
   * 初始化mock环境
   * @param {Object|String} metadata 插件元数据定义或插件元数据路径
   * @returns {Promise}
   */
  exports.init = function (metadata) {
    return new Promise(function (resolve, reject) {
      var callback = function (data, baseUrl) {
        var scopeId = scopeManager.createWindowScope({
          componentCode: 'v3',
          windowCode: 'demo',
          series: 'smartclient'
        })
        var baseMock = new BaseMock(data, scopeId, null, null, baseUrl)
        scopeManager.openScope(scopeId)
        resolve(baseMock)
      }
      var metadataType = typeof metadata
      if (metadataType == 'string') {
        if (!environment.isChrome()) {
          showNotSupportHtml()
        } else {
          RPC.orginalRequest({
            host: metadata,
            type: 'GET',
            afterResponse: function (res) {
              var json
              try {
                json = JSON.parse(res.responseText)
              } catch (e) {
                return reject(e)
              }
              callback(json, Path.join(metadata, '../'))
            },
            error: function (e) {
              if (
                e &&
                (e.status == 0 || (e.readyState == 4 && e.status == 404))
              ) {
                show404Html(metadata)
              }
              reject(
                new Error('加载元数据源文件出现异常！异常信息：' + e.statusText)
              )
            }
          })
        }
      } else if (metadataType == 'object') {
        callback(metadata)
      } else {
        callback()
      }
    })
  }

  return exports
})
