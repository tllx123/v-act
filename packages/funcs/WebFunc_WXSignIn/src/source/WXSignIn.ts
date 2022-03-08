import { FunctionContext } from '@v-act/vjs.framework.extension.platform.interface.function'
import { DatasourceManager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { RemoteOperation as remoteOperation } from '@v-act/vjs.framework.extension.platform.services.operation.remote.base'
import { RemoteMethodAccessor } from '@v-act/vjs.framework.extension.platform.services.operation.remote.ruleset'
import { ProgressBarUtil as progressBar } from '@v-act/vjs.framework.extension.ui.common.plugin.services.progressbar'
import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'

type Data = {
  username?: string
  latitude: number
  longitude: number
  fileId?: string
  phone?: string
  wechatName?: string
  signTime?: string
  resultMsgMainTitle?: string
  resultMsgSubTitle?: string
}

//主入口(必须有)
const main = function (param: FunctionContext) {
  let args = param.getArgs()
  let argsLen = args ? args.length : 0
  let entityName = argsLen >= 1 ? args[0] : null
  if (!entityName) {
    alert('微信打卡函数参数设置失败：请设置实体名称！')
  }
  getLocation(entityName)
}

//微信就绪后获取地理位置信息
let getLocation = function (entityName: string) {
  progressBar.showProgress('正在获取您的位置...')
  //@ts-ignore
  wx.getLocation({
    success: function (res: {
      latitude: number
      longitude: number
      speed: number
      accuracy: number
    }) {
      let latitude = res.latitude // 纬度，浮点数，范围为90 ~ -90
      let longitude = res.longitude // 经度，浮点数，范围为180 ~ -180。
      let speed = res.speed // 速度，以米/每秒计
      let accuracy = res.accuracy // 位置精度
      //			   alert(latitude + "-"+longitude)
      let data = {
        latitude: latitude,
        longitude: longitude
      }
      progressBar.hideProgress()
      //			   progressBar.showProgress("请拍摄您的环境照片");
      chooseImage(entityName, data)
    },
    fail: function () {
      alert('获取地理位置失败，请检查并开启定位功能后再次尝试！')
      progressBar.hideProgress()
    }
  })
}

/**
 * 图片选择
 */
let chooseImage = function (entityName: string, data: Data) {
  //@ts-ignore
  wx.chooseImage({
    count: 1, // 默认9
    sizeType: ['compressed'], // 可以指定是原图还是压缩图 （ 原图：  'original'）
    sourceType: ['camera'], // 可以指定来源是相册还是相机，(相册：'album')
    success: function (res: { localIds: string }) {
      progressBar.showProgress('正在上传图片...')
      let localId = res.localIds // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
      uploadImage(localId, entityName, data)
    },
    cancel: function () {
      progressBar.hideProgress()
    }
  })
}

/**
 * 图片上传接口
 */
let uploadImage = function (localId: string, entityName: string, data: Data) {
  //@ts-ignore
  wx.uploadImage({
    localId: localId.toString(), // 需要上传的图片的本地ID，由chooseImage接口获得
    isShowProgressTips: 0, // 默认为1，显示进度提示
    success: function (res: { serverId: string }) {
      let imageId = res.serverId // 返回图片的服务器端ID
      saveImage(imageId, entityName, data)
    },
    fail: function () {
      alert('上传图片失败，请检查网络后重新尝试！')
      progressBar.hideProgress()
    }
  })
}

/**
 * 保存图片
 */
let saveImage = function (imageId: string, entityName: string, data: Data) {
  let cb = function (res: { responseText: string }) {
    let obj = jsonUtil.json2obj(res.responseText)
    let fileId = obj.fileId
    data['fileId'] = fileId
    getUserInfo(data, entityName)
  }

  let ajaxUrl =
    location.href.substring(0, location.href.indexOf('module-operation')) +
    '/module-operation!executeOperation?operation=WexinSaveImage'
  remoteOperation.orginalRequest({
    host: ajaxUrl,
    param: { imageId: imageId },
    isAsync: true,
    afterResponse: cb
  })
}

//获取当前用户信息
let getUserInfo = function (data: Data, entityName: string) {
  let code = location.href.substring(
    location.href.indexOf('&code=') + 6,
    location.href.indexOf('&state')
  )
  let cb = function (res: { responseText: string }) {
    //alert("用户信息"+res.responseText);
    let obj = jsonUtil.json2obj(res.responseText)
    data.username = obj.userid
    data.phone = obj.mobile
    data.wechatName = obj.name
    //@ts-ignore
    window.WXUserID = obj.userid
    //@ts-ignore
    window.WXWechatName = obj.name
    //@ts-ignore
    window.WXPhone = obj.mobile
    saveRecord(data, entityName)
  }
  let currUrl = location.href.split('#')[0]
  let ajaxUrl =
    location.href.substring(0, location.href.indexOf('module-operation')) +
    '/module-operation!executeOperation?operation=WexinGetUserInfo'
  //缓存当前用户名
  //@ts-ignore
  if (window.WXUserID) {
    //@ts-ignore
    data.username = window.WXUserID
    //@ts-ignore
    data.phone = window.WXPhone
    //@ts-ignore
    data.wechatName = window.WXWechatName
    saveRecord(data, entityName)
  } else {
    remoteOperation.orginalRequest({
      host: ajaxUrl,
      param: { code: code },
      isAsync: true,
      afterResponse: cb
    })
  }
}

//保存打卡记录
let saveRecord = function (config: Data, entityName: string) {
  progressBar.showProgress('正在保存数据...')
  let username = config.username
  let latitude = config.latitude
  let longitude = config.longitude
  let fileId = config.fileId
  let phone = config.phone
  let wechatName = config.wechatName

  let ruleSetCallBack = function (rs: {
    isSuccess: boolean
    errorDetail: string
    signTime: string
  }) {
    let isSuccess = rs.isSuccess
    let errorDetail = rs.errorDetail
    let signTime = rs.signTime
    if (signTime) {
      config.signTime = signTime
    }
    if (isSuccess) {
      config.resultMsgMainTitle = '签到成功'
      config.resultMsgSubTitle = ''
    } else {
      config.resultMsgMainTitle = '您已超出打卡范围'
      config.resultMsgSubTitle = '请确认您在要求范围内再次尝试'
    }
    loadData2Entity(config, entityName)
  }
  let sConfig = {
    ruleSetCode: 'HR_API_WechatSign',
    componentCode: 'vp_hr_ad_sign_wechat',
    commitParams: [
      { paramName: 'wechatIdentity', paramType: 'char', paramValue: username },
      { paramName: 'latitude', paramType: 'char', paramValue: latitude },
      { paramName: 'fileId', paramType: 'char', paramValue: fileId },
      { paramName: 'phone', paramType: 'char', paramValue: phone },
      { paramName: 'wechatName', paramType: 'char', paramValue: wechatName },
      { paramName: 'longitude', paramType: 'char', paramValue: longitude }
    ],
    isAsync: true,
    afterResponse: ruleSetCallBack
  }
  RemoteMethodAccessor.invoke(sConfig)
}

//加载前台实体
let loadData2Entity = function (data: Data, entityName: string) {
  let datamap = {
    wechataccountid: data.username,
    latitude: data.latitude,
    longitude: data.longitude,
    signtime: data.signTime,
    resultmsgmaintitle: data.resultMsgMainTitle,
    resultmsgsubtitle: data.resultMsgSubTitle
  }
  let ds = DatasourceManager.lookup({ datasourceName: entityName })
  let params = {
    datas: [datamap],
    isAppend: false
  }
  ds.load(params)
  progressBar.hideProgress()
}

export { main }
