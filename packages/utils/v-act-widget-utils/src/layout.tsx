import { ContentAlignment } from '@v-act/jggrouppanel'
import {
  Control,
  ControlReact,
  JGContextProperty,
  JGGroupPanelProperty,
  ReactEnum,
  WidgetDefines
} from '@v-act/schema-types'

import adjustControlReactByDock from './adjustControlReactByDock'

let SPACER_INST_INDEX = 0

let ALLOW_PERCENT_LAYOUT = true

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
    const newChildren: Control[] = []
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
      //泊靠控件为倒叙，需反转
      dockedChildren = dockedChildren.reverse()
      adjustControlReactByDock(dockedChildren, contianerReact, controlDefines)
    }
    const sameLeftChildren: { [prop: string]: Control[] } = {}
    const sameTopChildren: { [prop: string]: Control[] } = {}
    //将左边距、上边距一致的控件堆放在数组中
    dockedChildren.forEach((child) => {
      const props = child.properties
      const left = props.left || '0'
      const top = props.top || '0'
      const sameLeftList = sameLeftChildren[left] || []
      const sameTopList = sameTopChildren[top] || []
      sameLeftList.push(child)
      sameTopList.push(child)
      sameLeftChildren[left] = sameLeftList
      sameTopChildren[top] = sameTopList
    })
    const sameHeightChildren = getHLayoutFromTopSameChildren(
      sameTopChildren,
      controlDefines
    )
    const sameWidthChildren = getVLayoutFromLeftSameChildren(
      sameLeftChildren,
      controlDefines
    )
    const catalogedChildren: Array<{
      type: string
      children: Control[]
    }> = []
    sameHeightChildren.forEach((list) => {
      catalogedChildren.push({
        type: 'sameTopAndHeight',
        children: list
      })
    })
    sameWidthChildren.forEach((list) => {
      catalogedChildren.push({
        type: 'sameLeftAndWidth',
        children: list
      })
    })
    sortCatalogedChildren(catalogedChildren)
    while (catalogedChildren.length > 0) {
      const item = catalogedChildren.pop()
      if (item) {
        const children = item.children
        if (item.type == 'sameTopAndHeight') {
          const control = dealWithSameTopAndHeightChildren(
            children,
            controlDefines,
            contianerReact
          )
          if (control) {
            newChildren.push(control)
          }
        } else {
          const control = dealWithSameLeftAndWidthChildren(
            children,
            controlDefines,
            contianerReact
          )
          if (control) {
            newChildren.push(control)
          }
        }
        removeUsedChildren(children, catalogedChildren)
        sortCatalogedChildren(catalogedChildren)
      }
    }
    return newChildren
  }
  return children
}

const removeUsedChildren = function (
  used: Array<Control>,
  catalogedChildren: Array<{
    type: string
    children: Control[]
  }>
) {
  used.forEach((control) => {
    for (let i = 0; i < catalogedChildren.length; i++) {
      const item = catalogedChildren[i]
      const index = item.children.indexOf(control)
      if (index != -1) {
        item.children.splice(index, 1)
        if (item.children.length == 0) {
          catalogedChildren.splice(i, 1)
          i--
        }
      }
    }
  })
}

const sortCatalogedChildren = function (
  catalogedChildren: Array<{
    type: string
    children: Control[]
  }>
) {
  catalogedChildren.sort((item, item1) => {
    const children = item.children
    const children1 = item1.children
    return children.length >= children1.length ? 1 : -1
  })
}

let JGCONTEXT_INST_INDEX = 0

/**
 * 处理锚定子控件
 * @param children 子控件
 * @returns
 */
const dealWithAbsoluteChildren = function (children: Control[]) {
  const properties: JGContextProperty = {
    code: 'JGContext_' + JGCONTEXT_INST_INDEX++,
    position: 'absolute'
  }
  const context: Control = {
    type: 'JGContext',
    properties: properties,
    controls: children
  }
  return context
}
/**
 * 包装static位置
 * @param children 子控件
 * @returns
 */
