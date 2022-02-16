import React from 'react'
import 'antd/dist/antd.css'
import { Property } from 'csstype'
import { useContext } from '@v-act/widget-context'
import { toHeight, toWidth, getCompEvent } from '@v-act/widget-utils'
import { Tooltip, Menu, Dropdown, Space } from 'antd'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'

import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import IconButton from '@mui/material/IconButton'
import FolderIcon from '@mui/icons-material/Folder'
import AddIcon from '@mui/icons-material/Add'
import ClearIcon from '@mui/icons-material/Clear'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ImportExportIcon from '@mui/icons-material/ImportExport'
import PrintIcon from '@mui/icons-material/Print'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import RemoveIcon from '@mui/icons-material/Remove'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import StopCircleOutlinedIcon from '@mui/icons-material/StopCircleOutlined'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import './JGButtonGroup.css'
interface JGButtonGroupProps {
  left?: Property.Left
  top?: Property.Top
  position?: Property.Position
  height?: Property.Height
  width?: Property.Width
  enabled?: boolean
  showBorder?: boolean
  expandWhenHover?: boolean
  control?: any
}
const { SubMenu } = Menu

const iconMap = [
  {
    iconV3: 'open',
    icon: <FolderIcon sx={{ fontSize: '16px' }} />
  },
  {
    iconV3: 'import',
    icon: <ExitToAppIcon sx={{ fontSize: '16px' }} />
  },
  {
    iconV3: 'export',
    icon: <OpenInNewOutlinedIcon sx={{ fontSize: '16px' }} />
  },
  {
    iconV3: 'add',
    icon: <AddIcon sx={{ fontSize: '16px' }} />
  },
  {
    iconV3: 'update',
    icon: <EditIcon sx={{ fontSize: '16px' }} />
  },
  {
    iconV3: 'delete',
    icon: <ClearIcon sx={{ fontSize: '16px' }} />
  },
  {
    iconV3: 'save',
    icon: <SaveIcon sx={{ fontSize: '16px' }} />
  },
  {
    iconV3: 'moveUp',
    icon: <ArrowUpwardIcon sx={{ fontSize: '16px' }} />
  },
  {
    iconV3: 'moveDown',
    icon: <ArrowDownwardIcon sx={{ fontSize: '16px' }} />
  },
  {
    iconV3: 'relegation',
    icon: <ImportExportIcon sx={{ fontSize: '16px' }} />
  },
  {
    iconV3: 'print',
    icon: <PrintIcon sx={{ fontSize: '16px' }} />
  },
  {
    iconV3: 'fuzhi',
    icon: <ContentCopyIcon sx={{ fontSize: '16px' }} />
  },
  {
    iconV3: 'liucheng',
    icon: <AccountTreeIcon sx={{ fontSize: '16px' }} />
  },
  {
    iconV3: 'jian',
    icon: <RemoveIcon sx={{ fontSize: '16px' }} />
  },
  {
    iconV3: 'qiyong',
    icon: <PlayCircleOutlineIcon sx={{ fontSize: '16px' }} />
  },
  {
    iconV3: 'tingyong',
    icon: <StopCircleOutlinedIcon sx={{ fontSize: '16px' }} />
  },
  {
    iconV3: 'template',
    icon: <CloudUploadOutlinedIcon sx={{ fontSize: '16px' }} />
  },
  {
    iconV3: 'more',
    icon: ''
  }
]

