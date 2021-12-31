import React from 'react'

import { Property } from 'csstype'

import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import { Height, Width } from '@v-act/schema-types'
import { useContext } from '@v-act/widget-context'
import { toHeight, toLabelWidth, toWidth } from '@v-act/widget-utils'
import { Aligment, ScrollbarDirection, TabAppearance } from './Enums'
import { JGTabPage } from './JGTabPage'

interface JGTabControlProps {
  /**
   * 左边距
   */
  left?: Property.Left
  /**
   * 上边距
   */
  top?: Property.Top
  /**
   * 高度
   */
  multiHeight?: Height
  /**
   * 宽度
   */
  multiWidth?: Width
  /**
   * 默认选中页
   */
  selectedIndex?: number
  /**
   * 显示
   */
  visible?: boolean

  /**
   * 页签头位置
   */
  alignment?: Aligment
  /**
   * 滚动条方向
   */
  scrollbarDir?: ScrollbarDirection

  /**
   * 外观
   */
  tabAppearance?: TabAppearance

  children?: Array<JSX.Element> | null
}

const JGTabControl = function (props: JGTabControlProps) {
  if (!props.visible) {
    return null
  }
  const context = useContext()
  const index = props.selectedIndex || 0
  const [value, setValue] = React.useState(index)
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }
  return (
    <Box
      sx={{
        position: context.position,
        left: props.left,
        top: props.top,
        width: toWidth(props.multiHeight, context, '235px'),
        height: toHeight(props.multiWidth, context, '26px')
      }}
    >
      <Tabs
        orientation={
          props.alignment == Aligment.Top || props.alignment == Aligment.Bottom
            ? 'horizontal'
            : 'vertical'
        }
        variant="scrollable"
        value={value}
        onChange={handleChange}
      >
        {props.children
          ? props.children.map((child) => {
              return (
                <Tab key={child.props.code} label={child.props.labelText}></Tab>
              )
            })
          : null}
      </Tabs>
      {props.children
        ? props.children.map((child, i) => {
            return (
              <JGTabPage
                key={child.props.code}
                {...child.props}
                value={value}
                index={i}
              >
                {child.props.children}
              </JGTabPage>
            )
          })
        : null}
    </Box>
  )
}

JGTabControl.defaultProps = {
  left: '0px',
  top: '0px',
  multiHeight: '100px',
  multiWidth: '200px',
  selectedIndex: 0,
  visible: true,
  alignment: Aligment.Top,
  scrollbarDir: ScrollbarDirection.Both,
  tabAppearance: TabAppearance.Line
}

export default JGTabControl
export { JGTabControl, type JGTabControlProps }
