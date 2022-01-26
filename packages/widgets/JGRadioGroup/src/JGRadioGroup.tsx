import React, { CSSProperties } from 'react'

import { Property } from 'csstype'

import Box, { BoxProps } from '@mui/material/Box'
import Radio from '@mui/material/Radio'
import { JGInputLabel } from '@v-act/jginputlabel'
import { FieldValue, useContext } from '@v-act/widget-context'
import {
  getFieldValue,
  toHeight,
  toLabelWidth,
  toWidth
} from '@v-act/widget-utils'

/* 包装器属性 */
interface JGRadioGroupProps extends BoxProps {
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
          selected: boolean
        }>
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

const JGRadioGroup = function (props: JGRadioGroupProps) {
  /* 如果单选框组不可见，直接返回null */
  if (!props.visible) {
    return null
  }

  console.log('JGRadioGroup')

  const context = useContext()
  const width = toWidth(props.multiWidth, context, '235px')
  const height = toHeight(props.multiHeight, context, '26px')

  /* 处理值，用于绑定到value属性上 */
  let value: FieldValue = ''
  if (props.tableName && props.idColumnName) {
    value = getFieldValue(props.tableName, props.idColumnName, context)
  }
  console.log(value)
  console.log(props.dropDownSource)

  const constData =
    props?.dropDownSource?.DataSourceSetting?.DataConfig?.ConstData || []

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
  const radioBoxStyles: CSSProperties = {
    height: height,
    margin: 0,
    border: '1px solid #0000003b',
    borderRadius: '4px',
    display: 'inline-block',
    maxWidth: '100%',
    overflowY: 'auto',
    flex: 1
  }

  /* 单选框样式 */
  const radioStyles: CSSProperties = {
    height: '24px',
    width: '20px',
    margin: 0
  }

  /* 编码(唯一) */
  const code = props.code
    ? props.code
    : `${Date.now()}${Math.random().toString(32).slice(2)}`

  const [selectedValue, setSelectedValue] = React.useState(value)

  /* change事件 */
  const handleChange = (event: any) => {
    setSelectedValue(event.target.value)
  }

  const radioData = []
  for (let i = 0; i < 16; i++) {
    radioData.push({
      id: i + 1,
      name: `苹果${i + 1}`
    })
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
        style={radioBoxStyles}
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
          /* '&::-webkit-scrollbar-track': {
            boxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0.2)',
            backgroundColor: 'red',
            borderRadius: '10px'
          } */
        }}
      >
        {constData.map((item) => {
          return (
            <div style={{ display: 'inline-block' }}>
              <Radio
                key={item.id}
                checked={selectedValue === item.id.toString()}
                onChange={props.readOnly ? () => {} : handleChange}
                value={item.id}
                name="radio-buttons"
                disabled={!props.enabled}
                style={radioStyles}
                inputProps={{
                  readOnly: true
                }}
                size="small"
                sx={{
                  '& .MuiSvgIcon-root': {
                    fontSize: 16
                  }
                }}
              />
              <span
                style={{
                  paddingRight: '5px',
                  display: 'inline-block',
                  height: '24px',
                  float: 'right',
                  lineHeight: '24px',
                  color: !props.enabled ? '#C3C5C6' : '#333'
                }}
              >
                {item.text}
              </span>
            </div>
          )
        })}
      </Box>
    </Box>
  )
}
/* 单选框组默认属性 */
JGRadioGroup.defaultProps = {
  left: 0,
  top: 0,
  height: '26px',
  width: '235px',
  multiWidth: '235px',
  labelWidth: '94px',
  labelText: '单选组',
  visible: true,
  labelVisible: true,
  readonly: false,
  enabled: true
}

export default JGRadioGroup
export { JGRadioGroup, type JGRadioGroupProps }
