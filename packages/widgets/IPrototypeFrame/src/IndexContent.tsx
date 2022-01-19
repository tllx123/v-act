import { useState } from 'react'

import SearchIcon from '@mui/icons-material/Search'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'

import { IndexPortal } from './IndexPortal'
import { SideMenu } from './SideMenu'
import { MenuData } from './utils'

interface IndexContentProps {
  menu?: MenuData[]
}

const getDefaultSelectMenu = function (menus: MenuData[]): MenuData {
  const menu = menus[0]
  if (menu.children && menu.children.length > 0) {
    return getDefaultSelectMenu(menu.children)
  } else {
    return menu
  }
}

const IndexContent = function (props: IndexContentProps) {
  const menu = props.menu || []
  let defMenu
  if (menu.length > 0) {
    defMenu = getDefaultSelectMenu(menu)
  }
  const [selectMenu, setSelectMenu] = useState<MenuData | undefined>(defMenu)
  const defaultOpened = defMenu ? [defMenu] : []
  const [opened, setOpened] = useState<MenuData[]>(defaultOpened)
  return (
    <div
      style={{
        display: 'flex',
        backgroundColor: '#ebebeb',
        width: '100%',
        height: '100%'
      }}
    >
      <div
        style={{
          width: '220px',
          height: '100%',
          flex: '0 0 220px',
          backgroundColor: 'white'
        }}
      >
        <Box
          sx={{
            padding: '10px 10px',
            width: '220px',
            height: '52px'
          }}
        >
          <div
            style={{
              display: 'flex',
              border: '1px solid #dcdee2',
              borderRadius: '4px',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <IconButton
              type="button"
              sx={{ fontSize: '14px', height: '24px', width: '24px' }}
              aria-label="search"
            >
              <SearchIcon />
            </IconButton>
            <InputBase
              sx={{
                ml: 1,
                flex: 1,
                height: '30px',
                width: '200px',
                fontSize: '14px'
              }}
              placeholder="搜索菜单"
            />
          </div>
        </Box>
        <div
          style={{
            height: 'calc(100% - 52px)'
          }}
        >
          <SideMenu
            datas={menu}
            selected={selectMenu}
            onChange={(item) => {
              setSelectMenu(item)
              opened.push(item)
              setOpened(opened)
            }}
          ></SideMenu>
        </div>
      </div>
      <IndexPortal
        list={opened}
        selected={selectMenu}
        onChange={(item) => {
          setSelectMenu(item)
          let isOpend = false
          for (let i = 0; i < opened.length; i++) {
            const op = opened[i]
            if (item.code === op.code) {
              isOpend = true
              break
            }
          }
          if (!isOpend) {
            opened.push(item)
            setOpened(opened)
          }
        }}
        onClose={(items) => {
          if (items && items.length > 0) {
            items.forEach((item) => {
              if (selectMenu && selectMenu.code === item.code) {
                setSelectMenu(selectMenu)
              }
              for (let i = 0; i < opened.length; i++) {
                const open = opened[i]
                if (open.code === item.code) {
                  opened.splice(i, 1)
                  break
                }
              }
            })
            setOpened(opened)
          }
        }}
      ></IndexPortal>
    </div>
  )
}

export { IndexContent, type MenuData }
