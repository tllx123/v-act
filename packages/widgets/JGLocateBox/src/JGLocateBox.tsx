import { Property } from 'csstype'

import SearchIcon from '@mui/icons-material/Search'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import Paper from '@mui/material/Paper'

interface JGLocateBoxProps {
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
  height?: Property.Height
  /**
   * 宽度
   */
  width?: Property.Width
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
        width: props.width,
        height: props.height
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