const loadButtonGroup = (
  control: any,
  enabled?: boolean,
  showBorder?: boolean,
  expandWhenHover?: boolean
) => {
  if (!control) {
    return null
  } else {
    const getChild = (controls: any) => {
      if (controls) {
        console.log('controls')
        console.log(controls)

        return controls.map((item: any) => {
          let color: any = '#333'

          if (
            !item.more &&
            item.properties.theme &&
            item.properties.theme == 'redType'
          ) {
            color = '#d32f2f'
          } else if (
            !item.more &&
            item.properties.theme &&
            item.properties.theme == 'greenType'
          ) {
            color = '#2e7d32'
          } else if (
            !item.more &&
            item.properties.theme &&
            item.properties.theme == 'orangeType'
          ) {
            color = '#ed6c02'
          }

          if (item.controls.length == 0) {
            let clickProps = () => {}

            if (getCompEvent(item).hasOwnProperty('OnClick')) {
              clickProps = getCompEvent(item).OnClick
            }

            return (
              <Menu.Item
                onClick={clickProps}
                style={{ color: color }}
                key={item.properties.code}
              >
                {item.properties.labelText}
              </Menu.Item>
            )
          } else {
            return (
              <SubMenu
                style={{ color: color }}
                title={item.properties.labelText}
                key={item.properties.code}
              >
                {getChild(item.controls)}
              </SubMenu>
            )
          }
        })
      } else {
        return null
      }
    }

    const getMenu = (more: any) => {
      return (
        <Menu>
          {more.map((item: any) => {
            let color: any = '#333'

            if (
              !item.more &&
              item.properties.theme &&
              item.properties.theme == 'redType'
            ) {
              color = '#d32f2f'
            } else if (
              !item.more &&
              item.properties.theme &&
              item.properties.theme == 'greenType'
            ) {
              color = '#2e7d32'
            } else if (
              !item.more &&
              item.properties.theme &&
              item.properties.theme == 'orangeType'
            ) {
              color = '#ed6c02'
            }

            if (item.controls.length == 0) {
              let clickProps = () => {}

              if (getCompEvent(item).hasOwnProperty('OnClick')) {
                clickProps = getCompEvent(item).OnClick
              }

              return (
                <Menu.Item
                  onClick={clickProps}
                  style={{ color: color }}
                  key={item.properties.code}
                >
                  {item.properties.labelText}
                </Menu.Item>
              )
            } else {
              return (
                <SubMenu
                  style={{ color: color }}
                  key={item.properties.code}
                  title={item.properties.labelText}
                >
                  {getChild(item.controls)}
                </SubMenu>
              )
            }
          })}
        </Menu>
      )
    }

    const more = control.filter((item: any) => {
      return item.properties.isMore == 'True'
    })
    const other = control.filter((item: any) => {
      return !item.properties.isMore
    })
    other.push({ more: [] })
    more.map((item: any) => {
      other[other.length - 1].more.push(item)
    })

    type triggerType = ('click' | 'hover' | 'contextMenu')[]

    let trigger: triggerType = ['click']
    if (expandWhenHover) {
      trigger = ['hover']
    }

    return other.map((item: any) => {
      let color: any = 'primary'
      let variant: any = 'contained'
      if (
        !item.more &&
        item.properties.theme &&
        item.properties.theme == 'redType'
      ) {
        color = 'error'
        variant = 'contained'
      } else if (
        !item.more &&
        item.properties.theme &&
        item.properties.theme == 'greenType'
      ) {
        color = 'success'
        variant = 'contained'
      } else if (
        !item.more &&
        item.properties.theme &&
        item.properties.theme == 'orangeType'
      ) {
        color = 'warning'
        variant = 'contained'
      } else if (
        !item.more &&
        item.properties.theme &&
        item.properties.theme == 'whiteType'
      ) {
        color = 'primary'
        variant = 'outlined'
      }

      if (showBorder == false) {
        variant = 'text'
      }

      if (item.controls && item.controls.length == 0) {
        let clickProps = () => {}

        if (getCompEvent(item).hasOwnProperty('OnClick')) {
          clickProps = getCompEvent(item).OnClick
        }

        if (item.properties.displayStyle || item.type === 'JGButtonGroupItem') {
          return (
            <Button
              disabled={enabled}
              variant={variant}
              color={color}
              key={item.properties.code}
              size="small"
              disableRipple
              onClick={clickProps}
              startIcon={iconMap.map((itemTemp) => {
                if (itemTemp.iconV3 == item.properties.icon) {
                  return itemTemp.icon
                }
              })}
            >
              {item.properties.labelText}
            </Button>
          )
        } else {
          return (
            <Tooltip title={item.properties.labelText}>
              <IconButton
                disabled={enabled}
                color={color}
                key={item.properties.code}
                size="small"
                onClick={clickProps}
                disableRipple
              >
                {iconMap.map((itemTemp) => {
                  if (itemTemp.iconV3 == item.properties.icon) {
                    return itemTemp.icon
                  }
                })}
              </IconButton>
            </Tooltip>
          )
        }
      }

      if (
        item.controls &&
        item.controls.length > 0 &&
        !item.properties.isMore
      ) {
        const menu = getMenu(item.controls)

        let clickProps = () => {}

        if (getCompEvent(item).hasOwnProperty('OnClick')) {
          clickProps = getCompEvent(item).OnClick
        }

        if (item.properties.displayStyle || item.type === 'JGButtonGroupItem') {
          return (
            <Dropdown
              disabled={enabled}
              overlay={menu}
              key={item.properties.code}
              trigger={trigger}
            >
              <Button
                disabled={enabled}
                variant={variant}
                color={color}
                size="small"
                endIcon={<ExpandMoreIcon />}
                disableRipple
                onClick={clickProps}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
                startIcon={iconMap.map((itemTemp) => {
                  if (itemTemp.iconV3 == item.properties.icon) {
                    return itemTemp.icon
                  }
                })}
              >
                {item.properties.labelText}
              </Button>
            </Dropdown>
          )
        } else {
          return (
            <Dropdown
              disabled={enabled}
              overlay={menu}
              key={item.properties.code}
              trigger={trigger}
            >
              <Tooltip title={item.properties.labelText}>
                <IconButton
                  disabled={enabled}
                  // variant={variant}
                  color={color}
                  size="small"
                  onClick={clickProps}
                  disableRipple
                >
                  {iconMap.map((itemTemp) => {
                    if (itemTemp.iconV3 == item.properties.icon) {
                      return itemTemp.icon
                    }
                  })}

                  <ExpandMoreIcon />
                </IconButton>
              </Tooltip>
            </Dropdown>
          )
        }
      }

      if (item.more.length > 0) {
        const menu = getMenu(item.more)
        let variant_more: any = 'contained'
        let color_more: any = 'primary'
        if (showBorder == false) {
          variant_more = 'text'
          color_more = 'primary'
        }
        let clickProps = () => {}

        if (getCompEvent(item).hasOwnProperty('OnClick')) {
          clickProps = getCompEvent(item).OnClick
        }
        return (
          <Dropdown
            disabled={enabled}
            overlay={menu}
            key={'#'}
            trigger={trigger}
          >
            <Button
              disabled={enabled}
              variant={variant_more}
              color={color_more}
              size="small"
              disableElevation
              onClick={clickProps}
              endIcon={<MoreHorizIcon />}
            ></Button>
          </Dropdown>
        )
      }
    })
  }
}

const JGButtonGroup = (props: JGButtonGroupProps) => {
  const context = useContext()
  const {
    left,
    top,
    height,
    width,
    position,
    control,
    enabled,
    showBorder,
    expandWhenHover,
    ...resprops
  } = props

  let controlsTemp = []

  if (control && control.controls) {
    controlsTemp = control.controls
  }

  // console.log("context.position")
  // console.log(context.position)

  return (
    <Box
      sx={{
        left: left,
        top: top,
        width: toWidth(width, context, '235px'),
        height: toHeight(height, context, '26px'),
        position: context.position,
        textAlign: control.properties.align == 'end' ? 'right' : 'left'
      }}
    >
      <Space size={control.properties.size}>
        {loadButtonGroup(controlsTemp, enabled, showBorder, expandWhenHover)}
      </Space>
    </Box>
  )
}

JGButtonGroup.defaultProps = {
  left: '20px',
  top: '50px',
  width: '250px',
  height: '30px',
  position: 'absolute'
}

export default JGButtonGroup
export { JGButtonGroup, type JGButtonGroupProps }
