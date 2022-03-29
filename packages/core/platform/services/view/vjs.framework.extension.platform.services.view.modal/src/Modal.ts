// import { default } from 'yargs'

import {
  BackMask as backMask,
  ZIndex as zIndex
} from '@v-act/vjs.framework.extension.platform.services.view.ui'
import { $ } from '@v-act/vjs.framework.extension.vendor.jquery'

import * as initor from './ModalInitor'

let WindowContaine, dragParams: any
let headerH: any

let borderWidth: number

dragParams = 'dragParams'
headerH = 47
borderWidth = 4

// export function initModule(sb) {

// }

const create = function (params: any) {
  initor.init()
  createModal(params)
}

/**
 *  增加模态窗口，UI操作
 *  @formBorderStyle 边框样式
 *  @windowState 窗体初始大小
 *  @maximizeBox 是否显示最小化按钮
 */
let createModal = function (params: any) {
  let title = params.title,
    width = params.width,
    height = params.height,
    readyFunc = params.rendered,
    closeFunc = params.closed,
    resizeFunc = params.resized,
    formBorderStyle = params.formBorderStyle,
    windowState = params.windowState,
    tmpZIndex = params.tmpZIndex,
    contentType = params.contentType,
    bgColor = params.bgColor,
    maximizeBox = params.maximizeBox
  let containerCode = 'modal_' + new Date().getTime()
  let bodyCode = 'modalbody_' + new Date().getTime()
  let tmp_borderWidth =
    formBorderStyle && formBorderStyle == 'None' ? 0 : borderWidth
  width = width ? parseInt(width) + tmp_borderWidth : 1000 //2个像素的边框
  height = height ? parseInt(height) + 0 : 700 //2个像素的边框
  backMask.Show(tmpZIndex)
  let html = genModalWindowHtml({
    title: title,
    width: width,
    height: height,
    containerCode: containerCode,
    bodyCode: bodyCode,
    formBorderStyle: formBorderStyle,
    windowState: windowState,
    maximizeBox: maximizeBox,
    contentType: contentType,
    bgColor: bgColor,
    tmpZIndex: tmpZIndex
  })
  $('body').append(html)
  $('#' + containerCode)
    .css('display', 'block')
    .show() //此处加入设置样式原由：在功能构件中，活动定义打开模态窗体不显示，原因display为none
  let setTitleFunc = function (title: string) {
    if (title) {
      let now = $('#' + containerCode)
      let parent = now.parent()
      if (parent.length < 1 || parent[0].tagName != 'BODY') {
        now = parent
      }
      now.find('.modal-header .modal-title').html(title)
    }
  }
  /**
   * 隐藏模态
   * */
  let hideFunc = function (
    modalCode: string,
    renderParams: any,
    isMiss: boolean
  ) {
    backMask.Hide()
    $('#' + modalCode)
      .css('display', 'none')
      .hide()
    let _$modal = $('#' + modalCode).children()
    if (!isMiss) {
      //如果最大化，就不用调整
      setModalWindowState('Normal', _$modal)
      // 恢复窗口位置
      let isDrag = _$modal.data('isDrag')
      let params = _$modal.data(dragParams)
      if (params) {
        isDrag
          ? _$modal.css('left', params.left).css('top', params.top)
          : _updDiaPosition(params, _$modal[0])
      }
      resizeFunc && resizeFunc(bodyCode)
    }
  }
  /**
   * 显示模态
   * */
  let showFunc = function (modalCode: string, newParams: any) {
    let $dom = $('#' + modalCode)
    let marginTop = $('#' + modalCode + '>div').css('width')
    let marginHeight = $('#' + modalCode + '>div').css('width')
    let tmpWidth = $('#' + modalCode + '>div').css('width')

    let _$modal = $dom.children()
    if (tmpWidth != '100%') {
      if (newParams && newParams.width) {
        orginPosition = {
          'width': _$modal.css('width'),
          'height': _$modal.css('height'),
          'margin-left': _$modal.css('margin-left'),
          'margin-top': _$modal.css('margin-top'),
          'left': '50%',
          'top': '50%'
        }
        _$modal.css('left', '')
        _$modal.css('top', '')

        let formBorderStyle = newParams.formBorderStyle
        let width = newParams.width
        let tmp_borderWidth = formBorderStyle == 'None' ? 0 : borderWidth
        width = width ? parseInt(width) + tmp_borderWidth : 1000 //2个像素的边框
        let height = newParams.height
        height = height ? parseInt(height) + 0 : 700 //2个像素的边框
        if (undefined == formBorderStyle || formBorderStyle == 'FixedSingle') {
          height = height + headerH
        }
        let rect = _dealRect(width, height)
        width = rect[0]
        height = rect[1]
        orginPosition['margin-left'] = '-' + width / 2 + 'px'
        _$modal.css('margin-left', orginPosition['margin-left'])
        orginPosition.width = width
        $('#' + modalCode + '>div').css('width', width)
        orginPosition['margin-top'] = '-' + height / 2 + 'px'
        _$modal.css('margin-top', orginPosition['margin-top'])
        orginPosition.height = height
        $('#' + modalCode + '>div').css('height', height)
        _$modal.data('orginPosition', orginPosition)
      }
    }

    let zIndex = Number($dom.css('z-index'))
    backMask.Show(zIndex - 100)
    //$("#windowBackMark").css("z-index",(zIndex - 100)).css("display", "block").show();
    $('#' + modalCode)
      .css('display', 'block')
      .show()
    if (_$head.length > 0 && _$modal.length > 0) {
      _initDrag(_$head[0], _$modal[0], newParams)
    }
  }
  let closeModal = (function () {
    return function (newCode: string) {
      let _code = containerCode
      backMask.Hide()
      $('#' + _code).hide()
      $('#' + _code).remove()
    }
  })()
  let renderParams = {
    modalCode: containerCode,
    hideFunc: hideFunc,
    showFunc: showFunc
  }
  readyFunc(bodyCode, closeModal, setTitleFunc, renderParams)
  // 处理浏览器大小小于模态窗体大小时，模态窗体未能显示滚动条导致被打开的窗体无法显示完整
  let _$modal = $('#' + containerCode).children(),
    _$head = _$modal.find('.modal-title')

  let orginPosition = _$modal.data('orginPosition')
  if (!orginPosition) {
    orginPosition = {
      'width': _$modal.css('width'),
      'height': _$modal.css('height'),
      'margin-left': _$modal.css('margin-left'),
      'margin-top': _$modal.css('margin-top'),
      'left': '50%',
      'top': '50%'
    }
    _$modal.data('orginPosition', orginPosition)
  }
  $(window).on(
    'resize',
    {
      containerCode: containerCode,
      modalWidth: width,
      modalHeight: height,
      formBorderStyle: formBorderStyle
    },
    function (e: any) {
      if (e.data.formBorderStyle !== 'None') {
        let el = $('#' + e.data.containerCode).children()
        if (el && el.length > 0) {
          orginPosition = el.data('orginPosition')
          let newPosition = orginPosition || {}
          newPosition.left = '50%'
          newPosition.top = '50%'
          el.find('.modal-body').css('overflow', 'auto')

          /* var isSet;
                    if(_$modal.offset().left+_$modal.width()>=$(window).width()){
                        newPosition.left = "50%";
                        isSet = true;
                    }
                    if(_$modal.offset().top+_$modal.height()>=$(window).height()){
                        newPosition.top = "50%";
                        isSet = true;
                    }
                    if(isSet){
                        setModalWindowState("Normal",_$modal);
                    }*/
          setModalWindowState('Normal', el)
          //_setDialogDragable(_$modal, true);
          let params = el.data(dragParams)
          if (params) _updDiaPosition(params, el[0])
        }
      }
      if (typeof resizeFunc == 'function') {
        //此处不传参，不触发原有的resize
        resizeFunc()
      }
    }
  )

  $('#' + containerCode).on(
    'click.dismiss.bs.modal',
    '[data-dismiss="vmodal"]',
    (function (cCode) {
      return function () {
        var $modalDom = $('#' + cCode)
        if ($modalDom.attr('data-content-type') == 'url') {
          //如果模态的内容是url直接走关闭关闭回调，其他不用处理
          if (closeFunc && typeof closeFunc == 'function') {
            closeFunc(bodyCode, {
              modalCode: cCode,
              hideFunc: hideFunc,
              showFunc: showFunc
            })
          }
        } else {
          var isLinkJump = $('#' + cCode).find('div[data-is-link-jump=true]')
          if (
            (isLinkJump && isLinkJump.length > 0) ||
            typeof closeFunc != 'function'
          ) {
            try {
              //comment by xiedh 2018-08-28 解决当打开模态窗体后，模态窗体再当前页面调整，关闭模态窗体时，模态窗体后续规则不执行问题
              if (closeFunc && typeof closeFunc == 'function') {
                closeFunc(bodyCode)
              }
            } catch (e) {
              //            			logUtil.warn("已忽略closeFunc");
            }
            //@ts-ignore
            closeModal()
          } else if (closeFunc && typeof closeFunc == 'function') {
            closeFunc(bodyCode, closeModal)
          }
        }
      }
    })(containerCode)
  )

  //最大化按钮点击事件
  $('#' + containerCode).on(
    'click.dismiss.bs.modal',
    '[data-dismiss="mmodal"]',
    (function () {
      return function () {
        setModalWindowState('Maximized', _$modal)
        resizeFunc && resizeFunc(bodyCode)
      }
    })()
  )

  //还原按钮点击事件
  $('#' + containerCode).on(
    'click.dismiss.bs.modal',
    '[data-dismiss="cmodal"]',
    (function () {
      return function () {
        setModalWindowState('Normal', _$modal)
        // 恢复窗口位置
        var isDrag = _$modal.data('isDrag')
        var params = _$modal.data(dragParams)
        isDrag
          ? _$modal.css('left', params.left).css('top', params.top)
          : _updDiaPosition(params, _$modal[0])
        resizeFunc && resizeFunc(bodyCode)
      }
    })()
  )

  // 模态窗体支持拖动效果, 拖動位置為頂部標題欄
  if (_$head.length > 0 && _$modal.length > 0)
    _initDrag(_$head[0], _$modal[0], params)
}

