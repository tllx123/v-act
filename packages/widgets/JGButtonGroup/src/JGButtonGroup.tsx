import React from 'react'
import 'antd/dist/antd.css'
import { Property } from 'csstype'
import { useContext } from '@v-act/widget-context'
import { toHeight, toWidth, getCompEvent } from '@v-act/widget-utils'
import { Menu, Dropdown, Space } from 'antd'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
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

        return (
          <Button
            disabled={enabled}
            variant={variant}
            color={color}
            key={item.properties.code}
            size="small"
            disableElevation
            onClick={clickProps}
          >
            {item.properties.labelText}
          </Button>
        )
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
              disableElevation
              onClick={clickProps}
            >
              {item.properties.labelText}
            </Button>
          </Dropdown>
        )
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
            >
              <MoreHorizIcon />
            </Button>
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
