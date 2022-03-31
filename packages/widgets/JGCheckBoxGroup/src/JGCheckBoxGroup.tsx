import React, { CSSProperties } from 'react'

import { Property } from 'csstype'

import Box, { BoxProps } from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import { JGInputLabel } from '@v-act/jginputlabel'
import { useContext } from '@v-act/widget-context'
import {
  getEntityDatas,
  getFieldValue,
  setFieldValue,
  toHeight,
  toLabelWidth,
  toWidth
} from '@v-act/widget-utils'

/* 包装器属性 */
export interface JGCheckBoxGroupProps extends BoxProps {
  /********************** 其它 ************************/
  /**
   * 控件编码
   */
  code?: string

  /**
   * 标题
   */
  labelText?: string

  /********************** 格式 ************************/
  /**
   * 上边距
   */
  top?: Property.Top

  /**
   * 左边距
   */
  left?: Property.Left

  /**
   * 宽度
   */
  width?: Property.Width

  /**
   * 高度
   */
  height?: Property.Height

  /**
   * 宽度(优先)
   */
  multiWidth?: Property.Width

  /**
   * 高度(优先)
   */
  multiHeight?: Property.Height

  /**
   * 界面顺序号
   */
  tabIndex?: number

  /**
   * 显示格式
   */
  displayFormat?: number

  /**
   * 是否显示
   */
  visible?: boolean

  /**
   * 锚定
   */
  anchor?: boolean

  /**
   * 泊靠
   */
  dock?: boolean

  /**
   * 显示标题
   */
  labelVisible?: boolean

  /**
   * 标签宽度
   */
  labelWidth?: number

  /**
   * 标签字体
   */
  labelFontStyle?: string

  /**
   * 标签前景色
   */
  labelForeColor?: string

  /**
   * 标签背景色
   */
  labelBackColor?: string

  /**
   * 标签对齐方式
   */
  labelTextAlign?: string

  /**
   * 值字体
   */
  lalueFontStyle?: string

  /**
   * 值前景色
   */
  valueForeColor?: string

  /**
   * 值背景色
   */
  valueBackColor?: string

  /**
   * 排列方向
   */
  flowDirection?: string

  /**
   * 边框
   */
  borderStyles?: string

  /**
   * 布局位置
   */
  position?: any

  /********************** 事件 ************************/
  /**
   * 值改变事件
   */
  onValueChanged?: string

  /**
   * 值加载事件
   */
  onValueLoaded?: string

  /**
   * 单击标题
   */
  onLabelClick?: string

  /********************** 数据 ************************/
  /**
   * 实体
   */
  tableName?: string | null

  /**
   * 标识字段
   */
  idColumnName?: string | null

  /**
   * 显示字段
   */
  columnName?: string | null

  /**
   * 只读
   */
  readOnly?: boolean

  /**
   * 数据来源
   */
  dropDownSource?: {
    DataSourceSetting: {
      DataConfig: {
        ConstData: Array<{
          id: string
          text: string
          selected?: boolean
        }>
        SourceID: string
        SourceName: string
        SourceType: string
        SaveColumn: string
        ShowColumn: string
      }
    }
  }

  /**
   * 浮动提示
   */
  toolTip?: string

  /**
   * 必填
   */
  isMust?: boolean

  /**
   * 使能
   */
  enabled?: boolean

  /**
   * 值
   */
  value?: string

  /**
   * 显示值
   */
  text?: string

  /********************** 表单布局 ************************/
  /**
   * 跨列
   */
  colSpan?: string

  /**
   * 起始行
   */
  startRow?: string

  /**
   * 结束行
   */
  endRow?: string
}

