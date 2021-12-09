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
const toNumber = function (val: string, def?: number): number | undefined {
  let res = parseFloat(val)
  return isNaN(res) ? def : res
}

/**
 * 转换成布尔值
 * @param val 转换值
 */
const toBoolean = function (val: string, def?: boolean): boolean {
  def = def === undefined ? false : def
  if (val === undefined) {
    return def
  }
  val = val.toLowerCase()
  return val == 'true' ? true : false
}

export {
  Component,
  Control,
  Height,
  Property,
  ReactEnum,
  toBoolean,
  toNumber,
  Width,
  Window
}