import { Fragment } from 'react'

import { Property as CSSProperty } from 'csstype'

import { Dock, Height, Property, ReactEnum, Width } from '@v-act/schema-types'
import { WidgetContextProps } from '@v-act/widget-context'

import { layoutControls } from './layout'

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
      return val.endsWith('%') ? val : parseInt(val) + 'px'
    }
  }
}

const valueofHeight = function (
  val: string | undefined,
  def: ReactEnum | Height
): Height {
  return valueofWidth(val, def)
}

const toHeight = function (
  val: Height | undefined,
  context: WidgetContextProps | undefined,
  def: CSSProperty.Height
): CSSProperty.Height {
  return toCssAxisVal(
    context ? (context.multiHeight ? context.multiHeight : val) : val,
    def
  )
}

const toWidth = function (
  val: Width | undefined,
  context: WidgetContextProps | undefined,
  def: CSSProperty.Width
): CSSProperty.Width {
  return toCssAxisVal(
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
  //服务端渲染不支持document
  /*const domId = 'test_' + new Date().getTime()
  const span = document.createElement('span')
  span.id = domId
  span.style.top = '-10px'
  span.style.position = 'absolute'
  span.innerText = title
  document.body.appendChild(span)
  let width = span.offsetWidth + 30
  width = width > maxTitleWidth ? maxTitleWidth : width
  document.body.removeChild(span)*/
  var width = title.length * 16 + 30
  width = width > maxTitleWidth ? maxTitleWidth : width
  return width
}

const getChildrenTitleWidth = function (children: JSX.Element[]): number {
  let titleWidth = 0
  for (let index = 0; index < children.length; index++) {
    const child = children[index]
    if (child.type && child.type.toString().indexOf('react.fragment') != -1) {
      const childList = child.props.children
      if (childList) {
        const w = getChildrenTitleWidth(
          Array.isArray(childList) ? childList : [childList]
        )
        titleWidth = titleWidth > w ? titleWidth : w
      }
    } else {
      const childProps = child.props
      const w = calTitleWidth(childProps.labelText)
      titleWidth = titleWidth > w ? titleWidth : w
    }
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

const toControlReact = function (properties: Property) {
  return {
    width: properties.width,
    height: properties.height
  }
}

const getChildrenWithoutFragment = function (
  element: JSX.Element | JSX.Element[] | null | undefined
): JSX.Element[] {
  if (element) {
    if (Array.isArray(element)) {
      return element
    } else {
      if (element.type === Fragment) {
        const children = element.props.children
        if (Array.isArray(children)) {
          return children
        } else {
          return [children]
        }
      }
      return [element]
    }
  }
  return []
}

const getChildrenWithoutFragmentRecursively = function (
  element: JSX.Element | JSX.Element[] | null | undefined
): JSX.Element[] {
  let children: JSX.Element[] = []
  if (element) {
    if (Array.isArray(element)) {
      element.forEach((ele) => {
        children = children.concat(getChildrenWithoutFragmentRecursively(ele))
      })
    } else {
      if (element.type === Fragment) {
        const childList = element.props.children
        children = children.concat(
          getChildrenWithoutFragmentRecursively(childList)
        )
      } else {
        children.push(element)
      }
    }
  }
  return children
}

const isPercent = function (val: string | null | undefined) {
  if (typeof val == 'string') {
    return val.endsWith('%')
  }
  return false
}

/**
 * 转换从成css坐标信息(宽、高、上边距、左边距等)
 */
const toCssAxisVal = function (
  val: ReactEnum | string | Width | Height | undefined | null,
  def:
    | string
    | CSSProperty.Height
    | CSSProperty.Width
    | CSSProperty.Left
    | CSSProperty.Top
) {
  if (val === ReactEnum.Space) {
    return '100%'
  } else if (val === ReactEnum.Content) {
    return 'auto'
  } else if (typeof val === 'string') {
    let val1 = parseInt(val)
    return val1 + '' === val ? val + 'px' : val
  } else {
    return def
  }
}

export {
  calTitleWidth,
  getChildrenTitleWidth,
  getChildrenWithoutFragment,
  getChildrenWithoutFragmentRecursively,
  isPercent,
  layoutControls,
  toBoolean,
  toControlReact,
  toCssAxisVal,
  toHeight,
  toLabelWidth,
  toNumber,
  toWidth,
  valueofDock,
  valueofHeight,
  valueofWidth
}
