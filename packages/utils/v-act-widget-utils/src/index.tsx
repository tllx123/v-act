import { CSSProperties, Fragment } from 'react'
import { useContext } from '@v-act/widget-context'
import { Property as CSSProperty } from 'csstype'
import { getResHashCode } from '@v-act/component-schema-utils'
import {
  Control,
  Dock,
  Entity,
  Event,
  Height,
  Property,
  ReactEnum,
  Width
} from '@v-act/schema-types'
import {
  Entities,
  EntityRecord,
  WidgetContextProps
} from '@v-act/widget-context'

/**
 * 转换成数值,转换失败将返回def值
 * @param val 转换值
 * @param def 默认值
 */
const toNumber = function (
  val: string | undefined,
  def?: number
): number | undefined {
  val = val === undefined ? def + '' : val
  let res = parseFloat(val)
  return isNaN(res) ? def : res
}

/**
 * 转换成布尔值
 * @param val 转换值
 */
const toBoolean = function (val: string | undefined, def?: boolean): boolean {
  def = def === undefined ? false : def
  if (val === undefined) {
    return def
  }
  val = val.toLowerCase()
  return val == 'true' ? true : false
}

const valueofWidth = function (
  val: string | undefined,
  def: ReactEnum | Width
): Width {
  if (val === 'space') {
    return ReactEnum.Space
  } else if (val === 'content') {
    return ReactEnum.Content
  } else {
    if (val === undefined) {
      return def
    } else {
      return val.endsWith('%') ? val : parseInt(val) + 'px'
    }
  }
}

const valueofHeight = function (
  val: string | undefined,
  def: ReactEnum | Height
): Height {
  return valueofWidth(val, def)
}

const toHeight = function (
  val: Height | undefined,
  context: WidgetContextProps | undefined,
  def: CSSProperty.Height
): CSSProperty.Height {
  return toCssAxisVal(
    context ? (context.multiHeight ? context.multiHeight : val) : val,
    def
  )
}

const toWidth = function (
  val: Width | undefined,
  context: WidgetContextProps | undefined,
  def: CSSProperty.Width
): CSSProperty.Width {
  return toCssAxisVal(
    context ? (context.multiWidth ? context.multiWidth : val) : val,
    def
  )
}

const toLabelWidth = function (
  val: number | undefined,
  context: WidgetContextProps | undefined,
  def: number
): number {
  if (context && typeof context.labelWidth == 'number') {
    return context.labelWidth
  }
  return typeof val == 'number' ? val : def
}

const maxTitleWidth = 196

const calTitleWidth = function (title: string): number {
  title = title || ''
  //服务端渲染不支持document
  /*const domId = 'test_' + new Date().getTime()
  const span = document.createElement('span')
  span.id = domId
  span.style.top = '-10px'
  span.style.position = 'absolute'
  span.innerText = title
  document.body.appendChild(span)
  let width = span.offsetWidth + 30
  width = width > maxTitleWidth ? maxTitleWidth : width
  document.body.removeChild(span)*/
  var width = title.length * 16 + 30
  width = width > maxTitleWidth ? maxTitleWidth : width
  return width
}

const getChildrenTitleWidth = function (children: JSX.Element[]): number {
  let titleWidth = 0
  for (let index = 0; index < children.length; index++) {
    const child = children[index]
    if (child.type && child.type === Fragment) {
      const childList = child.props.children
      if (childList) {
        const w = getChildrenTitleWidth(
          Array.isArray(childList) ? childList : [childList]
        )
        titleWidth = titleWidth > w ? titleWidth : w
      }
    } else {
      const childProps = child.props
      let labelText
      if (
        childProps.control &&
        childProps.control.properties &&
        childProps.control.properties.labelText
      ) {
        labelText = childProps.control.properties.labelText
      } else {
        childProps.labelText
      }
      const w = calTitleWidth(labelText)
      titleWidth = titleWidth > w ? titleWidth : w
    }
  }
  return titleWidth
}

