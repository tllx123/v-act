import { useState } from 'react'

import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined'
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'

import LightTooltip from './LightTooltip'
import { MenuData } from './utils'

interface SideMenuProps {
  selected?: MenuData
  datas?: MenuData[]
  onChange?: (menu: MenuData) => void | undefined
}

const hasChildren = function (menuItem: MenuData) {
  return menuItem.children && menuItem.children.length > 0
}

const toChildrenTooltipPanel = function (
  ele: JSX.Element,
  children: MenuData[],
  selected: MenuData | undefined,
  onChange: (item: MenuData) => void
) {
  const menuPanel = (
    <List component="nav" aria-label="secondary mailbox folder">
      {children.map((child) => {
        const isFolder = hasChildren(child)
        const item = (
          <ListItemButton
            key={child.code}
            sx={{
              'color': isSelfOrChildren(selected, child) ? '#3468BA' : 'gray',
              '&:hover': {
                color: '#3468BA'
              }
            }}
            onClick={() => {
              if (!isFolder && (!selected || selected.code !== child.code)) {
                onChange(child)
              }
            }}
          >
            <ListItemText>
              <span
                style={{
                  fontSize: '14px'
                }}
              >
                {child.title}
              </span>
            </ListItemText>
            {isFolder ? (
              <ArrowForwardIosOutlinedIcon
                sx={{
                  'width': '16px',
                  'height': '16px',
                  'color': isSelfOrChildren(selected, child)
                    ? '#3468BA'
                    : 'gray',
                  '&:hover': {
                    color: '#3468BA'
                  }
                }}
              />
            ) : null}
          </ListItemButton>
        )
        return isFolder
          ? toChildrenTooltipPanel(
              item,
              child.children || [],
              selected,
              onChange
            )
          : item
      })}
    </List>
  )
  return (
    <LightTooltip placement="right-start" title={menuPanel}>
      {ele}
    </LightTooltip>
  )
}

const isSelfOrChildren = function (
  selected: MenuData | undefined,
  item: MenuData
) {
  if (!selected) {
    return false
  }
  if (item.code === selected.code) {
    return true
  }
  const children = item.children
  if (children && children.length > 0) {
    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      const res = isSelfOrChildren(selected, child)
      if (res) {
        return true
      }
    }
  }
  return false
}

const SideMenu = function (props: SideMenuProps) {
  const selected = props.selected
  const datas = props.datas || []
  const [hoverMenuItemCode, setHoverMenuItemCode] = useState<string | null>(
    null
  )
  const onChange = props.onChange
  const changedHandler = (item: MenuData) => {
    if (onChange) {
      onChange(item)
    }
  }
  return (
    <ul
      style={{
        height: '100%',
        width: '100%',
        paddingInline: '0px',
        marginBlock: '0px'
      }}
    >
      {datas.map((menuItem) => {
        const isFolder = hasChildren(menuItem)
        const ele = (
          <li
            style={{
              display: 'inline-block',
              width: '100%',
              padding: '14px 24px',
              fontSize: '14px',
              cursor: 'pointer',
              height: '52px',
              color:
                hoverMenuItemCode === menuItem.code ||
                isSelfOrChildren(selected, menuItem)
                  ? '#3468BA'
                  : 'black'
            }}
            key={menuItem.code}
            onMouseOver={() => {
              setHoverMenuItemCode(menuItem.code)
            }}
            onMouseLeave={() => {
              setHoverMenuItemCode(null)
            }}
            onClick={() => {
              if (!isFolder && (!selected || selected.code !== menuItem.code)) {
                changedHandler(menuItem)
              }
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <ArticleOutlinedIcon
                sx={{
                  width: '18px',
                  height: '18px',
                  color:
                    hoverMenuItemCode == menuItem.code ||
                    isSelfOrChildren(selected, menuItem)
                      ? '#3468BA'
                      : 'gray'
                }}
              />
              <span style={{ marginLeft: '10px', width: '100%' }}>
                {menuItem.title}
              </span>
              {isFolder ? (
                <ArrowForwardIosOutlinedIcon
                  sx={{
                    width: '16px',
                    height: '16px',
                    color:
                      hoverMenuItemCode == menuItem.code ||
                      isSelfOrChildren(selected, menuItem)
                        ? '#3468BA'
                        : 'gray'
                  }}
                />
              ) : null}
            </div>
          </li>
        )
        return isFolder
          ? toChildrenTooltipPanel(
              ele,
              menuItem.children || [],
              selected,
              changedHandler
            )
          : ele
      })}
    </ul>
  )
}

export { type MenuData, SideMenu, type SideMenuProps }
