import React from 'react'

import { Property } from 'csstype'

import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import makeStyles from '@mui/styles/makeStyles'
import { Height, Width } from '@v-act/schema-types'
import { useContext } from '@v-act/widget-context'
import { toHeight, toWidth } from '@v-act/widget-utils'

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

  disabled?: boolean
  /**
   * 是否显示页签头
   */
  tabBarVisible?: boolean

  children?: Array<JSX.Element> | null
}

const useStyles = makeStyles({
  topIndicator: { top: '0px' },
  leftIndicator: { left: '0px' },
  bottomIndicator: { bottom: '0px' },
  rightIndicator: { right: '0px' }
})

const JGTabControl = function (props: JGTabControlProps) {
  if (!props.visible) {
    return null
  }
  const tabBarVisible = props.tabBarVisible
  const disabled = props.disabled
  const context = useContext()
  const index = props.selectedIndex || 0
  const [value, setValue] = React.useState(index)
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }
  const alignment = props.alignment
  const isHLayout = alignment == Aligment.Top || alignment == Aligment.Bottom
  let sx = isHLayout ? { height: '38px' } : { width: '110px' }
  const classes = useStyles()
  const tabHeader = (
    <Tabs
      value={value}
      classes={{
        indicator:
          alignment == Aligment.Bottom
            ? classes.topIndicator
            : alignment == Aligment.Right
            ? classes.leftIndicator
            : alignment == Aligment.Top
            ? classes.bottomIndicator
            : classes.rightIndicator
      }}
      onChange={handleChange}
      variant="scrollable"
      orientation={isHLayout ? 'horizontal' : 'vertical'}
      sx={sx}
    >
      {props.children
        ? props.children.map((child) => {
            return (
              <Tab
                key={child.props.code}
                disabled={disabled}
                label={child.props.labelText}
              ></Tab>
            )
          })
        : null}
    </Tabs>
  )
  const tabPanel = (
    <>
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
    </>
  )
  if (!tabBarVisible) {
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
        {tabPanel}
      </Box>
    )
  } else if (alignment == Aligment.Top) {
    return (
      <Stack
        sx={{
          position: context.position,
          left: props.left,
          top: props.top,
          width: toWidth(props.multiHeight, context, '235px'),
          height: toHeight(props.multiWidth, context, '26px')
        }}
      >
        {[tabHeader, tabPanel]}
      </Stack>
    )
  } else if (alignment == Aligment.Bottom) {
    return (
      <Stack
        sx={{
          position: context.position,
          left: props.left,
          top: props.top,
          width: toWidth(props.multiHeight, context, '235px'),
          height: toHeight(props.multiWidth, context, '26px')
        }}
      >
        {[tabPanel, tabHeader]}
      </Stack>
    )
  } else if (alignment == Aligment.Left) {
    return (
      <Box
        sx={{
          position: context.position,
          display: 'flex',
          left: props.left,
          top: props.top,
          width: toWidth(props.multiHeight, context, '235px'),
          height: toHeight(props.multiWidth, context, '26px')
        }}
      >
        {[tabHeader, tabPanel]}
      </Box>
    )
  } else {
    return (
      <Box
        sx={{
          position: context.position,
          display: 'flex',
          left: props.left,
          top: props.top,
          width: toWidth(props.multiHeight, context, '235px'),
          height: toHeight(props.multiWidth, context, '26px')
        }}
      >
        {[tabPanel, tabHeader]}
      </Box>
    )
  }
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
  tabAppearance: TabAppearance.Line,
  tabBarVisible: true
}

export default JGTabControl
export { JGTabControl, type JGTabControlProps }
