import React, { CSSProperties, forwardRef, useRef, useState } from 'react'

import { Property } from 'csstype'
import moment from 'moment'

import InputUnstyled, { InputUnstyledProps } from '@mui/base/InputUnstyled'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import EventIcon from '@mui/icons-material/Event'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import YearPicker from '@mui/lab/YearPicker'
import { Button, IconButton } from '@mui/material'
import Menu from '@mui/material/Menu'
import { styled } from '@mui/system'
import { JGInputLabel } from '@v-act/jginputlabel'
import { Height, Width } from '@v-act/schema-types'
import { FieldValue, useContext } from '@v-act/widget-context'
import {
  getFieldValue,
  isNullOrUnDef,
  toHeight,
  toLabelWidth,
  toWidth
} from '@v-act/widget-utils'

interface JGPeriodProps extends InputUnstyledProps {
  /**
   * 左边距
   */
  left?: Property.Left
  /**
   * 上边距
   */
  top?: Property.Top
  /**
   * 高度
   */
  multiHeight?: Height
  /**
   * 宽度
   */
  multiWidth?: Width
  /**
   * 标题
   */
  labelText?: string
  /**
   * 标题宽度
   */
  labelWidth?: number
  /**
   * 提醒文字
   */
  placeholder?: string
  /**
   * 必填
   */
  isMust?: boolean
  /**
   * 显示
   */
  visible?: boolean

  /**
   * 显示标题
   */
  labelVisible?: boolean

  /**
   * 显示宽度
   */
  width?: Property.Width

  /**
   * 显示高度
   */
  height?: Property.Height

  /**
   * 输入框显示类型
   */
  inputType?: string
  /**
   * 禁用
   */
  disabled?: boolean
  /**
   * 实体编号
   */
  tableName?: string | null
  /**
   * 字段编号
   */
  columnName?: string | null
}

const StyledInputElement = styled('input')`
  border: 1px solid #dcdee2;
  color: #333;
  border-radius: 4px;
  padding: 0 4px;
  width: 100%;
  outline: none;
  height: 100%;
  &:hover {
    border-color: #356abb;
  }

  &:focus {
    border-color: #356abb;
    background: #fff;
    box-shadow: 0 0 0 2px rgba(53, 106, 187, 0.3);
  }
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
  }
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  [disabled] {
    background: #f6f7fb;
  }
`

const CustomInput = forwardRef(function (
  props: JGPeriodProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  return (
    <InputUnstyled
      components={{ Input: StyledInputElement }}
      {...props}
      ref={ref}
    />
  )
})

