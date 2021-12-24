import React, { CSSProperties, forwardRef } from 'react'

import { Property } from 'csstype'

import { Box, BoxProps, MenuItem, Select, SelectProps } from '@mui/material'
import { JGInputLabel } from '@v-act/jginputlabel'
import { useContext } from '@v-act/widget-context'
import { toHeight, toLabelWidth, toWidth } from '@v-act/widget-utils'

/* 自定义下拉框 */
const CustomSelect = forwardRef(function (
  props: SelectProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  return <Select {...props} ref={ref}></Select>
})

/* 包装器属性 */
interface JGComboBoxProps extends BoxProps {
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
  tableName?: string

  /**
   * 标识字段
   */
  idColumnName?: string

  /**
   * 显示字段
   */
  columnName?: string

  /**
   * 只读
   */
  readOnly?: boolean

  /**
   * 数据来源
   */
  dropDownSource?: string

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
   * 用enabled还是disabled？？？？？
   */
  disabled?: boolean

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

const JGComboBox = function (props: JGComboBoxProps) {
  /* 如果下拉框不可见，直接返回null */
  if (!props.visible) {
    return null
  }

  const context = useContext()
  const width = toWidth(props.multiWidth, context, '235px')
  const height = toHeight(props.multiHeight, context, '26px')

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

  /* 标签样式 */
  const labelStyles: CSSProperties = {
    width: labelWidth,
    height: height,
    lineHeight: height,
    textAlign: 'right',
    paddingRight: '6px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontSize: '14px',
    color: '#333'
  }

  /* 下拉框样式 */
  const selectStyles: CSSProperties = {
    flex: 1,
    height: height,
    margin: 0,
    fontSize: '14px',
    padding: 0
  }

  /* 编码(唯一) */
  const code = props.code
    ? props.code
    : `${Date.now()}${Math.random().toString(32).slice(2)}`

  const [value, setValue] = React.useState(2)

  const handleChange = (event: any) => {
    setValue(event.target.value)
  }

  /* 测试数据 */
  const radioData = [
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
  ]

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
      <CustomSelect
        style={selectStyles}
        labelId={code}
        id={`${code}select`}
        value={value}
        defaultValue={value}
        onChange={handleChange}
      >
        {radioData.map((item) => {
          return <MenuItem value={item.id}>{item.name}</MenuItem>
        })}
      </CustomSelect>
    </Box>
  )
}

/* 下拉框默认属性 */
JGComboBox.defaultProps = {
  left: 0,
  top: 0,
  height: '26px',
  width: '235px',
  multiHeight: '26px',
  multiWidth: '235px',
  labelWidth: '94px',
  labelText: '下拉选择',
  placeholder: '',
  visible: true,
  labelVisible: true,
  disabled: false
}

export default JGComboBox
export { JGComboBox, type JGComboBoxProps }
