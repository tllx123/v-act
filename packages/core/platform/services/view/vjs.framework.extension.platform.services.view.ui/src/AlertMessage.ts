import { Platform as i18n } from '@v-act/vjs.framework.extension.platform.interface.i18n'
import { Log as log } from '@v-act/vjs.framework.extension.util.logutil'
import { StringUtil as stringUtils } from '@v-act/vjs.framework.extension.util.string'
import { $ } from '@v-act/vjs.framework.extension.vendor.jquery'

import * as backMask from './BackMask'
import * as zindex from './ZIndex'

var dialogs = [],
  alertDiv,
  _dialogIntervalIndex = null,
  defaultViewTime = 3,
  currentDialogInfo = null

let _inited = false

const _init = function () {
  if (!_inited) {
    var divId = '___alertMessageDiv'
    //插入DOM到页面
    alertDiv = $('#' + divId)
    if (alertDiv && alertDiv.length == 0) {
      //初始化提示框div
      var dialogDOM = _generateDiaLog(divId)
      $('body').append(dialogDOM)
      alertDiv = $('#' + divId)
      alertDiv.find('#dialogConfirm').click(function () {
        confirmHandler()
      })
      alertDiv.find('#dialogCancel').click(function () {
        cancelHandler()
      })
      alertDiv.find('#dialogIKnow').click(function () {
        iKnowHandler()
      })
    }
    _inited = true
  }
}

var confirmDialog = function (title, content, onCallback, isEsCapeHtml) {
  _init()
  _dialogInterval(title, content, 'confirm', onCallback, isEsCapeHtml)
}

var propmtDialog = function (
  title,
  content,
  onCallback,
  secDistance,
  isEsCapeHtml
) {
  _init()
  if (undefined != secDistance && !isNaN(secDistance)) {
    defaultViewTime = secDistance
  }
  _dialogInterval(title, content, 'prompt', onCallback, isEsCapeHtml)
}

var _dialogInterval = function (
  title,
  content,
  type,
  onCallback,
  isEsCapeHtml
) {
  _init()
  // 对话框队列, 实现对话框按照执行顺序显示
  var _dialogId = 'dialog_' + _genRamdomNum()
  var _dialogInfo = {
    id: _dialogId, //对话框ID
    info: {
      title: title,
      content: !isEsCapeHtml ? stringUtils.escapeHtml(content) : content,
      type: type,
      onCallback: onCallback
    },
    timeInterval: null,
    viewTime: null //显示时间
  }
  dialogs.push(_dialogInfo)
  // 1秒判断一次当前是否存在对话框定时队列
  if (_dialogIntervalIndex === null) {
    //提示框显示线程没有开启，则开启
    _dialogIntervalIndex = setInterval(function () {
      try {
        _dialogIntervalHandler()
      } catch (e) {
        log.error(
          '[AlertMessage._dialogInterval]提示框出现错误！原因：' + e.message
        )
      }
    }, 1)
  }
}

var _dialogIntervalHandler = function () {
  _init()
  if (dialogs.length > 0) {
    //队列不为空，且当前没有提示框显示
    if (!currentDialogInfo) {
      //当前没有提示框显示，则显示提示框，否则等待当前提示框显示完毕
      currentDialogInfo = dialogs[0].info
      dialogs.splice(0, 1)
      var type = currentDialogInfo.type
      switch (type) {
        case 'confirm':
          _showConfirmDialog()
          break
        case 'prompt':
          _showPromptDialog()
          break
      }
    }
  } else {
    //队列已清空，则清除提示框显示线程
    window.clearInterval(_dialogIntervalIndex)
    _dialogIntervalIndex = null
  }
}

var _showConfirmDialog = function () {
  _init()
  // 遮罩层显示
  backMask.Show()
  //清除初始的隐藏样式
  alertDiv.css('display', '')
  // 更新模特对话框消息内容
  _updateDialog()
  // 模特对话框显示
  alertDiv.addClass('dialog-show').addClass('dialogContainer-border')
  // 强制焦点为提示框，需配合dom结构的tabIndex

  _enterKeyPressHandler(alertDiv)
}

var _enterKeyPressHandler = function (_$div) {
  _init()
  _$div
    .find('#dialogConfirm')
    .removeClass('dialogConfirmUnSelect')
    .addClass('dialogConfirmSelect')
  _$div
    .find('#dialogCancel')
    .removeClass('dialogConfirmSelect')
    .addClass('dialogConfirmUnSelect')
  // 支持弹出层聚焦和监听回车按下
  // 强制焦点为提示框div，div需配合tabIndex属性实现聚焦
  if (
    _$div.find('#dialog_foot_pro_div').is(':visible') ||
    _$div.find('#dialog_foot_div').is(':visible')
  ) {
    _$div.on('focusin', function (e) {
      _$div.off('keydown')
      _$div.on('keydown', function (e) {
        if (e.which === 9 && _$div.find('#dialog_foot_div').is(':visible')) {
          e.preventDefault()
          var id = this.id
          var $input = $('#' + id).find('#dialog_foot_div input')
          $input.each(function (item) {
            var className = this.className
            if (className.indexOf('dialogConfirmSelect') != -1) {
              $(this).removeClass('dialogConfirmSelect')
              $(this).addClass('dialogConfirmUnSelect')
            } else {
              $(this).removeClass('dialogConfirmUnSelect')
              $(this).addClass('dialogConfirmSelect')
            }
          })
        }
      })
      _$div.on('keypress', function (e) {
        if ((e.which === 13 || e.which == 32) && _$div.is(':focus')) {
          _$div.blur()
          _$div.off('keypress focusin')
          if (
            _$div.find('#dialog_foot_div').is(':visible') &&
            $(this).find('input.dialogConfirmSelect').length > 0 &&
            $(this).find('input.dialogConfirmSelect')[0].id == 'dialogCancel'
          ) {
            iKnowHandler(true)
          } else {
            // 隐藏窗体
            iKnowHandler()
          }
        }
      })
    })
  }
  _$div.focus()
}

