import * as React from 'react'

import { Property } from 'csstype'

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
// import { Box } from '@mui/system'
import Button from '@mui/material/Button'
// import styled from 'styled-components'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

interface MenuData {
  labelText: string
}
interface JGStartMenuProps {
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

  labelText?: string

  menuData?: Array<MenuData>
}

const JGStartMenu = function (props: JGStartMenuProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (event.currentTarget) setAnchorEl(event.currentTarget || event.target)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const anchorWidth = props.width || props.multiWidth
  const anchorHeight = props.height || props.multiHeight
  const anchorWrap: React.CSSProperties = {
    width: anchorWidth,
    height: anchorHeight,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    padding: '0 10px',
    cursor: 'pointer',
    fontSize: '14px',
    position: 'absolute',
    left: props.left,
    top: props.top,
    fontFamily:
      'Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,\\5FAE\\8F6F\\96C5\\9ED1,Arial,sans-serif'
  }

  const menuItemSX = {
    'minWidth': '182px',
    'cursor': 'auto',
    '&:active,&:visited,&:focus': {
      backgroundColor: '#fff !important'
    },
    '&:hover': {
      cursor: 'pointer',
      color: '#356abb',
      backgroundColor: '#fff !important'
    }
  }
  return (
    <div>
      <Button
        id="demo-positioned-button"
        aria-controls="demo-positioned-button"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
        endIcon={open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        style={anchorWrap}
      >
        {props.labelText}
      </Button>
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
        {props.menuData &&
          props.menuData.map((val, index) => (
            <MenuItem onClick={handleClose} sx={menuItemSX} key={index}>
              {val.labelText}
            </MenuItem>
          ))}
      </Menu>
    </div>
  )
}

JGStartMenu.defaultProps = {
  left: 0,
  top: 0,
  multiHeight: 24,
  multiWidth: 87,
  visible: true,
  labelText: '菜单',
  menuData: [
    {
      labelText: '子项1'
    },
    {
      labelText: '子项2'
    },
    {
      labelText: '子项2'
    }
  ]
}
export default JGStartMenu
export { JGStartMenu, JGStartMenuProps }
