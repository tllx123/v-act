import { $ } from '@v-act/vjs.framework.extension.vendor.jquery'
import * as zindex from './ZIndex'

var windowZindex = [],
  bodyOver = true

/**
 * @param Number tmpZIndex 层级，可不传
 * */
export function Show(tmpZIndex: number) {
  if (bodyOver) {
    var _$body = $('body')
    if (_$body.css('overflow') != 'hidden') {
      var _oldWidth = _$body.width()
      // 处理body出现滚动条时，滚动条隐藏导致窗体大小发生变化
      _$body.css({
        overflow: 'hidden',
        width: _oldWidth + 'px'
      })
      bodyOver = false
    }
  }

  var _zindex = tmpZIndex ? tmpZIndex : zindex.getFrontZIndex()
  windowZindex.push(_zindex)
  if ($('#windowBackMark').length == 0) {
    var allowtransparency = ' allowtransparency="true" '
    if (navigator.userAgent.toLowerCase().indexOf('msie 8.0') > 0) {
      allowtransparency = ''
    }

    $('body').append(
      '<DIV ID="windowBackMark" style="z-index:' +
        _zindex +
        ';position: fixed;top: 0;right: 0;bottom: 0;left: 0;background-color: #333;opacity:0.5;filter:alpha(opacity=50);">' +
        '<iframe width="100%" height="100%" src="about:blank" style="border: 0;"' +
        allowtransparency +
        '></iframe><DIV>'
    )
  } else {
    $('#windowBackMark').css('display', 'block')
    $('#windowBackMark').css('z-index', _zindex)
  }
}

export function Hide() {
  if ($('#windowBackMark').length > 0) {
    if (windowZindex.length > 1) {
      var zindex = windowZindex.pop()
      $('#windowBackMark').css('z-index', windowZindex[windowZindex.length - 1])
    } else {
      windowZindex = []
      if (bodyOver == false) {
        // 重置width，放置用户从最小化到最大化后，窗体无法自适应
        $('body').css({ overflow: '', width: '' })
        bodyOver = true
      }
      $('#windowBackMark').css('display', 'none')
    }
  }
}
