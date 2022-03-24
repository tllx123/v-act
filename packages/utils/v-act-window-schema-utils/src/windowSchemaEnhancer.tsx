import { createElement, Fragment } from 'react'

import {
  Action,
  ActionSchema,
  Control,
  ControlReact,
  ControlSchema,
  DataBinding,
  DataBindingSchema,
  DataMember,
  Entity,
  EntityDefRowSchema,
  EntityField,
  EntityFieldSchema,
  EntityRecord,
  EntitySchema,
  Event,
  JGCollapsePanelProperty,
  JGGroupPanelProperty,
  MasterPage,
  MasterPageControl as MasterPageControl1,
  MasterPageControlSchema,
  MasterPageSchema,
  Property,
  PropertysSchema,
  ReactEnum,
  WidgetConvertContext,
  WidgetDefines,
  Window,
  WindowAction,
  WindowActionSchema,
  WindowSchema
} from '@v-act/schema-types'
import { RuleEngine as ruleEngine } from '@v-act/vjs.framework.extension.platform.engine.rule'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { EventManager as eventManager } from '@v-act/vjs.framework.extension.platform.services.view.event'
import { EventManager as commonEventManager } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.event.binding'
import { ContextProvider, createContext } from '@v-act/widget-context'

import { layoutControls } from './layout'
import { getInstCode } from './utils'

const _getRandomNum = function () {
  const random = Math.random() * 10000
  return parseInt(random + '')
}

const toJGCollapseSchema = function (controls: Control[]) {
  const collapseChildren: Control[] = []
  controls.forEach((con) => {
    const propties: JGCollapsePanelProperty = {
      code: getInstCode('JGCollapsePanel'),
      title: con.properties.groupTitle || ''
    }
    delete con.properties.groupTitle
    collapseChildren.push({
      type: 'JGCollapsePanel',
      properties: propties,
      controls: [con]
    })
  })
  const control: Control = {
    type: 'JGCollapse',
    properties: {
      code: getInstCode('JGCollapse'),
      dock: 'Top',
      multiWidth: 'space',
      multiHeight: 'content'
    },
    controls: collapseChildren
  }
  return control
}

/**
 * 窗体子控件靠上且有分组标题时，转换成折叠面板
 * @param win
 */
const convetToGroupedTopDock = function (win: Window) {
  const controls = win.controls
  const newControls: Control[] = []
  let temp: Control[] = []
  controls.forEach((control) => {
    const properties = control.properties
    const dock = properties.dock
    const groupTitle = properties.groupTitle
    if (dock === 'Top' && typeof groupTitle == 'string' && groupTitle !== '') {
      temp.push(control)
    } else {
      if (temp.length > 0) {
        newControls.push(toJGCollapseSchema(temp))
        temp = []
      }

      newControls.push(control)
    }
  })
  if (temp.length > 0) {
    newControls.push(toJGCollapseSchema(temp))
  }
  win.controls = newControls
}

/**
 * 处理窗体padding信息，如：原型工具中登录、首页模板需要去除窗体padding
 * @param win 窗体节点
 */
const enhanceWindowPadding = function (win: Window) {
  const controls = win.controls
  if (controls && controls.length > 0) {
    const control = controls[0]
    const widgetType = control.type
    if (widgetType === 'IPrototypeFrame' || widgetType === 'IPrototypeLogin') {
      win.properties.padding = '0px'
    }
  }
}

/**
 * 增强窗体配置，将控件事件属性值转换成Function
 * @param win 窗体节点
 */
