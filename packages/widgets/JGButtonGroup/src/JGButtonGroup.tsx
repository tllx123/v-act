import React from 'react'
import 'antd/dist/antd.css'
import { Property } from 'csstype'
import { useContext } from '@v-act/widget-context'
import { toHeight, toWidth } from '@v-act/widget-utils'
import { Menu, Dropdown, Button, Space } from 'antd'
import { DownOutlined, EllipsisOutlined } from '@ant-design/icons'
import { ArrowDropDownCircleOutlined } from '@mui/icons-material'

interface JGButtonGroupProps {
  left?: Property.Left
  top?: Property.Top
  position?: Property.Position
  height?: Property.Height
  width?: Property.Width
}
const { SubMenu } = Menu

const menu = (
  <Menu>
    <Menu.ItemGroup title="Group title">
      <Menu.Item>1st menu item</Menu.Item>
      <Menu.Item>2nd menu item</Menu.Item>
    </Menu.ItemGroup>
    <SubMenu title="sub menu">
      <Menu.Item>3rd menu item</Menu.Item>
      <Menu.Item>4th menu item</Menu.Item>
    </SubMenu>
    <SubMenu title="disabled sub menu" disabled>
      <Menu.Item>5d menu item</Menu.Item>
      <Menu.Item>6th menu item</Menu.Item>
    </SubMenu>
  </Menu>
)

const JGButtonGroup = (props: JGButtonGroupProps) => {
  const { left, top, height, width, position, ...resprops } = props

  return (
    <>
      <Space>
        <Button type="primary">你好</Button>
        <Dropdown overlay={menu}>
          <Button type="primary">
            你好
            <DownOutlined />
          </Button>
        </Dropdown>

        <Dropdown overlay={menu}>
          <Button type="primary">
            <EllipsisOutlined />
          </Button>
        </Dropdown>
      </Space>
    </>
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
