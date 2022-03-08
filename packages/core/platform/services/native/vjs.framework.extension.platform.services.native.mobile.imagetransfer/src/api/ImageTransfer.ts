import { Log as log } from '@v-act/vjs.framework.extension.util.log'

let instance
let VJSNAME = 'VJS[ImageTransfer]：'

let IMGFROMAt = {
  qiniu: {
    yindangu: {
      yunrooms: {
        publicroom: {
          styleDefault:
            'http://omy9jh22o.bkt.clouddn.com/prd/fileId?imageMogr2/auto-orient/thumbnail/500x/strip/quality/75/format/webp'
        }
      }
    }
  }
}

export function initModule(sb) {}

const putInstance = function (ins) {
  instance = ins
}

const getImage = function (url, successCB, errorCB, opation) {
  if (
    window.cordova &&
    window.cordova.platformId == 'ios' &&
    window.cordova.plugins.imageTransfer
  ) {
    if (!opation) {
      opation = cordova.plugins.imageTransfer.CONSTANTS.SDWebImageRetryFailed
    }
    let secondError = function () {
      //尝试文件业务服务器下载
      successCB(url) //失败则返回原地址
    }
    instance.getImage(url, successCB, secondError, opation)

    //			var qiniuURL = parse2QiniuURL(url);
    //			var firstError = function(){ //尝试七牛下载
    //				var secondError = function(){//尝试文件业务服务器下载
    //					successCB(url);//仍然失败则返回原地址
    //				}
    //				instance.getImage(url, successCB, secondError,opation);
    //			}
    //			if(qiniuURL){
    //				instance.getImage(qiniuURL, successCB, firstError,opation);
    //			}else{
    //				successCB(url);
    //			}
  } else if (
    window.cordova &&
    window.cordova.platformId == 'android' &&
    window.cordova.plugins.imageTransfer
  ) {
    // if(!opation){
    // 	opation = cordova.plugins.imageTransfer.CONSTANTS.SDWebImageRetryFailed;
    // }

    successCB(url)

    //			var secondError = function(){//尝试文件业务服务器下载
    //				successCB(url);//失败则返回原地址
    //			}
    //			instance.getImage(url, successCB, secondError,opation);
    //			var qiniuURL = parse2QiniuURL(url);
    //			var firstError = function(){ //尝试七牛下载
    //				log.log("第一次回调失败");
    //				var secondError = function(){//尝试文件业务服务器下载
    //					log.log("第二次回调失败");
    //					successCB(url);//仍然失败则返回原地址
    //				}
    //				instance.getImage(url, successCB, secondError,opation);
    //			}
    //			if(qiniuURL){
    //				instance.getImage(qiniuURL, successCB, firstError,opation);
    //			}else{
    //				successCB(url);
    //			}
  } else {
    log.log(VJSNAME + '没有getImage的PC端方法实现')
    successCB(url)
  }
}

//将文件服务地址转换为七牛地址
function parse2QiniuURL(url) {
  let token = getParamByURL('token', url)
  let fileId = ''
  let src = ''
  if (token) {
    let deCodeToken = decodeURIComponent(token)
    let tokenObject = JSON.parse(deCodeToken)
    let fileId = tokenObject.data.dataId
  }
  if (fileId) {
    let QniuImgFormat =
      IMGFROMAt.qiniu.yindangu.yunrooms.publicroom.styleDefault
    src = QniuImgFormat.replace('fileId', fileId)
  }
  return src
}

function getParamByURL(paramName, url) {
  let reg = new RegExp('(^|&)' + paramName + '=([^&]*)(&|$)', 'i')
  let r = url.match(reg)
  if (r != null) return unescape(r[2])
  return null
}

export { getImage, putInstance }