const enhanceWindow = function (
  win: Window,
  context: { router: any; stackInfo: any },
  instanceId: string
) {
  const prototype = win.prototype
  const controlEventMap: { [controlCode: string]: Event[] } = {}
  if (prototype) {
    const router = context.router
    const { thisLevel } = context.stackInfo
    prototype.forEach((action) => {
      const controlCode = action.controlCode
      const controlEvents = controlEventMap[controlCode] || []
      const triggerEvent = action.triggerEvent
      const windowAction = action.windowAction
      controlEvents.push({
        code: triggerEvent,
        name: '',
        handler: () => {
          const containerType = windowAction.targetContainerType
          if (containerType == 'dialogWindow') {
            const targetWindow = windowAction.targetWindow
            const winInfo = targetWindow.split('.')
            router.push({
              pathname: `/${winInfo[0]}/${winInfo[1]}`,
              query: {
                modal: thisLevel + 1,
                title: windowAction.targetWindowTitle,
                v: _getRandomNum()
              }
            })
          } else if (containerType == 'currentWindow') {
            const targetWindow = windowAction.targetWindow
            const winInfo = targetWindow.split('.')
            router.push({
              pathname: `/${winInfo[0]}/${winInfo[1]}`,
              query: {
                modal: thisLevel,
                title: windowAction.targetWindowTitle,
                v: _getRandomNum()
              }
            })
          }
          return action
        }
      })
      controlEventMap[controlCode] = controlEvents
    })
  }

  const controls = win.controls
  if (controls && controls.length > 0) {
    controls.forEach((control) => {
      _enhanceControl(control, controlEventMap, instanceId)
    })
  }
}

const _enhanceControlDock = function (control: Control) {
  const properties = control.properties
  const dock = properties.dock
  if (dock === 'Top' || dock === 'bottom') {
    properties.multiWidth = 'space'
  } else if (dock === 'Left' || dock === 'Right') {
    properties.multiHeight = 'space'
  } else if (dock === 'Fill') {
    properties.multiWidth = 'space'
    properties.multiHeight = 'space'
  }
}

const _enhanceControl = function (
  control: Control,
  controlEventMap: { [controlCode: string]: Event[] },
  instanceId: string
) {
  _enhanceControlDock(control)

  const properties = control.properties
  const controlCode = properties.code
  const events = controlEventMap[controlCode]
  if (events) {
    control.events = events
  } else {
    if (Array.isArray(control.event)) {
      control.event.forEach((item: any) => {
        scopeManager.openScope(instanceId)

        const controlEvents = []
        const triggerEvent = item.eventCode
        const evaluateRule = item.evaluateRule

        const $addEventHandler = eventManager.addEventHandler
        const $executeRouteRule = ruleEngine.executeRouteRule

        try {
          $addEventHandler(controlCode, triggerEvent, function () {
            $executeRouteRule({
              ruleSetCode: triggerEvent,
              ruleCode: evaluateRule,
              args: arguments,
              argMapping: {},
              argIndex: {}
            })
          })

          const handler = commonEventManager.fireEvent(
            controlCode,
            triggerEvent
          )
          controlEvents.push({
            code: triggerEvent,
            name: item.eventName,
            handler: handler
          })

          control.events = controlEvents
        } catch (error) {
          console.log(error)
        } finally {
          scopeManager.closeScope()
        }
      })
    }
  }

  const controls = control.controls
  if (controls && controls.length > 0) {
    controls.forEach((con) => {
      _enhanceControl(con, controlEventMap, instanceId)
    })
  }
}

const WIDGET_CODE_SUBFIX = '_$_Frame'
/**
 * 处理控件编号重复问题
 * @param windowSchema
 */
const _toDealWidgetCode = function (windowSchema: Window) {
  const actions = windowSchema.masterPage?.actions
  if (actions) {
    actions.forEach((action) => {
      action.controlCode += WIDGET_CODE_SUBFIX
    })
  }
  const dealControl = function (control: {
    properties?: { [props: string]: string }
    controls?: object[]
  }) {
    const properties = control.properties
    if (properties) {
      properties.Code += WIDGET_CODE_SUBFIX
    }
    const controls = control.controls
    if (controls) {
      controls.forEach((cn) => {
        dealControl(cn)
      })
    }
  }
  const controls = windowSchema.masterPage?.controls
  controls?.forEach((control) => {
    dealControl(control)
  })
}

