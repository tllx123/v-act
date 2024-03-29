import * as React from 'react'

import { Property } from 'csstype'

import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { Box } from '@mui/system'

interface JGDropdownMenuProps {
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
  multiHeight?: Property.Height
  /**
   * 宽度
   */
  multiWidth?: Property.Width
  /**
   * 显示
   */
  visible?: boolean
  /**
   * 显示宽度
   */
  width?: Property.Width

  /**
   * 显示高度
   */
  height?: Property.Height
}

const JGDropdownMenu = function (props: JGDropdownMenuProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (event.currentTarget) setAnchorEl(event.currentTarget || event.target)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const wrapStyle: React.CSSProperties = {
    width: props.width || props.multiWidth,
    height: props.height || props.multiHeight,
    fontSize: '14px',
    position: 'absolute',
    left: props.left,
    top: props.top,
    fontFamily:
      'Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,\\5FAE\\8F6F\\96C5\\9ED1,Arial,sans-serif',
    backgroundColor: '#5586cf'
  }
  const anchorWrap = {
    'height': '26px',
    'display': 'inline-flex',
    'alignItems': 'center',
    'justifyContent': 'center',
    'color': '#fff',
    'padding': '0 10px',
    'cursor': 'pointer',
    '&.active': {
      backgroundColor: '#558fe8'
    }
  }

  const menuItemSX = {
    'minWidth': '182px',
    'cursor': 'auto',
    '&:active,&:visited,&:focus': {
      backgroundColor: '#fff !important'
    },
    '&:hover': {
      backgroundColor: '#f6f7fb !important',
      color: '#356abb'
    }
  }
  return (
    <div style={wrapStyle}>
      <Box
        sx={anchorWrap}
        id="demo-positioned-button"
        aria-controls="demo-positioned-menu"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        className="active"
      >
        菜单1
      </Box>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
      >
        <MenuItem onClick={handleClose} sx={menuItemSX}>
          子项1
        </MenuItem>
        <MenuItem onClick={handleClose} sx={menuItemSX}>
          子项2
        </MenuItem>
        <MenuItem onClick={handleClose} sx={menuItemSX}>
          子项3
        </MenuItem>
      </Menu>
    </div>
  )
}

JGDropdownMenu.defaultProps = {
  left: 0,
  top: 0,
  multiHeight: 26,
  multiWidth: 235,
  visible: true
}
export default JGDropdownMenu
export { JGDropdownMenu, JGDropdownMenuProps }
