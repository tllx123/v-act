import * as $ from 'jquery'

export * as ExceptionFactory from './api/ExceptionFactory'

var addFile = function (file) {
  $('.panelTips').hide()
  var html = []
  html.push('<div class="attachmentItem" id="' + file.id + '">')
  html.push('<a class="name" id="a_' + file.id + '" title="' + file.name + '">')
  html.push('<span>' + file.name + '</span>')
  html.push('</a>')
  html.push('<div class="precessBar" id="processBar_' + file.id + '">')
  html.push('<div class="processBack" id="back_' + file.id + '"></div>')
  html.push('<div class="current" id="current_' + file.id + '"></div>')
  html.push('</div>')
  html.push('<span class="toolbar">')
  html.push(
    '<i class="fa fa-trash delBtn" aria-hidden="true" title="点击删除" onclick="deleteFile(\'' +
      file.id +
      '\')"></i>'
  )
  html.push('</span>')
  html.push('</div>')
  html = html.join('')
  $('#attachmentList').append(html)
}

var deleteFile = function (fileId) {
  if (confirm('确认删除？')) {
    $('#' + fileId).remove()
    if (window._$uploader) {
      var files = window._$uploader.files
      var file
      for (var i = 0, l = files.length; i < l; i++) {
        if (files[i].id == fileId) {
          file = files[i]
          break
        }
      }
      if (file) {
        window._$uploader.removeFile(file)
      }
    }
  }
  if ($('.attachmentItem').length == 0) {
    $('.panelTips').show()
  }
}

var getUrlById = function (fileId, fileName) {
  var token = {
    data: {
      isMulti: false,
      dataId: fileId
    }
  }
  if (fileName) {
    if (fileName.indexOf('.') != -1) {
      //后台会自动拼后缀名
      fileName = fileName.substring(0, fileName.lastIndexOf('.'))
    }
    token.data.oldFileName = fileName
  }
  token = encodeURIComponent(JSON.stringify(token))
  return 'module-operation!executeOperation?operation=FileDown&token=' + token
}

var handleUploadErr = function (fileId, msg) {
  var err = msg ? msg : '上传失败，请删除后重试！'
  $('#processBar_' + fileId).remove()
  $('#' + fileId)
    .attr('title', err)
    .addClass('err')
  $('#a_' + fileId)
    .attr('title', err)
    .addClass('err')
}

var createIFrame = function (iframeId, url) {
  var iframeObj = document.getElementById(iframeId)
  if (iframeObj == null) {
    iframeObj = document.createElement('iframe')
    iframeObj.setAttribute('id', iframeId)
    iframeObj.setAttribute('style', 'display:none')
    document.body.appendChild(iframeObj)
  }
  iframeObj.setAttribute('src', url)
}

var download = function (fileId, fileName) {
  var download_url = 'module-operation!executeOperation?operation=FileDown'
  var token = {
    data: {
      isMulti: false,
      dataId: fileId
    }
  }
  if (fileName) {
    if (fileName.indexOf('.') != -1) {
      fileName = fileName.substring(0, fileName.lastIndexOf('.'))
    }
    token.data.oldFileName = fileName
  }
  var prefix = download_url.indexOf('?') == -1 ? '?' : '&'
  var url = download_url + prefix + 'token=' + JSON.stringify(token)
  createIFrame('file_down_iframe', url)
}

var sendImageFile = function (files) {
  var data = new FormData()
  if (Object.prototype.toString.call(files[0]) === '[object Blob]') {
    data.append('image', files[0], 'image.png')
  } else {
    data.append('image', files[0], 'image.png')
  }
  $.ajax({
    data: data,
    type: 'POST',
    url: 'module-operation!executeOperation?operation=FileUpload',
    cache: false,
    contentType: false,
    processData: false,
    dataType: 'json',
    success: function (data) {
      var fileUrl = getUrlById(data.id)
      $('#editor')
        .eq(0)
        .summernote('insertImage', fileUrl, function ($image) {
          $image.attr('v3-res', 'true')
          $image.attr('v3-res-type', 'img')
          $image.attr('v3-res-id', data.id)
        })
      if ($('#editor').find(' .note-editable.panel-body').html() == '<p></p>') {
        $('#editor').find(' .note-editable.panel-body').html('')
      }
    },
    error: function () {
      alert('粘贴图片失败！')
    }
  })
}

