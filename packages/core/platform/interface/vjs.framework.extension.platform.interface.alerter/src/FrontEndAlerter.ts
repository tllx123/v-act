import { Environment as environment } from '@v-act/vjs.framework.extension.platform.interface.environment'
import { Platform as i18n } from '@v-act/vjs.framework.extension.platform.interface.i18n'
import { ProgressBarUtil as progressBarUtil } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.progressbar'
import { uuid as uuidUtil } from '@v-act/vjs.framework.extension.util.uuid'
import { $ } from '@v-act/vjs.framework.extension.vendor.jquery'

environment.parseCssStr(
  '.front-end-alerter .modal-body{padding: 32px 32px 24px;}.front-end-alerter .modal-body .icon{position: absolute;left: 32px;top: 32px;width: 24px;height: 24px;line-height: 1;}.front-end-alerter .modal-body p, .front-end-alerter .modal-body h5{padding-left: 40px;color:#666;}.front-end-alerter .modal-body h5{font-weight: bold;}.modal-body>.error-msg{padding-top: 5px;line-height:2;max-height:160px;overflow:auto;}.front-end-alerter .modal-footer{padding: 0 32px 24px;border-top: 0;}.front-end-alerter .modal button{padding: 0 16px;}.front-end-alerter .modal-footer button{height: 32px;line-height: 32px;font-size:12px;}.front-end-alerter .modal{width:530px;}.front-end-alerter .modal-footer .toggle-extra{font-size:12px;padding: 0 28px 0 16px;height: 32px;line-height: 32px;float:right;}.front-end-alerter .modal-footer .toggle-extra>.icon-unfold{font-size:12px;right:46px;margin:0px;}.front-end-alerter .modal-extra.in{padding: 24px 0 0;}.front-end-alerter .modal-extra .extra-cont{padding: 0 32px;}'
)

let sandbox,
  modalCode = 'error_modal_div',
  isShowDialog = false
/* 存放各个容器是否存在弹窗，避免同一个容器多次弹窗导致异常信息覆盖 */
let dialogInfos = {}

let errorStack = []
//当前容器的异常信息 key：容器标识 value 异常信息 用于反馈问题页面获取异常信息
let currentErrorInfos = {}

