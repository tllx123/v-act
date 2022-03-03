import { ProgressBarUtil as progressbar } from '@v-act/vjs.framework.extension.ui.common.plugin.services.progressbar'
import { config as sdkConfigService } from '@v-act/vjs.framework.extension.platform.service.native.sdk'
import { Filetransfer as h5FileTransfer } from '@v-act/vjs.framework.extension.platform.native.h5'

let undefined
let undefined

exports.initModule = function (sb) {}

function getHost() {
  //上传服务器地址
  let host = ''
  if (window.GlobalVariables) {
    host = GlobalVariables.getServerPath() + '/'
  } else {
    let url = window.location.href.split('/module-operation!executeOperation')
    if (url[0]) {
      host = url[0]
    }
  }
  host =
    host +
    '/module-operation!executeOperation?operation=DownloadDingdingPictureService'
  return host
}

const uploadFiles = function (element, callback, config) {
  //仅当useCamera为true，fileMimeType为image/*或fileType里面没有jpg，png，jpeg之外的元素时生效。

  sdkConfigService.initConfig(
    function () {
      $('#' + element).click(function () {
        dd.biz.util.uploadImageFromCamera({
          compression: true,
          onSuccess: function (result) {
            alert(JSON.stringify(result))
            if (result instanceof Array && result.length > 0) {
              //								alert("开始上传，请求地址：" + getHost());
              $.ajax({
                url: getHost(),
                data: {
                  url: result[0]
                },
                dataType: 'json',
                success: function (res) {
                  //										alert('上传成功：' + JSON.stringify(res));
                  if (true == res.success) {
                    callback([
                      {
                        id: res.fileId,
                        fileSize: res.fileSize,
                        oldFileName: res.oldFileName
                      }
                    ])
                  } else {
                    alert('上传失败')
                  }
                },
                error: function () {
                  alert('上传失败')
                }
              })
            }
          }
        })
      })
    },
    function (error) {
      h5FileTransfer.uploadFiles(element, callback, config)
    }
  )
}

export { uploadFiles }
