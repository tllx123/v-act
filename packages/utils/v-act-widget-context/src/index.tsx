import React, { ReactNode } from 'react'

import { Property } from 'csstype'

import { Height, Width } from '@v-act/schema-types'

type FieldValue = string | number | boolean | null

type EntityRecord = {
  [fieldCode: string]: FieldValue
}

type Entities = {
  [prop: string]: {
    datas: EntityRecord[]
    _current: EntityRecord | null
  }
}

interface WidgetContextProps {
  /**
   * 控件position
   */
  position: Property.Position
  /**
   * 构件编号
   */
  componentCode?: string
  /**
   * 标题宽度
   */
  labelWidth?: number
  /**
   * 控件高度
   */
  multiHeight?: Height
  /**
   * 控件宽度
   */
  multiWidth?: Width
  //因方案未确定，不要在控件中使用该属性,请使用@v-act/widget-utils中的getFieldValue和getEntityDatas两个接口获取实体数据
  entities?: Entities
}

interface ContextProviderProps {
  context?: WidgetContextProps
  children?: ReactNode
}

const defaultContext: WidgetContextProps = {
  position: 'absolute'
}

const WidgetContext = React.createContext<WidgetContextProps>(defaultContext)
WidgetContext.displayName = '控件position上下文'

function withContext<T>(
  Component: React.ComponentType<T> | React.FunctionComponent<T>
) {
  return (props: T) => {
    return (
      <WidgetContext.Consumer>
        {(context) => <Component context={context} {...props} />}
      </WidgetContext.Consumer>
    )
  }
  /*const WithWidgetContext = React.forwardRef(function (props, ref) {
    return (
      <WidgetContext.Consumer>
        {(context) => <Component context={context} ref={ref} {...props} />}
      </WidgetContext.Consumer>
    )
  })
  return WithWidgetContext*/
}

const useContext = function () {
  return React.useContext(WidgetContext)
}

const createContext = function (
  context: WidgetContextProps | undefined | null
) {
  return Object.assign({}, defaultContext, context || {})
}

const ContextProvider = function (props: ContextProviderProps) {
  const context = props.context || { position: 'absolute' }
  const children = props.children
  return (
    <WidgetContext.Provider value={context}>{children}</WidgetContext.Provider>
  )
}

export {
  ContextProvider,
  createContext,
  type Entities,
  type EntityRecord,
  type FieldValue,
  useContext,
  WidgetContext,
  type WidgetContextProps,
  withContext
}
