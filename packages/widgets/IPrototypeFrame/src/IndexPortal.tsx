import { Fragment, MouseEvent } from 'react'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined'
import CancelIcon from '@mui/icons-material/Cancel'
import CloseIcon from '@mui/icons-material/Close'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import RefreshIcon from '@mui/icons-material/Refresh'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'

import IFrame from './IFrame'
import LightTooltip from './LightTooltip'
import { MenuData } from './SideMenu'

const toTabTitle = function (
  item: MenuData,
  selected: MenuData | undefined,
  onClick: (item: MenuData) => void,
  onClose: (items: MenuData[]) => void
) {
  const isCurrent = selected && selected.code === item.code
  return (
    <div
      style={{
        display: 'flex',
        backgroundColor: 'white',
        width: 'auto',
        cursor: 'pointer',
        padding: '0px 10px',
        marginRight: '6px',
        borderRadius: '4px',
        alignItems: 'center'
      }}
    >
      <ArticleOutlinedIcon
        sx={{ fontSize: '14px', color: isCurrent ? '#356bbc' : 'gray' }}
        onClick={() => {
          onClick(item)
        }}
      ></ArticleOutlinedIcon>
      <span
        style={{
          margin: '0px 6px',
          fontSize: '14px',
          color: isCurrent ? '#356bbc' : 'gray'
        }}
        onClick={() => {
          onClick(item)
        }}
      >
        {item.title}
      </span>
      <CloseIcon
        sx={{ fontSize: '14px' }}
        onClick={() => {
          onClose([item])
        }}
      ></CloseIcon>
    </div>
  )
}

const toTabTitles = function (
  list: MenuData[],
  select: MenuData | undefined,
  onChange: (item: MenuData) => void,
  onClose: (items: MenuData[]) => void
) {
  return (
    <Fragment>
      {list && list.length > 0
        ? list.map((item) => {
            return (
              <Fragment key={item.code}>
                {toTabTitle(item, select, onChange, onClose)}
              </Fragment>
            )
          })
        : null}
    </Fragment>
  )
}

const tabHeaderToolItem = function (
  label: string,
  icon: JSX.Element,
  handler: (event: MouseEvent) => void
) {
  return (
    <ListItemButton
      sx={{ py: 0, minHeight: 32, color: 'gray' }}
      onClick={handler}
    >
      {icon}
      <ListItemText
        primary={label}
        primaryTypographyProps={{
          fontSize: 12
        }}
      />
    </ListItemButton>
  )
}

const tabHeaderTool = function (
  selected: MenuData | undefined,
  list: MenuData[],
  closeHandler: (items: MenuData[]) => void
) {
  const items = [
    {
      code: 'refresh',
      label: '刷新页面',
      icon: <RefreshIcon sx={{ fontSize: '14px' }} />,
      handler: () => {}
    },
    {
      code: 'closeLeft',
      label: '关闭左侧',
      icon: <ArrowBackIcon sx={{ fontSize: '14px' }} />,
      handler: () => {
        if (selected && list.length > 0) {
          const toClose = []
          for (let i = 0; i < list.length; i++) {
            const item = list[i]
            if (item.code === selected.code) {
              break
            } else {
              toClose.push(item)
            }
          }
          if (toClose.length > 0) {
            closeHandler(toClose)
          }
        }
      }
    },
    {
      code: 'closeRight',
      label: '关闭右侧',
      icon: <ArrowForwardIcon sx={{ fontSize: '14px' }} />,
      handler: () => {
        if (selected && list.length > 0) {
          const toClose = []
          let hasFound = false
          for (let i = 0; i < list.length; i++) {
            const item = list[i]
            if (hasFound) {
              toClose.push(item)
              continue
            }
            if (item.code === selected.code) {
              hasFound = true
            }
          }
          if (toClose.length > 0) {
            closeHandler(toClose)
          }
        }
      }
    },
    {
      code: 'closeOther',
      label: '关闭其他',
      icon: <CloseIcon sx={{ fontSize: '14px' }} />,
      handler: () => {
        if (selected && list.length > 0) {
          const toClose = []
          for (let i = 0; i < list.length; i++) {
            const item = list[i]
            if (item.code !== selected.code) {
              toClose.push(item)
            }
          }
          if (toClose.length > 0) {
            closeHandler(toClose)
          }
        }
      }
    },
    {
      code: 'closeAll',
      label: '全部关闭',
      icon: <CancelIcon sx={{ fontSize: '14px' }} />,
      handler: () => {
        if (selected && list.length > 0) {
          closeHandler(list)
        }
      }
    }
  ]
  const menu = (
    <Fragment>
      {items.map((item) => {
        return (
          <Fragment key={item.code}>
            {tabHeaderToolItem(item.label, item.icon, item.handler)}
          </Fragment>
        )
      })}
    </Fragment>
  )
  return (
    <LightTooltip title={menu}>
      <div
        style={{
          height: '32px',
          width: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'gray',
          backgroundColor: 'white'
        }}
      >
        <KeyboardArrowDownIcon fontSize="small"></KeyboardArrowDownIcon>
      </div>
    </LightTooltip>
  )
}

interface IndexPortalProps {
  list?: MenuData[]
  selected?: MenuData
  onChange?: (item: MenuData) => void
  onClose?: (items: MenuData[]) => void
}

const IndexPortal = function (props: IndexPortalProps) {
  const list = props.list || []
  const selected = props.selected
  const onClose = props.onClose
  const onChange = props.onChange
  const closeHandler = (items: MenuData[]) => {
    if (onClose) {
      onClose(items)
    }
  }
  const changeHandler = (item: MenuData) => {
    if (onChange && (!selected || selected.code !== item.code)) {
      onChange(item)
    }
  }
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        flex: 1,
        padding: '6px 16px 16px 16px'
      }}
    >
      <div
        style={{
          height: '38px',
          padding: '0px',
          display: 'flex',
          paddingBottom: '6px'
        }}
      >
        <div
          style={{
            width: '100%',
            display: 'flex'
          }}
        >
          {toTabTitles(list, selected, changeHandler, closeHandler)}
        </div>
        {tabHeaderTool(selected, list, closeHandler)}
      </div>
      {selected ? <IFrame src={selected.data}></IFrame> : null}
    </div>
  )
}

export { IndexPortal }
