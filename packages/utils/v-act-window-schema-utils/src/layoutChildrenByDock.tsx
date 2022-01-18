import { ContentAlignment } from '@v-act/jggrouppanel'
import {
  Control,
  ControlReact,
  JGGroupPanelProperty,
  WidgetDefines
} from '@v-act/schema-types'

import { getJGGroupPanelInstCode } from './utils'

/**
 * 根据泊靠布局子控件
 * @param children 子控件
 * @param contianerReact 容器宽高
 */
const layoutChildrenByDock = function (
  children: Control[],
  contianerReact: ControlReact,
  controlDefines: WidgetDefines
) {
  let headMembers: Control[] = [],
    centerMembers: Control[] = [],
    tailMembers: Control[] = []
  let layoutType: 'HLayout' | 'VLayout' | null = null
  for (let index = 0; index < children.length; index++) {
    const child = children[index]
    var flag = true
    if (isFillDock(child)) {
      //铺满不参与决定布局类型
      setFillDockReact(child)
      centerMembers.push(child)
    } else if (isHLayoutChild(child)) {
      setHorizontalDockRect(child)
      if (layoutType && layoutType !== 'HLayout') {
        flag = false
        centerMembers = centerMembers.concat(
          layoutChildrenByDock(
            children.splice(index),
            contianerReact,
            controlDefines
          )
        )
      } else {
        layoutType = 'HLayout'
        appendChild(child, headMembers, centerMembers, tailMembers)
      }
    } else if (isVLayoutChild(child)) {
      setVerticalDockRect(child)
      if (layoutType && layoutType !== 'VLayout') {
        flag = false
        centerMembers = centerMembers.concat(
          layoutChildrenByDock(
            children.splice(index),
            contianerReact,
            controlDefines
          )
        )
      } else {
        layoutType = 'VLayout'
        appendChild(child, headMembers, centerMembers, tailMembers)
      }
    }
    if (!flag) {
      break
    }
  }
  const members = headMembers.concat(centerMembers).concat(tailMembers)
  if (members.length > 0 && !layoutType) {
    layoutType = 'HLayout'
  }
  if (layoutType !== null) {
    const properties: JGGroupPanelProperty = {
      code: getJGGroupPanelInstCode(),
      contentAlignment:
        layoutType == 'HLayout'
          ? ContentAlignment.Horizontal
          : ContentAlignment.Vertical,
      multiHeight: 'space',
      multiWidth: 'space'
    }
    return [
      {
        type: 'JGGroupPanel',
        properties,
        controls: members
      }
    ]
  } else {
    return children
  }
}

const appendChild = function (
  child: Control,
  headMembers: Control[],
  centerMembers: Control[],
  tailMembers: Control[]
) {
  if (isHeadChild(child)) {
    headMembers.push(child)
  } else if (isTailChild(child)) {
    tailMembers.push(child)
  } else if (isCenterChild(child)) {
    centerMembers.push(child)
  } else {
    throw Error('未识别控件布局类型！')
  }
}

/**
 * 是否为头部控件（泊靠为Top、Left）
 */
const isHeadChild = function (child: Control) {
  var dock = getDock(child)
  return dock == 'Top' || dock == 'Left'
}
/**
 * 是否为尾部控件（泊靠为Bottom、Right）
 */
const isTailChild = function (child: Control) {
  var dock = getDock(child)
  return dock == 'Bottom' || dock == 'Right'
}
/**
 * 是否为居中控件
 */
const isCenterChild = function (child: Control) {
  var dock = getDock(child)
  return dock == 'Fill'
}

const setFillDockReact = function (child: Control) {
  const properties = child.properties
  properties.multiHeight = 'space'
  properties.multiWidth = 'space'
}

const setVerticalDockRect = function (child: Control) {
  const properties = child.properties
  properties.multiWidth = 'space'
}

const setHorizontalDockRect = function (child: Control) {
  const properties = child.properties
  properties.multiHeight = 'space'
}

const isFillDock = function (child: Control) {
  var dock = getDock(child)
  return dock == 'Fill'
}

const getDock = function (child: Control) {
  const properties = child.properties
  return properties.dock
}

const isHLayoutChild = function (child: Control) {
  const dock = getDock(child)
  return dock == 'Left' || dock == 'Right'
}

const isVLayoutChild = function (child: Control) {
  const dock = getDock(child)
  return dock == 'Top' || dock == 'Bottom'
}

export default layoutChildrenByDock
