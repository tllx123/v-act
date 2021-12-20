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
  let children = props.children || []
  const settingMap: { [prop: string]: Setting } = {}
  const context = useContext()
  settings.forEach((set) => {
    settingMap[set.key] = set
  })
  const childContext = createContext({
    position: 'static'
  })
  const parseChild = (child: JSX.Element) => {
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
        width: toWidth(
          child.props.multiWidth || child.props.width,
          context,
          ReactEnum.Content
        ),
        height: toHeight(
          child.props.multiHeight || child.props.height,
          context,
          ReactEnum.Content
        ),
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
  }
  if (Array.isArray(children)) {
    children.forEach((child) => {
      parseChild(child)
    })
  } else {
    parseChild(children)
  }
  const containerProps = getGroupPanelProps(props, context)
  const areaChidlren = []
  if (
    leftChildren.length > 0 ||
    (centerChildren.length > 0 && rightChildren.length > 0)
  ) {
    areaChidlren.push({
      justifyContent: 'start',
      children: leftChildren
    })
  }
  if (centerChildren.length > 0) {
    areaChidlren.push({
      justifyContent: 'center',
      children: centerChildren
    })
  }
  if (
    rightChildren.length > 0 ||
    (leftChildren.length > 0 && centerChildren.length > 0)
  ) {
    areaChidlren.push({
      justifyContent: 'end',
      children: rightChildren
    })
  }
  return (
    <Fragment>
      {props.groupTitle ? (
        <fieldset
          style={{
            margin: '0px',
            ...containerProps,
            height: 'auto',
            display: 'flex',
            overflow: 'visible',
            padding: '0px',
            border: '1px solid #ddd',
            fontFamily:
              'Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,\\5FAE\\8F6F\\96C5\\9ED1,Arial,sans-serif',
            boxSizing: 'border-box'
          }}
        >
          <legend
            style={{
              fontSize: '14px',
              color: '#8C8C8C',
              fontWeight: 'bold',
              boxSizing: 'border-box'
            }}
          >
            {props.groupTitle}
          </legend>
          <div
            style={{
              ...containerProps,
              height: 'calc(' + containerProps.height + ' - 22px)',
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <ContextProvider context={childContext}>
              {areaChidlren.map((area, i) => {
                return (
                  <div
                    style={{
                      display: 'flex',
                      width: '100%',
                      justifyContent: area.justifyContent
                    }}
                    key={i}
                  >
                    {area.children.map((child, index) => {
                      return <Fragment key={index}>{child}</Fragment>
                    })}
                  </div>
                )
              })}
            </ContextProvider>
          </div>
        </fieldset>
      ) : (
        <div
          style={{
            ...containerProps,
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <ContextProvider context={childContext}>
            {areaChidlren.map((area, i) => {
              return (
                <div
                  style={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: area.justifyContent
                  }}
                  key={i}
                >
                  {area.children.map((child, index) => {
                    return <Fragment key={index}>{child}</Fragment>
                  })}
                </div>
              )
            })}
          </ContextProvider>
        </div>
      )}
    </Fragment>
  )
}

export { JGHGroupPanel }
