import {
  Control,
  ControlReact,
  JGContextProperty,
  WidgetDefines
} from '@v-act/schema-types'

import layoutChildrenByDock from './layoutChildrenByDock'
import layoutChildrenByPosition from './layoutChildrenByPosition'
import { getJGContextInstCode } from './utils'

let ALLOW_PERCENT_LAYOUT = true

const layoutByDock = function () {
  return true
}

/**
 * 布局子控件,根据子控件左边距、上边距、宽、高等信息进行布局
 * @param children 子控件
 * @returns
 */
const layoutControls = function (
  children: Control[],
  contianerReact: ControlReact,
  controlDefines: WidgetDefines
) {
  if (
    ALLOW_PERCENT_LAYOUT &&
    children &&
    children.length > 0 &&
    contianerReact
  ) {
    let newChildren: Control[] = []
    let dockedChildren: Control[] = []
    const absoluteChildren: Control[] = []
    children.forEach((child) => {
      if (child.properties.dock && child.properties.dock != 'None') {
        dockedChildren.push(child)
      } else {
        absoluteChildren.push(child)
      }
    })
    if (absoluteChildren.length > 0) {
      newChildren.push(dealWithAbsoluteChildren(absoluteChildren))
    }
    if (dockedChildren.length > 0) {
      if (layoutByDock()) {
        //泊靠控件为倒叙，需反转
        dockedChildren = dockedChildren.reverse()
        dockedChildren = layoutChildrenByDock(
          dockedChildren,
          contianerReact,
          controlDefines
        )
      } else {
        dockedChildren = layoutChildrenByPosition(
          dockedChildren,
          contianerReact,
          controlDefines
        )
      }
    }
    newChildren = newChildren.concat(dockedChildren)
    return newChildren
  }
  return children
}

/**
 * 处理锚定子控件
 * @param children 子控件
 * @returns
 */
const dealWithAbsoluteChildren = function (children: Control[]) {
  const properties: JGContextProperty = {
    code: getJGContextInstCode(),
    position: 'absolute'
  }
  const context: Control = {
    type: 'JGContext',
    properties: properties,
    controls: children
  }
  return context
}

export { layoutControls }