let minDate = new Date('2020-01-01T00:00:00.000')
let maxDate = new Date('2034-01-01T00:00:00.000')
let minDateName = moment(minDate).format('YYYY')
let maxDateName = moment(maxDate).format('YYYY')
const JGPeriod = function (props: JGPeriodProps) {
  if (!props.visible) {
    return null
  }
  const context = useContext()
  let value: FieldValue = ''
  if (props.tableName && props.columnName) {
    value = getFieldValue(props.tableName, props.columnName, context)
    value = isNullOrUnDef(value) ? '' : value
  }
  console.log(value)
  const [inputVal, setInputVal] = useState<any>('')
  const [inputDateVal, setInputDateVal] = useState<Date | null>(new Date())
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const menuWrapScope = useRef(null)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    console.log(menuWrapScope.current, menuWrapScope)
    setAnchorEl(menuWrapScope.current)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleConfirmDate = () => {
    setInputVal(moment(inputDateVal).format('YYYY') + '年')
  }

  const handleSelectedCurrent = () => {
    setInputVal(moment().format('YYYY') + '年')
    setInputDateVal(new Date())
  }

  const width = toWidth(props.multiWidth, context, '235px')
  const height = toHeight(props.multiHeight, context, '26px')
  const labelWidth = props.labelVisible
    ? toLabelWidth(props.labelWidth, context, 94)
    : 0
  const wrapStyles: CSSProperties = {
    width: width,
    height: height,
    fontSize: '14px',
    display: 'flex',
    position: context.position,
    left: props.left,
    top: props.top,
    fontFamily:
      'Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,\\5FAE\\8F6F\\96C5\\9ED1,Arial,sans-serif'
  }
  let inputWidth = String(width)

  if (inputWidth.indexOf('px') !== -1) inputWidth = inputWidth.replace(/px/, '')
  const inputStyles = {
    width: '100%',
    height: height,
    display: 'inline-block'
  }
  const yearPickerWrap: CSSProperties = {
    width: '350px',
    fontSize: '14px'
  }
  const calendarBoxStyles: CSSProperties = {
    display: 'inline-block',
    width: '100%',
    position: 'relative'
  }
  const calendarIconStyles: CSSProperties = {
    position: 'absolute',
    right: '-3px',
    top: '50%',
    transform: 'translateY(-50%)'
  }
  const calendarOperateWrapStyles: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-around'
  }
  const calendarOperateIconStyles: CSSProperties = {
    padding: '2px 14px',
    borderRadius: '25px',
    backgroundColor: '#1976d2',
    color: '#fff',
    cursor: 'pointer'
  }

  const datePickerHeaderWrapStyle: CSSProperties = {
    display: 'flex',
    margin: '8px 6px 8px 13px',
    alignItems: 'center'
  }

  const datePickerHeaderTextStyle: CSSProperties = {
    flex: 1,
    textAlign: 'center',
    fontSize: '16px',
    cursor: 'pointer'
  }
  return (
    <div style={wrapStyles}>
      <JGInputLabel
        width={labelWidth}
        height={height}
        visible={props.labelVisible}
        required={props.isMust}
      >
        {props.labelText}
      </JGInputLabel>
      <div
        style={calendarBoxStyles}
        id="menuWrapScope"
        aria-controls="menuScope"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        ref={menuWrapScope}
      >
        <CustomInput
          style={inputStyles}
          placeholder={props.placeholder}
          type={'text'}
          onChange={(e) => setInputVal(e.target.value)}
          value={inputVal}
          disabled={props.disabled}
        />
        <IconButton
          aria-label="日期按钮"
          component="span"
          style={calendarIconStyles}
          onClick={handleClick}
        >
          <EventIcon fontSize="small" />
        </IconButton>
      </div>
      <Menu
        style={yearPickerWrap}
        onClose={handleClose}
        open={open}
        anchorEl={anchorEl}
        id="menuScope"
        sx={{
          '& .css-1poimk-MuiPaper-root-MuiMenu-paper-MuiPaper-root-MuiPopover-paper':
            {
              width: '225px'
            },
          '& .MuiYearPicker-root button': {
            height: '30px'
          }
        }}
      >
        <div style={datePickerHeaderWrapStyle}>
          <IconButton aria-label="日期后退按钮" component="span">
            <ArrowBackIosIcon
              sx={{
                fontSize: '16px',
                color: '#8C8C8C'
              }}
            />
          </IconButton>
          <div style={datePickerHeaderTextStyle}>
            {minDateName}年 - {maxDateName}年
          </div>
          <IconButton aria-label="日期前进按钮" component="span">
            <ArrowForwardIosIcon
              sx={{
                fontSize: '16px',
                color: '#8C8C8C'
              }}
            />
          </IconButton>
        </div>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <YearPicker
            date={inputDateVal}
            isDateDisabled={() => false}
            minDate={minDate}
            maxDate={maxDate}
            onChange={(newDate) => setInputDateVal(newDate)}
          />
        </LocalizationProvider>
        <div style={calendarOperateWrapStyles}>
          <Button variant="contained" onClick={handleSelectedCurrent}>
            本年
          </Button>
          <Button variant="contained" onClick={handleConfirmDate}>
            确定
          </Button>
          <Button variant="contained" onClick={() => setInputVal('')}>
            清空
          </Button>
          {/* <span style={calendarOperateIconStyles}>本年</span>
          <span style={calendarOperateIconStyles}>确定</span>
          <span style={calendarOperateIconStyles}>清空</span> */}
        </div>
      </Menu>
    </div>
  )
}

JGPeriod.defaultProps = {
  left: '0px',
  top: '0px',
  multiHeight: '26px',
  multiWidth: '235px',
  labelWidth: 94,
  labelText: '期次',
  placeholder: '',
  isMust: false,
  visible: true,
  labelVisible: true,
  disabled: false
}

export default JGPeriod
export { JGPeriod }
export type { JGPeriodProps }
