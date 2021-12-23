import { ContentAlignment } from '@v-act/jggrouppanel'
import {
  Control,
  ControlReact,
  JGGroupPanelProperty,
  ReactEnum
} from '@v-act/schema-types'

let SPACER_INST_INDEX = 0

/**
 * 布局子控件,根据子控件左边距、上边距、宽、高等信息进行布局
 * @param children 子控件
 * @returns
 */
const layoutControls = function (
  children: Control[],
  contianerReact: ControlReact,
  controlDefines: { [prop: string]: { defaultProps?: { [pro: string]: any } } }
) {
  if (children && children.length > 0 && contianerReact) {
    const sameLeftChildren: { [prop: string]: Control[] } = {}
    const sameTopChildren: { [prop: string]: Control[] } = {}
    //将左边距、上边距一致的控件堆放在数组中
    children.forEach((child) => {
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
    const newChildren: Control[] = []
    const used: Control[] = []
    const sameHeightChildren = getHLayoutFromTopSameChildren(
      sameTopChildren,
      controlDefines
    )
    sameHeightChildren.forEach((list) => {
      if (list.length > 0) {
        list = list.sort((item, item1) => {
          const l1 = parseInt(item.properties.left || '0')
          const l2 = parseInt(item1.properties.left || '0')
          return l1 - l2
        })
        const controls: Control[] = []
        const hLayoutProperties: JGGroupPanelProperty = {
          top:
            (getControlTop(list[0], controlDefines) / contianerReact.height) *
              100 +
            '%',
          multiHeight:
            (getControlHeight(list[0], controlDefines) /
              contianerReact.height) *
              100 +
            '%',
          multiWidth: ReactEnum.Space.toString(),
          contentAlignment: ContentAlignment.Horizontal,
          code: '_$inner_hlayout_' + SPACER_INST_INDEX++
        }
        const hLayout: Control = {
          type: 'JGGroupPanel',
          properties: hLayoutProperties,
          controls: controls
        }
        list.forEach((child, i) => {
          const preChild = list[i - 1]
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
          child.properties.multiWidth =
            (getControlWidth(child, controlDefines) / contianerReact.width) *
              100 +
            '%'
          controls.push(child)
          used.push(child)
        })
        newChildren.push(hLayout)
      }
    })
    const sameWidthChildren = getVLayoutFromLeftSameChildren(
      sameLeftChildren,
      controlDefines,
      used
    )
    sameWidthChildren.forEach((list) => {
      if (list.length > 0) {
        list = list.sort((item, item1) => {
          const l1 = parseInt(item.properties.top || '0')
          const l2 = parseInt(item1.properties.top || '0')
          return l1 - l2
        })
        const controls: Control[] = []
        const vLayoutProperties: JGGroupPanelProperty = {
          left:
            (getControlLeft(list[0], controlDefines) / contianerReact.width) *
              100 +
            '%',
          multiHeight: ReactEnum.Space.toString(),
          multiWidth:
            (getControlWidth(list[0], controlDefines) / contianerReact.width) *
              100 +
            '%',
          contentAlignment: ContentAlignment.Vertical,
          code: '_$inner_vlayout_' + SPACER_INST_INDEX++
        }
        const vLayout: Control = {
          type: 'JGGroupPanel',
          properties: vLayoutProperties,
          controls: controls
        }
        list.forEach((child, i) => {
          const preChild = list[i - 1]
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
          child.properties.multiHeight =
            (getControlHeight(child, controlDefines) / contianerReact.height) *
              100 +
            '%'
          child.properties.multiWidth = ReactEnum.Space.toString()

          controls.push(child)
          used.push(child)
        })
        newChildren.push(vLayout)
      }
    })
    children.forEach((child) => {
      if (used.indexOf(child) == -1) {
        newChildren.push(child)
      }
    })
    return newChildren
  }
  return children
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
  controlDefines: { [prop: string]: { defaultProps?: { [pro: string]: any } } },
  used: Control[]
) {
  const result: Array<Control[]> = []
  for (const key in sameLeftChildren) {
    if (Object.prototype.hasOwnProperty.call(sameLeftChildren, key)) {
      const sameWidthChildren: { [prop: string]: Control[] } = {}
      const controls = sameLeftChildren[key]
      controls.forEach((child) => {
        if (used.indexOf(child) == -1) {
          const width = getControlWidth(child, controlDefines)
          const sameWidthList = sameWidthChildren[width] || []
          sameWidthList.push(child)
          sameWidthChildren[width] = sameWidthList
        }
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
