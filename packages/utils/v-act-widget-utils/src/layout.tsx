import { Control, Dock } from '@v-act/schema-types'

import { valueofDock } from './'

interface DockControl {
  dock: Dock
  control: Control
}

/**
 * 子控件是否有泊靠
 * @param children 子控件
 * @returns
 */
const hasDock = function (children: Control[]) {
  for (let index = 0; index < children.length; index++) {
    const child = children[index]
    const childProps = child.properties
    const dock = valueofDock(childProps.dock)
    if (dock !== Dock.None) {
      return true
    }
  }
  return false
}
/**
 * 分类子控件，将泊靠子控件和锚定子控件分类
 * @param children 子控件
 * @returns
 */
const filterChildren = function (children: Control[]): {
  dockChildren: DockControl[]
  absChildren: Control[]
} {
  const result: {
    dockChildren: DockControl[]
    absChildren: Control[]
  } = {
    dockChildren: [],
    absChildren: []
  }
  children.forEach((child) => {
    const childDock = valueofDock(child.properties.dock)
    if (childDock !== Dock.None) {
      result.dockChildren.push({
        dock: childDock,
        control: child
      })
    } else {
      result.absChildren.push(child)
    }
  })
  return result
}

/**
 * 布局子控件
 * @param children 子控件
 * @returns
 */
const layoutControls = function (children: Control[]) {
  const docked = hasDock(children)
  if (docked) {
    //子控件有泊靠时，泊靠顺序为倒序，需要反转
    children = children.reverse()
    const catalogChildren = filterChildren(children)
    const dockChildren = catalogChildren.dockChildren
    let hLayout = isHLayout(dockChildren[0].dock) //编组内容排列类型，可选值：Horizontal（水平排列），Vertical（垂直排列），Table（网格排列）
    let headChildren = [],
      bodyChildren = [],
      tailChildren = []
    let index = 0
    while (index < dockChildren.length) {
      const dockChild = dockChildren[index]
      const dock = dockChild.dock
      if (hLayout !== isHLayout(dock)) {
        break
      }
      if (dock === Dock.Top || dock === Dock.Left) {
        headChildren.push(dockChild.control)
      } else if (dock === Dock.Bottom || dock === Dock.Right) {
        tailChildren.push(dockChild.control)
      } else {
        bodyChildren.push(dockChild.control)
      }
      index++
    }
  }
  return children
}
/**
 * 是否为水平布局
 * @param dock 泊靠
 */
const isHLayout = function (dock: Dock) {
  return dock === Dock.Left || dock === Dock.Right || dock === Dock.Fill
}
/**
 * 是否为垂直布局
 * @param dock 泊靠
 * @returns
 */
const isVLayout = function (dock: Dock) {
  return dock === Dock.Top || dock === Dock.Bottom || dock === Dock.Fill
}
