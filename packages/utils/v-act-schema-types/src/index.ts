import { Property as CSSProperty } from 'csstype'

import { WidgetContextProps } from '@v-act/widget-context'

import type Component from './Component'
import type Control from './Control'
import type Height from './Height'
import type Property from './Property'
import ReactEnum from './ReactEnum'
import type Width from './Width'
import type Window from './Window'

/**
 * 转换成数值,转换失败将返回def值
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

const valueofHeight = function (
  val: string | undefined,
  def: ReactEnum | Height
): Height {
  return valueofWidth(val, def)
}

const toReactVal = function (
  val: Width | Height | undefined,
  def: CSSProperty.Height | CSSProperty.Width
) {
  return val === ReactEnum.Space
    ? '100%'
    : val == ReactEnum.Content
    ? '1px'
    : val
    ? val
    : def
}

const toHeight = function (
  val: Height | undefined,
  context: WidgetContextProps | undefined,
  def: CSSProperty.Height
): CSSProperty.Height {
  return toReactVal(
    context ? (context.multiHeight ? context.multiHeight : val) : val,
    def
  )
}

const toWidth = function (
  val: Width | undefined,
  context: WidgetContextProps | undefined,
  def: CSSProperty.Width
): CSSProperty.Width {
  return toReactVal(
    context ? (context.multiWidth ? context.multiWidth : val) : val,
    def
  )
}

const toLabelWidth = function (
  val: number | undefined,
  context: WidgetContextProps | undefined,
  def: number
): number {
  if (context && typeof context.labelWidth == 'number') {
    return context.labelWidth
  }
  return typeof val == 'number' ? val : def
}

export {
  Component,
  Control,
  Height,
  Property,
  ReactEnum,
  toBoolean,
  toHeight,
  toLabelWidth,
  toNumber,
  toWidth,
  valueofHeight,
  valueofWidth,
  Width,
  Window
}
