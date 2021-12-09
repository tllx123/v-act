import React, { forwardRef, CSSProperties } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import { Height, Width } from '@v-act/schema-types'

import { JGTabPage } from './JGTabPage'

/**
 * 页签头显示位置
 */
enum Aligment {
  /**
   * 顶部
   */
  Top = 'top',
  /**
   * 左边
   */
  Left = 'left',
  /**
   * 底部
   */
  Bottom = 'bottom',
  /**
   * 右边
   */
  Right = 'right'
}

/**
 * 滚动条位置
 */
enum ScrollbarDirection {
  /**
   * 垂直
   */
  Vertical = 'vertical',

  /**
   * 水平
   */
  Horizontal = 'horizontal',

  /**
   * 垂直及水平
   */
  Both = 'both'
}

/**
 * 页签外观
 */
enum TabAppearance {
  /**
   * 简洁
   */
  Line = 'line',
  /**
   * 卡式外框
   * @todo
   */
  Card = 'card'
}

interface JGTabControlProps {
  /**
   * 左边距
   */
  left?: number
  /**
   * 上边距
   */
  top?: number
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

  children?: Array<any>
}

const JGTabControl = function (props: JGTabControlProps) {
  if (!props.visible) {
    return null
  }
  const index = props.selectedIndex || 0
  const childrenCodes = props.children
    ? props.children.map((child) => {
        return child.props.code
      })
    : []
  const [value, setValue] = React.useState(childrenCodes[index])
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(childrenCodes[newValue])
  }
  return (
    <Box
      sx={{
        position: 'absolute',
        left: props.left,
        top: props.top,
        height: props.multiHeight,
        width: props.multiWidth
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
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: 'divider' }}
      >
        {props.children
          ? props.children.map((child) => {
              return (
                <Tab key={child.props.code} label={child.props.labelText}>
                  {child.children}
                </Tab>
              )
            })
          : null}
      </Tabs>
      {props.children
        ? props.children.map((child) => {
            return (
              <JGTabPage key={child.props.code} {...child.props}>
                {child.children}
              </JGTabPage>
            )
          })
        : null}
    </Box>
  )
}

JGTabControl.defaultProps = {
  left: 0,
  top: 0,
  multiHeight: '100px',
  multiWidth: '200px',
  selectedIndex: 0,
  visible: true,
  alignment: Aligment.Top,
  scrollbarDir: ScrollbarDirection.Both,
  tabAppearance: TabAppearance.Line
}

export default JGTabControl
export {
  JGTabControl,
  JGTabControlProps,
  Aligment,
  ScrollbarDirection,
  TabAppearance
}
