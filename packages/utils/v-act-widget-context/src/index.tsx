import React, { ReactNode, useState } from 'react'
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
   * 窗体实例id
   */
  instanceId: string
  /**
   * 控件position
   */
  position: Property.Position
  /**
   * 构件编号
   */
  componentCode?: string
  /**
   * 构件方法
   */
  windowScope?: any
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

  setFieldValueTemp?: (
    tableName: string,
    columnName: string,
    context: WidgetContextProps,
    val: any
  ) => void
  getFieldValue?: (
    tableName: string,
    columnName: string,
    context: WidgetContextProps
  ) => void
  inputVal?: any
  insertDataFunc?: (data: any) => void
  updateDataFunc?: (data: any) => void
  removeDataFunc?: (data: any) => void
}

interface ContextProviderProps {
  context?: WidgetContextProps
  children?: ReactNode
}

const defaultContext: WidgetContextProps = {
  position: 'absolute',
  entities: undefined,
  instanceId: ''
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

  const [contextTemp, setVal] = useState(context)

  //插入
  const insertDataFunc = (params: any) => {
    const entities = contextTemp.entities
    if (entities) {
      const entity = entities[params.code]
      if (entity) {
        entity.datas.push(params.re)
      }
    }
  }

  //更新
  const updateDataFunc = (params: any) => {}
  //删除
  const removeDataFunc = (params: any) => {}

  const getFieldValue = (
    tableName: string,
    columnName: string,
    context: WidgetContextProps
  ): any => {
    const entities = context.entities
    if (entities) {
      const entity = entities[tableName]
      if (entity) {
        const current = entity._current
        if (current) {
          return current[columnName]
        }
      }
    }
    return null
  }

  const setFieldValueTemp = (
    tableName: string,
    columnName: string,
    context: WidgetContextProps,
    val: any
  ) => {
    const entities = context.entities
    if (entities) {
      const entity = entities[tableName]
      if (entity) {
        const current = entity._current
        if (current) {
          current[columnName] = val
          setVal(context)
        }
      }
    }
  }

  return (
    <WidgetContext.Provider
      value={{
        ...contextTemp,
        getFieldValue,
        setFieldValueTemp,
        insertDataFunc,
        updateDataFunc,
        removeDataFunc
      }}
    >
      {children}
    </WidgetContext.Provider>
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
