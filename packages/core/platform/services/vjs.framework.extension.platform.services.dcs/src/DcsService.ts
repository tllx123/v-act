import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { History as history } from '@v-act/vjs.framework.extension.platform.services.browser.history'
import { RemoteOperation as operation } from '@v-act/vjs.framework.extension.platform.services.domain.operation'
import { FileUtil as fileUtil } from '@v-act/vjs.framework.extension.platform.services.native.mobile.fileoperation'
import { FileTransfer } from '@v-act/vjs.framework.extension.platform.services.native.mobile.filetransfer'
import { PlayVideo as playVideoService } from '@v-act/vjs.framework.extension.platform.services.native.mobile.playvideo'
import { RemoteOperation as remoteOperation } from '@v-act/vjs.framework.extension.platform.services.operation.remote.base'
import { ProgressBarUtil } from '@v-act/vjs.framework.extension.ui.common.plugin.services.progressbar'
import { StringUtil as stringUtil } from '@v-act/vjs.framework.extension.util.string'

/**
 * 文档转换服务
 * @param fileId   <String>      mongodb 文件ID
 * @param successCB<Function>    成功回调  回调入参：{"preViewfileUrl":"xxx"}
 * @param errorCB  <Function>    失败回调  回调入参：{"errorMsg":"xxx"}
 */
let conversionByFileId = function (mongodbFileId, successCB, errorCB) {
  let host = location.href.substring(
    0,
    location.href.indexOf('module-operation')
  )
  if (window.GlobalVariables) {
    host = window.GlobalVariables.getServerUrl() + '/'
  }
  let ajaxUrl = host + 'module-operation!executeOperation?operation=DcsUpload'
  let successCallback = function (data) {
    if (typeof successCB == 'function') {
      if (data && data.responseText) {
        let rs = JSON.parse(data.responseText)
        if (rs.success == true) {
          if (!stringUtil.startsWith('http', rs.preViewfileUrl)) {
            rs.preViewfileUrl = host + rs.preViewfileUrl
          }
          successCB(rs)
        } else {
          errorCB(rs.errorMsg)
        }
      }
    }
  }
  let errorCallback = function () {
    if (typeof errorCB == 'function') {
      errorCB(data)
    }
  }

  //兼容谷歌浏览器32.0.1700.107版本，如果是此版本，则平台预览方案除了pdf，都走永中
  let isChromeLowVersion = getChromeVersion()
  let chromeVersion88 = false
  if (88 == isChromeLowVersion) {
    chromeVersion88 = true
  }

  remoteOperation.orginalRequest({
    host: ajaxUrl,
    param: { fileId: mongodbFileId, isChromeVersion88: chromeVersion88 },
    isAsync: true,
    afterResponse: successCallback,
    error: errorCallback
  })
}

// 获取谷歌浏览器版本
function getChromeVersion() {
  let arr = navigator.userAgent.split(' ')
  let chromeVersion = ''
  for (let i = 0; i < arr.length; i++) {
    if (/chrome/i.test(arr[i])) chromeVersion = arr[i]
  }
  if (chromeVersion) {
    return Number(chromeVersion.split('/')[1].split('.')[0])
  } else {
    return false
  }
}

/**
 * 根据文件ID预览文件（打开页面）
 * @param fileId   <String>      mongodb 文件ID
 */
let previewByFileId = function (mongodbFileId, successCB, errorCB) {
  insertPreviewHTML2Body()
  if (typeof successCB != 'function') {
    successCB = function () {}
  }
  if (typeof errorCB != 'function') {
    errorCB = function () {}
  }
  let getFileInfoCB = function (fileName) {
    fileName = fileName.replace(/\s+/g, '')
    let fileType = getFileType(fileName)
    if ('img' == fileType) {
      addHistory()
      previewImage(mongodbFileId, fileName, successCB, errorCB)
    } else if ('video' == fileType) {
      //Android && ios 视频处理
      //				previewVideo(_data);
      alert('暂不支持视频播放')
    } else if ('audio' == fileType) {
      //Android && ios 音频处理
      //				previewAudio(mongodbFileId);
      alert('暂不支持音频播放')
    } else {
      addHistory()
      previewFile(mongodbFileId, fileName, successCB, errorCB)
    }
  }
  let getFileInfoExp = 'GetFileInfo("' + mongodbFileId + '","fileName")'
  executeExpression(getFileInfoExp, getFileInfoCB)
}

