import { platform as i18n } from '@v-act/vjs.framework.extension.platform.interface.i18n'

let sandbox,
  modalCode = 'error_modal_div'

let errorStack = []

exports.initModule = function (sb) {
  sandbox = sb
}
/**
 * 去除重复的，如果错误信息一样，则合并
 */
let _removeRepeat = function () {
  if (errorStack.length > 1) {
    let msg = null,
      indexs = []
    for (let i = 0; i < errorStack.length; i++) {
      let params = errorStack[i]
      if (msg !== params.msg) {
        msg = params.msg
      } else {
        indexs.push(i)
      }
    }
    if (indexs.length > 0) {
      for (let i = 0; i < indexs.length; i++) {
        let index = indexs[i]
        errorStack.splice(index - i, 1)
      }
    }
  }
}

let _show = function () {
  let dialog = $('#' + modalCode)
  if (!dialog.is(':hidden')) {
    //当前没有异常提示框显示
    if (dialog.size() < 1) {
      //初始化异常提示框
      _initDialog()
    }
    if (errorStack.length > 0) {
      let params = errorStack.shift()
      _modifyDialog(params)
      _showDialog()
    }
  }
}

/**
 * 初始化异常提示框：1、创建dom结构 2、绑定事件
 */
let _initDialog = function () {
  let html = getHtml()
  $('body').append(html)
  $('#' + modalCode + ' #toggle').click(function () {
    $(this)
      .toggleClass('active')
      .parents('.modal-footer')
      .next('.modal-extra')
      .toggleClass('in')
    let dom = $('#error-detail')
    let div = $('#' + modalCode + ' .modal-extra')
    if (dom.html() == '暂无信息' && div.hasClass('in')) {
      //出现滚动条
      div.css('paddingBottom', '16px')
    } else {
      div.css('paddingBottom', '0px')
    }
  })
}

/**
 * 修改异常提示框显示内容
 */
let _modifyDialog = function (params) {
  let title = params.title,
    msgHeader = params.msgHeader,
    msg = params.msg
      ? params.msg.replace("'", "\\'")
      : i18n.get('系统异常', '系统报错信息'),
    detail = params.detail
      ? params.detail.replace("'", "\\'")
      : i18n.get('暂无信息', '无报错信息')
  let dialog = $('#' + modalCode)
  dialog.find('#error-title').html(title)
  dialog.find('#error-msgHeader').html(msgHeader)
  dialog.find('#error-msg').html(msg)
  dialog.find('#error-detail').html(detail)
  $('#' + modalCode + ' .modal-extra')
    .removeClass('in')
    .css('padding-bottom', '0px')
  $('#' + modalCode + ' #toggle').removeClass('active')
  _bindCloseLogic(params)
}

/**
 * 显示异常提示框
 */
let _showDialog = function () {
  let modal = $('#' + modalCode + ' .modal')
  modal.css('marginTop', '-' + modal.height() / 2 + 'px')
  modal.show(0, function () {
    $('#' + modalCode + ' .modal').addClass('in')
  })
  $('#' + modalCode + ' #modal-mask').show(0, function () {
    $('#' + modalCode + ' #modal-mask').addClass('in')
  })
}

/**
 * 绑定关闭逻辑
 */
let _bindCloseLogic = function (params) {
  let close = params.callback
  let closeFun = (function (callback) {
    return function () {
      $('#' + modalCode + ' .modal').removeClass('in')
      transEndEvent($('#' + modalCode + ' .modal'))
      $('#' + modalCode + ' #modal-mask').removeClass('in')
      transEndEvent($('#' + modalCode + ' #modal-mask'))
      $('#' + modalCode + ' #toggle').removeClass('active')
      if (typeof callback == 'function') {
        callback()
      }
      _show()
      //				Environment = sandbox.getService("vjs.framework.extension.platform.interface.environment.Environment");
      let _isIE = function () {
        function isOpera() {
          return (
            navigator.appName == 'Opera' ||
            navigator.userAgent.indexOf('Opera') != -1
          )
        }
        return (
          (navigator.appName == 'Microsoft Internet Explorer' && !isOpera()) ||
          navigator.userAgent.indexOf('Trident/') != -1
        )
      }
      let isIE = _isIE()
      if (isIE) {
        $('#' + modalCode + ' .modal.fade')[0].style.display = 'none'
        $('#' + modalCode + ' .modal-mask.fade')[0].style.display = 'none'
      }
      //				var userAgent = navigator.userAgent;
      //				var isOpera = userAgent.indexOf("Opera") > -1;
      //				if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
      //					$("body")[0].removeChild(document.getElementById(modalCode));
      //			    }
      //				var ie = !-[1,];
    }
  })(close)
  $('#' + modalCode)
    .find('.btn.btn-primary')
    .unbind('click')
    .on('click', closeFun)
  $('#' + modalCode)
    .find('.modal-header .btn-icon')
    .unbind('click')
    .on('click', closeFun)
  $('#' + modalCode + ' #modal-mask')
    .unbind('click')
    .click(closeFun)
}

const error = function (params) {
  errorStack.push(params)
  _removeRepeat()
  _show()
}

let getHtml = function () {
  let showD = i18n.get('显示详情', '报错弹框的显示详情')
  let html =
    '<div id="' +
    modalCode +
    '" class="front-end-alerter" style=""><div class="modal fade">' +
    '<div class="modal-header">' +
    '<h4 id="error-title"></h4>' +
    '<button class="btn-icon iconfont icon-close1"></button>' +
    '</div>' +
    '<div class="modal-body">' +
    '<span class="icon icon-danger"><i class="iconfont icon-error"></i></span>' +
    '<h5 id="error-msgHeader"></h5>' +
    '<p id="error-msg"></p>' +
    '</div>' +
    '<div class="modal-footer clear">' +
    '<button class="btn btn-text toggle-extra" id="toggle" style="outline: none;">' +
    showD +
    '<i class="iconfont icon-unfold"></i>' +
    '</button>' +
    '<button class="btn btn-primary">' +
    i18n.get('确定', '报错弹框的确定按钮文字') +
    '</button>' +
    '</div>' +
    '<div class="modal-extra">' +
    '<div class="extra-cont">' +
    '<pre id="error-detail"></pre>' +
    '</div>' +
    '</div>' +
    '</div><div class="modal-mask fade" id="modal-mask"></div></div>'
  return html
}

let transEndEvent = function (obj) {
  obj.on('transitionend', function () {
    let isShow = $(this).hasClass('in')
    if (!isShow) {
      $(this).hide()
    }
  })
}

export { error }
