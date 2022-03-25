import {
  ExpressionContext,
  ExpressionEngine as engine
} from '@v-act/vjs.framework.extension.platform.engine.expression'
import { ExceptionFactory as factory } from '@v-act/vjs.framework.extension.platform.interface.exception'
import { DatasourceFactory as DBFactory } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'
//规则主入口(必须有)
import {
  RouteContext,
  RuleContext
} from '@v-act/vjs.framework.extension.platform.interface.route'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { DatasourceManager as manager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { FileTransfer as FileTransferService } from '@v-act/vjs.framework.extension.platform.services.native.mobile.filetransfer'
import { Mediacapture as MediacaptureService } from '@v-act/vjs.framework.extension.platform.services.native.mobile.mediacapture'
import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'

const main = function (ruleContext: RuleContext) {
  // 获取规则链路由上下文,终止执行后续规则
  let routeContext = ruleContext.getRouteContext()
  // 获取规则链路由上下文的配置参数值
  let ruleCfgValue = ruleContext.getRuleCfg()
  // 获取开发系统配置的参数
  let inParams = ruleCfgValue['inParams']
  let inParamObj = jsonUtil.json2obj(inParams)
  let mediaType = inParamObj.mediaType
  if ('video' == mediaType) {
    getVideoFile(inParamObj, routeContext, ruleContext)
  } else {
    getAudioFile(inParamObj, routeContext, ruleContext)
  }
}

/**
 * 拍摄视频文件
 */
let getVideoFile = function (inParamObj, routeContext, ruleContext) {
  ruleContext.markRouteExecuteUnAuto()
  let scopeId = scopeManager.getCurrentScopeId()
  let successCB = function (mediaFiles) {
    let scopeId = scopeManager.getCurrentScopeId()
    if (mediaFiles) {
      let mediaFileLocalPath = mediaFiles[0].fullPath
      uploadMediaFile([mediaFileLocalPath], inParamObj, ruleContext)
    }
  }

  let errorCB = function (errorMsg) {
    alert(errorMsg)
  }

  let sCB = scopeManager.createScopeHandler({
    handler: successCB
  })

  let eCB = scopeManager.createScopeHandler({
    handler: errorCB
  })

  MediacaptureService.captureVideo(sCB, eCB)
}

/**
 * 拍摄音频文件
 */
let getAudioFile = function (inParamObj, routeContext, ruleContext) {
  ruleContext.markRouteExecuteUnAuto()

  let successCB = function (mediaFiles) {
    if (mediaFiles) {
      let mediaFileLocalPath = mediaFiles[0].fullPath
      uploadMediaFile([mediaFileLocalPath], inParamObj, ruleContext)
    }
  }
  let errorCB = function (errorMsg) {
    alert(errorMsg)
  }

  let sCB = scopeManager.createScopeHandler({
    handler: successCB
  })

  let eCB = scopeManager.createScopeHandler({
    handler: errorCB
  })

  MediacaptureService.captureAudio(sCB, eCB)
}

/**
 * 上传媒体文件
 */
let uploadMediaFile = function (
  imagePath: string,
  inParamObj,
  ruleContext: RuleContext
) {
  let entityCode = inParamObj.entityCode //实体编码
  let fieldFileID = inParamObj.fieldId //字段编码（文件ID）
  let dataSource = getDataSource(entityCode, routeContext)
  //上传后的回调,设置规则返回值
  let scopeId = scopeManager.getCurrentScopeId()
  let uploadSuccess = function (
    results: Array<{}> | { success: boolean | string }
  ) {
    if (undefined != scopeId) {
      scopeManager.openScope(scopeId)
    }

    if (
      results &&
      undefined != results.success &&
      (results.success == false || results.success == 'false')
    ) {
      HandleException(ruleContext, '上传录音录像规则：上传失败！')
      setBusinessRuleResult(ruleContext, false)
    } else {
      let fileIds = results
      if (fileIds) {
        let insertRecords = []
        for (let i = 0; i < fileIds.length; i++) {
          let fileId = fileIds[i]
          let emptyRecord = dataSource.createRecord()
          emptyRecord.set(fieldFileID, fileId)
          insertRecords.push(emptyRecord)
        }
        dataSource.insertRecords({
          records: insertRecords,
          position: 3
        })
      }
      setBusinessRuleResult(ruleContext, true)
    }
    scopeManager.closeScope()
    ruleContext.fireRouteCallback()
  }
  let scopeChooseOKCB = ruleContext.genAsynCallback(uploadSuccess)
  FileTransferService.filetransferUpload(imagePath, scopeChooseOKCB)
}

//获取实体对象
function getDataSource(entityCode: string, routeContext: RouteContext) {
  let dsName = entityCode
  let datasource = null
  if (DBFactory.isDatasource(dsName)) {
    datasource = dsName
  } else {
    let context = new ExpressionContext()
    context.setRouteContext(routeContext)
    if (dsName.indexOf('.') == -1 && dsName.indexOf('@') == -1) {
      datasource = manager.lookup({
        datasourceName: dsName
      })
    } else {
      datasource = engine.execute({
        expression: dsName,
        context: context
      })
    }
  }
  return datasource
}

/**
 * 异常处理方法
 * @ruleContext 规则上下文
 * @error_msg 提示信息
 */
function HandleException(ruleContext: RuleContext, error_msg: string) {
  error_msg = ERRORNAME + error_msg
  let exception = factory.create({
    type: factory.TYPES.Business,
    message: error_msg
  })
  ruleContext.handleException(exception)
}

/**
 * 设置业务返回结果
 */
function setBusinessRuleResult(ruleContext: RuleContext, result: any) {
  if (ruleContext.setBusinessRuleResult) {
    ruleContext.setBusinessRuleResult({
      isSuccess: result
    })
  }
}

export { main }
