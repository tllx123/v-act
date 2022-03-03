import { RemoteOperation as remoteOperation } from '@v-act/vjs.framework.extension.platform.services.operation.remote'
import { RemoteMethodAccessor as remoteMethodAccessor } from '@v-act/vjs.framework.extension.platform.services.operation.remote'
import { RouteEngine as RouteEngine } from '@v-act/vjs.framework.extension.platform.services.engine.route'
import { Image as ImageService } from '@v-act/vjs.framework.extension.platform.services.native.mobile'
import { ProgressBarUtil as progressbar } from '@v-act/vjs.framework.extension.ui.common.plugin.services.progressbar'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

let undefined

exports.initModule = function (sb) {
  let fileService = sb.getService(
    'vjs.framework.extension.platform.services.native.mobile.FileTransfer'
  )
  fileService.putInstance(exports)
}

/**
 * 微信文件上传内部实现
 */
let uploadingFile = function (
  mediaIds,
  fileResultInfos,
  allFileCount,
  callback,
  scopeId
) {
  if (mediaIds.length > 0) {
    let fileSize = mediaIds.length
    let mediaId = mediaIds.shift()
    let loadingMsg =
      '正在上传图片' + (allFileCount - mediaIds.length) + '/' + allFileCount
    if (allFileCount == 1) {
      loadingMsg = '正在上传图片...'
    }
    progressbar.showProgress(loadingMsg)
    let upload2WXServerCB = function (WXserverId) {
      let uploadMongoCB = function (rs) {
        if (rs.success) {
          let fileId = rs.fileId
          let fileName = rs.fileName
          let fileSize = rs.fileSize
          let fileObj = {
            id: fileId,
            oldFileName: fileName,
            fileSize: fileSize
          }
          fileResultInfos.push(fileObj)
          uploadingFile(
            mediaIds,
            fileResultInfos,
            allFileCount,
            callback,
            scopeId
          )
        } else {
          alert('图片上传到文件服务器失败！')
          let rs = {
            success: false,
            errorCode: 2
          }
          callback(rs)
          return
        }
      }
      let params = {
        fileUrls: [WXserverId],
        wxPlatform: '',
        callback: uploadMongoCB
      }
      if (scopeId) {
        params.scopeId = scopeId
      }
      wxUpload(params)
    }
    let uploadWXParams = {
      localId: mediaId,
      successCallback: upload2WXServerCB
    }
    //上传到微信服务器
    ImageService.uploadImage(uploadWXParams)
  } else {
    progressbar.hideProgress()
    let successObj = {
      success: true
    }
    callback(successObj, fileResultInfos)
  }
}

const uploadFiles = function (mediaIds, callback, scopeId) {
  if (mediaIds) {
    let firstElement = mediaIds[0]
    if (isArrayFn(firstElement)) {
      mediaIds = firstElement
    }
  }
  let fileResultInfos = []
  let allFileCount = mediaIds.length
  uploadingFile(mediaIds, fileResultInfos, allFileCount, callback, scopeId)
}

function isArrayFn(o) {
  return Object.prototype.toString.call(o) === '[object Array]'
}

/**
 * 获取【企业号简单版】系统信息
 */
let getCorpSimpleInfo = function (successCB, scopeId) {
  //		var errorCB = function(error){
  //			alert("执行微信企业号简单版API【获取企业信息】【API_QuerySimpleConfig】失败："+error);
  //		}
  //		var params = {
  //				"ruleSetCode"   : "API_QuerySimpleConfig",
  //				"componentCode" : "vbase_wx_qy_simple_yw_api",
  //				"error"         : errorCB,
  //				"isAsyn"        : true,
  //				"isRuleSetCode" : true,                   // 是否是后台活动集
  //				"afterResponse" : successCB
  //		}
  //		remoteMethodAccessor.invoke(params);

  let func = function () {
    let errorCB = function (error) {
      alert(
        '执行微信企业号简单版API【获取企业信息】【API_QuerySimpleConfig】失败：' +
          error
      )
    }
    try {
      let params = {
        ruleSetCode: 'API_QuerySimpleConfig',
        componentCode: 'vbase_wx_qy_simple_yw_api',
        error: scopeManager.createScopeHandler({
          handler: errorCB
        }),
        isAsyn: true,
        isRuleSetCode: true, // 是否是后台活动集
        afterResponse: scopeManager.createScopeHandler({
          handler: successCB
        })
      }
      remoteMethodAccessor.invoke(params)
    } catch (e) {
      alert('getCorpSimpleInfo error: exception')
    }
  }

  if (scopeId) {
    scopeManager.createScopeHandler({
      handler: func,
      scopeId: scopeId
    })()
  } else {
    func()
  }
}

