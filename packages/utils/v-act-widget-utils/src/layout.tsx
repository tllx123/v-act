import { ContentAlignment } from '@v-act/jggrouppanel'
import { Control, ControlReact, ReactEnum } from '@v-act/schema-types'
import { toControlReact } from '.'

/**
 * 布局子控件,根据子控件左边距、上边距、宽、高等信息进行布局
 * @param children 子控件
 * @returns
 */
const layoutControls = function (
  children: Control[],
  contianerReact: ControlReact
) {
  if (children && children.length > 0) {
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
    const used = []
    const sameHeightChildren = getHLayoutFromTopSameChildren(sameTopChildren)
    sameHeightChildren.forEach((list) => {
      if (list.length > 1) {
        list = list.sort((item, item1) => {
          const l1 = parseInt(item.properties.left || '0')
          const l2 = parseInt(item1.properties.left || '0')
          return l1 - l2
        })
        const controls: Control[] = []
        const hLayout: Control = {
          type: 'JGGroupPanel',
          properties: {
            multiHeight: ReactEnum.Space.toString(),
            multiWidth: ReactEnum.Space.toString(),
            contentAlignment: ContentAlignment.Horizontal,
            code: '_$inner_' + new Date().getTime()
          },
          controls: controls
        }
        list.forEach((child) => {})
        newChildren.push(hLayout)
      }
    })
    return newChildren
  }
  return children
}
/**
 * 从上边距一致的控件中获取可以水平布局的控件
 */
const getHLayoutFromTopSameChildren = function (sameTopChildren: {
  [prop: string]: Control[]
}) {
  const result: Array<Control[]> = []
  for (const key in sameTopChildren) {
    if (Object.prototype.hasOwnProperty.call(sameTopChildren, key)) {
      const sameHeightChildren: { [prop: string]: Control[] } = {}
      const controls = sameTopChildren[key]
      controls.forEach((child) => {
        const height = child.properties.multiHeight || ''
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
  used: Control[]
) {
  const result: Array<Control[]> = []
  for (const key in sameLeftChildren) {
    if (Object.prototype.hasOwnProperty.call(sameLeftChildren, key)) {
      const sameWidthChildren: { [prop: string]: Control[] } = {}
      const controls = sameLeftChildren[key]
      controls.forEach((child) => {
        const width = child.properties.multiWidth || ''
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