/**
 * 显示确认框
 */
var _showPromptDialog = function () {
  _init()
  _showConfirmDialog()
  currentDialogInfo.viewTime = defaultViewTime
  //2017-02-14 liangzc:移动app上面不用显示倒计时
  if (window.VJSBridge) {
    currentDialogInfo.timeInterval = setInterval(function () {
      //显示倒计时
      currentDialogInfo.viewTime--
      if (!currentDialogInfo.viewTime) {
        iKnowHandler()
      }
    }, 1000)
  } else {
    var span = alertDiv.find('#dialogIKnow > span')
    span.html(defaultViewTime)
    currentDialogInfo.timeInterval = setInterval(function () {
      //显示倒计时
      currentDialogInfo.viewTime--
      alertDiv.find('#dialogIKnow > span').html(currentDialogInfo.viewTime)
      if (!currentDialogInfo.viewTime) {
        iKnowHandler()
      }
    }, 1000)
  }
}

var clearDialogInfo = function () {
  _init()
  alertDiv.removeClass('dialog-show').removeClass('dialogContainer-border')
  backMask.Hide()
  var result = currentDialogInfo
  currentDialogInfo = null
  return result
}

var confirmHandler = function () {
  var info = clearDialogInfo()
  if (info.onCallback) {
    info.onCallback(true)
  }
}

var cancelHandler = function () {
  var info = clearDialogInfo()
  if (info.onCallback) {
    info.onCallback(false)
  }
}

var iKnowHandler = function (isCancle) {
  _init()
  var info = clearDialogInfo()
  var _info = info + ''
  if (_info !== 'null' && _info !== 'undefined') {
    if (info.timeInterval) clearInterval(info.timeInterval)

    if (info.onCallback) {
      if (isCancle) {
        info.onCallback(false)
      } else {
        info.onCallback(true)
      }
    }
  }
}

// 生成6位随机数
var _genRamdomNum = function () {
  var num = ''
  for (var i = 0; i < 6; i++) num += Math.floor(Math.random() * 10)

  return num
}

var _updateDialog = function () {
  _init()
  var title = currentDialogInfo.title,
    content = currentDialogInfo.content,
    type = currentDialogInfo.type
  // 更新标题
  if (title + '' === 'null' || title + '' === 'undefined' || title + '' === '')
    title = i18n.get('提示信息', '提示框的标题文字')
  alertDiv.find(' .header').html(title)
  // 更新内容
  alertDiv.find('#dialog_content_div').html(content)
  // 处理按钮显示隐藏
  if (type === 'confirm') {
    alertDiv.find('#dialog_foot_div').show()
    alertDiv.find('#dialog_foot_pro_div').hide()
  } else {
    alertDiv.find('#dialog_foot_div').hide()
    alertDiv.find('#dialog_foot_pro_div').show()
  }
  //重新计算 z-index
  var newIndex = zindex.getFrontZIndex()

  // 处理进度条已显示出来导致遮盖问题
  var _loading = document.getElementById('_waitingMsgDiv')
  if (_loading) {
    var _loadingZIndex = _loading.style.zIndex * 1
    var _loadingIsShowed = _loading.style.display === 'none' ? false : true
    if (_loadingIsShowed) {
      newIndex = _loadingZIndex > newIndex ? _loadingZIndex * 1 + 100 : newIndex
    }
  }
  alertDiv.css('z-index', newIndex)
  _handleDialogCenter()
}

var _handleDialogCenter = function () {
  _init()
  /*
   * 移动端软键盘弹起，收起时计算错误
   * */
  if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
    alertDiv.css({
      position: 'absolute',
      left: ($(window).width() - alertDiv.outerWidth()) / 2,
      top: '50%', // 处理窗体存在竖直方向滚动条
      transform: 'translateY(-' + parseFloat(alertDiv.outerHeight() / 2) + 'px)'
    })
  } else {
    alertDiv.css({
      position: 'absolute',
      left: ($(window).width() - alertDiv.outerWidth()) / 2,
      top: parseFloat(
        ($(window).height() - alertDiv.outerHeight()) / 2 +
          $(document).scrollTop()
      ) // 处理窗体存在竖直方向滚动条
    })
  }
}

var _generateDiaLog = function (id) {
  var _left = ''
  var _right = ''
  if (!window.VJSBridge) {
    _left = '('
    _right = ')'
  }
  var result =
    '<div id="' +
    id +
    '" tabindex="99999999" class="dialogContainer" style="display:none;">' +
    '<div>' +
    '<div class="header"></div>' +
    '<div id="dialog_content_div" class="content"></div>' +
    '<div id="foot_div" class="foot">' +
    '<div id="dialog_foot_div" class="foot_buttons">' +
    '<input type="button" id="dialogConfirm" class="dialogConfirmSelect" value="' +
    i18n.get('确定', '询问框的确定按钮文字') +
    '"></input>' +
    '<input type="button" id="dialogCancel" class="dialogConfirmUnSelect" value="' +
    i18n.get('取消', '询问框的取消按钮文字') +
    '"></input>' +
    '</div>' +
    '<div id="dialog_foot_pro_div" class="foot_buttons">' +
    '<div id="dialogIKnow">' +
    i18n.get('我知道了', '提示框的文字信息') +
    _left +
    '<span></span>' +
    _right +
    '</div>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</div>'

  return result
}

export { confirmDialog, propmtDialog }