/**
 * 【企业号简单版】上传文件
 */
let uploadFileQiyeSimple = function (corpSimpleInfo, successCB) {
  let errorCB = function (error) {
    alert(
      '执行微信企业号简单版API失败【获取临时素材】【API_GetTemporaryMaterialSimple】:' +
        error
    )
  }
  let params = []
  let entity = corpSimpleInfo.v_wx_qy_simple_config
  if (entity) {
    let allRecords = entity.getAllRecords()
    let info = allRecords.datas[0]
    info['media_id'] = corpSimpleInfo.media_id
    for (let key in info) {
      let parameter = {
        paramName: key,
        paramType: 'text',
        paramValue: info[key]
      }
      params.push(parameter)
    }
    let config = {
      ruleSetCode: 'API_GetTemporaryMaterialSimple',
      componentCode: 'vbase_wx_qy_simple_yw_api',
      commitParams: params,
      afterResponse: successCB,
      error: errorCB,
      isAsyn: true,
      isRuleSetCode: true
    }
    remoteMethodAccessor.invoke(config)
  } else {
    alert('请到服务端配置企业号简单版应用信息！')
  }
}

/**
 * 获取【企业号授权版】系统信息
 */
let getCorpInfo = function (successCB) {
  let errorCB = function (error) {
    alert(
      '执行微信企业号授权版API失败【获取企业信息】【API_GetConfigValue】：' +
        error
    )
  }
  let params = {
    ruleSetCode: 'API_GetConfigValue',
    componentCode: 'vbase_wx_qy_yw_api',
    error: errorCB,
    isAsyn: true,
    isRuleSetCode: true, // 是否是后台活动集
    afterResponse: successCB
  }
  remoteMethodAccessor.invoke(params)
}

/**
 *【 企业号授权版】上传文件
 */
let uploadFileQiye = function (corpInfo, successCB) {
  let errorCB = function (error) {
    alert(
      '执行微信企业号授权版API失败【获取临时素材】【API_GetTemporaryMaterial】:' +
        error
    )
  }
  let params = []
  for (let key in corpInfo) {
    let parameter = {
      paramName: key,
      paramType: 'text',
      paramValue: corpInfo[key]
    }
    params.push(parameter)
  }
  let config = {
    ruleSetCode: 'API_GetTemporaryMaterial',
    componentCode: 'vbase_wx_qy_yw_api',
    commitParams: params,
    afterResponse: successCB,
    error: errorCB,
    isAsyn: true,
    isRuleSetCode: true
  }
  remoteMethodAccessor.invoke(config)
}

/**
 * 【公众号】上传文件
 */
let uploadFileGongzhong = function (params, successCB) {
  let errorCB = function (error) {
    alert(
      '执行微信公众号API失败【获取临时素材】【API_GetTemporaryMaterial】：' +
        error
    )
  }
  let parameter = {
    ruleSetCode: 'API_GetTemporaryMaterial',
    componentCode: 'vbase_wx_mp_yw_api',
    commitParams: params,
    afterResponse: successCB,
    error: errorCB,
    isAsyn: true,
    host: '',
    isRuleSetCode: true
  }

  remoteMethodAccessor.invoke(parameter)
}

const filetransferUpload = function (fileUrls, wxPlatform, callback) {
  let result = {}
  let currentUploadingCount = 0

  let uploadSuccesCB = function (rs) {
    currentUploadingCount++
    let fileId = rs.AppFileInfo_id
    let fileName = rs.AppFileInfo_name
    let fileSize = ''
    if (wxPlatform == 'gongzhong') {
      fileSize = rs.AppFileInfo_size
    } else {
      fileSize = rs.AppFileInfo_fileSize
    }
    let success = rs.isSuccess
    if (success) {
      if (currentUploadingCount == fileUrls.length) {
        result['success'] = true
        result['fileId'] = fileId
        result['fileName'] = fileName
        result['fileSize'] = fileSize
        callback(result)
      }
    } else {
      if (rs.errorMsg) {
        alert('图片下载失败：' + rs.errorMsg)
      } else {
        alert('图片下载失败：' + rs.errorContent)
      }
    }
  }

  if (wxPlatform == 'qiye') {
    let getCorpInfoCB = function (rs) {
      for (let i = 0; i < fileUrls.length; i++) {
        rs['media_id'] = fileUrls[i]
        uploadFileQiye(rs, uploadSuccesCB)
      }
    }
    getCorpInfo(getCorpInfoCB)
  } else if (wxPlatform == 'qiyeSimple') {
    let getCorpSimpleInfoCB = function (rs) {
      for (let i = 0; i < fileUrls.length; i++) {
        rs['media_id'] = fileUrls[i]
        uploadFileQiyeSimple(rs, uploadSuccesCB)
      }
    }
    getCorpSimpleInfo(getCorpSimpleInfoCB)
  } else {
    for (let i = 0; i < fileUrls.length; i++) {
      let params = [
        {
          paramName: 'media_id',
          paramType: 'text',
          paramValue: fileUrls[i]
        }
      ]
      uploadFileGongzhong(params, uploadSuccesCB)
    }
  }
}