const wrapWithStaticPosition = function (children: Control[]) {
  const properties: JGContextProperty = {
    code: 'JGContext_' + JGCONTEXT_INST_INDEX++,
    position: 'static'
  }
  const context: Control = {
    type: 'JGContext',
    properties: properties,
    controls: children
  }
  return context
}

/**
 * 处理上边距和高度相同的子控件
 * @param children
 */
const dealWithSameTopAndHeightChildren = function (
  children: Array<Control>,
  controlDefines: { [prop: string]: { defaultProps?: { [pro: string]: any } } },
  contianerReact: ControlReact
) {
  if (children.length > 0) {
    children = children.sort((item, item1) => {
      const l1 = parseInt(item.properties.left || '0')
      const l2 = parseInt(item1.properties.left || '0')
      return l1 - l2
    })
    const controls: Control[] = []
    /*let groupPanelHeight: string | number = 0
    for (let index = 0; index < children.length; index++) {
      const element = children[index]
      let height = element.properties.multiHeight || element.properties.height
      if (height === undefined) {
        const widgetDefine = controlDefines[element.type]
        if (widgetDefine) {
          const defaultProps = widgetDefine.defaultProps
          if (defaultProps) {
            height = defaultProps.height || defaultProps.multiHeight
          }
        }
      }
      if (height == 'space' || height == 'content') {
        groupPanelHeight = height
        break
      } else {
        if (groupPanelHeight == null) {
          groupPanelHeight = 0
        }
        groupPanelHeight += height ? parseInt(height) : 0
      }
    }
    if (typeof groupPanelHeight == 'number') {
      groupPanelHeight = groupPanelHeight + 'px'
    }*/
    const hLayoutProperties: JGGroupPanelProperty = {
      top:
        (getControlTop(children[0], controlDefines) / contianerReact.height) *
          100 +
        '%',
      multiHeight:
        (getControlHeight(children[0], controlDefines) /
          contianerReact.height) *
          100 +
        '%',
      //multiHeight: groupPanelHeight,
      multiWidth: ReactEnum.Space.toString(),
      contentAlignment: ContentAlignment.Horizontal,
      code: '_$inner_hlayout_' + SPACER_INST_INDEX++
    }
    const hLayout: Control = {
      type: 'JGGroupPanel',
      properties: hLayoutProperties,
      controls: controls
    }
    children.forEach((child, i) => {
      const preChild = children[i - 1]
      const preChildLeft = preChild
        ? parseInt(preChild.properties.left || '0')
        : 0
      const preChildWidth = preChild
        ? getControlWidth(preChild, controlDefines)
        : 0
      const left = parseInt(child.properties.left || '0')
      const delta = left - preChildLeft - preChildWidth
      if (delta > 0) {
        controls.push({
          type: 'JGSpacer',
          properties: {
            code: '_$inner_spacer_' + SPACER_INST_INDEX++,
            multiHeight: ReactEnum.Space.toString(),
            multiWidth: (delta / contianerReact.width) * 100 + '%'
          },
          controls: []
        })
      }
      child.properties.multiHeight = ReactEnum.Space.toString()
      /*child.properties.multiWidth =
        (getControlWidth(child, controlDefines) / contianerReact.width) * 100 +
        '%'*/
      controls.push(child)
    })
    return wrapWithStaticPosition([hLayout])
  }
  return null
}
/**
 * 处理左边距和宽度相同的子控件
 * @param children
 */
