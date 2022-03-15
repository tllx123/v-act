import { ProgressBarUtil as progressbar } from '@v-act/vjs.framework.extension.ui.common.plugin.services.progressbar'

function getHost() {
  //上传服务器地址
  let host = ''
  //@ts-ignore
  if (window.GlobalVariables) {
    //@ts-ignore
    host = GlobalVariables.getServerPath() + '/'
  } else {
    let url = window.location.href.split('/module-operation!executeOperation')
    if (url[0]) {
      host = url[0]
    }
  }
  host =
    host +
    '/module-operation!executeOperation?operation=FileUpload&ajaxRequest=true'
  return host
}

const uploadFiles = function (
  element: Element,
  callback: Function,
  config: Record<string, any>
) {
  let uploadUrl = getHost()
  let plUploadConfig: Record<string, any> = {
    //实例化一个plupload上传对象
    browse_button: element,
    url: uploadUrl,
    flash_swf_url: 'js/Moxie.swf',
    silverlight_xap_url: 'js/Moxie.xap'
  }
  //		if(config && config.filters)
  //			plUploadConfig.filters = config.filters ;

  if (config && config.fileType) {
    plUploadConfig.filters = {
      mime_types: [
        //只允许上传图片和zip文件
        { title: 'FileTypeFilter', extensions: config.fileType }
      ]
    }
  }

  if (config && config.multi_selection != undefined) {
    plUploadConfig.multi_selection = config.multi_selection == true
  } else {
    plUploadConfig.multi_selection = true
  }

  let uploader = new plupload.Uploader(plUploadConfig)
  if (config && config.useCamera) {
    uploader.useCamera = true
  }
  if (config && config.fileMimeType) {
    uploader.fileMimeType = config.fileMimeType
  }

  uploader.init() //初始化

  uploader.bind('Init', function (uploader: Record<string, any>) {})

  uploader.bind(
    'FilesAdded',
    function (uploader: Record<string, any>, files: Record<string, any>) {
      let fileSize = files.length
      if (fileSize > 0) {
        uploader.start()
      }
    }
  )

  uploader.bind(
    'BeforeUpload',
    function (uploader: Record<string, any>, file: Record<string, any>) {
      let loadingMsg = '正在上传'
      progressbar.showProgress(loadingMsg)
    }
  )

  uploader.bind(
    'UploadProgress',
    function (uploader: Record<string, any>, file: any) {
      debugger
      let queueProgress = uploader.total
      let percent = queueProgress.percent
      let loadingMsg = '正在上传(' + percent + '%)'
      progressbar.showProgress(loadingMsg)
    }
  )

  uploader.bind(
    'FileUploaded',
    function (
      uploader: Record<string, any>,
      file: Record<string, any>,
      responseObject: Record<string, any>
    ) {
      let rsStr = responseObject.response
      if (rsStr) {
        let rsObj = JSON.parse(rsStr)
        file.serverRes = rsObj
      }
    }
  )

  uploader.bind(
    'UploadComplete',
    function (uploader: Record<string, any>, files: Array<any>) {
      let result = []
      let tmpFile = undefined
      while ((tmpFile = files.pop()) != undefined) {
        result.push(tmpFile.serverRes)
      }
      window.console.log(result)
      if (typeof callback == 'function') {
        callback(result)
      }
      progressbar.hideProgress()
    }
  )

  uploader.bind('Error', function (uploader: Record<string, any>, error: any) {
    if (error && error.code == -601) {
      if (
        config.fileTypeErrorCB &&
        typeof config.fileTypeErrorCB == 'function'
      ) {
        config.fileTypeErrorCB({
          code: error.code,
          message: error.message,
          fileName: error.file ? error.file.name : ''
        })
      }
    }
  })
}

export { uploadFiles }