let getImgBasePath = function () {
  //@ts-ignore
  return window.V3PlatformNamespace ? V3PlatformNamespace.getBasePath() : ''
}

/**
 * 生成模态窗体Html
 */
let genModalWindowHtml = function (params: any) {
  let title = params.title,
    width = params.width,
    height = params.height,
    containerCode = params.containerCode,
    bodyCode = params.bodyCode,
    formBorderStyle = params.formBorderStyle,
    windowState = params.windowState,
    tmpZIndex = params.tmpZIndex,
    contentType = params.contentType,
    bgColor = params.bgColor,
    maximizeBox = params.maximizeBox
  if (undefined == formBorderStyle || formBorderStyle == 'FixedSingle')
    height = height + headerH
  let rect = _dealRect(width, height)
  width = rect[0]
  height = rect[1]

  let maxIcon = 'icon-maximization'
  let restore = 'icon-restore'
  let isMaxWindow = '' //最大化样式
  let centerStyle = '' //窗体样式
  let imgPath = '' //最大化按钮图标路径
  let isHideMaxIcon = '' //隐藏最大化图标样式
  let maxIden = '' //隐藏最大化图标样式
  let titleTop = '' //预留标题位置
  let contentStyle = '' //预留标题位置
  let borderStyle = bgColor && '' != bgColor ? bgColor : ''
  let formBorderDom = ''
  let btnIcon = maxIcon
  if (undefined != maximizeBox && false == maximizeBox) {
    isHideMaxIcon = 'display:none;'
  }
  if (windowState && windowState == 'Maximized') {
    //最大化窗体
    isMaxWindow = ' v-full-screen '
    imgPath = 'itop/common/bootstrap/extra/images/ccascade.png' //最小化图标
    maxIden = 'cmodal'
    btnIcon = restore
  } else {
    isMaxWindow = ' v-full-center '
    centerStyle =
      'width: ' +
      width +
      'px;' +
      'height: ' +
      height +
      'px;' +
      'margin-left: -' +
      width / 2 +
      'px;margin-top: -' +
      height / 2 +
      'px;opacity:1;'
    imgPath = 'itop/common/bootstrap/extra/images/cmaximize.png' //最大化图标
    maxIden = 'mmodal'
    btnIcon = maxIcon
  }
  let newZIndex = tmpZIndex ? tmpZIndex : zIndex.getFrontZIndex()
  if (formBorderStyle && formBorderStyle == 'None') {
    borderStyle = borderStyle + 'border:0;margin-bottom:0;'
    titleTop = 'top:0;'
  } else {
    formBorderDom =
      '      <div class="modal-header">' +
      '      <button type="button" class="close" data-dismiss="vmodal"><span class="iconfont icon-close" aria-hidden="true"></span><span class="sr-only">Close</span></button>' +
      //+ "      <button type=\"button\" class=\"maximum\" style=\"padding-top:0px;padding-bottom:0px;"+isHideMaxIcon+"\" data-dismiss=\""+maxIden+"\"><img src=\""+getImgBasePath()+imgPath+"\"></img><span class=\"sr-only\">Maximize</span></button>"
      '      <button type="button" class="maximum" style="padding-top:0px;padding-bottom:0px;' +
      isHideMaxIcon +
      '" data-dismiss="' +
      maxIden +
      '"><span class="iconfont ' +
      btnIcon +
      ' "></span><span class="sr-only">Maximize</span></button>' +
      '      <h4 class="modal-title" id="myModalLabel">' +
      title +
      '</h4>' +
      '    </div>'
  }
  let result =
    '<div data-backdrop=false data-content-type="' +
    contentType +
    '" data-keyboard=false class="modal fade in" style="display:none;z-index:' +
    newZIndex +
    ';background-color:transparent;"  id="' +
    containerCode +
    '" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
    '  <div class="v-modal-dialog ' +
    isMaxWindow +
    '" style="' +
    centerStyle +
    '" >' +
    '    <div class="modal-content" style="' +
    borderStyle +
    '">' +
    formBorderDom +
    '      <div class="modal-body" id="' +
    bodyCode +
    '" style="overflow:auto;padding:0px;' +
    titleTop +
    '">' +
    '' +
    '      </div>' +
    '    </div>' +
    '  </div>' +
    '</div>'
  // 处理BS中打开模态SC窗体，日期控件弹出层被遮盖
  //@ts-ignore
  if (window.isc && window.isc.Canvas) {
    //@ts-ignore
    isc.Canvas._BIG_Z_INDEX = zIndex.getFrontZIndex()
  }
  return result
}

