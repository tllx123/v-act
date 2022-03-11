/**
 *	保存图片到相册
 */
import * as expression from '@v-act/vjs.framework.extension.platform.services.integration.vds.expression'
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'
import * as rpc from '@v-act/vjs.framework.extension.platform.services.integration.vds.rpc'
import * as app from '@v-act/vjs.framework.extension.platform.services.integration.vds.app'
const vds = { expression, exception, rpc, app,object }

/**
 * 规则入口
 */
import { RuleContext } from '@v-act/vjs.framework.extension.platform.services.integration.vds.rule'
const main = function (ruleContext: RuleContext) {
  return new Promise<void>(function (resolve, reject) {
    try {
      var inParamsObj = ruleContext.getVplatformInput()
      if (!inParamsObj) {
        //建议兼容
        inParamsObj = ''
      }
      var type = inParamsObj.sourceType
      if (!inParamsObj.sourceValue) {
        reject(
          vds.exception.newConfigException('文件标识或url不存在，请检查配置')
        )
        return
      }
      var value = experssFunc(inParamsObj.sourceValue, ruleContext)
      if (type == 'url') {
        var fileUrl = value
        let fileName:any
        fileName = vds.object.isUndefOrNull(fileName) ? '' : getFileName(fileUrl)
        fileName = fileName.replace(/\s+/g, '')
        if (window.device.platform == 'iOS') {
          fileName = new Date().getTime() + '.' + getFileNameLast(fileName)
        }
        saveFile(fileUrl, fileName, resolve, reject)
      } else {
        var fileId = value
        var getFileInfoCB = function (fileName:string) {
          fileName = fileName.replace(/\s+/g, '')
          if (window.device.platform == 'iOS') {
            fileName = new Date().getTime() + '.' + getFileNameLast(fileName)
          }
          var getFileUrlByFileIdExp = 'GetFileUrlByFileId("' + fileId + '")'
          var getFileUrlCB = function (url:string) {
            saveFile(url, fileName, resolve, resolve)
          }
          executeExpression(getFileUrlByFileIdExp, getFileUrlCB, reject)
        }
        var getFileInfoExp = 'GetFileInfo("' + fileId + '","fileName")'
        executeExpression(getFileInfoExp, getFileInfoCB, reject)
      }
    } catch (err) {
      reject(err)
    }
  })
}

var saveFile = function (fileUrl:string, fileName:string, resolve:any, reject:any) {
  var failCB = function (error:{message:string}) {
    reject(vds.exception.newConfigException('保存失败；' + error.message))
  }
  var promise = vds.app.saveImage(fileUrl, fileName)
  promise.then(resolve).catch(failCB)
}

/**
 * 执行后台函数（根据文件ID获取文件信息）
 */
var executeExpression = function (expression:string, callback:any, reject:any) {
  var paramData = {
    expression: expression
  }
  var result = null
  var promise = vds.rpc.callCommand('WebExecuteFormulaExpression', null, {
    isAsync: false,
    isOperation: true,
    operationParam: paramData,
    isRuleSetCode: false
  })
  promise
    .then(function (rs:any) {
      result = rs.data.result
      callback(result)
    })
    .catch(reject)
}

/**
 * desc 执行表达式
 * experss 表达式
 * routeContext 路由上下文
 */
var experssFunc = function (experss:string, ruleContext:RuleContext) {
  if (experss == null || experss == '') {
    return null
  }
  if (undefined == experss || null == experss) return null
  var resultValue = vds.expression.execute(experss, {
    ruleContext: ruleContext
  })
  return resultValue
}

/**
 * 获取URL后缀
 */
function getFileName(fileName:string) {
  return fileName.split('/').pop()
}

/**
 * 获取文件名后缀
 */
function getFileNameLast(fileName:string) {
  return fileName.split('.').pop()
}

export { main }