const valueofDock = function (dock?: string): Dock {
  switch (dock) {
    case 'Top':
      return Dock.Top
    case 'Left':
      return Dock.Left
    case 'Right':
      return Dock.Right
    case 'Bottom':
      return Dock.Bottom
    case 'Fill':
      return Dock.Fill
    default:
      return Dock.None
  }
}

const toControlReact = function (properties: Property) {
  return {
    width: properties.width,
    height: properties.height
  }
}

const getChildrenWithoutFragment = function (
  element: JSX.Element | JSX.Element[] | null | undefined
): JSX.Element[] {
  if (element) {
    if (Array.isArray(element)) {
      return element
    } else {
      if (element.type === Fragment) {
        const children = element.props.children
        if (Array.isArray(children)) {
          return children
        } else {
          return [children]
        }
      }
      return [element]
    }
  }
  return []
}

const getChildrenWithoutFragmentRecursively = function (
  element: JSX.Element | JSX.Element[] | null | undefined
): JSX.Element[] {
  let children: JSX.Element[] = []
  if (element) {
    if (Array.isArray(element)) {
      element.forEach((ele) => {
        children = children.concat(getChildrenWithoutFragmentRecursively(ele))
      })
    } else {
      if (element.type === Fragment) {
        const childList = element.props.children
        children = children.concat(
          getChildrenWithoutFragmentRecursively(childList)
        )
      } else {
        children.push(element)
      }
    }
  }
  return children
}

const isPercent = function (val: string | null | undefined) {
  if (typeof val == 'string') {
    return val.endsWith('%')
  }
  return false
}
/**
 * 是否为锚定值
 * @param val 宽高值
 * @returns
 */
const isAbsoluteVal = function (val: string | null | undefined) {
  const type = typeof val
  if (type == 'number') {
    return true
  } else if (type == 'string') {
    //@ts-ignore
    const num = parseInt(val)
    return !isNaN(num)
  }
  return false
}

/**
 * 转换从成css坐标信息(宽、高、上边距、左边距等)
 */
const toCssAxisVal = function (
  val: ReactEnum | string | Width | Height | undefined | null,
  def:
    | string
    | CSSProperty.Height
    | CSSProperty.Width
    | CSSProperty.Left
    | CSSProperty.Top
) {
  if (val === ReactEnum.Space) {
    return '100%'
  } else if (val === ReactEnum.Content) {
    return 'auto'
  } else if (typeof val === 'string') {
    let val1 = parseInt(val)
    return val1 + '' === val ? val + 'px' : val
  } else {
    return def
  }
}
/**
 * 是否为null或undefined值
 * @param val 值
 * @returns
 */
const isNullOrUnDef = function (val: any): boolean {
  return val === null || typeof val === 'undefined'
}

/**
 * 获取实体字段值
 * @param tableName 实体编号
 * @param columnName 字段编号
 * @param context 上下文
 */
