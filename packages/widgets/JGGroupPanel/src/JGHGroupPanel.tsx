import { CSSProperties, Fragment, ReactNode } from 'react'

import { ReactEnum } from '@v-act/schema-types'
import {
  ContextProvider,
  createContext,
  useContext
} from '@v-act/widget-context'
import { toHeight, toWidth } from '@v-act/widget-utils'

import {
  HorizontalAlign,
  JGGroupPanelProps,
  Setting,
  VerticalAlign
} from './JGGroupPanel'
import { getGroupPanelProps } from './utils'

const JGHGroupPanel = function (props: JGGroupPanelProps) {
  const settings = props.setting || []
  const leftChildren: ReactNode[] = [],
    centerChildren: ReactNode[] = [],
    rightChildren: ReactNode[] = []
  const children = props.children || []
  const settingMap: { [prop: string]: Setting } = {}
  const context = useContext()
  settings.forEach((set) => {
    settingMap[set.key] = set
  })
  const childContext = createContext({
    position: 'static'
  })
  children.forEach((child) => {
    let key = child.key
    if (key === null) {
      key = child.props.code
    }
    if (key !== null) {
      const childSetting = settingMap[key]
      const hAlign =
        childSetting && childSetting.horizontalAlign
          ? childSetting.horizontalAlign
          : HorizontalAlign.Left
      const vAlign =
        childSetting && childSetting.verticalAlign
          ? childSetting.verticalAlign
          : VerticalAlign.Top
      const containerProps: CSSProperties = {
        width: toWidth(child.props.multiWidth, context, ReactEnum.Content),
        height: toHeight(child.props.multiHeight, context, ReactEnum.Content),
        alignSelf:
          vAlign === VerticalAlign.Top
            ? 'start'
            : vAlign === VerticalAlign.Middle
            ? 'center'
            : 'end'
      }
      if (hAlign == HorizontalAlign.Left) {
        if (leftChildren.length > 0) {
          //添加成员间距8px
          containerProps.marginLeft = '8px'
        }
        leftChildren.push(<div style={containerProps}>{child}</div>)
      } else if (hAlign == HorizontalAlign.Center) {
        if (leftChildren.length > 0 || centerChildren.length > 0) {
          //添加成员间距8px
          containerProps.marginLeft = '8px'
        }
        centerChildren.push(<div style={containerProps}>{child}</div>)
      } else {
        if (
          leftChildren.length > 0 ||
          centerChildren.length > 0 ||
          rightChildren.length > 0
        ) {
          //添加成员间距8px
          containerProps.marginLeft = '8px'
        }
        rightChildren.push(<div style={containerProps}>{child}</div>)
      }
    }
  })
  const containerProps = getGroupPanelProps(props, context)
  return (
    <div
      style={{
        ...containerProps,
        display: 'flex',
        justifyContent: 'space-between'
      }}
    >
      <ContextProvider context={childContext}>
        <div style={{ display: 'flex' }}>
          {leftChildren.map((child, index) => {
            return <Fragment key={index}>{child}</Fragment>
          })}
        </div>
        <div style={{ display: 'flex' }}>
          {centerChildren.map((child, index) => {
            return <Fragment key={index}>{child}</Fragment>
          })}
        </div>
        <div style={{ display: 'flex' }}>
          {rightChildren.map((child, index) => {
            return <Fragment key={index}>{child}</Fragment>
          })}
        </div>
      </ContextProvider>
    </div>
  )
}

export { JGHGroupPanel }
