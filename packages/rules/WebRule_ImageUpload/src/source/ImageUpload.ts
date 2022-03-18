import { ExceptionFactory as factory } from '@v-act/vjs.framework.extension.platform.interface.exception'
import { DatasourceFactory as DBFactory } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import {
  ExpressionContext,
  ExpressionEngine as engine
} from '@v-act/vjs.framework.extension.platform.engine.expression'
//规则主入口(必须有)
import { RuleContext } from '@v-act/vjs.framework.extension.platform.services.integration.vds.rule'
import { RouteContext } from '@v-act/vjs.framework.extension.platform.services.integration.vds.rule'
import { DatasourceManager as manager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import {
  Camera as CameraService,
  ImagePicker as ImagePickerService
} from '@v-act/vjs.framework.extension.platform.services.native.mobile.localdb'
import { ProgressBarUtil as progressbar } from '@v-act/vjs.framework.extension.ui.common.plugin.services.progressbar'
import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'
import { Log as log } from '@v-act/vjs.framework.extension.util.logutil'
import { MathUtil as mathUtil } from '@v-act/vjs.framework.extension.util.math'
import { $ } from '@v-act/vjs.framework.extension.vendor.jquery'

let FileTransferService, routeContext, ImageService, sandbox
let ERRORNAME
//初始化vjs模块，如果规则逻辑需要引用相关vjs服务，则初始化相关vjs模块；如果不需要初始化逻辑可以为空
export function initModule(sBox) {
  //sBox：前台vjs的沙箱（容器/上下文），可以用它根据vjs名称，获取到相应vjs服务
  sandbox = sBox
  if (isWeiXin()) {
    let initWXImpl = [
      'vjs.framework.extension.platform.native.weixin.filetransfer',
      'vjs.framework.extension.platform.native.weixin.image'
    ]
    let sb = sandbox.create()
    sb.use(initWXImpl)
    sb.active().done(function () {
      FileTransferService = sandbox.getService(
        'vjs.framework.extension.platform.native.weixin.Filetransfer'
      )
      ImageService = sandbox.getService(
        'vjs.framework.extension.platform.services.native.mobile.Image'
      )
    })
  } else {
    FileTransferService = sandbox.getService(
      'vjs.framework.extension.platform.services.native.mobile.FileTransfer'
    )
  }
}

const main = function (ruleContext: RuleContext) {
  if (isWeiXin()) {
    WXUpload(ruleContext)
  } else {
    APPUpload(ruleContext)
  }
}
let StringToArray = function (str: string) {
  let tmpvar = []
  tmpvar[0] = str
  return tmpvar
}
let removeDailog = function () {
  $('body').find('#md-bg-imgupload').fadeOut(300)
  $('body').find('#main-imgupload').css('transform', 'translateY(120%)')
}
let showDailog = function () {
  $('body').find('#md-bg-imgupload').fadeIn(300)
  $('body').find('#main-imgupload').css('transform', 'translateY(0)')
}
/**
 * desc 异常处理方法
 * @ruleContext 规则上下文
 * @error_msg 提示信息
 * vjs: 可省略
 * services:
 * 		factory = sandbox.getService("vjs.framework.extension.platform.interface.exception.ExceptionFactory");
 * */
function HandleException2(ruleContext: RuleContext, error_msg: string) {
  error_msg = ERRORNAME + error_msg
  let exception = factory.create({
    type: factory.TYPES.Business,
    message: error_msg
  })
  ruleContext.handleException(exception)
}
/**
 * desc 非回调中抛异常
 * @ruleContext 规则上下文
 * @error_msg 提示信息
 * vjs: 可省略
 * services:
 * 		factory = sandbox.getService("vjs.framework.extension.platform.interface.exception.ExceptionFactory");
 * */
function HandleException(error_msg: string) {
  error_msg = ERRORNAME + error_msg
  let exception = factory.create({
    type: factory.TYPES.Business,
    message: error_msg
  })
  throw exception
}
/**
 * @desc 获取数字类型的值,不是数字会抛异常
 * @param sourceValue 来源值(String|Number)
 * @param paramName 参数名称
 * @returns targetValue 数字类型的值(Number)
 * @vjs
 * 		"vjs.framework.extension.util.math":null
 * @service
 * 		mathUtil = sandbox.getService("vjs.framework.extension.util.Math");
 * */
function getNum(sourceValue: any, paramName: string) {
  if (sourceValue == null || sourceValue == '') {
    return 0
  }
  if (!mathUtil.isNum(sourceValue) || isNaN(parseFloat(sourceValue + ''))) {
    HandleException(paramName + '不是数字类型')
  }
  return Number(sourceValue)
}
/**
 * desc 打印日志
 * content 需要打印的内容
 * type 打印的类型，log、warn、error
 * vjs
 * 		"vjs.framework.extension.util.log":null
 * services
 * 		log = sandbox.getService("vjs.framework.extension.util.log");
 * */
function OutPutLog(content: any, type: string) {
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
 * desc 执行表达式
 * experss 表达式
 * routeContext 路由上下文
 * vjs:
 * 		"vjs.framework.extension.platform.services.engine":null,
 * services:
 * 		ExpressionContext = sandbox.getService("vjs.framework.extension.platform.services.engine.expression.ExpressionContext");
 * 		engine = sandbox.getService("vjs.framework.extension.platform.services.engine.expression.ExpressionEngine");
 *
 * */
function experssFunc(experss: string, routeContext: RouteContext) {
  if (experss == null || experss == '') {
    return null
  }
  let context = new ExpressionContext()
  context.setRouteContext(routeContext)
  let resultValue = engine.execute({
    expression: experss,
    context: context
  })
  return resultValue
}
//获取实体对象
function GetDataSource(ds: any, routeContext: RouteContext) {
  let dsName = ds
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
  //			if(!datasource) throw new Error("规则[图片上传]找不到配置的实体！");
  return datasource
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

//判断终端是否是微信
function isWeiXin() {
  let ua = window.navigator.userAgent.toLowerCase()
  //@ts-ignore
  if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    return true
  } else {
    return false
  }
}

//微信端上传图片
function WXUpload(ruleContext: RuleContext) {
  ERRORNAME = '规则[ImageUpload]：'
  // 获取规则链路由上下文,终止执行后续规则
  routeContext = ruleContext.getRouteContext()
  // 获取规则链路由上下文的配置参数值
  let ruleCfgValue = ruleContext.getRuleCfg()
  // 获取开发系统配置的参数
  let inParams = ruleCfgValue['inParams']
  let inParamObj = jsonUtil.json2obj(inParams)

  let wxPlatform = inParamObj.platform ? inParamObj.platform : 'qiye'

  //微信上传图片来源
  let sourceType = inParamObj.WXSourceType
  if (sourceType == 'camera') {
    sourceType = ['camera']
  } else if (sourceType == 'album') {
    sourceType = ['album']
  } else {
    sourceType = []
  }

  //微信上传图片压缩类型
  let sizeType =
    inParamObj.WXSizeType == 'original' ? ['original'] : ['compressed']
  //微信相册可选数量
  let count = inParamObj.WXCount

  let entityCode = inParamObj.entityCode //实体编码
  let dataSource = GetDataSource(entityCode, routeContext)
  if (!dataSource) {
    HandleException('请检查实体' + entityCode + '是否存在')
  }
  let fieldCode = inParamObj.fieldCode //实体文件ID字段编码
  let fileNameField = inParamObj.fileName //实体文件名字段编码
  let fileSizeField = inParamObj.fileSize //实体文件大小字段编码

  let chooseOKCB = function (imageIds) {
    let chooseCount = imageIds.length
    if (chooseCount > 0) {
      let mongoFileIds = []
      let mongoFileNames = []
      let mongoFileSizes = []
      upload2WX(
        ruleContext,
        imageIds,
        mongoFileIds,
        mongoFileNames,
        mongoFileSizes,
        dataSource,
        fieldCode,
        chooseCount,
        fileNameField,
        fileSizeField,
        wxPlatform
      )
    } else {
      setBusinessRuleResult(ruleContext, true)
      ruleContext.fireRouteCallback()
    }
  }

  let scopeChooseOKCB = ruleContext.genAsynCallback(chooseOKCB)

  let chooseImageParams = {
    count: count,
    sizeType: sizeType,
    sourceType: sourceType,
    successCallback: scopeChooseOKCB
  }
  ImageService.chooseImage(chooseImageParams)
  ruleContext.markRouteExecuteUnAuto()
}

/*
 * 将图片上传到微信服务器
 */
function upload2WX(
  ruleContext: RuleContext,
  imageIds: any[],
  mongoFileIds: any[],
  mongoFileNames: any[],
  mongoFileSizes: any[],
  dataSource: any,
  fieldCode: any,
  chooseCount: number,
  fileNameField: any,
  fileSizeField: any,
  wxPlatform: any
) {
  if (imageIds.length > 0) {
    let imageID = imageIds.shift()
    let loadingMsg =
      '正在上传图片' + (chooseCount - imageIds.length) + '/' + chooseCount
    if (chooseCount == 1) {
      loadingMsg = '正在上传图片...'
    }

    progressbar.showProgress(loadingMsg)
    let uploadWXCB = function (WXserverId) {
      window.console.log(WXserverId)
      let uploadMongoCB = function (rs) {
        if (rs.success) {
          let mongoFileId = rs.fileId
          let mongoFileName = rs.fileName
          let mongoFileSize = rs.fileSize
          mongoFileIds.push(mongoFileId)
          mongoFileNames.push(mongoFileName)
          mongoFileSizes.push(mongoFileSize)
          upload2WX(
            ruleContext,
            imageIds,
            mongoFileIds,
            mongoFileNames,
            mongoFileSizes,
            dataSource,
            fieldCode,
            chooseCount,
            fileNameField,
            fileSizeField,
            wxPlatform
          )
        } else {
          alert('图片上传失败！')
        }
      }

      let scopeUploadMongoCB = ruleContext.genAsynCallback(uploadMongoCB)
      //从微信服务器下载mongodb
      let params = {
        fileUrls: [WXserverId],
        wxPlatform: wxPlatform,
        callback: scopeUploadMongoCB
      }
      FileTransferService.wxUpload(params)
    }

    let scopeUploadWXCB = ruleContext.genAsynCallback(uploadWXCB)
    let uploadWXParams = {
      localId: imageID,
      successCallback: scopeUploadWXCB
    }

    //上传到微信服务器
    ImageService.uploadImage(uploadWXParams)
  } else {
    let insertRecords = []
    for (let i = 0; i < mongoFileIds.length; i++) {
      let fileId = mongoFileIds[i]
      let emptyRecord = dataSource.createRecord()
      if (fieldCode) {
        emptyRecord.set(fieldCode, fileId)
      }
      if (fileNameField) {
        emptyRecord.set(fileNameField, mongoFileNames[i])
      }
      if (fileSizeField) {
        emptyRecord.set(fileSizeField, mongoFileSizes[i])
      }
      insertRecords.push(emptyRecord)
    }
    dataSource.insertRecords({
      records: insertRecords,
      position: 3
    })
    progressbar.hideProgress()
    setBusinessRuleResult(ruleContext, true)
    ruleContext.fireRouteCallback()
  }
}

function APPUpload(ruleContext: RuleContext) {
  ERRORNAME = '规则[ImageUpload]：'
  // 获取规则链路由上下文,终止执行后续规则
  routeContext = ruleContext.getRouteContext()
  // 获取规则链路由上下文的配置参数值
  let ruleCfgValue = ruleContext.getRuleCfg()
  // 获取开发系统配置的参数
  let inParams = ruleCfgValue['inParams']
  let inParamObj = jsonUtil.json2obj(inParams)
  //相册是否单选
  let simpleUpload =
    inParamObj.albumSingle == undefined || inParamObj.albumSingle == false
      ? false
      : true
  let entityCode = inParamObj.entityCode //实体编码
  let dataSource = GetDataSource(entityCode, routeContext)
  if (!dataSource) {
    HandleException('请检查实体' + entityCode + '是否存在')
  }
  let fieldCode = inParamObj.fieldCode //字段编码

  //拍照是否保存到相册
  let saveImage =
    inParamObj.saveImage == undefined || inParamObj.saveImage == false
      ? false
      : true
  //图片宽度
  let _targetWidth = experssFunc(inParamObj.targetWidth, ruleContext)
  if (_targetWidth == null || _targetWidth == '') {
    _targetWidth = 0
  } else {
    //转换成数字
    _targetWidth = getNum(_targetWidth, '图片宽度')
    if (_targetWidth < 0) {
      HandleException('图片宽度不能小于0')
    }
  }
  //图片高度
  let _targetHeight = experssFunc(inParamObj.targetHeight, ruleContext)
  if (_targetHeight == null || _targetHeight == '') {
    _targetHeight = 0
  } else {
    //转换成数字
    _targetHeight = getNum(_targetHeight, '图片高度')
    if (_targetHeight < 0) {
      HandleException('图片高度不能小于0')
    }
  }
  //图片质量
  let _quality = experssFunc(inParamObj.quatity, ruleContext)
  if (_quality == null || _quality == '') {
    _quality = 50
  } else {
    //转换成数字
    _quality = getNum(_quality, '图片质量')
    if (_quality < 0 || _quality > 100) {
      HandleException('图片质量不能小于0且不能大于100')
    }
  }

  let zd = $('#md-bg-imgupload')
  let nr = $('#main-imgupload')
  if (zd != undefined && zd.length > 0 && nr != undefined && nr.length > 0) {
    $('body #main-imgupload li').unbind('click')
  } else {
    if (zd != undefined && zd.length > 0) zd.remove()
    if (nr != undefined && nr.length > 0) nr.remove()
    //遮罩以及弹出的内容
    let ruleDialogHTML =
      '<div id="md-bg-imgupload" class="mobileDialog-bg" style="opacity: 1;background-color: rgba(0,0,0,0.4)"></div><div id="main-imgupload" class="imageUploadDialog-main"><div class="imageUploadDialog-bg"><li class="imageUploadDialog-btns" style="border-radius: 12px 12px 0 0;" data-value="picture">拍照</li><li class="imageUploadDialog-btns" style="border-radius: 0 0 12px 12px;" data-value="album">从手机相册选择</li></div><div class="imageUploadDialog-bg"><li class="imageUploadDialog-btns" data-value="cancle" style="margin-top: 8px;border-radius: 12px;">取消</li></div></div>'
    $('body').append(ruleDialogHTML)
  }
  let scopeId = scopeManager.getCurrentScopeId()
  $('body #md-bg-imgupload').on('click', removeDailog)
  $('body #main-imgupload li').on('click', function () {
    let valueCode = $(this).attr('data-value')
    //成功后回调
    let SuncceccCallBack = function (imagePath) {
      if (undefined != scopeId) scopeManager.openScope(scopeId)
      removeDailog()
      if (imagePath && imagePath.length > 0) {
        //上传后的回调,设置规则返回值
        let uploadSuccess = function (results) {
          if (
            results &&
            undefined != results.success &&
            (results.success == false || results.success == 'false')
          ) {
            HandleException2(ruleContext, '图片上传规则：上传图片不成功')
            setBusinessRuleResult(ruleContext, false)
          } else {
            let fileIds = results
            if (fileIds) {
              let insertRecords = []
              for (let i = 0; i < fileIds.length; i++) {
                let fileId = fileIds[i]
                let emptyRecord = dataSource.createRecord()
                emptyRecord.set(fieldCode, fileId)
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
        if (valueCode == 'picture') {
          imagePath = StringToArray(imagePath)
        }
        FileTransferService.filetransferUpload(imagePath, uploadSuccess)
      } else {
        setBusinessRuleResult(ruleContext, false)
        ruleContext.fireRouteCallback()
      }
    }
    //失败后回调
    let FailCallBack = function (errorMsg) {
      setBusinessRuleResult(ruleContext, false)
      removeDailog()
      ruleContext.fireRouteCallback()
    }
    let options: { [code: string]: any } = {}
    options['quality'] = _quality
    if (valueCode == 'cancle') {
      removeDailog()
      setBusinessRuleResult(ruleContext, false)
      ruleContext.fireRouteCallback()
      return
    } else if (valueCode == 'picture') {
      options.destinationType = CameraService.DestinationType.FILE_URI
      options.sourceType = CameraService.PictureSourceType.CAMERA
      options.encodingType = CameraService.EncodingType.JPEG
      options.mediaType = CameraService.MediaType.PICTURE
      options.allowEdit = false
      options.correctOrientation = true
      options.saveToPhotoAlbum = false
      options.targetWidth = _targetWidth
      options.targetHeight = _targetHeight
      CameraService.getPicture(SuncceccCallBack, FailCallBack, options)
    } else if (valueCode == 'album') {
      options.width = _targetWidth
      options.height = _targetHeight
      /*设置相册最大选择数量*/
      if (simpleUpload == true) {
        options['maximumImagesCount'] = 1
      }
      ImagePickerService.getPicture(SuncceccCallBack, FailCallBack, options)
    } else {
      HandleException2(
        ruleContext,
        '图片上传规则暂时不支持这种类型：' + valueCode
      )
      removeDailog()
      setBusinessRuleResult(ruleContext, false)
      ruleContext.fireRouteCallback()
      return
    }
  })
  showDailog()
  ruleContext.markRouteExecuteUnAuto()
}

export { main }