const getFieldValue = function (
  tableName: string,
  columnName: string,
  context: WidgetContextProps
) {
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

/**
 * 设置实体字段值
 * @param tableName 实体编号
 * @param columnName 字段编号
 * @param context 上下文
 * @param val 值
 */
const setFieldValue = function (
  tableName: string,
  columnName: string,
  context: WidgetContextProps,
  val: any
) {
  if (context.setFieldValueTemp) {
    context.setFieldValueTemp(tableName, columnName, context, val)
  }
}

/**
 * 获取组件属性值
 * @param control
 */
const useGetCompVal = function (control: Control, type?: string) {
  const context = useContext()
  const properties = control.properties
  const tableName = getTableName(control)
  const columnName = getColumnName(control)

  let props: any = {
    top: toNumber(properties.top) + 'px',
    left: toNumber(properties.left) + 'px',
    width: toWidth(
      valueofWidth(properties.multiWidth, '235px'),
      context,
      '235px'
    ),
    height: toHeight(
      valueofHeight(properties.multiHeight, '26px'),
      context,
      '26px'
    ),
    ismust: toBoolean(properties.isMust, false),
    placeholder: properties.placeholder,
    position: context.position,
    disabled: !toBoolean(properties.enabled, true),
    labeltext: properties.labelText || '',
    labelWidth: toLabelWidth(toNumber(properties.labelWidth, 94), context, 94),
    labelVisible: toBoolean(properties.labelVisible, true),
    readonly: toBoolean(properties.readOnly, false),
    value:
      tableName && columnName
        ? getFieldValue(tableName, columnName, context)
        : undefined
  }

  switch (type) {
    case 'JGLongDateTimePicker':
      ;(props.value =
        tableName && columnName
          ? getFieldValue(tableName, columnName, context)
            ? getFieldValue(tableName, columnName, context)
            : new Date()
          : undefined),
        (props.maxDate = properties.maxDate)
      props.minDate = properties.minDate
      props.onChangedForDate = (val: any) => {
        if (tableName && columnName) {
          setFieldValue(tableName, columnName, context, val)
        }
      }
      break
    case 'JGCheckBox':
      ;(props.value =
        tableName && columnName
          ? getFieldValue(tableName, columnName, context)
          : undefined),
        (props.value = props.value === 'false' ? '' : props.value)
      props.value = props.value === null ? '' : props.value
      props.onChanged = (e: any) => {
        if (tableName && columnName) {
          setFieldValue(
            tableName,
            columnName,
            context,
            e.target.checked.toString()
          )
        }
      }
      break
    case 'JGDateTimePicker':
      break

    default:
      props.onChanged = (e: any) => {
        if (tableName && columnName) {
          setFieldValue(tableName, columnName, context, e.target.value)
        }
      }
  }

  return props
}

/**
 * 获取实体数据
 * @param tableName 实体编号
 * @param context 上下文
 */
const getEntityDatas = function (
  tableName: string,
  context: WidgetContextProps
) {
  const entities = context.entities
  if (entities) {
    const entity = entities[tableName]
    if (entity) {
      return entity.datas
    }
  }
  return null
}

const _checkDataBinding = function (control: Control) {
  const dataMembers = control.dataBindings
  if (dataMembers && dataMembers.length > 0) {
    if (dataMembers.length > 1) {
      throw Error('未支持控件绑定多个实体！')
    }
  }
}

/**
 * 获取数据来源
 * @param control 控件定义
 * @returns
 */
const getConstData = function (control: Control) {
  const dropDownSource = control?.properties?.dropDownSource
  const dropDownSourceObj = dropDownSource ? JSON.parse(dropDownSource) : {}
  return dropDownSourceObj.DataSourceSetting.DataConfig.ConstData
}

/**
 * 获取数据来源
 * @param control 控件定义
 * @returns
 */
const getDropDownSource = function (control: Control) {
  const dropDownSource = control?.properties?.dropDownSource
  return dropDownSource ? JSON.parse(dropDownSource) : {}
}

/**
 * 获取控件绑定实体编号
 * @param control 控件定义
 * @returns
 */
const getTableName = function (control: Control) {
  _checkDataBinding(control)
  return control.dataBindings && control.dataBindings.length > 0
    ? control.dataBindings[0].dataSource
    : null
}

/**
 * 获取控件绑定字段
 * @param control 控件定义
 * @returns
 */
const getColumnName = function (control: Control) {
  _checkDataBinding(control)
  if (control.dataBindings && control.dataBindings.length > 0) {
    const dataMembers = control.dataBindings[0].dataMembers
    for (let index = 0; index < dataMembers.length; index++) {
      const element = dataMembers[index]
      if (element.code === 'ColumnName') {
        return element.value
      }
    }
  }
  return null
}
/**
 * 获取控件标识字段
 * @param control 控件定义
 * @returns
 */
const getIDColumnName = function (control: Control) {
  _checkDataBinding(control)
  if (control.dataBindings) {
    const dataMembers = control.dataBindings[0].dataMembers
    for (let index = 0; index < dataMembers.length; index++) {
      const element = dataMembers[index]
      if (element.code === 'IDColumnName') {
        return element.value
      }
    }
  }
  return null
}

const __fieldValueConverts: { [type: string]: Function } = {
  integer: function (value?: string) {
    if (typeof value === 'string') {
      const val = parseInt(value)
      return isNaN(val) ? null : val
    }
    return null
  },
  float: function (value?: string) {
    if (typeof value === 'string') {
      const val = parseFloat(value)
      return isNaN(val) ? null : val
    }
    return null
  },
  boolean: function (value?: string) {
    if (typeof value === 'string') {
      const val = value.toLowerCase()
      return val === 'true' ? true : false
    }
    return null
  }
}

const toEntities = function (entities?: Entity[]): Entities {
  const result: Entities = {}
  if (entities) {
    entities.forEach((entity) => {
      const tableName = entity.code
      const fieldMap: { [fieldCode: string]: string } = {}
      const fields = entity.fields
      fields.forEach((field) => {
        fieldMap[field.code] = field.type
      })
      const rows = entity.rows
      const datas: EntityRecord[] = []
      rows.forEach((row) => {
        const record: EntityRecord = {}
        for (const fieldCode in row) {
          if (Object.prototype.hasOwnProperty.call(row, fieldCode)) {
            let fieldValue = row[fieldCode]
            const fieldType = fieldMap[fieldCode]
            if (fieldType) {
              const convert = __fieldValueConverts[fieldType]
              if (convert) {
                fieldValue = convert(fieldValue)
              }
            }
            record[fieldCode] = fieldValue
          }
        }
        datas.push(record)
      })
      result[tableName] = {
        datas: datas,
        _current: datas.length > 0 ? datas[0] : null
      }
    })
  }
  return result
}

/**
 * 获取构件资源路径
 * @param resCode 资源编号
 * @param componentCode 构件编号
 */
const getComponentResPath = function (resCode: string, componentCode: string) {
  if (!componentCode) {
    throw Error('未找到构件编码，无法获取构件资源路径！')
  }
  return `../../resources/${componentCode}_${resCode}?h=${getResHashCode(
    componentCode,
    resCode
  )}`
}

/**
 * 将控件动作转换成React元素
 * @param evt 控件动作
 */
const toJSXElementFromAction = function (evt: Event): JSX.Element | null {
  const handler = evt.handler
  const action = handler()
  const windowAction = action.windowAction
  const targetWindow = windowAction.targetWindow
  const winInfo = targetWindow.split('.')
  return (
    <iframe
      src={'/' + winInfo[0] + '/' + winInfo[1]}
      style={{ width: '100%', height: '100%', padding: '0px', margin: '0px' }}
    ></iframe>
  )
}

const getCompEvent = function (control?: any): any {
  const events = control.events
  const eventMap: { [eventCode: string]: Function } = {}
  if (events && events.length > 0) {
    events.forEach((evt: any) => {
      eventMap[evt.code] = evt.handler
    })
  }
  return eventMap
}

/**
 * 获取主题颜色
 * @param theme 主题类型
 * @param control 控件定义
 * @returns
 */
const valueofTheme = function (
  theme?: string,
  control?: Control
): CSSProperties {
  switch (theme) {
    case 'whiteType':
      return {
        backgroundColor: '#fff'
      }
    case 'greenType':
      return {
        backgroundColor: '#04B26A'
      }
    case 'orangeType':
      return {
        backgroundColor: '#F27923'
      }
    case 'redType':
      return {
        backgroundColor: '#ED4014'
      }
    case 'customType':
      return {
        backgroundColor: control?.properties?.backColor ?? '#356abb'
      }
    default:
      return {
        backgroundColor: '#356abb'
      }
  }
}

export {
  calTitleWidth,
  getChildrenTitleWidth,
  getChildrenWithoutFragment,
  getChildrenWithoutFragmentRecursively,
  getColumnName,
  getCompEvent,
  getComponentResPath,
  getConstData,
  getDropDownSource,
  getEntityDatas,
  getFieldValue,
  getIDColumnName,
  getTableName,
  useGetCompVal,
  isAbsoluteVal,
  isNullOrUnDef,
  isPercent,
  setFieldValue,
  toBoolean,
  toControlReact,
  toCssAxisVal,
  toEntities,
  toHeight,
  toJSXElementFromAction,
  toLabelWidth,
  toNumber,
  toWidth,
  valueofDock,
  valueofHeight,
  valueofTheme,
  valueofWidth
}
