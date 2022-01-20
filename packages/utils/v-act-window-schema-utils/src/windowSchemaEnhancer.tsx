import { Fragment } from 'react'

import {
  Control,
  ControlReact,
  Event,
  JGCollapsePanelProperty,
  ReactEnum,
  WidgetConvertContext,
  WidgetConverts,
  WidgetDefines,
  Window
} from '@v-act/schema-types'
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
  context: { router: any; stackInfo: any }
) {
  const prototype = win.prototype
  if (prototype) {
    const controlEventMap: { [controlCode: string]: Event[] } = {}
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
    const controls = win.controls
    if (controls && controls.length > 0) {
      controls.forEach((control) => {
        _enhanceControl(control, controlEventMap)
      })
    }
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
  controlEventMap: { [controlCode: string]: Event[] }
) {
  _enhanceControlDock(control)
  const properties = control.properties
  const controlCode = properties.code
  const events = controlEventMap[controlCode]
  if (events) {
    control.events = events
  }
  const controls = control.controls
  if (controls && controls.length > 0) {
    controls.forEach((con) => {
      _enhanceControl(con, controlEventMap)
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

const _toFrameDockTop = function (windowSchema: Window) {
  _toDealWidgetCode(windowSchema)
  const masterPage = windowSchema.masterPage
  let actions = windowSchema.prototype || []
  actions = actions.concat(masterPage?.actions || [])
  windowSchema.properties.dock = 'Fill'
  delete windowSchema.properties.width
  windowSchema.properties.multiWidth = ReactEnum.Space.toString()
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
        properties: {
          dock: 'Top',
          contentAlignment: 'Horizontal',
          multiHeight: '34px',
          multiWidth: ReactEnum.Space.toString(),
          code: 'Frame_Dock_Top_JGGroupPanel_' + _getRandomNum()
        },
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
 * 从窗体schema数据转换成React脚本
 * @param componentCode 构件编号
 * @param windowSchema 窗体schema数据
 * @param widgetDefines 控件定义
 * @param widgetConverts 控件缓存函数
 * @param context 转换上下文
 * @returns
 */
const convertWindowSchema = function (
  componentCode: string,
  windowSchema: Window,
  widgetDefines: WidgetDefines,
  widgetConverts: WidgetConverts,
  context: WidgetConvertContext
): JSX.Element | null {
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
                {widgetConverts[control.type]
                  ? widgetConverts[control.type](
                      control,
                      renderChildrenFunc,
                      componentCode,
                      context
                    )
                  : null}
              </Fragment>
            )
          })}
        </Fragment>
      )
    }
    return null
  }
  windowSchema = _dealWindowMasterPageInfo(windowSchema)
  convetToGroupedTopDock(windowSchema)
  //处理窗体schema，将控件事件值转换成Function
  enhanceWindow(windowSchema, context)
  enhanceWindowPadding(windowSchema)
  const widgetType = windowSchema.type
  const convert = widgetConverts[widgetType]
  if (convert) {
    const widgetContext = createContext({
      position: 'relative',
      componentCode: componentCode
    })
    return (
      <ContextProvider context={widgetContext}>
        {convert(windowSchema, renderChildrenFunc, componentCode, context)}
      </ContextProvider>
    )
  } else {
    return null
  }
}

export { convertWindowSchema }
