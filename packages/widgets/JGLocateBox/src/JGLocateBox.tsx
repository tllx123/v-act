import * as React from 'react'
import Paper from '@mui/material/Paper'
import InputBase from '@mui/material/InputBase'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import DirectionsIcon from '@mui/icons-material/Directions'

import { Height, Width } from '@v-act/schema-types'

interface JGLocateBoxProps {
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
   * 提示文字
   */
  hint?: string
  /**
   * 显示
   */
  visible?: boolean
  /**
   * 禁用
   */
  disabled?: boolean
}

const JGLocateBox = function (props: JGLocateBoxProps) {
  if (!props.visible) {
    return null
  }
  return (
    <Paper
      component="form"
      sx={{
        position: 'absolute',
        left: props.left,
        top: props.top,
        display: 'flex',
        alignItems: 'center',
        width: props.multiWidth,
        height: props.multiHeight
      }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        disabled={props.disabled}
        placeholder={props.hint}
      />
      <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  )
}

JGLocateBox.defaultProps = {
  left: 0,
  top: 0,
  multiHeight: 28,
  multiWidth: 220,
  hint: '请输入关键字搜索',
  visible: true,
  disabled: false
}

export default JGLocateBox
export { JGLocateBox, JGLocateBoxProps }
