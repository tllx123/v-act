import {
  Control,
  Event,
  IPrototypeFrameProperty,
  WidgetRenderContext,
  WidgetRenderer
} from '@v-act/schema-types'
import { getComponentResPath } from '@v-act/widget-utils'

import { IPrototypeFrame, IPrototypeFrameProps } from './IPrototypeFrame'
import { ListItem, MenuData } from './utils'

const convert = function (
  control: Control,
  render: WidgetRenderer,
  componentCode: string,
  context: WidgetRenderContext
): JSX.Element {
  const pros: IPrototypeFrameProperty = control.properties

  const headerMenu: ListItem[] = [],
    sideMenu: MenuData[] = []
  const props: IPrototypeFrameProps = {
    logo: pros.logoPic
      ? getComponentResPath(pros.logoPic, componentCode)
      : undefined,
    sideMenu,
    headMenu: headerMenu
  }
  const getDataFromEvents = function (events: Event[] | undefined) {
    let data = ''
    if (events && events.length > 0) {
      const handler = events[0].handler
      if (handler) {
        const res = handler()
        const windowAction = res.windowAction
        const targetSourceType = windowAction.targetSourceType
        if (targetSourceType === 'default') {
          const targetWindow = windowAction.targetWindow
          const windowInfo = targetWindow.split('.')
          data = `../../${windowInfo[0]}/${windowInfo[1]}`
        } else if (targetSourceType === 'url') {
          data = windowAction.targetWindow
        }
      }
    }
    return data
  }
  const toMenuData = function (control: Control): MenuData {
    const menuProps = control.properties
    const menuData: MenuData = {
      code: menuProps.code,
      type: 'url',
      data: getDataFromEvents(control.events),
      title: menuProps.labelText ? menuProps.labelText : ''
    }
    const childrenCons = control.controls
    if (childrenCons && childrenCons.length > 0) {
      const children: MenuData[] = []
      childrenCons.forEach((child) => {
        children.push(toMenuData(child))
      })
      menuData.children = children
    }
    return menuData
  }
  const controls = control.controls
  controls.forEach((con) => {
    const widgetType = con.type
    if (widgetType === 'TopMenu') {
      const topMenus = con.controls
      topMenus.forEach((menu) => {
        const menuProps = menu.properties
        headerMenu.push({
          code: menuProps.code,
          type: 'url',
          data: getDataFromEvents(menu.events),
          title: menuProps.labelText ? menuProps.labelText : ''
        })
      })
    } else if (widgetType === 'LeftSideMenu') {
      const sideMenus = con.controls
      sideMenus.forEach((menu) => {
        sideMenu.push(toMenuData(menu))
      })
    }
  })
  return <IPrototypeFrame {...props}></IPrototypeFrame>
}

const JsonIPrototypeFrame = function (props: {
  control: Control
  render: WidgetRenderer
  componentCode: string
  context: WidgetRenderContext
}) {
  return convert(
    props.control,
    props.render,
    props.componentCode,
    props.context
  )
}

export { IPrototypeFrame, type IPrototypeFrameProps, JsonIPrototypeFrame }
