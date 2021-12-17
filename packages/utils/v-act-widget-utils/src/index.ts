import { Property as CSSProperty } from 'csstype'

import { Dock, Height, ReactEnum, Width } from '@v-act/schema-types'
import { WidgetContextProps } from '@v-act/widget-context'

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

const maxTitleWidth = 196

const calTitleWidth = function (title: string): number {
  title = title || ''
  const domId = 'test_' + new Date().getTime()
  const span = document.createElement('span')
  span.id = domId
  span.style.top = '-10px'
  span.style.position = 'absolute'
  span.innerText = title
  document.body.appendChild(span)
  let width = span.offsetWidth + 30
  width = width > maxTitleWidth ? maxTitleWidth : width
  document.body.removeChild(span)
  return width
}

const getChildrenTitleWidth = function (children: JSX.Element[]): number {
  let titleWidth = 0
  for (let index = 0; index < children.length; index++) {
    const child = children[index]
    const childProps = child.props
    const w = calTitleWidth(childProps.labelText)
    titleWidth = titleWidth > w ? titleWidth : w
  }
  return titleWidth
}

const valueofDock = function (dock?: string): Dock {
  switch (dock) {
    case 'Top':
      return Dock.Top
    case 'Left':
      return Dock.Left
    case 'Right':
      return Dock.Right
    case 'Bottom':
      return Dock.Bottom
    case 'Fill':
      return Dock.Fill
    default:
      return Dock.None
  }
}

export {
  calTitleWidth,
  getChildrenTitleWidth,
  toBoolean,
  toHeight,
  toLabelWidth,
  toNumber,
  toWidth,
  valueofDock,
  valueofHeight,
  valueofWidth
}