const JGCheckBoxGroup = function (props: JGCheckBoxGroupProps) {
  /* 如果复选框组不可见，直接返回null */
  if (!props.visible) {
    return null
  }

  console.log('JGCheckBoxGroup')
  const context = useContext()
  const width = toWidth(props.multiWidth, context, '235px')
  const height = toHeight(props.multiHeight, context, '26px')

  /* 处理值，用于绑定到value属性上 */
  let value: string = ''
  if (props.tableName && props.idColumnName) {
    value =
      (getFieldValue(props.tableName, props.idColumnName, context) as string) ||
      ''
  }

  const constData =
    props?.dropDownSource?.DataSourceSetting?.DataConfig?.ConstData || []

  const {
    SourceID: sourceID,
    SourceName: sourceName,
    SourceType: sourceType,
    SaveColumn: saveColumn,
    ShowColumn: showColumn
  } = props?.dropDownSource?.DataSourceSetting?.DataConfig || {
    SourceID: '',
    SourceName: '',
    SourceType: '',
    SaveColumn: '',
    ShowColumn: ''
  }
  const entries = getEntityDatas(sourceID, context) || []
  entries.forEach(function (item) {
    constData.push({
      id: item[saveColumn] as string,
      text: item[showColumn] as string,
      selected: false
    })
  })

  /* 包装器样式 */
  const wrapStyles: CSSProperties = {
    width: width,
    height: height,
    fontSize: '14px',
    position: context.position,
    left: props.left,
    top: props.top,
    display: 'inline-flex',
    fontFamily:
      'Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,\\5FAE\\8F6F\\96C5\\9ED1,Arial,sans-serif'
  }

  /* 标签宽度 */
  const labelWidth = props.labelVisible
    ? toLabelWidth(props.labelWidth, context, 94)
    : 0

  /* 单选框组样式 */
  const checkboxStyles: CSSProperties = {
    height: height,
    margin: 0,
    border: '1px solid #0000003b',
    borderRadius: '4px',
    overflowY: 'auto',
    flex: 1
  }

  /* 编码(唯一) */
  const code = props.code
    ? props.code
    : `${Date.now()}${Math.random().toString(32).slice(2)}`

  /* 测试数据 */
  /* const radioData = [
    {
      id: 1,
      name: '苹果'
    },
    {
      id: 2,
      name: '雪梨'
    },
    {
      id: 3,
      name: '香蕉'
    },
    {
      id: 4,
      name: '芒果'
    }
  ] */
  const radioData = []
  for (let i = 0; i < 16; i++) {
    radioData.push({
      id: i + 1,
      name: `苹果${i + 1}`
    })
  }

  constData.forEach((item) => {
    item.selected =
      item.selected && item.selected.toString().toLocaleLowerCase() === 'true'
        ? true
        : false

    //如果有当前选项，所有待选项默认值都改成false
    value.length > 0 && (item.selected = false)
    value.indexOf(item.id) > -1 && (item.selected = true)
  })

  const [checkboxData, setCheckboxData] = React.useState(constData)

  const records: Array<{
    id: string
    text: string
    selected?: boolean
  }> = []
  constData.forEach((constDataItem) => {
    const record = checkboxData.find((checkboxDataItem) => {
      if (constDataItem.id === checkboxDataItem.id) {
        Object.assign(checkboxDataItem, constDataItem)
      }
      return constDataItem.id === checkboxDataItem.id
    })
    if (!record) {
      records.push(constDataItem)
    }
  })
  checkboxData.splice(checkboxData.length, 0, ...records)

  const handleChange = (event: any, item: any) => {
    const newCheckboxData = checkboxData.map((item) => {
      item.id === event.target.id && (item.selected = event.target.checked)
      return item
    })
    setCheckboxData(newCheckboxData)
    setFieldValue(
      props.tableName as string,
      props.columnName as string,
      context,
      item.text
    )
    setFieldValue(
      props.tableName as string,
      props.idColumnName as string,
      context,
      item.id
    )
  }

  return (
    <Box style={wrapStyles}>
      <JGInputLabel
        width={labelWidth}
        height={height}
        visible={props.labelVisible}
        required={props.isMust}
      >
        {props.labelText}
      </JGInputLabel>
      <Box
        style={checkboxStyles}
        sx={{
          '&::-webkit-scrollbar': {
            height: '10px',
            width: '10px'
          },
          '&::-webkit-scrollbar-thumb': {
            borderRadius: '10px',
            backgroundColor: '#ddd',
            backgroundImage:
              '-webkit-linear-gradient(45deg,rgba(255, 255, 255, 0.2) 25%,transparent 25%,transparent 50%,rgba(255, 255, 255, 0.2) 50%,rgba(255, 255, 255, 0.2) 75%,transparent 75%,transparent)'
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#999'
          }
          /*  '&:hover': {
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'red'
            }
          } */
          /* '&::-webkit-scrollbar-track': {
        boxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0.2)',
        backgroundColor: 'red',
        borderRadius: '10px'
      } */
        }}
      >
        {checkboxData.map((item) => {
          return (
            <Box
              key={item.id}
              style={{
                paddingRight: '6px',
                height: '24px',
                display: 'inline-flex',
                pointerEvents: props.readOnly ? 'none' : 'auto'
              }}
            >
              <Checkbox
                id={item.id}
                defaultChecked={item.selected}
                //checked={item.selected}
                onChange={
                  props.readOnly
                    ? () => {}
                    : (e) => {
                        handleChange(e, item)
                      }
                }
                disabled={!props.enabled}
                readOnly={props.readOnly}
                inputProps={{
                  readOnly: false
                }}
                size="small"
                sx={{
                  'width': '16px',
                  'height': '24px',
                  '& .MuiSvgIcon-root': { fontSize: 16 }
                }}
              />
              <span
                style={{
                  lineHeight: '25px'
                }}
              >
                {item.text}
              </span>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}

JGCheckBoxGroup.defaultProps = {
  left: 0,
  top: 0,
  height: '26px',
  width: '235px',
  labelWidth: '94px',
  labelText: '多选组',
  placeholder: '',
  visible: true,
  labelVisible: true,
  enabled: true,
  readOnly: false
}

export default JGCheckBoxGroup
export { JGCheckBoxGroup }
