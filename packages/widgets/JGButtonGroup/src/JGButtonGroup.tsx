import React from 'react'
import 'antd/dist/antd.css'
import { Property } from 'csstype'
import { useContext } from '@v-act/widget-context'
import { toHeight, toWidth } from '@v-act/widget-utils'
import { Menu, Dropdown, Button, Space } from 'antd'
import { DownOutlined, EllipsisOutlined } from '@ant-design/icons'
import { ArrowDropDownCircleOutlined } from '@mui/icons-material'
import Box from '@mui/material/Box'
import { el } from 'date-fns/locale'
interface JGButtonGroupProps {
  left?: Property.Left
  top?: Property.Top
  position?: Property.Position
  height?: Property.Height
  width?: Property.Width
  control?: any
}
const { SubMenu } = Menu

const loadButtonGroup = (control: any) => {
  if (!control) {
    return null
  } else {
    const getChild = (controls: any) => {
      if (controls) {
        controls.map((item: any) => {
          if (item.controls.length == 0) {
            return <Menu.Item>{item.properties.labelText}</Menu.Item>
          } else {
            return (
              <SubMenu title={item.properties.labelText}>
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
            if (item.controls.length == 0) {
              return <Menu.Item>{item.properties.labelText}</Menu.Item>
            } else {
              return (
                <SubMenu title={item.properties.labelText}>
                  {getChild(item.controls)}
                </SubMenu>
              )
            }
          })}
        </Menu>
      )
    }

    console.log(control)

    const more = control.filter((item: any) => {
      return item.properties.isMore == 'True'
    })
    const other = control.filter((item: any) => {
      return !item.properties.isMore
    })
    other.ismore = []
    more.map((item: any) => {
      other.ismore.push(item)
    })

    other.map((item: any) => {
      console.log('item')

      console.log(item)

      if (item.controls.length == 0) {
        return <Button type="primary">{item.properties.labelText}</Button>
      }

      if (item.controls.length > 0 && !item.properties.isMore) {
        const menu = getMenu(item.controls)
        // console.log(menu)
        return (
          <Dropdown overlay={menu}>
            <Button type="primary">
              {item.properties.labelText}
              <DownOutlined />
            </Button>
          </Dropdown>
        )
      }

      if (item.controls.length > 0 && item.properties.isMore == 'True') {
        const menu = getMenu(more)
        // console.log(menu)
        return (
          <Dropdown overlay={menu}>
            <Button type="primary">
              <EllipsisOutlined />
            </Button>
          </Dropdown>
        )
      }
    })
  }
}

const JGButtonGroup = (props: JGButtonGroupProps) => {
  const context = useContext()
  const { left, top, height, width, position, control, ...resprops } = props

  let controlTemp = [
    {
      type: 'JGButtonGroupItem',
      properties: {
        code: 'JGButtonGroupItem1',
        labelText: '按钮1',
        theme: 'whiteType'
      },
      headerControls: [],
      controls: []
    },
    {
      type: 'JGButtonGroupItem',
      properties: {
        code: 'JGButtonGroupItem2',
        labelText: '按钮2',
        theme: 'redType'
      },
      headerControls: [],
      controls: [
        {
          type: 'JGButtonGroupItem',
          properties: {
            code: 'JGButtonGroupItem3',
            labelText: '按钮3'
          },
          headerControls: [],
          controls: [
            {
              type: 'JGButtonGroupItem',
              properties: {
                code: 'JGButtonGroupItem4',
                labelText: '按钮4',
                theme: 'greenType'
              },
              headerControls: [],
              controls: []
            }
          ]
        }
      ]
    },
    {
      type: 'JGButtonGroupItem',
      properties: {
        code: 'JGButtonGroupItem5',
        isMore: 'True',
        labelText: '按钮5'
      },
      headerControls: [],
      controls: [
        {
          type: 'JGButtonGroupItem',
          properties: {
            code: 'JGButtonGroupItem9',
            isMore: 'True',
            labelText: '按钮9',
            theme: 'greenType'
          },
          headerControls: [],
          controls: []
        },
        {
          type: 'JGButtonGroupItem',
          properties: {
            code: 'JGButtonGroupItem10',
            isMore: 'True',
            labelText: '按钮10'
          },
          headerControls: [],
          controls: [
            {
              type: 'JGButtonGroupItem',
              properties: {
                code: 'JGButtonGroupItem11',
                isMore: 'True',
                labelText: '按钮11',
                theme: 'whiteType'
              },
              headerControls: [],
              controls: []
            }
          ]
        }
      ]
    },
    {
      type: 'JGButtonGroupItem',
      properties: {
        code: 'JGButtonGroupItem6',
        isMore: 'True',
        labelText: '按钮6',
        theme: 'redType'
      },
      headerControls: [],
      controls: [
        {
          type: 'JGButtonGroupItem',
          properties: {
            code: 'JGButtonGroupItem7',
            isMore: 'True',
            labelText: '按钮7',
            theme: 'orangeType'
          },
          headerControls: [],
          controls: [
            {
              type: 'JGButtonGroupItem',
              properties: {
                code: 'JGButtonGroupItem8',
                isMore: 'True',
                labelText: '按钮8',
                theme: 'whiteType'
              },
              headerControls: [],
              controls: []
            }
          ]
        }
      ]
    }
  ]

  return (
    <Box
      sx={{
        left: left,
        top: top,
        width: toWidth(width, context, '235px'),
        height: toHeight(height, context, '26px'),
        position: context.position
      }}
    >
      <Space>{loadButtonGroup(controlTemp)}</Space>
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
