import {
  Control,
  JGTabControlProperty,
  WidgetRenderContext,
  WidgetRenderer
} from '@v-act/schema-types'
import {
  toBoolean,
  toCssAxisVal,
  toNumber,
  isNullOrUnDef
} from '@v-act/widget-utils'

import {
  Aligment,
  ScrollbarDirection,
  TabAppearance,
  valueofAligment,
  valueofScrollbarDirection,
  valueofTabAppearance
} from './Enums'
import { JGTabControl, JGTabControlProps } from './JGTabControl'
import { convert as convertJGTabPage, JGTabPage } from './JGTabPage'

/**
 * 获取选中页签页下标
 * 1、如果页签页属性有设置selected为True，优先使用
 * 2、否则根据页签selectedIndex来设置，selectedIndex属性值支持下标和页签页编号
 * @param control 页签配置信息
 */
const getSelectedIndex = function (control: Control) {
  let selectedIndex = -1
  const pros: JGTabControlProperty = control.properties
  if (control.controls) {
    //优先查找页签页是否配置selected（规则设置）
    for (let index = 0; index < control.controls.length; index++) {
      const con = control.controls[index]
      //@ts-ignore
      if (con.properties.selected) {
        selectedIndex = index
        break
      }
    }
    if (selectedIndex == -1) {
      //页签页未设置selected
      if (isNullOrUnDef(pros.selectedIndex)) {
        //页签未设置选中页，默认选中第一页
        selectedIndex = 0
      } else {
        const temp = toNumber(pros.selectedIndex, -1)
        if (temp == -1) {
          //页签选中页为页签页编号
          for (let index = 0; index < control.controls.length; index++) {
            const con = control.controls[index]
            //@ts-ignore
            if ((con.properties.code = pros.selectedIndex)) {
              selectedIndex = index
              break
            }
          }
        } else {
          selectedIndex = temp || 0
        }
      }
    }
  }
  return selectedIndex
}

const convert = function (
  control: Control,
  render: WidgetRenderer,
  componentCode: string,
  context: WidgetRenderContext
): JSX.Element {
  const pros: JGTabControlProperty = control.properties
  const props: JGTabControlProps = {
    top: toCssAxisVal(pros.top, '0px'),
    left: toCssAxisVal(pros.left, '0px'),
    multiWidth: toCssAxisVal(pros.multiWidth, '200px'),
    multiHeight: toCssAxisVal(pros.multiHeight, '100px'),
    visible: toBoolean(pros.visible, true),
    selectedIndex: getSelectedIndex(control),
    disabled: !toBoolean(pros.enabled, true),
    alignment: pros.alignment ? valueofAligment(pros.alignment) : Aligment.Top,
    tabHeadWidth: toNumber(pros.tabHeadWidth, 110),
    scrollbarDir: pros.scrollbarDir
      ? valueofScrollbarDirection(pros.scrollbarDir)
      : ScrollbarDirection.Both,
    tabAppearance: pros.tabAppearance
      ? valueofTabAppearance(pros.tabAppearance)
      : TabAppearance.Line
  }
  return (
    <JGTabControl {...props}>
      {control.controls
        ? control.controls.map((con: Control) => {
            return convertJGTabPage(con, render, control)
          })
        : null}
    </JGTabControl>
  )
}

const JsonJGTabControl = function (props: {
  control: Control
  render: WidgetRenderer
  componentCode: string
  context: WidgetRenderContext
}) {
  return convert(
    props.control,
    props.render,
    props.componentCode,
    props.context
  )
}

export default JGTabControl

export { convert, JGTabControl, JGTabPage, JsonJGTabControl }