/**
 * 微信文件上传接口
 * @param {Object} params
 * 		{
 * 			fileUrl    :  文件路径地址，数组格式 [media_id1,media_id2,...]  //media_id是微信服务器上的文件ID
 * 			wxPlatform : "qiye" ： 企业号  "gongzhong" : 公众号
 * 			callback   : 回调
 * 		}
 *
 * @example
 * 回调函数说明：
 * 成功时返回： {success:true,fileIds:[fileID1,fileID2,...]}
 * 失败时返回： {success:false,errorCode:1}
 *      		1:不合法的URL
 *      		3:服务器异常或网络连接失败
 * var callback = function(res){
 * 		alert(JSON.stringify(res));
 * }
 */
let wxUpload = function (params) {
  let fileUrls = params.fileUrls
  let wxPlatform = params.wxPlatform
  let callback = params.callback
  let scopeId = params.scopeId

  let result = {}
  let currentUploadingCount = 0

  //去后台获取微信的平台类型
  getWXPlatform(function (WXPlatformType) {
    let uploadSuccesCB = function (rs) {
      currentUploadingCount++
      let fileId = rs.AppFileInfo_id
      let fileName = rs.AppFileInfo_name
      let fileSize = ''

      if (WXPlatformType == 'gongzhong') {
        fileSize = rs.AppFileInfo_size
      } else {
        fileSize = rs.AppFileInfo_fileSize
      }
      let success = rs.isSuccess
      if (success) {
        if (currentUploadingCount == fileUrls.length) {
          result['success'] = true
          result['fileId'] = fileId
          result['fileName'] = fileName
          result['fileSize'] = fileSize
          callback(result)
        }
      } else {
        if (rs.errorMsg) {
          alert('图片下载失败：' + rs.errorMsg)
        } else {
          alert('图片下载失败：' + rs.errorContent)
        }
      }
    }

    if (WXPlatformType == 'qyAuth') {
      let getCorpInfoCB = function (rs) {
        for (let i = 0; i < fileUrls.length; i++) {
          rs['media_id'] = fileUrls[i]
          uploadFileQiye(rs, uploadSuccesCB)
        }
      }
      getCorpInfo(getCorpInfoCB)
    } else if (WXPlatformType == 'qySample') {
      let getCorpSimpleInfoCB = function (rs) {
        for (let i = 0; i < fileUrls.length; i++) {
          rs['media_id'] = fileUrls[i]
          uploadFileQiyeSimple(rs, uploadSuccesCB)
        }
      }
      getCorpSimpleInfo(getCorpSimpleInfoCB, scopeId)
    } else if (WXPlatformType == 'mp') {
      for (let i = 0; i < fileUrls.length; i++) {
        let params = [
          {
            paramName: 'media_id',
            paramType: 'text',
            paramValue: fileUrls[i]
          }
        ]
        uploadFileGongzhong(params, uploadSuccesCB)
      }
    } else {
      alert('微信【图片上传】失败，无法识别的微信平台类型：' + WXPlatformType)
    }
  })
}

/**
 * 获取当前开启的微信服务：企业号授权版、企业号简单版、公众号
 */
let getWXPlatform = function (callback) {
  let ajaxUrl =
    location.href.substring(0, location.href.indexOf('module-operation')) +
    '/module-operation!executeOperation?operation=WXGetPlatform'
  let cb = scopeManager.createScopeHandler({
    handler: function (result) {
      let rs = $.parseJSON(result.responseText)
      let isOpen = rs.data.isOpen
      if (isOpen == 'true') {
        let platfrom = rs.data.currentPlatform
        if (typeof callback == 'function') {
          callback(platfrom)
        }
      } else {
        alert(
          '微信【图片上传】失败，请在服务端控制台-移动端管理-微信管理 开启微信服务'
        )
      }
    }
  })
  remoteOperation.orginalRequest({
    host: ajaxUrl,
    param: {},
    isAsync: true,
    afterResponse: cb
  })
}

export { uploadFiles, filetransferUpload, wxUpload }
