import * as $ from '@v-act/vjs.framework.extension.vendor.jquery'
const vds = { $ }
let isMust, topNodeName

export function initModule(sb) {
  topNodeName = '_topnode'
  isMust = 'has-error'
}

let setIsMust = function (id: string, state: any) {
  let _id = '#' + id
  if (state && state + '' === 'true') _handleRequireWidget(_id)
  else _handleUnRequireWidget(_id)
}

let getIsMust = function (id: string) {
  let _id = '#' + id,
    _topNodeId = _id + topNodeName,
    _$idElement = $(_id),
    _$topNodeIdElement = $(_topNodeId),
    isMust = false

  if (_$topNodeIdElement.length > 0) {
    if (!_$topNodeIdElement.hasClass(isMust)) isMust = true
  } else if (_$idElement.length > 0) {
    if (!_$idElement.hasClass(isMust)) isMust = true
  }

  return isMust
}

/**
 * 控件必填
 */
let _handleRequireWidget = function (id: string) {
  let _topNodeId = id + topNodeName,
    _$idElement = $(id),
    _$topNodeIdElement = $(_topNodeId)

  if (_$topNodeIdElement.length > 0) {
    if (!_$topNodeIdElement.hasClass(isMust))
      _$topNodeIdElement.addClass(isMust)
  } else if (_$idElement.length > 0) {
    if (!_$idElement.hasClass(isMust)) _$idElement.addClass(isMust)
  }
}

/**
 * 去除控件必填
 */
let _handleUnRequireWidget = function (id: string) {
  let _topNodeId = id + topNodeName,
    _$idElement = $(id),
    _$topNodeIdElement = $(_topNodeId)

  if (_$topNodeIdElement.length > 0) {
    if (_$topNodeIdElement.hasClass(isMust))
      _$topNodeIdElement.removeClass(isMust)
  } else if (_$idElement.length > 0) {
    if (_$idElement.hasClass(isMust)) _$idElement.removeClass(isMust)
  }
}

export { setIsMust }
