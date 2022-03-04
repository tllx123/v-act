import { log as logUtil } from '@v-act/vjs.framework.extension.util'
import { ExceptionFactory as factory } from '@v-act/vjs.framework.extension.platform.interface.exception'
import { JsonUtil as jsonUtil } from '@v-act/vjs.framework.extension.util.json'
import { ExpressionContext as ExpressionContext } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { ExpressionEngine as engine } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { RemoteMethodAccessor as remoteMethodAccessor } from '@v-act/vjs.framework.extension.platform.services.operation.remote'
import { SaveImageToGallery as saveImageToGalleryService } from '@v-act/vjs.framework.extension.platform.services.native.mobile'
import { RemoteOperation as operation } from '@v-act/vjs.framework.extension.platform.services.domain.operation'
let ERRORNAME
//初始化vjs模块，如果规则逻辑需要引用相关vjs服务，则初始化相关vjs模块；如果不需要初始化逻辑可以为空
exports.initModule = function (sBox) {
  //sBox：前台vjs的沙箱（容器/上下文），可以用它根据vjs名称，获取到相应vjs服务
  sandbox = sBox
}

//规则主入口(必须有)d
let main = function (ruleContext) {
  ERRORNAME = '规则[SaveFileByUrl]'
  // 获取规则链路由上下文,终止执行后续规则
  let routeContext = ruleContext.getRouteContext()
  // 获取规则链路由上下文的配置参数值
  let ruleCfgValue = ruleContext.getRuleCfg()
  // 获取开发系统配置的参数
  let inParams = ruleCfgValue['inParams']
  let inParamsObj = convertJson(inParams)
  let type = inParamsObj.sourceType
  let value = inParamsObj.sourceValue
    ? experssFunc(inParamsObj.sourceValue, routeContext)
    : HandleException('文件标识或url不存在，请检查配置')
  if (type == 'url') {
    let fileUrl = value
    let fileName = getFileName(fileUrl)
    fileName = fileName.replace(/\s+/g, '')
    if (window.device.platform == 'iOS') {
      fileName = new Date().getTime() + '.' + getFileNameLast(fileName)
    }
    saveFile(fileUrl, fileName, ruleContext)
  } else {
    let fileId = value
    let getFileInfoCB = function (fileName) {
      fileName = fileName.replace(/\s+/g, '')
      if (window.device.platform == 'iOS') {
        fileName = new Date().getTime() + '.' + getFileNameLast(fileName)
      }
      let getFileUrlByFileIdExp = 'GetFileUrlByFileId("' + fileId + '")'
      let getFileUrlCB = function (url) {
        saveFile(url, fileName, ruleContext)
      }
      executeExpression(getFileUrlByFileIdExp, getFileUrlCB)
    }
    let getFileInfoExp = 'GetFileInfo("' + fileId + '","fileName")'
    executeExpression(getFileInfoExp, getFileInfoCB)
  }
  SuspendRuleChain(ruleContext)
}

let saveFile = function (fileUrl, fileName, ruleContext) {
  let successCB = function (results) {
    ruleContext.fireRouteCallback()
  }
  let failCB = function (error) {
    HandleException('保存失败！')
    ruleContext.fireRouteCallback()
  }
  let options = {
    fileUrl: fileUrl,
    fileName: fileName
  }
  saveImageToGalleryService.saveimagetogallery(successCB, failCB, options)
}

/**
 * 执行后台函数（根据文件ID获取文件信息）
 */
let executeExpression = function (expression, callback) {
  let scope = scopeManager.getWindowScope(),
    windowCode = scope.getWindowCode()
  let paramData = { expression: expression }
  let result = null
  operation.request({
    windowCode: windowCode,
    operation: 'WebExecuteFormulaExpression',
    isAsync: false,
    params: paramData,
    success: function (rs) {
      result = rs.data.result
      callback(result)
    },
    error: function (e) {
      HandleException(e)
    }
  })
}

/**
 * desc 执行表达式
 * experss 表达式
 * routeContext 路由上下文
 */
let experssFunc = function (experss, routeContext) {
  if (experss == null || experss == '') {
    return null
  }
  let context = new ExpressionContext()
  context.setRouteContext(routeContext)
  if (undefined == experss || null == experss) return null
  let resultValue = engine.execute({
    expression: experss,
    context: context
  })
  return resultValue
}

/**
 * desc Json字符串转Json对象
 * inParams
 * vjs:
 * 		"vjs.framework.extension.util.json":null,
 * services:
 * 		jsonUtil = sandbox.getService("vjs.framework.extension.util.JsonUtil");
 * */
let convertJson = function (inParams) {
  let result = {}
  if (undefined != inParams) {
    result = jsonUtil.json2obj(inParams)
  }
  return result
}

/**
 * desc 异常处理方法
 * error_msg 提示信息
 */
function HandleException(error_msg) {
  error_msg = ERRORNAME + error_msg
  let exception = factory.create({
    type: factory.TYPES.Dialog,
    message: error_msg
  })
  throw exception
}

/**
 * 获取URL后缀
 */
function getFileName(fileName) {
  return fileName.split('/').pop()
}

/**
 * 获取文件名后缀
 */
function getFileNameLast(fileName) {
  return fileName.split('.').pop()
}

/**
 * desc 打印日志
 * content 需要打印的内容
 * type 打印的类型，log、warn、error
 */
function OutPutLog(content, type) {
  if (log == null) return
  /*打印log类型的日志*/
  if (type == 'log') {
    log.log(ERRORNAME + content)
    return
  }
  /*打印warn类型的日志*/
  if (type == 'warn') {
    log.warn(ERRORNAME + content)
    return
  }
  /*打印error类型的日志*/
  if (type == 'error') {
    log.error(ERRORNAME + content)
    return
  }
}

/**
 * 中断规则链
 */
function SuspendRuleChain(ruleContext) {
  ruleContext.markRouteExecuteUnAuto()
}

/**
 * 释放规则链
 */
function ReleaseRuleChain(ruleContext) {
  ruleContext.fireRouteCallback()
}
export { main }