let _dealRect = function (width: string, height: string) {
  let w = parseInt(width)
  let h = parseInt(height)
  let page = null
  if (document.compatMode == 'CSS1Compat') {
    page = document.documentElement
  } else {
    page = document.body
  }
  let screenWidth = page.clientWidth
  let screenHeight = page.clientHeight
  let flag = true
  let widthAdjust = false
  let heigthAdjust = false
  let isWebkit = navigator.userAgent.indexOf('AppleWebKit') > -1
  while (flag) {
    flag = false
    if (!widthAdjust && w > screenWidth) {
      h += 18
      widthAdjust = true
      flag = true
    }
    if (!heigthAdjust && h > screenHeight) {
      w += isWebkit ? 8 : 18
      heigthAdjust = true
      flag = true
    }
  }
  w = w > screenWidth ? screenWidth : w
  h = h > screenHeight ? screenHeight : h
  return [w, h]
}

/**
 * 最大化\还原时调整模态窗体CSS
 */
let rejustModalCss = function (param: any) {
  //setModalWindowState(param);
}
let setModalWindowState = function (param: any, el: any) {
  if (param == 'Maximized') {
    setMaximized(el)
  }
  if (param == 'Normal') {
    setReinstatement(el)
  }
}
let setMaximized = function (el: any) {
  let newPosition = {
    'width': '100%',
    'height': '100%',
    'margin-left': '0',
    'margin-top': '0',
    'left': 0,
    'top': 0
  }
  el.addClass('v-full-screen').removeClass('v-full-center').css(newPosition)
  let header = el.find('>.modal-content >.modal-header')
  header
    .children('button.maximum')
    .attr('data-dismiss', 'cmodal')
    .children('.iconfont')
    .removeClass('icon-maximization')
    .addClass('icon-restore')
  _setDialogDragable(el, false)
}
let setReinstatement = function (el: any) {
  let orginPosition = el.data('orginPosition')
  el.addClass('v-full-center').removeClass('v-full-screen').css(orginPosition)
  let header = el.find('>.modal-content >.modal-header')
  header
    .children('button.maximum')
    .attr('data-dismiss', 'mmodal')
    .children('.iconfont')
    .removeClass('icon-restore')
    .addClass('icon-maximization')
  _setDialogDragable(el, true)
}
//拖拽的实现
let _initDrag = function (bar: any, dialog: any, options: any, callback?: any) {
  let resizeFunc = options.resized
  // 初始化信息
  let params = $(dialog).data(dragParams)
  if (!params) {
    params = {
      left: '50%',
      top: '50%',
      currentX: 0,
      currentY: 0,
      flag: false,
      isDragable: true
    }
  }

  // 记录第一次加载时控件位置信息
  _updDiaPosition(params, dialog)
  if (options.windowState && options.windowState.toLowerCase() == 'maximized') {
    _setDialogDragable($(dialog), false)
  }
  function down(event: any, dialog: any) {
    let e = event || window.event
    let _eveTarget = e.target || e.srcElement
    let params = $(dialog).data(dragParams)
    if (_allowSavePosition(_eveTarget, $(dialog))) {
      params.flag = true

      //防止IE文字选中
      bar.onselectstart = function () {
        return false
      }
      let _position = getPosition(e)
      params.currentX = _position[0]
      params.currentY = _position[1]

      $(dialog).data(dragParams, params)
    }
  }
  function up(event: any, dialog: any) {
    let e = event || window.event
    // 当点击的是最大化按钮或者恢复按钮时，不记录位置
    let params = $(dialog).data(dragParams)
    params.flag = false

    // 当点击了恢复按钮，不记录位置
    let _eveTarget = e.target || e.srcElement
    let $eveTarget = $(_eveTarget)

    // 点击最大化或者最小化按钮时不记录位置
    if (
      !params.isDragable ||
      ($eveTarget.is('button') && $eveTarget.attr('data-dismiss') !== '') ||
      $(_eveTarget).parents('button[data-dismiss]').length > 0
    )
      return
    $(dialog).data('isDrag', true)
    _updDiaPosition(params, dialog)
  }
  function move(event: any, dialog: any, callback?: any) {
    let e = event || window.event
    if (!dialog) {
      dialog = e.data[1]
    }
    if (!callback) {
      callback = e.data[2]
    }
    let params = $(dialog).data(dragParams)
    if (params.flag) {
      let _position = getPosition(e)
      let nowX = _position[0],
        nowY = _position[1]
      let disX = nowX - params.currentX,
        disY = nowY - params.currentY,
        newX = parseInt(params.left) + disX,
        newY = parseInt(params.top) + disY

      let newTop = _getDialogTop(newY, $(dialog))

      dialog.style.left = newX + 'px'
      dialog.style.top = newTop + 'px'

      if (typeof callback == 'function') {
        callback(
          (parseInt(params.left) || 0) + disX,
          (parseInt(params.top) || 0) + disY
        )
      }
      if (typeof resizeFunc == 'function') {
        //此处不传参，不触发原有的resize
        resizeFunc()
      }
      if (e.preventDefault) {
        e.preventDefault()
      }
      return false
    }
  }
  $(bar).on('mousedown', function (event: any) {
    let _this = dialog
    down(event, _this)
    $(document).on('mousemove', [event, _this, callback], move)

    $(document).on('mouseup', function (event: any) {
      up(event, _this)
      let orginPosition = {
        'width': $(_this).css('width'),
        'height': $(_this).css('height'),
        'margin-left': $(_this).css('margin-left'),
        'margin-top': $(_this).css('margin-top'),
        'left': $(_this).css('left'),
        'top': $(_this).css('top')
      }
      $(_this).data('orginPosition', orginPosition)
      $(document).off('mousemove', move)
      $(document).off('mouseup')
    })
  })
}