const TYPE = {
  SYSTEM: 'SystemException', //系统异常弹框
  DEV: 'DevException', //环境异常弹框
  CONFIG: 'ConfigException', //配置异常弹框
  BUSINESS: 'BusinessException', //业务异常弹框
  LOGIN: 'LoginException' //登录异常
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

/**
 * 从弹框入参中获取弹框标识，若没有指定的容器id，则使用全局的弹框
 * 全局弹框和局部弹框互不影响
 * */
let _getModalIden = function (params) {
  let endfixed = params.containerId || ''
  return modalCode + endfixed
}
/**
 * 判断是否存在弹框
 * @param {Object} params 弹窗入参
 * */
let _existModal = function (iden) {
  return dialogInfos[iden] === true
}
/**
 * 标记弹窗
 * */
let _markModal = function (iden) {
  dialogInfos[iden] = true
}
/**
 * 取消弹窗标记
 * */
let _cancelModal = function (iden) {
  try {
    delete dialogInfos[iden]
  } catch (e) {}
}

let _show = function (params) {
  let iden = _getModalIden(params)
  let dialog = $('#' + iden)
  if (!dialog.is(':hidden')) {
    //当前没有异常提示框显示
    if (dialog.length < 1) {
      //初始化异常提示框
      _initDialog(params)
    }
    if (errorStack.length > 0) {
      let params = errorStack.shift()
      _modifyDialog(params)
      /* 弹窗显示前，重新设置弹框可操作的按钮：未登录异常的操作按钮跟其他异常的操作按钮不一致 */
      _changeDialogType(params)
      _showDialog(params)
    }
  }
  if (params.hideFeeback === true) {
    let containerId = params.containerId
    let $com = containerId ? $('#' + containerId) : $('body')
    $com.find('#' + iden + ' .modal-footer>button[btn-type="feedback"]').hide()
  }
}
/**
 * 判断是否属于登录异常
 * @params {Object} params 异常弹框入参
 * @returns {Boolean}
 * */
let _isLoginException = function (params) {
  return params.isLoginException === true
}
/**
 * 改变弹窗类型：登录异常弹框与其他异常弹框互转
 * */
let _changeDialogType = function (params) {
  let isLogin = params.isLoginException === true
  let containerId = params.containerId
  let $com = containerId ? $('#' + containerId) : $('body')
  $com.find('.modal-footer.clear>button').each(function (index, btn) {
    let $btn = $(btn)
    /*属于 登录异常且为确定按钮 或者 非登录异常且不为确定按钮 的状态，设置为显示  */
    if (
      ($btn.attr('login') === 'true' && isLogin) ||
      (!isLogin && $btn.attr('login') != 'true')
    ) {
      $btn.css('display', 'block')
    } else {
      $btn.css('display', 'none')
    }
  })
  $com
    .find('.modal.fade>i.icon-close')
    .css('display', isLogin ? 'none' : 'block')
}
function getCopyValue(e) {
  let t = e.text,
    n = void 0 === t ? '' : t,
    o = e.successTip,
    c = void 0 === o ? '复制成功' : o,
    u = e.errorTip,
    s = void 0 === u ? '复制失败' : u,
    l = e.success,
    d = e.error,
    f = e.showTip,
    p = void 0 === f || f,
    h = 'rtl' === document.documentElement.getAttribute('dir'),
    m = document.createElement('textarea')
  ;(m.style.fontSize = '12pt'),
    (m.style.border = '0'),
    (m.style.padding = '0'),
    (m.style.margin = '0'),
    (m.style.position = 'absolute'),
    (m.style[h ? 'right' : 'left'] = '-9999px')
  let v = window.pageYOffset || document.documentElement.scrollTop
  m.style.top = String(v) + 'px'
  m.setAttribute('readonly', '')
  m.value = n
  document.body.appendChild(m)
  ;(0, setCopyValue)(m)
  try {
    document.execCommand('copy')
    document.body.removeChild(m)
    l && l.call()
  } catch (e) {
    p && console.error(s)
    document.body.removeChild(m)
    d && d.call()
  }
}

function setCopyValue(e) {
  let t
  if ('SELECT' === e.nodeName) e.focus(), (t = e.value)
  else if ('INPUT' === e.nodeName || 'TEXTAREA' === e.nodeName) {
    let n = e.hasAttribute('readonly')
    n || e.setAttribute('readonly', ''),
      e.select(),
      e.setSelectionRange(0, e.value.length),
      n || e.removeAttribute('readonly'),
      (t = e.value)
  } else {
    e.hasAttribute('contenteditable') && e.focus()
    let i = window.getSelection(),
      r = document.createRange()
    r.selectNodeContents(e),
      i.removeAllRanges(),
      i.addRange(r),
      (t = i.toString())
  }

  return t
}

/**
 * 初始化异常提示框：1、创建dom结构 2、绑定事件
 */
let _initDialog = function (params) {
  let iden = _getModalIden(params)
  let html = getHtml(params)
  let containerId = params.containerId
  let $com = containerId ? $('#' + containerId) : $('body')
  $com.append(html)
  $com.find('#' + iden + ' #toggle' + iden).click(function () {
    $(this)
      .toggleClass('active')
      .parents('.modal-footer')
      .next('.modal-extra')
      .toggleClass('in')
    let dom = $('#error-detail' + iden)
    let div = $('#' + iden + ' .modal-extra')
    if (dom.html() == '暂无信息' && div.hasClass('in')) {
      //出现滚动条
      div.css('paddingBottom', '16px')
    } else {
      div.css('paddingBottom', '0px')
    }
  })
  let $feedback_btn = $com.find(
    '#' + iden + ' .modal-footer>button[btn-type="feedback"]'
  )
  $feedback_btn.on(
    'click',
    (function (_iden) {
      return function () {
        var uuid = 'cb_' + uuidUtil.generate()
        window[uuid] = function () {
          return (
            (currentErrorInfos &&
              currentErrorInfos[_iden] &&
              currentErrorInfos[_iden].exceptionMap) ||
            {}
          )
        }
        var url = 'itop/common/exception/feeback/index.html?cb=' + uuid
        window.open(url, uuid)
        getCloseFun(currentErrorInfos && currentErrorInfos[_iden])()
      }
    })(iden)
  )
  let $btn = $com.find(
    '#' + iden + ' .modal-footer>button[btn-type="copyDetail"]'
  )
  let text1 = i18n.get('复制详情', '报错弹框的复制详情按钮文字')
  let text2 = i18n.get('已复制', '报错弹框的复制详情按钮文字')
  $btn.on('click', function () {
    let copyValue = ''
    $btn.html(text2)
    $btn.attr('disabled', true)
    $btn.css('cursor', 'not-allowed')
    copyValue += $('#error-msgHeader' + iden).text() + '\n'
    copyValue += $('#error-msg' + iden).text() + '\n'
    copyValue += $('#error-detail' + iden + ' .err-abnormal')
      .text()
      .replace(/\*#/g, '\n')
    getCopyValue({
      text: copyValue
    })
    setTimeout(function () {
      $btn.html(text1)
      $btn.attr('disabled', false)
      $btn.css('cursor', 'pointer')
    }, 2000)
  })
}

/**
 * 修改异常提示框显示内容
 */
let _modifyDialog = function (params) {
  let iden = _getModalIden(params)
  let title = params.title,
    msgHeader = params.msgHeader,
    msg = params.msg
      ? params.msg.replace("'", "\\'")
      : i18n.get('系统异常', '系统报错信息'),
    detail = params.detail
      ? params.detail.replace("'", "\\'")
      : i18n.get('暂无信息', '无报错信息')
  let containerId = params.containerId
  let $com = containerId ? $('#' + containerId) : $('body')
  let dialog = $com.find('#' + iden)
  dialog.find('#error-title' + iden).html(title)
  dialog.find('#error-msgHeader' + iden).html(msgHeader)
  let contextPath = environment.getContextPath()
  let imgUrl =
    (contextPath ? contextPath : '') +
    '/itop/common/frontend/alerter/images/' +
    (params.type ? params.type : 'SystemException') +
    '.png'
  dialog.find('#error-img' + iden).attr('src', imgUrl)
  dialog.find('#error-msg' + iden).html(msg)
  dialog.find('#error-detail' + iden).html(detail)
  $('#' + iden + ' .modal-extra')
    .removeClass('in')
    .css('padding-bottom', '0px')
  $('#' + iden + ' #toggle' + iden).removeClass('active')
  _bindCloseLogic(params)
}

/**
 * 显示异常提示框
 */
let _showDialog = function (params) {
  let iden = _getModalIden(params)
  let modal = $('#' + iden + ' .modal')
  modal.css('marginTop', '-' + modal.height() / 2 + 'px')
  modal.show(0, function () {
    $('#' + iden + ' .modal').addClass('in')
  })
  $('#' + iden + ' #modal-mask' + iden).show(0, function () {
    $('#' + iden + ' #modal-mask' + iden).addClass('in')
  })
}

let getCloseFun = function (params) {
  let iden = _getModalIden(params)
  let close = params.callback
  let closeFun = (function (callback2, _iden) {
    return function () {
      $('#' + _iden + ' .modal').removeClass('in')
      transEndEvent($('#' + _iden + ' .modal'))
      $('#' + _iden + ' #modal-mask' + iden).removeClass('in')
      transEndEvent($('#' + _iden + ' #modal-mask' + iden))
      $('#' + _iden + ' #toggle' + iden).removeClass('active')
      if (typeof callback2 == 'function') {
        callback2()
      }
      _show(params)
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
        $('#' + _iden + ' .modal.fade')[0].style.display = 'none'
        $('#' + _iden + ' .modal-mask.fade')[0].style.display = 'none'
      }
      //				var userAgent = navigator.userAgent;
      //				var isOpera = userAgent.indexOf("Opera") > -1;
      //				if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
      //					$("body")[0].removeChild(document.getElementById(_getModalIden(params)));
      //			    }
      //				var ie = !-[1,];
    }
  })(close, iden)
  return closeFun
}

/**
 * 绑定关闭逻辑
 */
let _bindCloseLogic = function (params) {
  let iden = _getModalIden(params)
  let closeFun = getCloseFun(params)
  $('#' + iden)
    .find('.btn.btn-primary')
    .unbind('click')
    .on('click', closeFun)
  $('#' + iden)
    .find('.modal-header .btn-icon')
    .unbind('click')
    .on('click', closeFun)
  $('#' + iden + ' #modal-mask' + iden)
    .unbind('click')
    .click(closeFun)
  $('#' + iden)
    .find('.modal i.icon-close')
    .on('click', closeFun)
}

const error = function (params) {
  //异常弹框前，隐藏全部进度条，避免遮挡弹框的操作按钮
  try {
    progressBarUtil.hideProgress(true)
  } catch (e) {} /* 全局滚动条可能不存在，所以不对异常处理 */
  try {
    progressBarUtil.hideProgress(false)
  } catch (e) {} /* 局部滚动条可能不存在，所以不对异常处理 */
  let func2 = params.callback
  let iden = _getModalIden(params)
  if (_existModal(iden)) {
    //异常弹窗运行中，避免其他弹窗覆盖
    return
  }
  currentErrorInfos[iden] = params
  _markModal(iden)
  params.callback = (function (cb2, _iden) {
    return function () {
      _cancelModal(_iden)
      if (typeof cb2 == 'function') {
        cb2.apply(this, arguments)
      }
    }
  })(func2, iden)
  if (!params.type) {
    params.type = TYPE.SYSTEM
  }
  errorStack.push(params)
  _removeRepeat()
  _show(params)
}

let getHtml = function (params) {
  let iden = _getModalIden(params)
  let containerStyle = ''
  if (params.containerId) {
    containerStyle = 'height:100%;'
  }
  /* 预览模式，目前在异常反馈页面使用 */
  let viewonly = params.viewonly === true
  let showD = i18n.get('查看详情', '报错弹框的显示详情')
  let copyStyle =
    'float:right;height:32px;line-height:32px;margin-left: 8px;padding: 0 16px;cursor: pointer;font-size: 12px;border-radius: 4px;transition: color .2s linear,background-color .2s linear,border .2s linear,box-shadow .2s linear;'
  let html =
    '<div id="' +
    iden +
    '" class="front-end-alerter" style="' +
    containerStyle +
    '">'
  if (!viewonly) {
    html +=
      '<div class="modal fade">' +
      '<div class="modal-header" style="display:none;">' + //新版错误框不需要顶部
      '<h4 id="error-title' +
      iden +
      '"></h4>' +
      '<button class="btn-icon iconfont icon-close1"></button>' +
      '</div>' +
      '<i style="position: absolute;right: 30px;top: 10px;cursor: pointer;z-index: 9999;" class="iconfont icon-close"></i>'
  }
  html +=
    '<div class="modal-body">' +
    //				'<span class="icon icon-danger"><i class="iconfont icon-error"></i></span>'+//新版错误框图标改用图片
    '<span class="icon icon-danger"><img id="error-img' +
    iden +
    '" src="" /></span>' +
    '<h5 id="error-msgHeader' +
    iden +
    '" style="text-align:left;"></h5>' +
    '<p id="error-msg' +
    iden +
    '" class="error-msg" style="text-align:left;"></p>' +
    '</div>' +
    '<div class="modal-footer clear">' +
    '<button class="btn btn-text toggle-extra" id="toggle' +
    iden +
    '" style="outline: none;margin-left: 8px;">' +
    '<i class="iconfont icon-unfold"></i>' +
    showD + //新版调整顺序
    '</button>' +
    '<button size="small" style="' +
    copyStyle +
    '" btn-type="copyDetail" class="btn-copy-detail">' +
    i18n.get('复制详情', '报错弹框的复制详情按钮文字') +
    '</button>' +
    '<button size="small" style="' +
    copyStyle +
    '" btn-type="feedback" class="btn-feedback">' +
    i18n.get('反馈问题', '报错弹框的复制详情按钮文字') +
    '</button>' +
    '<button class="btn btn-primary" login="true">' +
    i18n.get('确定', '报错弹框的确定按钮文字') +
    '</button>' +
    '</div>' +
    '<div class="modal-extra">' +
    '<div class="extra-cont">' +
    '<pre id="error-detail' +
    iden +
    '"></pre>' +
    '</div>' +
    '</div>' +
    '</div><div class="modal-mask fade" id="modal-mask' +
    iden +
    '" style="' +
    (containerStyle ? containerStyle + 'position: relative;' : containerStyle) +
    '">' +
    (!viewonly ? '' : '</div>') +
    '</div>'
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

export { error, TYPE }