type MasterPageControl = {
  Code?: string
  IsMore?: string
  LabelText?: string
  controls?: MasterPageControl[]
}

const toJGButtonGroupItemSchema = function (
  control: MasterPageControl
): Control {
  const result: Control = {
    type: 'JGButtonGroupItem',
    properties: {
      code: control.Code || '',
      isMore: control.IsMore ? 'True' : 'False',
      labelText: control.LabelText || ''
    },
    controls: []
  }
  const controlObjs = control.controls
  if (controlObjs) {
    const controls: Control[] = []
    controlObjs.forEach((cn) => {
      controls.push(toJGButtonGroupItemSchema(cn))
    })
    result.controls = controls
  }
  return result
}

const toJGButtonGroupSchema = function (windowSchema: Window) {
  const controls = windowSchema.masterPage?.controls
  const controlList =
    controls && controls.length > 0 ? controls[0].controls : null
  if (controlList && controlList.length > 0) {
    for (let i = 0; i < controlList.length; i++) {
      const control = controlList[i]
      if (control.type == 'JGButtonGroup') {
        const buttonItems: Control[] = []
        control.controls?.forEach((cn) => {
          buttonItems.push(toJGButtonGroupItemSchema(cn))
        })
        return {
          type: 'JGButtonGroup',
          properties: {
            btnGrpDataSourceType: 'Static',
            code: control.properties.Code,
            horizontalAlign: 'Right',
            multiHeight: '32px',
            multiWidth: ReactEnum.Content.toString()
          },
          controls: buttonItems
        }
      }
    }
  }
  return {
    type: 'JGButtonGroup',
    properties: {
      btnGrpDataSourceType: 'Static',
      code: 'Frame_Dock_Top_JGButtonGroup_' + _getRandomNum(),
      horizontalAlign: 'Right',
      multiHeight: '32px',
      multiWidth: ReactEnum.Content.toString()
    },
    controls: []
  }
}

const _toFrameDockTop = function (windowSchema: Window): Window {
  _toDealWidgetCode(windowSchema)
  const masterPage = windowSchema.masterPage
  let actions = windowSchema.prototype || []
  actions = actions.concat(masterPage?.actions || [])
  windowSchema.properties.dock = 'Fill'
  delete windowSchema.properties.width
  windowSchema.properties.multiWidth = ReactEnum.Space.toString()
  const groupPanelProps: JGGroupPanelProperty = {
    dock: 'Top',
    contentAlignment: 'Horizontal',
    multiHeight: '34px',
    multiWidth: ReactEnum.Space.toString(),
    code: 'Frame_Dock_Top_JGGroupPanel_' + _getRandomNum()
  }
  if (!(windowSchema.properties && windowSchema.properties.multiHeight)) {
    windowSchema.properties.multiHeight = ReactEnum.Space.toString()
  }
  return {
    type: 'JGComponent',
    properties: {
      multiWidth: ReactEnum.Space.toString(),
      multiHeight: ReactEnum.Space.toString(),
      code: 'Frame_Dock_Top_' + _getRandomNum()
    },
    controls: [
      {
        type: 'JGGroupPanel',
        properties: groupPanelProps,
        controls: [
          {
            type: 'JGLabel',
            properties: {
              dock: 'Top',
              multiHeight: ReactEnum.Space.toString(),
              multiWidth: '200px',
              labelText: '合同编号：HT-2020-03-11-001<br>当前状态：立项中',
              code: 'Frame_Dock_Top_JGLabel_' + _getRandomNum()
            },
            controls: []
          },
          toJGButtonGroupSchema(windowSchema)
        ]
      },
      windowSchema
    ],
    prototype: actions
  }
}