let getPosition = function (e: any) {
  // 访问事件对象
  //var e = e || window.event;

  // 声明x、y分别为鼠标相对于文档的位置
  let x = 0,
    y = 0

  // 针对W3C标准浏览器具有pageX/Y属性
  if (e.pageX !== undefined) {
    x = e.pageX
    y = e.pageY
  } else if (e.clientX !== undefined) {
    // 在IE6~8中不支持pageX，而是用clientX；但clientX只是相对屏幕视口的横坐标，不包含滚动宽度；
    let scrollLeft =
      document.documentElement.scrollLeft || document.body.scrollLeft
    let scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop
    // pageX = clientX + scrollX
    x = e.clientX + scrollLeft
    y = e.clientY + scrollTop
  }
  return [x, y]
}

// 获取相关CSS属性
let getCss = function (o: any, cssCode: any) {
  //return o.currentStyle ? o.currentStyle[key] : document.defaultView.getComputedStyle(o, false)[key];
  return document.defaultView
    ? document.defaultView.getComputedStyle(o, '')[cssCode]
    : o.currentStyle.getAttribute(cssCode)
}

// 执行更新dom存储的位置信息
let _updDiaPosition = function (params: any, dialog: any) {
  let left = getCss(dialog, 'left')
  let top = getCss(dialog, 'top')
  if (left !== 'auto') {
    params.left = left
  }
  if (top !== 'auto') {
    params.top = top
  }
  $(dialog).data(dragParams, params)
}