var isIE = function () {
  return (
    (navigator.appName == 'Microsoft Internet Explorer' && !isOpera()) ||
    navigator.userAgent.indexOf('Trident/') != -1
  )
}

var toExceptionPlatformUrl = function (url) {
  return 'http://exdb-service.t.yindangu.com/' + url
}

var initUploader = function () {
  var conf = {
    browse_button: 'uploadBtn',
    drop_element: 'attachmentList',
    runtimes: 'html5,silverlight,html4',
    url: 'module-operation!executeOperation?operation=FileUpload&ajaxRequest=true',
    //        chunk_size: '5000mb',
    dragdrop: true,
    unique_names: true,
    flash_swf_url: './script/plupload/Moxie.swf',
    silverlight_xap_url: './script/plupload/Moxie.xap'
  }
  var uploader = new plupload.Uploader(conf)
  uploader.bind('Init', function (up, params) {
    let target = $('#uploadPanel')
    if (uploader.features.dragdrop) {
      target.on('dragover', function (event) {
        $(this).addClass('dragover')
      })
      target.on('dragenter', function () {
        $(this).addClass('dragover')
      })
      target.on('dragleave', function () {
        $(this).removeClass('dragover')
      })
      target.on('drop', function () {
        $(this).removeClass('dragover')
      })
    } else {
      target.html('')
    }
  })
  uploader.bind('FilesAdded', function (up, files) {
    plupload.each(files, function (file) {
      addFile(file)
    })
    up.start()
  })
  uploader.bind('UploadProgress', function (up, file) {
    let id = file.id
    let w = $('#back_' + id).width()
    let width = (w * file.percent) / 100
    $('#current_' + id).width(width)
  })
  uploader.bind('FileUploaded', function (up, file, result) {
    if (result.status == 200) {
      $('#processBar_' + file.id).remove()
      let resObj = JSON.parse(result.response)
      if (resObj.success === false) {
        handleUploadErr(file.id, resObj.msg)
      } else {
        $('#a_' + file.id).attr({
          'href':
            "javascript:download('" + resObj.id + "','" + file.name + "')",
          'v3-res-id': resObj.id,
          'v3-res-name': file.name
        })
      }
    } else {
      handleUploadErr(file.id)
    }
  })
  uploader.bind('Error', function (up) {
    $('.attachmentItem').each(function (index, item) {
      let fileId = $(item).attr('id')
      handleUploadErr(fileId)
    })
  })
  uploader.init()
  return uploader
}

var checkAttachmentUploaded = function () {
  if (window._$uploader && window._$uploader.files) {
    var files = window._$uploader.files
    for (var i = 0, l = files.length; i < l; i++) {
      var file = files[i]
      if (file.status != 5) {
        return false
      }
    }
  }
  return true
}

var msgAlert = function (msg) {
  alert(msg)
}

var genAttachmentContent = function () {
  var res = {
    attachmentIds: [],
    content: ''
  }
  var resElList = $('#attachmentList').find('[v3-res-id]')
  if (resElList.length > 0) {
    var contentList = ["<p v3-res-panel='true'><h3>附件列表</h3><ol>"]
    resElList.each(function (i, item) {
      let el = $(item)
      let resId = el.attr('v3-res-id')
      let resName = el.attr('v3-res-name')
      res.attachmentIds.push(resId)
      contentList.push('<li>')
      contentList.push("<a v3-res='true' href='")
      contentList.push(toExceptionPlatformUrl(getUrlById(resId, resName)))
      contentList.push("'>")
      contentList.push(resName)
      contentList.push('</a>')
      contentList.push('</li>')
    })
    contentList.push('</ol></p>')
    res.content = contentList.join('')
  }
  return res
}

var exceptionSerialNumber = null