const dealWithSameLeftAndWidthChildren = function (
  children: Array<Control>,
  controlDefines: { [prop: string]: { defaultProps?: { [pro: string]: any } } },
  contianerReact: ControlReact
) {
  if (children.length > 0) {
    children = children.sort((item, item1) => {
      const l1 = parseInt(item.properties.top || '0')
      const l2 = parseInt(item1.properties.top || '0')
      return l1 - l2
    })
    /*let groupPanelWidth: string | number = 0
    for (let index = 0; index < children.length; index++) {
      const element = children[index]
      let width = element.properties.multiWidth || element.properties.width
      if (width === undefined) {
        const widgetDefine = controlDefines[element.type]
        if (widgetDefine) {
          const defaultProps = widgetDefine.defaultProps
          if (defaultProps) {
            width = defaultProps.width || defaultProps.multiWidth
          }
        }
      }
      if (width == 'space' || width == 'content') {
        groupPanelWidth = width
        break
      } else {
        if (groupPanelWidth == null) {
          groupPanelWidth = 0
        }
        groupPanelWidth += width ? parseInt(width) : 0
      }
    }
    if (typeof groupPanelWidth == 'number') {
      groupPanelWidth = groupPanelWidth + 'px'
    }*/
    const controls: Control[] = []
    const vLayoutProperties: JGGroupPanelProperty = {
      left:
        (getControlLeft(children[0], controlDefines) / contianerReact.width) *
          100 +
        '%',
      multiHeight: ReactEnum.Space.toString(),
      multiWidth:
        (getControlWidth(children[0], controlDefines) / contianerReact.width) *
          100 +
        '%',
      //multiWidth: groupPanelWidth,
      contentAlignment: ContentAlignment.Vertical,
      code: '_$inner_vlayout_' + SPACER_INST_INDEX++
    }
    const vLayout: Control = {
      type: 'JGGroupPanel',
      properties: vLayoutProperties,
      controls: controls
    }
    children.forEach((child, i) => {
      const preChild = children[i - 1]
      const preChildTop = preChild
        ? parseInt(preChild.properties.top || '0')
        : 0
      const preChildHeight = preChild
        ? getControlHeight(preChild, controlDefines)
        : 0
      const left = parseInt(child.properties.top || '0')
      const delta = left - preChildTop - preChildHeight
      if (delta > 0) {
        controls.push({
          type: 'JGSpacer',
          properties: {
            code: '_$inner_spacer_' + SPACER_INST_INDEX++,
            multiHeight: (delta / contianerReact.height) * 100 + '%',
            multiWidth: ReactEnum.Space.toString()
          },
          controls: []
        })
      }
      /*child.properties.multiHeight =
        (getControlHeight(child, controlDefines) / contianerReact.height) *
          100 +
        '%'*/
      child.properties.multiWidth = ReactEnum.Space.toString()

      controls.push(child)
    })
    return wrapWithStaticPosition([vLayout])
  }
  return null
}
/**
 * 从上边距一致的控件中获取可以水平布局的控件
 */
const getHLayoutFromTopSameChildren = function (
  sameTopChildren: {
    [prop: string]: Control[]
  },
  controlDefines: { [prop: string]: { defaultProps?: { [pro: string]: any } } }
) {
  const result: Array<Control[]> = []
  for (const key in sameTopChildren) {
    if (Object.prototype.hasOwnProperty.call(sameTopChildren, key)) {
      const sameHeightChildren: { [prop: string]: Control[] } = {}
      const controls = sameTopChildren[key]
      controls.forEach((child) => {
        const height = getControlHeight(child, controlDefines)
        const sameHeightList = sameHeightChildren[height] || []
        sameHeightList.push(child)
        sameHeightChildren[height] = sameHeightList
      })
      for (const height in sameHeightChildren) {
        if (Object.prototype.hasOwnProperty.call(sameHeightChildren, height)) {
          result.push(sameHeightChildren[height])
        }
      }
    }
  }
  return result
}

