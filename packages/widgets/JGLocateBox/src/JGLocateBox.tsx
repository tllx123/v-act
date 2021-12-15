import { Property } from 'csstype'

import SearchIcon from '@mui/icons-material/Search'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import { useContext, withContext } from '@v-act/widget-context'

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

const JGLocateBoxDef = function (props: JGLocateBoxProps) {
  if (!props.visible) {
    return null
  }
  const context = useContext()
  return (
    <Box
      component="form"
      sx={{
        'position': context.position,
        'left': props.left,
        'top': props.top,
        'display': 'flex',
        'alignItems': 'center',
        'width': props.width,
        'border': '1px solid #808080',
        'borderRadius': '4px',
        'fontSize': '14px',
        'fontFamily':
          'Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,\\5FAE\\8F6F\\96C5\\9ED1,Arial,sans-serif',
        'height': props.height,
        'backgroundColor': '#fff',
        '&:hover': { borderColor: '#356abb' },
        '&:focus': {
          borderColor: '#356abb',
          background: '#fff',
          boxShadow: '0 0 0 2px rgba(53, 106, 187, 0.3)'
        }
      }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1, fontSize: '14px' }}
        disabled={props.disabled}
        placeholder={props.hint}
      />
      <IconButton
        type="submit"
        sx={{ p: '10px', fontSize: '14px' }}
        aria-label="search"
      >
        <SearchIcon />
      </IconButton>
    </Box>
  )
}

JGLocateBoxDef.defaultProps = {
  left: '0px',
  top: '0px',
  height: '28px',
  width: '220px',
  hint: '请输入关键字搜索',
  visible: true,
  disabled: false
}

const JGLocateBox = withContext(JGLocateBoxDef)

export default JGLocateBox
export { JGLocateBox, type JGLocateBoxProps }