const _toFrameDockBottom = function (windowSchema: Window) {
  _toDealWidgetCode(windowSchema)
  const masterPage = windowSchema.masterPage
  let actions = windowSchema.prototype || []
  actions = actions.concat(masterPage?.actions || [])
  windowSchema.properties.dock = 'Fill'
  delete windowSchema.properties.width
  windowSchema.properties.multiWidth = ReactEnum.Space.toString()
  if (!(windowSchema.properties && windowSchema.properties.multiHeight)) {
    windowSchema.properties.multiHeight = ReactEnum.Space.toString()
  }
  const result = {
    type: 'JGComponent',
    properties: {
      multiWidth: windowSchema.properties.multiWidth,
      multiHeight: windowSchema.properties.multiHeight,
      code: 'Frame_Dock_Top_' + _getRandomNum()
    },
    controls: [
      windowSchema,
      {
        type: 'JGGroupPanel',
        properties: {
          dock: 'Top',
          contentAlignment: 'Horizontal',
          multiHeight: '34px',
          multiWidth: ReactEnum.Space.toString(),
          code: 'Frame_Dock_Top_JGGroupPanel_' + _getRandomNum()
        },
        controls: [toJGButtonGroupSchema(windowSchema)]
      }
    ],
    prototype: actions
  }
  return result
}
/**
 * 处理窗体框架母版信息
 * @param windowSchema 窗体schema数据
 */
const _dealWindowMasterPageInfo = function (windowSchema: Window) {
  if (windowSchema.masterPage) {
    const masterPageType = windowSchema.masterPage.properties.code
    if (masterPageType === 'Frame_Dock_Top') {
      //顶栏框架
      windowSchema = _toFrameDockTop(windowSchema)
    } else if (masterPageType === 'Frame_Dock_Bottom') {
      //底部框架
      windowSchema = _toFrameDockBottom(windowSchema)
    } else {
      throw Error('未识别框架母版，母版类型：' + masterPageType)
    }
  }
  return windowSchema
}

/**
 * 解析控件属性schema
 * @param propertys 控件属性信息
 * @returns
 */
const parseSchemaProperty = function (propertys: PropertysSchema): Property {
  const properties: Property = { code: '' }
  if (propertys && propertys.property) {
    let property = propertys.property
    property = Array.isArray(property) ? property : [property]
    property.forEach((property) => {
      let attr = property.$.code
      if (attr.length > 1) {
        attr = attr.substring(0, 2).toLowerCase() + attr.substring(2)
      } else {
        attr = attr.toLowerCase()
      }
      const attrVal = property._ || ''
      //@ts-ignore
      properties[attr] = attrVal
    })
  }
  if (!properties.code) {
    throw Error('控件未设置控件编号！')
  }
  return properties
}

/**
 * 解析控件数据绑定schema
 * @param dataBinding 数据绑定schema
 * @returns
 */
const parseSchemaDataBinding = function (
  dataBinding: DataBindingSchema
): DataBinding {
  let dataMemberObjs =
    dataBinding.dataMembers && dataBinding.dataMembers.dataMember
      ? dataBinding.dataMembers.dataMember
      : null
  const dataMembers: DataMember[] = []
  if (dataMemberObjs) {
    dataMemberObjs = Array.isArray(dataMemberObjs)
      ? dataMemberObjs
      : [dataMemberObjs]
    dataMemberObjs.forEach((dataMemberObj) => {
      dataMembers.push({
        name: dataMemberObj.$.name,
        code: dataMemberObj.$.code,
        value: dataMemberObj._
      })
    })
  }
  return {
    dataSource: dataBinding.dataSource ? dataBinding.dataSource : null,
    dataMembers: dataMembers
  }
}

/**
 * 解析控件schema
 * @param controlObj 控件schema
 * @returns
 */