let addHistory = function () {
  //添加历史记录
  let preScopeId = scopeManager.getWindowScope().getInstanceId()
  let newScopeId = scopeManager.createWindowScope({
    parentScopeId: preScopeId,
    componentCode: 'tmpCom',
    windowCode: 'tmpWin',
    series: 'bootstrap_mobile'
  })
  let closeCB = function () {
    $('#file_preview_min').remove()
    if (window.StatusBar) {
      window.StatusBar.styleDefault()
    }
  }
  let historyParams = {
    callback: (function (sId, ck) {
      return function () {
        scopeManager.openScope(sId)
        var ret = window.history._$v3PlatformReturnValues
        window.history._$v3PlatformReturnValues = null
        ck(ret)
        scopeManager.destroy(newScopeId)
        scopeManager.closeScope()
      }
    })(newScopeId, closeCB),
    currentScopeId: newScopeId,
    title: document.title
  }
  history.addHistory(historyParams)
}

let previewImage = function (fileId, fileName, successCB, errorCB) {
  let imgSrc = getImageSrc(fileId)
  let mobileType = getDeviceType()
  if (window.StatusBar) {
    window.StatusBar.styleBlackTranslucent()
  }
  let imgElId = fileId
  let imgEl =
    '<section id=' +
    imgElId +
    'imgScan class ="picBrower pswp">' +
    '<div class="pswp__bg"></div>' +
    '<div class="pswp__scroll-wrap">' +
    '<div class="pswp__container" area-container = true>' +
    '<div class="pswp__item"></div>' +
    '<div class="pswp__item"></div>' +
    '<div class="pswp__item"></div>' +
    '</div>' +
    '</div>' +
    '</section>'
  $('#file_preview_menu_button').hide() //隐藏右上角...菜单
  $('#file_preview_file_name').text(fileName)
  $('#file_preview_min').find('#file_preview').css('height', '100%')
  $('#file_preview_min').show().find('#file_preview div').html(imgEl)
  $('#file_preview_min').addClass('img') //预览图片时效果

  if (mobileType.isIos) {
    if (mobileType.isWechat) {
      $('#file_preview_min').find('#file_preview').css({
        'height': 'calc(100% - 120px)',
        'width': ' 1px',
        'min-width': '100%',
        '*width': '100%'
      })
    } else {
      $('#preview_p').css({ padding: '15px 15px' })
      $('#file_preview_min').find('#file_preview').css({
        'height': 'calc(100% - 60px)',
        'width': ' 1px',
        'min-width': '100%',
        '*width': '100%',
        'top': '60px'
      })
    }
  }
  imgEl = $("<img src='" + imgSrc + "'>")
  let imgObj = new Image()
  imgObj.src = imgEl.attr('src')
  imgObj.onload = function () {
    imgScan(imgElId, imgEl[0], imgSrc)
    successCB()
  }
}

let imgScan = function (id, imgEl, imgSrc) {
  let options = {
    modal: false,
    closeOnScroll: false,
    closeOnVerticalDrag: false,
    fullscreenEl: false,
    history: false,
    index: 0,
    loop: false,
    pinchToClose: false,
    scaleMode: 'fit',
    shareEl: false
  }
  let items = [
    {
      src: imgSrc,
      w: imgEl.naturalWidth,
      h: imgEl.naturalHeight
    }
  ]
  let el = $('#' + id + 'imgScan')[0]
  let ImgBrower = new PhotoSwipe(el, false, items, options)

  setTimeout(function () {
    ImgBrower.init()
  }, 300)
}

let previewVideo = function (_data) {
  let mobileType = getDeviceType()
  if (mobileType.isAPP) {
    playVideo(_data)
  } else {
    alert('视频播放目前仅支持移动App端')
  }
}

