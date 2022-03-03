exports.initModule = function (sb) {
  let Image = sb.getService(
    'vjs.framework.extension.platform.services.native.mobile.Image'
  )
  Image.putInstance(exports)
}

/**
 * 拍照或从手机相册中选图接口
 * 入参说明：
 * 	{
 *	    count: 1,    //照片选中数量,默认9
 *	    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
 *	    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
 *	    successCallback: function(res){alert(res.localIds)} // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
 *	}
 */
let chooseImage = function (params) {
  //		alert(JSON.stringify(params));
  if (params.sizeType) {
    if (params.sizeType.length == 0) params.sizeType = undefined
  }
  if (params.sourceType) {
    if (params.sourceType.length == 0) params.sourceType = undefined
  }

  wx.ready(function () {
    // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
    wx.chooseImage({
      count: params.count, // 默认9
      sizeType: params.sizeType, // 可以指定是原图还是压缩图，默认二者都有
      sourceType: params.sourceType, // 可以指定来源是相册还是相机，默认二者都有
      complete: function (res) {
        let localIds = res.localIds // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
        localIds = localIds || []
        if (typeof params.successCallback == 'function') {
          params.successCallback(localIds)
        }
      }
      //				success: function (res) {
      //					var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
      //					if(typeof(params.successCallback) == "function"){
      //						params.successCallback(localIds);
      //					}
      //				}
    })
  })
}

/**
 * 预览图片接口
 *
 * 入参说明：
 * 	{
 *	    current: xxx, // 当前显示图片的http链接
 *	    urls: [], // 需要预览的图片http链接列表
 *	}
 */
let previewImage = function (params) {
  // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
  wx.ready(function () {
    wx.previewImage({
      current: params.current,
      urls: params.urls
    })
  })
}

/**
 * 上传图片（上传到微信服务器,暂存3天）
 * 入参说明：params
 * 	{
 *	    localId: xxx, // 需要上传的图片的本地ID，由chooseImage接口获得
 *	    isShowProgressTips: [],// 默认为1，显示进度提示
 *		successCallback : function(serverId){)}    // 返回图片的服务器端ID
 *	}
 */
let uploadImage = function (params) {
  wx.uploadImage({
    localId: params.localId,
    isShowProgressTips: 0,
    success: function (res) {
      let serverId = res.serverId
      if (typeof params.successCallback == 'function') {
        params.successCallback(serverId)
      }
    },
    error: function (errMsg) {
      alert('上传图片至微信失败:' + errMsg)
    }
  })
}

export { uploadImage, chooseImage, previewImage }