const getControlHeight = function (
  control: Control,
  controlDefines: { [prop: string]: { defaultProps?: { [pro: string]: any } } }
): number {
  if (control.properties.height) {
    return parseInt(control.properties.height)
  } else {
    if (
      control.properties.multiHeight &&
      control.properties.multiHeight.endsWith('px')
    ) {
      return parseInt(control.properties.multiHeight)
    }
    if (control.properties.multiHeight == 'space') {
      return -1
    }
    const widgetType = control.type
    const widgetDefine = controlDefines[widgetType]
    if (widgetDefine) {
      const defaultProps = widgetDefine.defaultProps
      let height
      if (defaultProps) {
        height = defaultProps.height || defaultProps.multiHeight
      }
      height = parseInt(height)
      if (isNaN(height)) {
        throw Error(
          `控件未定义height或multiHeight默认值！ 控件类型：${widgetType}`
        )
      }
      return height
    } else {
      throw Error(`未找到控件定义！控件类型：${widgetType}`)
    }
  }
}

const getControlLeft = function (
  control: Control,
  controlDefines: { [prop: string]: { defaultProps?: { [pro: string]: any } } }
) {
  if (control.properties.left) {
    return parseInt(control.properties.left)
  } else {
    const widgetType = control.type
    const widgetDefine = controlDefines[widgetType]
    if (widgetDefine) {
      const defaultProps = widgetDefine.defaultProps
      let left
      if (defaultProps) {
        left = defaultProps.left
      }
      left = parseInt(left)
      if (isNaN(left)) {
        left = 0
      }
      return left
    } else {
      throw Error(`未找到控件定义！控件类型：${widgetType}`)
    }
  }
}

const getControlTop = function (
  control: Control,
  controlDefines: { [prop: string]: { defaultProps?: { [pro: string]: any } } }
) {
  if (control.properties.top) {
    return parseInt(control.properties.top)
  } else {
    const widgetType = control.type
    const widgetDefine = controlDefines[widgetType]
    if (widgetDefine) {
      const defaultProps = widgetDefine.defaultProps
      let top
      if (defaultProps) {
        top = defaultProps.top
      }
      top = parseInt(top)
      if (isNaN(top)) {
        top = 0
      }
      return top
    } else {
      throw Error(`未找到控件定义！控件类型：${widgetType}`)
    }
  }
}

const getControlWidth = function (
  control: Control,
  controlDefines: { [prop: string]: { defaultProps?: { [pro: string]: any } } }
): number {
  if (control.properties.width) {
    return parseInt(control.properties.width)
  } else {
    if (
      control.properties.multiWidth &&
      control.properties.multiWidth.endsWith('px')
    ) {
      return parseInt(control.properties.multiWidth)
    }
    if (control.properties.multiWidth === 'space') {
      return -1
    }
    const widgetType = control.type
    const widgetDefine = controlDefines[widgetType]
    if (widgetDefine) {
      const defaultProps = widgetDefine.defaultProps
      let width
      if (defaultProps) {
        width = defaultProps.width || defaultProps.multiWidth
      }
      width = parseInt(width)
      if (isNaN(width)) {
        throw Error(
          `控件未定义width或multiWidth默认值！ 控件类型：${widgetType}`
        )
      }
      return width
    } else {
      throw Error(`未找到控件定义！控件类型：${widgetType}`)
    }
  }
}

const getVLayoutFromLeftSameChildren = function (
  sameLeftChildren: {
    [prop: string]: Control[]
  },
  controlDefines: { [prop: string]: { defaultProps?: { [pro: string]: any } } }
) {
  const result: Array<Control[]> = []
  for (const key in sameLeftChildren) {
    if (Object.prototype.hasOwnProperty.call(sameLeftChildren, key)) {
      const sameWidthChildren: { [prop: string]: Control[] } = {}
      const controls = sameLeftChildren[key]
      controls.forEach((child) => {
        const width = getControlWidth(child, controlDefines)
        const sameWidthList = sameWidthChildren[width] || []
        sameWidthList.push(child)
        sameWidthChildren[width] = sameWidthList
      })
      for (const height in sameWidthChildren) {
        if (Object.prototype.hasOwnProperty.call(sameWidthChildren, height)) {
          result.push(sameWidthChildren[height])
        }
      }
    }
  }
  return result
}
export { layoutControls }