let playVideo = function (_data) {
  //Android&&ios 视频处理
  let mobileType = getDeviceType()
  let videoSuccess = function (successMsg) {}
  let videoFail = function (errorMsg) {
    console.warn(errorMsg)
  }
  if (mobileType.isAndroid) {
    this.getFileUrl(_data.fileId, function (url) {
      let path = window.GlobalVariables
        ? GlobalVariables.getServerUrl() + '/' + url.data.result
        : url.data.result
      playVideoService.openVideoPlayer(
        path,
        _data.fileName,
        videoSuccess,
        videoFail
      )
    })
  }
  if (mobileType.isIos) {
    let isDownLoad = fileUtil.checkFileIsExist(_data.fileId)
    if (!isDownLoad) {
      window.showProgress('下载中,请稍候...')
      let success = function (path) {
        ProgressBarUtil.hideProgress()
        playVideoService.openVideoPlayerByFileId(
          _data.fileId,
          _data.fileName,
          videoSuccess,
          videoFail
        )
      }
      let error = function (code) {
        ProgressBarUtil.hideProgress()
        console.warn(code)
      }
      let onProgress =
        FileTransfer.supportOnProgress() == true
          ? function (progressEvent) {
              var num = progressEvent.loaded / _data.fileSize
              window.showProgress(
                '下载中,请稍候(' +
                  change(progressEvent.loaded) +
                  ' / ' +
                  change(_data.fileSize) +
                  ')'
              )
              if (num === 1) {
                ProgressBarUtil.hideProgress()
              }
            }
          : undefined
      FileTransfer.filetransferDownload(
        _data.fileId,
        _data.fileName,
        success,
        error,
        onProgress
      )
    } else {
      playVideoService.openVideoPlayerByFileId(
        _data.fileId,
        _data.fileName,
        videoSuccess,
        videoFail
      )
    }
  }
}

//文件大小转换
function change(limit) {
  let size = ''
  if (limit < 0.1 * 1024) {
    //小于0.1KB，则转化成B
    size = limit.toFixed(2) + 'B'
  } else if (limit < 0.1 * 1024 * 1024) {
    //小于0.1MB，则转化成KB
    size = (limit / 1024).toFixed(2) + 'KB'
  } else if (limit < 0.1 * 1024 * 1024 * 1024) {
    //小于0.1GB，则转化成MB
    size = (limit / (1024 * 1024)).toFixed(2) + 'MB'
  } else {
    //其他转化成GB
    size = (limit / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
  }

  let sizeStr = size + '' //转成字符串
  let index = sizeStr.indexOf('.') //获取小数点处的索引
  let dou = sizeStr.substr(index + 1, 2) //获取小数点后两位的值
  if (dou == '00') {
    //判断后两位是否为00，如果是则删除00
    return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2)
  }
  return size
}

let newLimit = change(1048576)
console.log(newLimit)

let previewAudio = function () {
  if (mobileType.isAPP) {
    let el = $('#' + gloabalCode + '_par')
      .find('#' + _data.fileId)
      .parent()
    $audioPlay.call(this, _data, el)
  }
}

let previewFile = function (mongodbFileId, fileName, successCB, errorCB) {
  $('#file_preview_min').removeClass('img')
  let mobileType = getDeviceType()
  conversionByFileId(
    mongodbFileId,
    function (info) {
      if (window.StatusBar) {
        window.StatusBar.styleBlackTranslucent()
      }
      if (info.success && info.preViewfileUrl) {
        if (!mobileType.isAPP && mobileType.isAndroid) {
          // ANDROID NOT APP
          let ifame =
            '<iframe sandbox="allow-forms allow-popups allow-scripts allow-same-origin " seamless src="' +
            info.preViewfileUrl +
            "\" style='border: none;' width='100%' height='100%'></iframe>"
          $('#file_preview_file_name').text(fileName)
          $('#file_preview_min')
            .appendTo('body')
            .show()
            .data('fileInfo', 'data')
            .find('#file_preview div')
            .html(ifame)
        } else {
          let ifame =
            "<iframe style='border: none;width: 1px; min-width: 100%;height: 1px; min-height: 100%; *width: 100%;' scrolling='no' sandbox=\"allow-forms allow-popups allow-scripts allow-same-origin \" seamless src=\"" +
            info.preViewfileUrl +
            "\" width='100%' height='100%'></iframe>"
          $('#file_preview_file_name').text(fileName)
          $('#file_preview_min')
            .show()
            .data('fileInfo', 'data')
            .find('#file_preview div')
            .html(ifame)
          //ios空出电量栏的位置，否则高度超出
          if (mobileType.isIos && mobileType.isAPP) {
            $('#preview_p').css({ padding: '15px 15px' })
            $('#file_preview_min').find('#file_preview').css({
              'height': 'calc(100% - 60px)',
              'width': ' 1px',
              'min-width': '100%',
              '*width': '100%',
              'top': '60px'
            })
          }
        }
        successCB(info)
      } else {
        let msg = info.errorMsg
        errorCB(msg)
      }
    },
    function (error) {
      let msg = error.errorMsg
      errorCB(msg)
      console.warn(msg)
    }
  )
}

