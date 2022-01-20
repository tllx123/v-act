import { type MouseEvent, useState } from 'react'

import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import CropFreeIcon from '@mui/icons-material/CropFree'
import FormatIndentDecreaseIcon from '@mui/icons-material/FormatIndentDecrease'
import Logout from '@mui/icons-material/Logout'
import SearchIcon from '@mui/icons-material/Search'
import Settings from '@mui/icons-material/Settings'
import TokenIcon from '@mui/icons-material/Token'
import ViewComfyIcon from '@mui/icons-material/ViewComfy'
import Divider from '@mui/material/Divider'
import ListItemIcon from '@mui/material/ListItemIcon'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

import { getIndexCode, ListItem } from './utils'

enum ListItemType {
  url = 'url',
  index = 'index'
}

interface FrameHeaderProps {
  logo?: string
  list?: ListItem[]
  onMenuChange?: (item: ListItem) => void
}

const FrameHeader = function (props: FrameHeaderProps) {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: MouseEvent) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const list = props.list ? props.list : []
  const homeCode = getIndexCode()
  const menus: ListItem[] = [
    {
      code: homeCode,
      type: ListItemType.index,
      data: '',
      title: '首页'
    }
  ]
  if (props.list) {
    props.list.forEach((item) => {
      menus.push(item)
    })
  }
  const [tabVal, setTabVal] = useState(homeCode)
  const onMenuChange = props.onMenuChange
  return (
    <div
      style={{
        height: '64px',
        display: 'flex',
        backgroundColor: '#356bbc'
      }}
    >
      <div
        style={{
          width: '220px',
          height: '64px'
        }}
      >
        <img
          style={{
            maxWidth: '220px',
            maxHeight: '64px',
            marginLeft: '10px',
            verticalAlign: 'middle'
          }}
          src={
            props.logo
              ? props.logo
              : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANwAAABACAYAAABx/hm5AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA0ppVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MjU3RjlCRDQ2RjA3MTFFQTk0RkZFQzVGMTI1ODlGQkUiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MjU3RjlCRDM2RjA3MTFFQTk0RkZFQzVGMTI1ODlGQkUiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpkZTBkZmJjNi1iMDMwLTAzNDMtOWM1ZC1iOThhODM4OTBhNjMiIHN0UmVmOmRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpkZTBkZmJjNi1iMDMwLTAzNDMtOWM1ZC1iOThhODM4OTBhNjMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz79JVCqAAAC2klEQVR42uzcjW3iQBCG4RBdA0kJtEALXAlugRbSAimBlJAWSAm5EqAEKMFnS0ayot31D6wh8LzSKMjsDKNkPr5dZDIry/IJwDQ8+xUABAcQHACCAwgOAMEBBAcQHACCAwgOAMEBBAcQHACCAwgOAMEBBAeA4IBfLLhdFWUkVrPZ7GlMVBRVfFZxCNStr32Prd/U3gZqH5rry6n7xYNQ/0+TM2NXxlmN6Keo4lAO461n7bcBtb+reJmq3wv8HcQviOcbE/9n4xI/B/191lA/DqSuq9xtR+36+XWodhWvTe3XKj6a64vGla7SLzhcVoer1m4iNT4HrN3GxBZZXyScMPr6Ofr17v8YcROCa7ZlMZaB9fPE+qLnsHe5V3ubuMjdr2G0pZyS6Bms2pV9Ba7tqx/HSMq6Nej18MdE/9XR07/W49UU/cKnlFNsaefNeSnEPpEaG+B5y2VSw9wluPZrLyfqFwSXnaLn0A95btkhjJ8O1iW899z9GsXH4M8N9JBj2BaJreRpm3fssaX8G9gi5uoXBDcJ85F5+zNq7ruKV0L7uKF+YUs5CceReS9XGuJz+gXBXd3hbnGA5wSHe3W47FvV+hPCvvdjGRfcg+CO6uJRmOV+4+66E77r9WP55/Y9pm6dc61+weFOJL+e0yP/O5GfusF3k8jbddTdJepuE3k5+wWH43AcDvfmcKuRjpFyonVH3fIMh8vVLzjc73W4sW7E4XDXDtcMaJerhDjEzkOtoU+dm4oxDpe5X3C4vA43xuWGrO9yrKEOl6tfDsjhpjrDnQY05kahb1zH1m4CIlpG1h4GOlE5Ub/gcHkd7lLukvO8N9S5hvbL4TjcJRyu711Tm9YAFiGXad1eFXKqt5Swm+fmsbNXpG4ZcKZQ3Yv3Cw4H4EYcDgDBAQQHEBwAggMIDgDBAQQHgOAAggMIDgDBAQQHgOAAggMIDgDBAQQHgOAAggNw4r8AAwBQHENFS6dXWwAAAABJRU5ErkJggg=='
          }
        />
      </div>
      <div
        style={{
          width: '42px',
          height: '64px',
          cursor: 'pointer',
          padding: '0px 12px',
          display: 'flex',
          color: 'white',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <FormatIndentDecreaseIcon />
      </div>
      <div
        style={{
          width: '42px',
          height: '64px',
          cursor: 'pointer',
          padding: '0px 12px',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <SearchIcon />
      </div>

      <div
        style={{
          width: '155px',
          height: '64px',
          cursor: 'pointer',
          padding: '0px 12px'
        }}
      >
        <div
          style={{
            margin: '0px 20px',
            display: 'flex',
            color: 'white',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ViewComfyIcon />
          <span
            style={{
              height: '64px',
              fontSize: '14px',
              marginLeft: '8px',
              lineHeight: '64px'
            }}
          >
            常用功能
          </span>
        </div>
      </div>
      <div
        style={{
          height: '64px',
          width: 'calc(100% - 750px)',
          color: 'hsla(0,0%,100%,.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <ul
          style={{
            height: '40px',
            width: '100%',
            marginTop: '10px',
            paddingInlineStart: '0px'
          }}
        >
          {menus.map((item) => {
            return (
              <li style={{ display: 'inline-block' }} key={item.code}>
                <div
                  style={{
                    height: '40px',
                    margin: '0px 20px',
                    cursor: 'pointer',
                    color: item.code === tabVal ? 'white' : 'unset',
                    borderBottom:
                      item.code == tabVal ? '3px solid white' : '0px'
                  }}
                  onClick={() => {
                    setTabVal(item.code)
                    if (onMenuChange) {
                      onMenuChange(item)
                    }
                  }}
                >
                  <span style={{ lineHeight: '40px', fontSize: '14px' }}>
                    {item.title}
                  </span>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
      <div
        style={{
          width: '42px',
          height: '64px',
          cursor: 'pointer',
          padding: '0px 12px',
          display: 'flex',
          color: 'white',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <CropFreeIcon />
      </div>
      <div
        style={{
          width: '170px',
          height: '64px',
          cursor: 'pointer',
          padding: '0px 12px'
        }}
      >
        <div
          style={{
            margin: '0px 20px',
            display: 'flex',
            color: 'white',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <TokenIcon />
          <span
            style={{
              height: '64px',
              fontSize: '14px',
              marginLeft: '8px',
              lineHeight: '64px'
            }}
          >
            测试项目部
          </span>
        </div>
      </div>
      <div
        style={{
          height: '64px',
          width: '80px',
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          justifyContent: 'center'
        }}
        onClick={handleClick}
      >
        <img
          style={{
            width: '24px',
            height: '24px'
          }}
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo4NGVhMTU5MC1jMzkxLWQ3NDctOTc4YS1mMzI5ZWU5ZmQxYTMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QjlBRDQ3MDlFRUYzMTFFOTgzNkFEQzFCOTJDODRFMTciIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QjlBRDQ3MDhFRUYzMTFFOTgzNkFEQzFCOTJDODRFMTciIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OGVmODM0ZDQtZDk3YS0wMzRkLTlkNDQtNWI4NGUyYWJiYmRmIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjg0ZWExNTkwLWMzOTEtZDc0Ny05NzhhLWYzMjllZTlmZDFhMyIv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"
        />
        <span
          style={{
            fontSize: '14px',
            color: 'white',
            marginLeft: '12px'
          }}
        >
          张三
        </span>
      </div>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            'overflow': 'visible',
            'filter': 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            'mt': 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem sx={{ fontSize: '12px', color: '#515a6e' }}>
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" />
          </ListItemIcon>
          hello,张三
        </MenuItem>
        <Divider />
        <MenuItem sx={{ fontSize: '12px', color: '#515a6e' }}>
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" />
          </ListItemIcon>
          个人中心
        </MenuItem>
        <Divider />
        <MenuItem sx={{ fontSize: '12px', color: '#515a6e' }}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          设置
        </MenuItem>
        <Divider />
        <MenuItem sx={{ fontSize: '12px', color: '#515a6e' }}>
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" />
          </ListItemIcon>
          超级管理员
        </MenuItem>
        <Divider />
        <MenuItem sx={{ fontSize: '12px', color: '#515a6e' }}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          退出
        </MenuItem>
      </Menu>
    </div>
  )
}

export default FrameHeader

export { FrameHeader }
