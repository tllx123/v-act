let sandbox, cssHide, topNodeName

export function initModule(sb) {
  sandbox = sb
  topNodeName = '_topnode'
  // 该 css 定义在 12render-web-bootstrap/.../bootstrap.extra.css
  cssHide = 'v-hide'
}

let setVisible = function (id, state) {
  let _id = '#' + id
  if (state && state + '' === 'true') _handleShowWidget(_id)
  else _handleHideWidget(_id)
}

let getVisible = function (id) {
  let _id = '#' + id,
    _topNodeId = _id + topNodeName,
    _$idElement = $(_id),
    _$topNodeIdElement = $(_topNodeId),
    isVisible = false

  if (_$topNodeIdElement.length > 0) {
    if (!_$topNodeIdElement.hasClass(cssHide)) isVisible = true
  } else if (_$idElement.length > 0) {
    if (!_$idElement.hasClass(cssHide)) isVisible = true
  }

  return isVisible
}

/**
 * 隐藏控件
 */
let _handleHideWidget = function (id) {
  let _topNodeId = id + topNodeName,
    _$idElement = $(id),
    _$topNodeIdElement = $(_topNodeId)

  if (_$topNodeIdElement.length > 0) {
    if (!_$topNodeIdElement.hasClass(cssHide))
      _$topNodeIdElement.addClass(cssHide)
  } else if (_$idElement.length > 0) {
    if (!_$idElement.hasClass(cssHide)) _$idElement.addClass(cssHide)
  }
}

/**
 * 显示控件
 */
let _handleShowWidget = function (id) {
  let _topNodeId = id + topNodeName,
    _$idElement = $(id),
    _$topNodeIdElement = $(_topNodeId)

  if (_$topNodeIdElement.length > 0) {
    if (_$topNodeIdElement.hasClass(cssHide))
      _$topNodeIdElement.removeClass(cssHide)
  } else if (_$idElement.length > 0) {
    if (_$idElement.hasClass(cssHide)) _$idElement.removeClass(cssHide)
  }
}

export { handleColor, setVisible, getVisible }