let getDeviceType = function () {
  let mobileType = {}
  mobileType.isDingDing =
    navigator.userAgent.toLowerCase().match(/dingtalk/i) == 'dingtalk'
  mobileType.isWechat =
    navigator.userAgent.toLowerCase().match(/MicroMessenger/i) ==
    'micromessenger'
  let appReg = /[(]{1}[\d]+[)]{1}$/ //ios app，仅用VJSBridge在使用打开链接跳转时无法判断
  mobileType.isAPP =
    (window.VJSBridge || appReg.test(navigator.userAgent)) &&
    !mobileType.isWechat
  mobileType.isIos = !!navigator.userAgent.match(
    /\(i[^;]+;( U;)? CPU.+Mac OS X/
  )
  mobileType.isNewIosApp =
    mobileType.isAPP &&
    mobileType.isIos &&
    mobileType.isAPP.platform &&
    mobileType.isAPP.platform.toLowerCase() == 'ios'
  mobileType.isAndroid =
    navigator.userAgent.indexOf('Android') > -1 ||
    navigator.userAgent.indexOf('Adr') > -1
  return mobileType
}

let insertPreviewHTML2Body = function () {
  let mobileType = getDeviceType()

  let iframeHTML =
    '<div style="background-color: #eee;display: none;position: absolute;top: 0px;left: 0px;right: 0px;bottom: 0;z-index: 10;opacity: 1;" id="file_preview_min">'
  iframeHTML += '<div style="width: 100%;">'
  iframeHTML +=
    '<div id="preview_p" style="display: -webkit-box;display: -webkit-flex;display: flex;line-height: 45px;text-align: center;padding: 0 15px;color: #fff;background-color: #202020;font-size: 18px;">'
  iframeHTML +=
    '<span class="iconfont icon-back" data-type="back" id="file_preview_exit_button"></span>'
  iframeHTML +=
    '<span data-type="file_name" id="file_preview_file_name" style="-webkit-box-flex: 1;box-flex: 1;flex: 1;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;"></span>'
  iframeHTML +=
    '<span style="font-family: "iconfont" !important;font-size: 16px;font-style: normal;-webkit-font-smoothing: antialiased;box-sizing: border-box;" data-type="menu" id="file_preview_menu_button"></span>'
  iframeHTML += '</div>'
  iframeHTML += '</div>'
  iframeHTML +=
    '<div id="file_preview" style="position: absolute;height: calc(100% - 45px);top: 45px;bottom: 0;left: 0;right: 0;overflow: hidden;">'
  iframeHTML += '<div id="file_preview_window" style="height: 100%;"></div>'
  iframeHTML += '</div>'
  iframeHTML += '</div>'
  $('body').append(iframeHTML)
  if (mobileType.isAPP && mobileType.isIos) {
    $('#file_preview_min').addClass('v_APP')
  }
  //退出附件预览页面
  $('#file_preview_exit_button').bind('click', function () {
    //			$("#file_preview_min").remove();
    window.history.back()
    if (window.StatusBar) {
      window.StatusBar.styleDefault()
    }
  })
}

let getFileType = function (fileName) {
  let isImg = /(gif|jpeg|jpg|png)$/gi.test(fileName)
  let isVideo = /(flv|gif|mov|mp4|avi)$/gi.test(fileName)
  let isAudio = /(amr|ape|mp3|ogg|wav|wma)$/gi.test(fileName)
  if (isImg === true) {
    return 'img'
  } else if (isVideo === true) {
    return 'video'
  } else if (isAudio === true) {
    return 'audio'
  } else {
    return 'other'
  }
}

//根据文件ID拼装成文件下载地址(兼容App端)
let getImageSrc = function (src) {
  if (src != null) {
    let result =
      'module-operation!executeOperation?operation=FileDown&token=%7B%22data%22%3A%7B%22dataId%22%3A%22' +
      src +
      '%22%2C%22ImageObj%22%3A%22' +
      src +
      '%22%7D%7D'
    if (window.GlobalVariables) {
      result = GlobalVariables.getServerUrl() + '/' + result
    }
    return result
  } else {
    return ''
  }
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
    isAsync: true,
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

export { conversionByFileId, previewByFileId }
