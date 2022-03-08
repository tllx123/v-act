let sandbox, topNodeName, secNodeName, attDisable

export function initModule(sb) {
  sandbox = sb
  topNodeName = '_topnode'
  secNodeName = '_secondnode'
  attDisable = 'disabled'
}

/**
 * 设置控件使能属性值
 */
let setEnabled = function (id, state) {
  let _id = '#' + id
  if (state && state + '' === 'true') _handleEnabledWidget(_id)
  else _handleDisabledWidget(_id)
}

/**
 * 获取控件使能属性值
 */
let getEnabled = function (id) {
  let _id = '#' + id,
    _topNodeId = _id + topNodeName,
    _secElement = id + secNodeName,
    _$idElement = $(_id),
    _$topNodeIdElement = $(_topNodeId),
    _$secNodeIdElement = $(_secElement),
    isEnableId = true,
    isEnableTop = true,
    isEnableSec = true

  if (_$idElement.length > 0) {
    if (typeof _$idElement.attr(attDisable) !== 'undefined') isEnableId = false
    // 处理用样式控制使能的控件
    if (_$idElement.hasClass(attDisable)) isEnableId = false
  }

  if (_$topNodeIdElement.length > 0) {
    if (typeof _$topNodeIdElement.attr(attDisable) !== 'undefined')
      isEnableTop = false
    // 处理用样式控制使能的控件
    if (_$topNodeIdElement.hasClass(attDisable)) isEnableTop = false
  }

  if (_$secNodeIdElement.length > 0) {
    if (typeof _$secNodeIdElement.attr(attDisable) !== 'undefined')
      isEnableSec = false
    // 处理用样式控制使能的控件
    if (_$secNodeIdElement.hasClass(attDisable)) isEnableSec = false
  }

  return isEnableId && isEnableTop && isEnableSec
}

/**
 * 非使能控件
 */
let _handleDisabledWidget = function (id) {
  let _topNodeId = id + topNodeName,
    _secElement = id + secNodeName,
    _$idElement = $(id),
    _$topNodeIdElement = $(_topNodeId),
    _$secNodeIdElement = $(_secElement)

  if (_$topNodeIdElement.length > 0) {
    _$topNodeIdElement.attr(attDisable, attDisable)
    // 处理用样式控制使能的控件
    if (!_$topNodeIdElement.hasClass(attDisable))
      _$topNodeIdElement.addClass(attDisable)
  }

  if (_$idElement.length > 0) {
    _$idElement.attr(attDisable, attDisable)
    // 处理用样式控制使能的控件
    if (!_$idElement.hasClass(attDisable)) _$idElement.addClass(attDisable)
  }

  if (_$secNodeIdElement.length > 0) {
    _$secNodeIdElement.attr(attDisable, attDisable)
    // 处理用样式控制使能的控件
    if (!_$secNodeIdElement.hasClass(attDisable))
      _$secNodeIdElement.addClass(attDisable)
  }
}

/**
 * 使能控件
 */
let _handleEnabledWidget = function (id) {
  let _topNodeId = id + topNodeName,
    _secElement = id + secNodeName,
    _$idElement = $(id),
    _$topNodeIdElement = $(_topNodeId),
    _$secNodeIdElement = $(_secElement)

  if (_$topNodeIdElement.length > 0) {
    _$topNodeIdElement.removeAttr(attDisable)

    // 处理用样式控制使能的控件
    if (_$topNodeIdElement.hasClass(attDisable))
      _$topNodeIdElement.removeClass(attDisable)
  }

  if (_$idElement.length > 0) {
    _$idElement.removeAttr(attDisable)

    // 处理用样式控制使能的控件
    if (_$idElement.hasClass(attDisable)) _$idElement.removeClass(attDisable)
  }

  if (_$secNodeIdElement.length > 0) {
    _$secNodeIdElement.removeAttr(attDisable)

    // 处理用样式控制使能的控件
    if (_$secNodeIdElement.hasClass(attDisable))
      _$secNodeIdElement.removeClass(attDisable)
  }
}

export { setEnabled, getEnabled }
