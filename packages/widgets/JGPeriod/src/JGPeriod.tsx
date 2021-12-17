import React, { CSSProperties, forwardRef, useRef, useState } from 'react'

import { Property } from 'csstype'

import InputUnstyled, { InputUnstyledProps } from '@mui/base/InputUnstyled'
import EventIcon from '@mui/icons-material/Event'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import YearPicker from '@mui/lab/YearPicker'
import { IconButton } from '@mui/material'
import Menu from '@mui/material/Menu'
import { styled } from '@mui/system'
import { Height, Width } from '@v-act/schema-types'

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

const minDate = new Date('2020-01-01T00:00:00.000')
const maxDate = new Date('2034-01-01T00:00:00.000')

const JGPeriod = function (props: JGPeriodProps) {
  if (!props.visible) {
    return null
  }
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
  console.log(props.top)
  const wrapStyles: CSSProperties = {
    width: props.width || props.multiWidth,
    height: props.height || props.multiHeight,
    fontSize: '14px',
    position: 'absolute',
    left: props.left,
    top: props.top,
    fontFamily:
      'Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,\\5FAE\\8F6F\\96C5\\9ED1,Arial,sans-serif'
  }
  const labelWidth = props.labelVisible
    ? props.labelWidth === undefined
      ? 94
      : props.labelWidth
    : 0
  const labelStyles: CSSProperties = {
    width: labelWidth,
    height: props.height || props.multiHeight,
    textAlign: 'right',
    display: 'inline-block',
    paddingRight: '6px'
  }
  let inputWidth = String(props.width || props.multiWidth)

  if (inputWidth.indexOf('px') !== -1) inputWidth = inputWidth.replace(/px/, '')
  const inputStyles = {
    width: Number(inputWidth) - labelWidth,
    height: props.height || props.multiHeight,
    display: 'inline-block'
  }
  const yearPickerWrap: CSSProperties = {
    width: '350px',
    fontSize: '14px'
  }
  const calendarBoxStyles: CSSProperties = {
    display: 'inline-block',
    position: 'relative'
  }
  const calendarIconStyles: CSSProperties = {
    position: 'absolute',
    right: '-3px',
    top: '-4px'
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
  return (
    <div style={wrapStyles}>
      {labelWidth > 0 ? (
        <span style={labelStyles}>
          {props.labelText}
          {props.isMust ? <label style={{ color: 'red' }}>*</label> : ''}
        </span>
      ) : (
        ''
      )}
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
            }
        }}
      >
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
          <span style={calendarOperateIconStyles}>本年</span>
          <span style={calendarOperateIconStyles}>确定</span>
          <span style={calendarOperateIconStyles}>清空</span>
        </div>
      </Menu>
    </div>
  )
}

JGPeriod.defaultProps = {
  left: 0,
  top: 0,
  multiHeight: 26,
  multiWidth: 235,
  labelWidth: 94,
  labelText: '期次',
  placeholder: '',
  isMust: false,
  visible: true,
  labelVisible: true,
  inputType: 'number'
}

export default JGPeriod
export { JGPeriod, JGPeriodProps }
