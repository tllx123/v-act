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
  loadRecords?: (params: Record<string, any>) => void
  insertRecords?: (params: Record<string, any>) => void
  removeRecords?: (params: Record<string, any>) => void
  updateRecords?: (params: Record<string, any>) => void
  setCurrentRecord?: (recordId: string, code: string) => void
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
  const entities: Record<string, any> = {}
  const context = props.context || { position: 'absolute', entities }
  const children = props.children

  const [contextTemp, setVal] = useState(context)
  //const [contextTemp, setVal] = useState({})
  const [load, setLoad] = useState(0.1)

  /**加载实体
   *  params = {
   *    code:"",//实体编码
   *    records:[{...},{...}]
   *  }
   */
  const loadRecords = (params: Record<string, any>) => {
    const entities = contextTemp?.entities
    const { code, records } = params || {}

    if (!Array.isArray(records) || records.length === 0) {
      return
    }

    if (entities) {
      if (!entities[code]) {
        entities[code] = {
          datas: [],
          _current: null
        }
      }

      const entity = entities[code]

      !Array.isArray(entity.datas) && (entity.datas = [])

      entity.datas = [...entity.datas, ...records]
      entity._current = entity.datas[0]
    }
  }

  /**插入实体数据
   *  params = {
   *    code:"",
   *    records:[{...},{...}],
   *    index:0
   *  }
   */
  const insertRecords = (params: Record<string, any>) => {
    const entities = contextTemp?.entities
    const { code, records, index } = params || {}

    if (!Array.isArray(records) || records.length === 0) {
      return
    }

    let insertIndex =
      index < 0 ? 0 : index > records.length ? records.length : index

    if (entities) {
      const entity = entities[code]

      if (!entity) {
        return
      }

      !Array.isArray(entity.datas) && (entity.datas = [])

      entity.datas.splice(insertIndex, 0, ...records)
      setVal({ ...contextTemp })
    }
  }

  /**删除实体数据
   *  params = {
   *    code:"",
   *    records:[id1,id2...]
   *  }
   */
  const removeRecords = (params: Record<string, any>) => {
    const entities = contextTemp?.entities
    const { code, records } = params || {}

    if (!Array.isArray(records) || records.length === 0) {
      return
    }

    if (entities) {
      const entity = entities[code]

      if (!entity) {
        return
      }

      !Array.isArray(entity.datas) && (entity.datas = [])

      if (entity.datas.length === 0) {
        return
      }

      var newDatas = entity.datas.filter((item: any) => {
        return records.indexOf(item.id) === -1
      })

      entity.datas = newDatas
    }
  }

  /**更新实体数据
   *  params = {
   *    code:"",
   *    records:[{...},{...},...]
   *  }
   */
  const updateRecords = (params: Record<string, any>) => {
    const entities = context?.entities
    const { code, records } = params || {}

    if (!Array.isArray(records) || records.length === 0) {
      return
    }

    if (entities) {
      const entity = entities[code]

      if (!entity) {
        return
      }

      !Array.isArray(entity.datas) && (entity.datas = [])

      if (entity.datas.length === 0) {
        return
      }

      entity.datas.forEach((item: any) => {
        var record =
          records.find((record: any) => {
            return record.id === item.id
          }) || {}

        Object.assign(item, record)
      })

      setVal({ ...contextTemp })
    }
  }

  //设置当前行
  const setCurrentRecord = (recordId: string, code: string) => {
    const entities = contextTemp?.entities

    if (entities) {
      const entity = entities[code]

      if (!entity) {
        return
      }

      !Array.isArray(entity.datas) && (entity.datas = [])

      if (entity.datas.length === 0) {
        return
      }

      entity._current = entity.datas.find(
        (item: any) => item.id === recordId.toString()
      )
    }
  }

  //插入
  const insertDataFunc = (params: any) => {
    // const entities = context.entities
    console.log('entities')
    console.log(context.entities)
    // if (entities) {
    //   const entity = entities[params.code]
    //   if (entity) {
    //     entity.datas.push(params.record)
    //     setVal(context)
    //   }
    // }
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
  if (window != undefined) {
    window.contextTemp = contextTemp
    window.loadRecords = loadRecords
    window.insertRecords = insertRecords
    window.removeRecords = removeRecords
    window.updateRecords = updateRecords
    window.setCurrentRecord = setCurrentRecord
  }

  return (
    <WidgetContext.Provider
      value={{
        ...contextTemp,
        getFieldValue,
        setFieldValueTemp,
        insertDataFunc,
        updateDataFunc,
        removeDataFunc,
        loadRecords,
        insertRecords,
        removeRecords,
        updateRecords,
        setCurrentRecord
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