const parseSchemaControl = function (controlObj: ControlSchema): Control {
  const controls: Control[] = []
  let controlObjs =
    controlObj.controls && controlObj.controls.control
      ? controlObj.controls.control
      : null
  if (controlObjs) {
    controlObjs = Array.isArray(controlObjs) ? controlObjs : [controlObjs]
    controlObjs.forEach((con) => {
      controls.push(parseSchemaControl(con))
    })
  }
  const headerControls: Control[] = []
  let headerControlObjs =
    controlObj.headerControls && controlObj.headerControls.control
      ? controlObj.headerControls.control
      : null
  if (headerControlObjs) {
    headerControlObjs = Array.isArray(headerControlObjs)
      ? headerControlObjs
      : [headerControlObjs]
    headerControlObjs.forEach((con) => {
      headerControls.push(parseSchemaControl(con))
    })
  }
  const dataBindings: DataBinding[] = []
  let dataBindingObjs =
    controlObj.dataBindings && controlObj.dataBindings.dataBinding
      ? controlObj.dataBindings.dataBinding
      : null
  if (dataBindingObjs) {
    dataBindingObjs = Array.isArray(dataBindingObjs)
      ? dataBindingObjs
      : [dataBindingObjs]
    dataBindingObjs.forEach((dataBindingObj) => {
      dataBindings.push(parseSchemaDataBinding(dataBindingObj))
    })
  }

  //获取事件
  let event: Array<any> = []
  let originalArray = controlObj?.events?.event
  if (!(originalArray && Array.isArray(originalArray))) {
    originalArray = [originalArray]
  }

  if (originalArray && Array.isArray(originalArray)) {
    originalArray.forEach((eventItem) => {
      if (eventItem?.evaluateRule && eventItem?.evaluateRule?.$?.code) {
        event.push({
          eventCode: eventItem.$.code,
          eventName: eventItem.$.name,
          evaluateRule: eventItem.evaluateRule.$.code
        })
      }
    })
  }
  return {
    type: controlObj.$.type,
    properties: parseSchemaProperty(controlObj.propertys),
    headerControls,
    controls,
    dataBindings,
    event
  }
}

/**
 * 解析字段定义
 * @param field 字段定义
 * @returns
 */
const parseSchemaField = function (field: EntityFieldSchema): EntityField {
  let length = parseInt(field.$.length)
  return {
    code: field.$.code,
    name: field.$.name,
    chineseName: field.$.chineseName,
    type: field.$.type,
    length: isNaN(length) ? 0 : length,
    precision: field.$.precision,
    defaultValue: field.$.defaultValue
  }
}

/**
 * 解析实体记录
 * @param entityDefRow 实体记录
 * @returns
 */
const parseSchemaRow = function (entityDefRow: EntityDefRowSchema) {
  let entityFieldDefVal = entityDefRow.entityFieldDefVal
  const value: { [pro: string]: string } = {}
  if (entityFieldDefVal) {
    entityFieldDefVal = Array.isArray(entityFieldDefVal)
      ? entityFieldDefVal
      : [entityFieldDefVal]
    entityFieldDefVal.forEach((defVal) => {
      value[defVal.$.fieldCode] = defVal._
    })
  }
  return value
}

/**
 * 解析实体schema
 * @param entity 实体schema
 * @returns
 */
const parseSchemaEntity = function (entity: EntitySchema): Entity {
  const fileds: EntityField[] = []
  if (entity.entityFields && entity.entityFields.entityField) {
    let entitiesFields = entity.entityFields.entityField
    entitiesFields = Array.isArray(entitiesFields)
      ? entitiesFields
      : [entitiesFields]
    entitiesFields.forEach((field) => {
      fileds.push(parseSchemaField(field))
    })
  }
  const rows: EntityRecord[] = []
  if (entity.entityDefRows && entity.entityDefRows.entityDefRow) {
    let entitiesDefRows = entity.entityDefRows.entityDefRow
    entitiesDefRows = Array.isArray(entitiesDefRows)
      ? entitiesDefRows
      : [entitiesDefRows]
    entitiesDefRows.forEach((row) => {
      rows.push(parseSchemaRow(row))
    })
  }
  return {
    code: entity.$.code,
    name: entity.$.name,
    chineseName: entity.$.chineseName,
    fields: fileds,
    rows: rows
  }
}

