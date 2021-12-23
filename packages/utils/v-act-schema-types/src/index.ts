import type Component from './Component'
import type Control from './Control'
import type ControlReact from './ControlReact'
import Dock from './Dock'
import type Height from './Height'
import type JGGroupPanelProperty from './properties/JGGroupPanelProperty'
import type JGReportProperty from './properties/JGReportProperty'
import type JGWebBrowserProperty from './properties/JGWebBrowserProperty'
import type Property from './Property'
import ReactEnum from './ReactEnum'
import type Width from './Width'
import type Window from './Window'

/**
 * 转换成数值,转换失败将返回def值
 * @deprecated
 * @param val 转换值
 * @param def 默认值
 */
const toNumber = function (
  val: string | undefined,
  def?: number
): number | undefined {
  val = val === undefined ? def + '' : val
  let res = parseFloat(val)
  return isNaN(res) ? def : res
}

/**
 * 转换成布尔值
 * @deprecated
 * @param val 转换值
 */
const toBoolean = function (val: string | undefined, def?: boolean): boolean {
  def = def === undefined ? false : def
  if (val === undefined) {
    return def
  }
  val = val.toLowerCase()
  return val == 'true' ? true : false
}

/**
 * @deprecated
 * @param val
 * @param def
 * @returns
 */
const valueofWidth = function (
  val: string | undefined,
  def: ReactEnum | Width
): Width {
  if (val === 'space') {
    return ReactEnum.Space
  } else if (val === 'content') {
    return ReactEnum.Content
  } else {
    if (val === undefined) {
      return def
    } else {
      return parseInt(val) + 'px'
    }
  }
}

/**
 *
 * @deprecated
 * @param val
 * @param def
 * @returns
 */
const valueofHeight = function (
  val: string | undefined,
  def: ReactEnum | Height
): Height {
  return valueofWidth(val, def)
}

export {
  Component,
  Control,
  ControlReact,
  Dock,
  Height,
  JGGroupPanelProperty,
  JGReportProperty,
  JGWebBrowserProperty,
  Property,
  ReactEnum,
  toBoolean,
  toNumber,
  valueofHeight,
  valueofWidth,
  Width,
  Window
}