// 判断对话框的顶部标题栏是否可拖动
let _getDialogTop = function (newTop: any, $dialog: any) {
  let headerHeight = $dialog.find('.modal-header').innerHeight()
  let dialogMarTop = $dialog.css('margin-top').replace('px', '') * 1
  let comTop = newTop + dialogMarTop
  let winHeight = $(document).height()
  if (comTop < 0) {
    return dialogMarTop * -1
  } else if (winHeight - headerHeight < comTop) {
    return winHeight - headerHeight - dialogMarTop
  }

  return newTop
}

let _allowSavePosition = function (headDom: any, $dialog: any) {
  let params = $dialog.data(dragParams) || {}
  if (params.isDragable && headDom.className.indexOf('modal-title') > -1)
    return true
  else return false
}

let _setDialogDragable = function ($dom: any, isAllow: boolean) {
  let params = $dom.data(dragParams) || {}
  params.isDragable = isAllow
}

let _getDialogDragable = function ($dom: any) {
  let params = $dom.data(dragParams) || {}
  return params.isDragable
}

let _addEvent = function (elem: any, type: any, handler: any) {
  if (elem.addEventListener) {
    // 非ie
    elem.addEventListener(type, handler, false)
  } else if (elem.attachEvent) {
    elem['temp' + type + handler] = handler
    elem[type + handler] = function () {
      elem['temp' + type + handler].apply(elem)
    }
    // ie
    elem.attachEvent('on' + type, elem[type + handler])
  } else {
    elem['on' + type] = handler
  }
}
export default { create, setModalWindowState }