var showErrorMessage = function () {
  try {
    var href = window.location.href
    var queryStr = href.split('#')[0].split('?')[1]
    if (queryStr) {
      var cbName
      var pairList = queryStr.split('&')
      for (var i = 0, l = pairList.length; i < l; i++) {
        var pair = pairList[i].split('=')
        if (pair[0] == 'cb') {
          cbName = pair[1]
          break
        }
      }
      if (cbName) {
        $('.container').removeClass('hide')
        $('.miss_content').addClass('hide')
        var errJson = window.opener[cbName]()
        vds.config({})
        vds.ready(function () {
          let sandBox = vds.sandbox.create({
            extensions: [
              'vjs.framework.extension.platform.interface.exception',
              'vjs.framework.extension.platform.interface.domain.window.skin.common'
            ] //样式vjs
          })
          sandBox.active().done(function () {
            let exceptionFactory = sandBox.getService(
              'vjs.framework.extension.platform.interface.exception.ExceptionFactory'
            )
            let exception = exceptionFactory.unSerialize(errJson)
            exceptionSerialNumber = exception.getErrorNo()
            exception.setContainerId('errMsg')
            exception.hideFeeback()
            exception.markUnSubmit()
            exception.markViewonly() /* 标记异常为预览模式，因为反馈页面需要的异常弹框dom结构不一样 */
            let exceptionHandler = sandBox.getService(
              'vjs.framework.extension.platform.interface.exception.ExceptionHandler'
            )
            exceptionHandler.handle(exception)
          })
        })
      } else {
        showError()
      }
    } else {
      showError()
    }
  } catch (e) {
    showError()
  }
}
var showError = function () {
  $('.container').addClass('hide')
  $('.miss_content').removeClass('hide')
}
$(document).ready(function () {
  showErrorMessage()
  let height = $('#editor').height()
  $('#editor').summernote({
    /*toolbar: [
            ['style', ['style']],
            ['font', ['bold', 'underline', 'clear']],
            ['fontname', ['fontname']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['table', ['table']],
            ['view', ['codeview', 'help']]
        ],*/
    disableResizeEditor: true,
    disableDragAndDrop: true,
    focus: true,
    height: height - 57,
    lang: 'zh-CN',
    callbacks: {
      onImageUpload: function (files) {
        sendImageFile(files)
      },
      onPaste: function (ne) {
        if (isIE()) {
          var files = (
            (ne.originalEvent || ne).clipboardData || window.clipboardData
          ).files
          if (files.length !== 0) {
            event.preventDefault()
            event.stopPropagation()
            sendImageFile(files)
          }
          return
        }
        var clipboardData =
          (ne.originalEvent || ne).clipboardData || window.clipboardData
        var isImage = false
        if (clipboardData.items) {
          var items = clipboardData.items,
            len = items.length
          event.preventDefault()
          for (var i = 0; i < len; i++) {
            if (items[i].type.indexOf('image') !== -1) {
              isImage = true
              break
            }
          }
          if (isImage) return
        }
        var bufferText = clipboardData.getData('Text/plain')
        ne.preventDefault ? ne.preventDefault() : (ne.returnValue = false)
        setTimeout(function () {
          document.execCommand('insertText', false, bufferText)
        }, 10)
      }
    }
  })
  window._$uploader = initUploader()
  $('.submitBtn').on('click', function () {
    if (checkAttachmentUploaded()) {
      let attachmentIds = []
      let content = ''
      let code = $('#editor').summernote('code').trim()
      if (code.length > 0) {
        let dom = $('<div>' + code + '</div>')
        dom.find('[v3-res]').each(function (i, item) {
          let el = $(item)
          attachmentIds.push(el.attr('v3-res-id'))
          let resType = el.attr('v3-res-type')
          if (resType == 'img') {
            el.attr('src', toExceptionPlatformUrl(el.attr('src')))
          }
        })
        content += dom[0].innerHTML
      }
      let attachObj = genAttachmentContent()
      attachmentIds = attachmentIds.concat(attachObj.attachmentIds)
      content += attachObj.content
      if (
        content.length == 0 ||
        content == '<p><br></p>' ||
        content == '<br>'
      ) {
        msgAlert('请输入问题描述信息！')
      } else {
        $(this).attr('disabled', 'true').text('正在提交')
        let json = JSON.stringify({
          exceptionSerialNumber: exceptionSerialNumber,
          content: content,
          attachmentIds: attachmentIds
        })
        $.post('../../../../module-operation!executeOperation?operation=Form', {
          ajaxRequest: true,
          token: encodeURIComponent(
            JSON.stringify({
              data: {
                type: 'feeback',
                operation: 'FrontendException',
                windowCode: null, //设置窗体Code，防止接口里设置导致走权限校验
                detail: json
              }
            })
          )
        })
          .success(function () {
            $('.submitBtn').removeAttr('disabled').text('提交反馈')
            msgAlert('反馈成功！')
            window.close()
          })
          .error(function () {
            $('.submitBtn').removeAttr('disabled').text('提交反馈')
            msgAlert('反馈失败，请重试！')
          })
      }
    } else {
      msgAlert('请等待附件上传成功后再提交！')
    }
  })
})