/**
 * 解析窗体动作
 * @param windowAction 窗体动作
 * @returns
 */
const parseSchemaWindowAction = function (
  windowAction: WindowActionSchema
): WindowAction {
  return {
    targetWindow: windowAction.$.targetWindow,
    targetWindowTitle: windowAction.$.targetWindowTitle,
    targetContainerType: windowAction.$.targetContainerType,
    targetSourceType: windowAction.$.targetSourceType,
    widthExp: windowAction.$.widthExp,
    heightExp: windowAction.$.heightExp
  }
}

/**
 * 解析动作定义
 * @param actionObj 动作定义
 * @returns
 */
const parseSchemaAction = function (actionObj: ActionSchema): Action {
  return {
    controlCode: actionObj.$.controlCode,
    triggerEvent: actionObj.$.triggerEvent,
    windowAction: parseSchemaWindowAction(actionObj.windowAction)
  }
}

/**
 * 解析动作定义
 * @param actions 动作定义
 * @returns
 */
const parseSchemaActions = function (actions: ActionSchema[]): Action[] {
  const result: Action[] = []
  actions.forEach((actionObj) => {
    result.push(parseSchemaAction(actionObj))
  })
  return result
}

/**
 * 解析母版属性
 * @param masterPage 母版
 * @returns
 */
const parseSchemaMasterPageProperties = function (
  masterPage: MasterPageSchema
): Property {
  const properties: { [proName: string]: string } = {}
  if (masterPage.propertys && masterPage.propertys.property) {
    let propertys = masterPage.propertys.property
    propertys = Array.isArray(propertys) ? propertys : [propertys]
    propertys.forEach((property) => {
      properties[property.$.name] = property._
    })
  }
  //@ts-ignore
  return properties
}

/**
 * 解析母版控件
 * @param widgetType 控件类型
 * @param widget 控件定义
 * @returns
 */
const parseSchemaMasterPageControl = function (
  widgetType: string,
  widget: MasterPageControlSchema
): MasterPageControl1 {
  const properties = widget.$
  const controls: MasterPageControl[] = []
  for (const wdType in widget) {
    if (wdType !== '$' && Object.hasOwnProperty.call(widget, wdType)) {
      const wd = widget[wdType]
      controls.push(parseSchemaMasterPageControl(wdType, wd))
    }
  }
  return {
    type: widgetType,
    //@ts-ignore
    properties,
    //@ts-ignore
    controls
  }
}

/**
 * 解析母版信息
 * @param masterPage
 * @returns
 */
const parseSchemaMasterPage = function (
  masterPage: MasterPageSchema
): MasterPage {
  let properties = {
    code: masterPage.$.code
  }
  properties = parseSchemaMasterPageProperties(masterPage)
  properties.code = masterPage.$.code
  const result: MasterPage = {
    properties: properties,
    actions: [],
    controls: []
  }
  if (masterPage.actions && masterPage.actions.action) {
    let actions = masterPage.actions.action
    actions = Array.isArray(actions) ? actions : [actions]
    result.actions = parseSchemaActions(actions)
  }
  if (masterPage.controls) {
    const controls = []
    for (const widgetType in masterPage.controls) {
      if (Object.hasOwnProperty.call(masterPage.controls, widgetType)) {
        const widget = masterPage.controls[widgetType]
        controls.push(parseSchemaMasterPageControl(widgetType, widget))
      }
    }
    result.controls = controls
  }
  return result
}

/**
 * 转换窗体schema
 * @param windowSchema 窗体schema
 * @returns
 */
