import { Control, ControlReact, WidgetDefines } from '@v-act/schema-types'

/**
 * 根据泊靠调整控件宽、高、左边距、上边距信息（解决开发系统生成不正确问题）
 * @param children 子控件
 * @param contianerReact 容器宽高
 */
const adjustControlReactByDock = function (
  children: Control[],
  contianerReact: ControlReact,
  controlDefines: WidgetDefines
) {
  let containerWidthLeft = contianerReact.width,
    containerHeightLeft = contianerReact.height
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

export default adjustControlReactByDock
