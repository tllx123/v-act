let sandbox, topNodeName, secNodeName, attReadOnly

exports.initModule = function (sb) {
  sandbox = sb
  topNodeName = '_topnode'
  secNodeName = '_secondnode'
  attReadOnly = 'readonly'
}

/**
 * 设置控件只读属性值
 */
let setReadOnly = function (id, state) {
  let _id = '#' + id
  if (state && state + '' === 'true') _handleReadOnlyWidget(_id)
  else _handleEditableWidget(_id)
}

/**
 * 获取控件只读属性值
 */
let getReadOnly = function (id) {
  let _id = '#' + id,
    _topNodeId = _id + topNodeName,
    _secElement = id + secNodeName,
    _$idElement = $(_id),
    _$topNodeIdElement = $(_topNodeId),
    _$secNodeIdElement = $(_secElement),
    isReadOnlyId = true,
    isReadOnlyTop = true,
    isReadOnlySec = true

  if (_$idElement.length > 0) {
    if (typeof _$idElement.attr(attReadOnly) == 'undefined')
      isReadOnlyId = false
  }

  if (_$topNodeIdElement.length > 0) {
    if (typeof _$topNodeIdElement.attr(attReadOnly) == 'undefined')
      isReadOnlyTop = false
  }

  if (_$secNodeIdElement.length > 0) {
    if (typeof _$secNodeIdElement.attr(attReadOnly) == 'undefined')
      isReadOnlySec = false
  }

  return isReadOnlyId && isReadOnlyTop && isReadOnlySec
}

/**
 * 设置控件只读
 */
let _handleReadOnlyWidget = function (id) {
  let _topNodeId = id + topNodeName,
    _secElement = id + secNodeName,
    _$idElement = $(id),
    _$topNodeIdElement = $(_topNodeId),
    _$secNodeIdElement = $(_secElement)

  if (_$idElement.length > 0) _$idElement.attr(attReadOnly, attReadOnly)

  if (_$topNodeIdElement.length > 0)
    _$topNodeIdElement.attr(attReadOnly, attReadOnly)

  if (_$secNodeIdElement.length > 0)
    _$secNodeIdElement.attr(attReadOnly, attReadOnly)
}

/**
 * 设置控件可编辑
 */
let _handleEditableWidget = function (id) {
  let _topNodeId = id + topNodeName,
    _secElement = id + secNodeName,
    _$idElement = $(id),
    _$topNodeIdElement = $(_topNodeId),
    _$secNodeIdElement = $(_secElement)

  if (_$idElement.length > 0) _$idElement.removeAttr(attReadOnly)

  if (_$topNodeIdElement.length > 0) _$topNodeIdElement.removeAttr(attReadOnly)

  if (_$secNodeIdElement.length > 0) _$secNodeIdElement.removeAttr(attReadOnly)
}

export { setEnabled, getEnabled, setIsMust, setReadOnly, getReadOnly }