const convertWindowSchema = function (windowSchema: WindowSchema): Window {
  const properties = parseSchemaProperty(windowSchema.propertys)
  const controls: Control[] = []
  if (windowSchema.controls && windowSchema.controls.control) {
    let control = windowSchema.controls.control
    control = Array.isArray(control) ? control : [control]
    control.forEach((con) => {
      controls.push(parseSchemaControl(con))
    })
  }
  const entities: Entity[] = []
  if (windowSchema.entitys && windowSchema.entitys.entity) {
    let entity = windowSchema.entitys.entity
    entity = Array.isArray(entity) ? entity : [entity]
    entity.forEach((en) => {
      entities.push(parseSchemaEntity(en))
    })
  }
  let prototype: Action[] = []
  if (
    windowSchema.prototype &&
    windowSchema.prototype.actions &&
    windowSchema.prototype.actions.action
  ) {
    let actionObjs = windowSchema.prototype.actions.action
    actionObjs = Array.isArray(actionObjs) ? actionObjs : [actionObjs]
    let actions = parseSchemaActions(actionObjs)
    prototype = prototype.concat(actions)
  }

  //获取事件
  let event: Array<any> = []
  const originalArray = windowSchema?.events?.event
  if (originalArray && Array.isArray(originalArray)) {
    originalArray.forEach((eventItem) => {
      if (eventItem?.evaluateRule && eventItem?.evaluateRule?.$?.code) {
        event.push({
          eventCode: eventItem.$.code,
          eventName: eventItem.$.name,
          evaluateRule: eventItem.evaluateRule.$.code
        })
      }
    })
  }

  const windowJsonObj: Window = {
    type: 'JGComponent',
    properties,
    controls,
    entities,
    prototype,
    event
  }
  if (windowSchema.masterPage) {
    const masterPage = parseSchemaMasterPage(windowSchema.masterPage)
    windowJsonObj.masterPage = masterPage
  }
  return windowJsonObj
}

/**
 * 从窗体schema数据转换成React脚本
 * @param componentCode 构件编号
 * @param windowSchema 窗体schema数据
 * @param widgetDefines 控件定义
 * @param widgetConverts 控件缓存函数
 * @param context 转换上下文
 * @returns
 */
const parseWindowSchema = function (params: {
  instanceId: string
  componentCode: string
  windowSchema: WindowSchema
  widgetDefines: WidgetDefines
  context: WidgetConvertContext
}): JSX.Element | null {
  try {
    const instanceId = params.instanceId
    const componentCode = params.componentCode
    const windowSchema = params.windowSchema
    const widgetDefines = params.widgetDefines
    const context = params.context
    let windowDefine = convertWindowSchema(windowSchema)
    const renderChildrenFunc = (
      controls: Array<Control>,
      contianerReact: ControlReact
    ) => {
      controls = layoutControls(controls, contianerReact, widgetDefines)
      if (controls && controls.length > 0) {
        return (
          <Fragment>
            {controls.map((control) => {
              return (
                <Fragment key={control.properties.code}>
                  {widgetDefines[control.type]
                    ? createElement(widgetDefines[control.type], {
                        control,
                        render: renderChildrenFunc,
                        componentCode,
                        context
                      })
                    : null}
                </Fragment>
              )
            })}
          </Fragment>
        )
      }
      return null
    }
    windowDefine = _dealWindowMasterPageInfo(windowDefine)
    convetToGroupedTopDock(windowDefine)
    //处理窗体schema，将控件事件值转换成Function
    enhanceWindow(windowDefine, context, instanceId)
    enhanceWindowPadding(windowDefine)
    const widgetType = windowDefine.type
    const define = widgetDefines[widgetType]
    if (define) {
      const widgetContext = createContext({
        instanceId,
        position: 'relative',
        componentCode: componentCode
      })
      return (
        <ContextProvider context={widgetContext}>
          {createElement(define, {
            control: windowDefine,
            render: renderChildrenFunc,
            componentCode,
            context
          })}
        </ContextProvider>
      )
    } else {
      return null
    }
  } catch (err) {
    console.error(err)
    return null
  }
}

export { parseWindowSchema }
