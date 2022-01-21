import { CSSProperties, Fragment, ReactNode } from 'react'

import { ReactEnum } from '@v-act/schema-types'
import {
  ContextProvider,
  createContext,
  useContext
} from '@v-act/widget-context'
import {
  getChildrenWithoutFragment,
  toHeight,
  toWidth
} from '@v-act/widget-utils'

import {
  HorizontalAlign,
  JGGroupPanelProps,
  Setting,
  VerticalAlign
} from './JGGroupPanel'
import { getGroupPanelProps, isSpacer } from './utils'

const JGHGroupPanel = function (props: JGGroupPanelProps) {
  const settings = props.setting || []
  const leftChildren: ReactNode[] = [],
    centerChildren: ReactNode[] = [],
    rightChildren: ReactNode[] = []
  const settingMap: { [prop: string]: Setting } = {}
  const settingIndexList: Setting[] = []
  const context = useContext()
  settings.forEach((set) => {
    if (typeof set.key === 'string') {
      settingMap[set.key] = set
    }
    if (typeof set.index === 'number') {
      settingIndexList[set.index] = set
    }
  })
  const childContext = createContext(
    Object.assign(context, {
      position: 'static'
    })
  )
  let preChildIsSpacer = false
  const parseChild = (child: JSX.Element, index: number) => {
    child = getChildrenWithoutFragment(child)[0]
    if (child) {
      const isSpacerChild = isSpacer(child)
      let key = child.key
      if (key === null) {
        key = child.props.code
      }
      if (key !== null) {
        const childSetting = settingMap[key] || settingIndexList[index]
        const hAlign =
          childSetting && childSetting.horizontalAlign
            ? childSetting.horizontalAlign
            : HorizontalAlign.Left
        const vAlign =
          childSetting && childSetting.verticalAlign
            ? childSetting.verticalAlign
            : VerticalAlign.Top
        const containerProps: CSSProperties = {
          pointerEvents: isSpacerChild ? 'none' : 'all',
          position: 'relative',
          width:
            childSetting && childSetting.percentWidth
              ? childSetting.percentWidth
              : toWidth(
                  child.props.multiWidth || child.props.width,
                  context,
                  ReactEnum.Content
                ),
          height:
            childSetting && childSetting.percentHeight
              ? childSetting.percentHeight
              : toHeight(
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
            containerProps.marginLeft =
              isSpacerChild || preChildIsSpacer ? '0px' : '8px'
          }
          leftChildren.push(<div style={containerProps}>{child}</div>)
        } else if (hAlign == HorizontalAlign.Center) {
          if (leftChildren.length > 0 || centerChildren.length > 0) {
            //添加成员间距8px
            containerProps.marginLeft =
              isSpacerChild || preChildIsSpacer ? '0px' : '8px'
          }
          centerChildren.push(<div style={containerProps}>{child}</div>)
        } else {
          if (
            leftChildren.length > 0 ||
            centerChildren.length > 0 ||
            rightChildren.length > 0
          ) {
            //添加成员间距8px
            containerProps.marginLeft =
              isSpacerChild || preChildIsSpacer ? '0px' : '8px'
          }
          rightChildren.push(<div style={containerProps}>{child}</div>)
        }
      }
      preChildIsSpacer = isSpacerChild
    }
  }
  let children = getChildrenWithoutFragment(props.children)
  children.forEach((child, index) => {
    parseChild(child, index)
  })
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
              pointerEvents: 'none',
              boxSizing: 'border-box'
            }}
          >
            {props.groupTitle}
          </legend>
          <div
            style={{
              ...containerProps,
              pointerEvents: 'none',
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
                      pointerEvents: 'none',
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
            pointerEvents: 'none',
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
                    pointerEvents: 'none',
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
