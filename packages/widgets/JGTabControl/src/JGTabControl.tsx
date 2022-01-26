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
  /**
   * 页签头宽度，只在页签头位置为Left、Right时生效
   */
  tabHeadWidth?: number

  children?: Array<JSX.Element> | null
}

const borderStyle = '1px solid #DCDEE2'

const useStyles = makeStyles({
  topLineIndicator: { bottom: '0px' },
  leftLineIndicator: { left: '0px' },
  bottomLineIndicator: { top: '0px' },
  rightLineIndicator: { right: '0px' },
  topCardIndicator: {
    bottom: '0px',
    width: '1px',
    backgroundColor: 'white'
  },
  leftCardIndicator: {
    right: '0px',
    width: '1px',
    backgroundColor: 'white'
  },
  bottomCardIndicator: {
    top: '0px',
    width: '1px',
    backgroundColor: 'white'
  },
  rightCardIndicator: {
    left: '0px',
    width: '1px',
    backgroundColor: 'white'
  },
  selectCardTabTitle: {
    backgroundColor: 'white !important'
  },
  topCardTabTitle: {
    border: borderStyle,
    marginLeft: '4px',
    borderTopLeftRadius: '4px',
    borderTopRightRadius: '4px',
    backgroundColor: '#F6F7FB'
  },
  leftCardTabTitle: {
    border: borderStyle,
    marginTop: '4px',
    borderTopLeftRadius: '4px',
    borderBottomLeftRadius: '4px',
    backgroundColor: '#F6F7FB'
  },
  bottomCardTabTitle: {
    border: borderStyle,
    marginLeft: '4px',
    borderBottomLeftRadius: '4px',
    borderBottomRightRadius: '4px',
    backgroundColor: '#F6F7FB'
  },
  rightCardTabTitle: {
    border: borderStyle,
    marginTop: '4px',
    borderTopRightRadius: '4px',
    borderBottomRightRadius: '4px',
    backgroundColor: '#F6F7FB'
  }
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
  const isLineStyle = props.tabAppearance == TabAppearance.Card ? false : true
  const isHLayout = alignment == Aligment.Top || alignment == Aligment.Bottom
  let sx = isHLayout
    ? { height: '38px', minHeight: '0px' }
    : { width: props.tabHeadWidth ? props.tabHeadWidth + 'px' : '110px' }
  const classes = useStyles()
  const tabPageWidth = isHLayout ? '100%' : `calc(100% - ${sx.width})`
  const tabPageHeight = isHLayout ? `calc(100% - ${sx.height})` : '100%'
  const tabHeader = (
    <Tabs
      value={value}
      classes={{
        indicator:
          alignment == Aligment.Bottom
            ? isLineStyle
              ? classes.bottomLineIndicator
              : classes.bottomCardIndicator
            : alignment == Aligment.Right
            ? isLineStyle
              ? classes.rightLineIndicator
              : classes.rightCardIndicator
            : alignment == Aligment.Top
            ? isLineStyle
              ? classes.topLineIndicator
              : classes.topCardIndicator
            : isLineStyle
            ? classes.leftLineIndicator
            : classes.leftCardIndicator
      }}
      onChange={handleChange}
      variant="scrollable"
      orientation={isHLayout ? 'horizontal' : 'vertical'}
      sx={sx}
    >
      {props.children
        ? props.children.map((child, i) => {
            return (
              <Tab
                key={child.props.code}
                disabled={disabled}
                sx={
                  i == 0
                    ? isHLayout
                      ? { ...sx, marginLeft: '0px !important' }
                      : { ...sx, marginTop: '0px !important' }
                    : { ...sx }
                }
                classes={
                  isLineStyle
                    ? {}
                    : {
                        root:
                          alignment == Aligment.Top
                            ? classes.topCardTabTitle
                            : alignment == Aligment.Left
                            ? classes.leftCardTabTitle
                            : alignment == Aligment.Right
                            ? classes.rightCardTabTitle
                            : classes.bottomCardTabTitle,
                        selected: classes.selectCardTabTitle
                      }
                }
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
                sx={
                  isLineStyle
                    ? {}
                    : alignment == Aligment.Top
                    ? {
                        marginTop: '-1px',
                        border: borderStyle,
                        width: tabPageWidth,
                        height: tabPageHeight
                      }
                    : alignment == Aligment.Left
                    ? {
                        marginLeft: '-1px',
                        border: borderStyle,
                        width: tabPageWidth,
                        height: tabPageHeight
                      }
                    : alignment == Aligment.Bottom
                    ? {
                        marginBottom: '-1px',
                        border: borderStyle,
                        width: tabPageWidth,
                        height: tabPageHeight
                      }
                    : {
                        marginRight: '-1px',
                        border: borderStyle,
                        width: tabPageWidth,
                        height: tabPageHeight
                      }
                }
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
          width: toWidth(props.multiWidth, context, '235px'),
          height: toHeight(props.multiHeight, context, '26px')
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
          width: toWidth(props.multiWidth, context, '235px'),
          height: toHeight(props.multiHeight, context, '26px')
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
          width: toWidth(props.multiWidth, context, '235px'),
          height: toHeight(props.multiHeight, context, '26px')
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
          width: toWidth(props.multiWidth, context, '235px'),
          height: toHeight(props.multiHeight, context, '26px')
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
          width: toWidth(props.multiWidth, context, '235px'),
          height: toHeight(props.multiHeight, context, '26px')
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
