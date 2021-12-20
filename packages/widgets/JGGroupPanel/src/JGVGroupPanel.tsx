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

const JGVGroupPanel = function (props: JGGroupPanelProps) {
  const settings = props.setting || []
  const topChildren: ReactNode[] = [],
    middleChildren: ReactNode[] = [],
    bottomChildren: ReactNode[] = []
  const children = props.children || []
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
          hAlign === HorizontalAlign.Left
            ? 'start'
            : hAlign === HorizontalAlign.Center
            ? 'center'
            : 'end'
      }
      if (vAlign == VerticalAlign.Top) {
        if (topChildren.length > 0) {
          //添加成员间距8px
          containerProps.marginTop = '8px'
        }
        topChildren.push(<div style={containerProps}>{child}</div>)
      } else if (vAlign == VerticalAlign.Middle) {
        if (topChildren.length > 0 || middleChildren.length > 0) {
          //添加成员间距8px
          containerProps.marginTop = '8px'
        }
        middleChildren.push(<div style={containerProps}>{child}</div>)
      } else {
        if (
          topChildren.length > 0 ||
          middleChildren.length > 0 ||
          bottomChildren.length > 0
        ) {
          //添加成员间距8px
          containerProps.marginTop = '8px'
        }
        bottomChildren.push(<div style={containerProps}>{child}</div>)
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
  const areaChildren = []
  if (
    topChildren.length > 0 ||
    (middleChildren.length > 0 && bottomChildren.length > 0)
  ) {
    areaChildren.push({
      justifyContent: 'start',
      children: topChildren
    })
  }
  if (middleChildren.length > 0) {
    areaChildren.push({
      justifyContent: 'center',
      children: middleChildren
    })
  }
  if (
    bottomChildren.length > 0 ||
    (topChildren.length > 0 && middleChildren.length > 0)
  ) {
    areaChildren.push({
      justifyContent: 'end',
      children: bottomChildren
    })
  }
  const containerProps = getGroupPanelProps(props, context)
  return (
    <Fragment>
      {props.groupTitle ? (
        <fieldset
          style={{
            margin: '0px',
            ...containerProps,
            padding: '0px',
            display: 'flex',
            overflow: 'visible',
            fontFamily:
              'Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,\\5FAE\\8F6F\\96C5\\9ED1,Arial,sans-serif',
            border: '1px solid #ddd',
            boxSizing: 'border-box'
          }}
        >
          <legend
            style={{
              fontSize: '14px',
              color: '#8C8C8C',
              fontWeight: 'bold'
            }}
          >
            {props.groupTitle}
          </legend>
          <div
            style={{
              ...containerProps,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <ContextProvider context={childContext}>
              {areaChildren.map((area, i) => {
                return (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: area.justifyContent,
                      height: '100%'
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
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <ContextProvider context={childContext}>
            {areaChildren.map((area, i) => {
              return (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: area.justifyContent,
                    height: '100%'
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

export { JGVGroupPanel }
