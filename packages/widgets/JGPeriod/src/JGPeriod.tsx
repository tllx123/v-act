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
import { Box, Button, IconButton } from '@mui/material'
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

type enumLayoutData = {
  title: number
  enumArr: string[]
}
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
  periodType?: string
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

let minDate = new Date(moment().subtract(6, 'years').format('YYYY'))
let maxDate = new Date(moment().add(5, 'years').format('YYYY'))
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
  const [minDateVal, setMinDateVal] = useState<any>(minDate)
  const [maxDateVal, setMaxDateVal] = useState<any>(maxDate)
  const [minDateNameVal, setMinDateNameVal] = useState<any>(minDateName)
  const [maxDateNameVal, setMaxDateNameVal] = useState<any>(maxDateName)
  const [monthNameVal, setMonthNameVal] = useState<any>(moment().format('YYYY'))
  const [inputDateVal, setInputDateVal] = useState<Date | null>(new Date())
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const menuWrapScope = useRef(null)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(menuWrapScope.current)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const [anchorElForDateModal, setAnchorElForDateModal] =
    React.useState<null | HTMLElement>(null)
  const openForDateModal = Boolean(anchorElForDateModal)
  const menuWrapScopeForDateModal = useRef(null)
  const handleClickForDateModal = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElForDateModal(menuWrapScopeForDateModal.current)
  }
  const handleCloseForDateModal = () => {
    setAnchorElForDateModal(null)
  }

  const calcDateModalData = (currentDataNum: number) => {
    if (!isNaN(currentDataNum)) {
      let minNum = currentDataNum - 7
      let maxNum = currentDataNum + 7
      let calcArr = []
      while (minNum <= maxNum) {
        calcArr.push(minNum)
        minNum++
      }
      return calcArr
    }
  }

  const calcEnumLayoutData = (
    currentNum: number,
    enumArr: string[] | number[]
  ) => {
    if (!isNaN(currentNum)) {
      let minNum = currentNum - 2
      let maxNum = currentNum + 3
      let calcArr = []
      while (minNum <= maxNum) {
        calcArr.push({ title: minNum, enumArr: enumArr })
        minNum++
      }
      return calcArr
    }
  }

  const monthData = () => {
    let initMonth = 1
    let retMonth = []
    while (initMonth <= 12) {
      retMonth.push(initMonth)
      initMonth++
    }
    return {}
  }

  // console.log(dateMonth, props.periodType)
  const [dateModalSelectedVal, setDateModalSelectedVal] = useState(
    +moment().format('YYYY')
  )

  const [dateModalVal, setDateModalVal] = useState<any>(
    calcDateModalData(dateModalSelectedVal)
  )

  let dateEnumData: { [key: string]: any } = {
    years: {
      data: [],
      initActive: '',
      initYear: ''
    },
    halfyear: {
      data: calcEnumLayoutData(dateModalSelectedVal, ['上半年', '下半年']),
      initActive: moment().month() < 6 ? '上半年' : '下半年',
      initYear: +moment().format('YYYY')
    },
    quarter: {
      data: calcEnumLayoutData(dateModalSelectedVal, [1, 2, 3, 4]),
      initActive: moment().quarter(),
      initYear: +moment().format('YYYY')
    },
    month: {
      data: [],
      initActive: '',
      initYear: ''
    }
  }

  const [enumSelectedYearVal, setEnumSelectedYearVal] = useState<any>(
    props.periodType ? dateEnumData[props.periodType]?.initYear : void 0
  )
  const [enumSelectedVal, setEnumSelectedVal] = useState<any>(
    props.periodType ? dateEnumData[props.periodType]?.initActive : void 0
  )

  const [dateEnumVal, setDateEnumVal] = useState<any>(
    props.periodType ? dateEnumData[props.periodType]?.data : void 0
  )
  console.log(dateEnumVal)
  const handleConfirmDate = () => {
    handleClose()
  }

  const handleSelectedCurrent = () => {
    let currentYear = +moment().format('YYYY')
    switch (props.periodType) {
      case 'years':
        let min = new Date(moment().subtract(6, 'years').format('YYYY'))
        let max = new Date(moment().add(5, 'years').format('YYYY'))
        setMinDateVal(min)
        setMaxDateVal(max)
        setInputVal(moment().format('YYYY') + '年')
        setInputDateVal(new Date())
        handleClose()
        break
      case 'halfyear':
        let currentHalfYear = moment().month() < 6 ? '上半年' : '下半年'
        setInputVal(moment().format('YYYY') + currentHalfYear)
        setDateModalSelectedVal(currentYear)
        setDateModalVal(calcDateModalData(currentYear))
        setDateEnumVal(calcEnumLayoutData(currentYear, ['上半年', '下半年']))
        handleEnumClick(currentYear, currentHalfYear)
        handleClose()
        break
      case 'quarter':
        let currentQuarter = String(moment().quarter())
        setInputVal(`${moment().format('YYYY')}年0${currentQuarter}季`)
        setDateModalSelectedVal(currentYear)
        setDateModalVal(calcDateModalData(currentYear))
        setDateEnumVal(calcEnumLayoutData(currentYear, [1, 2, 3, 4]))
        handleEnumClick(currentYear, currentQuarter)
        handleClose()
        break
    }
  }

  const handleClearSelectDate = () => {
    setInputVal('')
    handleClose()
  }

  const handleBackDate = () => {
    let minDate = String(-minDateNameVal - 15)
    let maxDate = String(-minDateNameVal - 1)
    setMinDateVal(() => {
      return new Date(minDate)
    })
    setMaxDateVal(() => {
      return new Date(maxDate)
    })
    setMinDateNameVal(minDate)
    setMaxDateNameVal(maxDate)
  }
  const handleNextDate = () => {
    let minDate = String(-minDateNameVal + 1)
    let maxDate = String(-minDateNameVal + 15)
    setMinDateVal(() => {
      return new Date(minDate)
    })
    setMaxDateVal(() => {
      return new Date(maxDate)
    })
    setMinDateNameVal(minDate)
    setMaxDateNameVal(maxDate)
  }
  const handleClickDateModal = (val: number) => {
    let minDate = String(val - 6)
    let maxDate = String(val + 5)
    setDateModalVal(calcDateModalData(val))
    switch (props.periodType) {
      case 'years':
        setMinDateVal(() => {
          return new Date(minDate)
        })
        setMaxDateVal(() => {
          return new Date(maxDate)
        })
        setMinDateNameVal(minDate)
        setMaxDateNameVal(maxDate)
        break
      case 'halfyear':
        setDateEnumVal(calcEnumLayoutData(val, ['上半年', '下半年']))
        minDate = String(val - 2)
        maxDate = String(val + 3)
        setMinDateNameVal(minDate)
        setMaxDateNameVal(maxDate)
        break
      case 'quarter':
        minDate = String(val - 2)
        maxDate = String(val + 3)
        setDateEnumVal(calcEnumLayoutData(val, [1, 2, 3, 4]))
        setMinDateNameVal(minDate)
        setMaxDateNameVal(maxDate)
        break
    }

    setDateModalSelectedVal(val)
    handleCloseForDateModal()
  }

  const handleEnumClick = (yearNum: number, clickVal: string) => {
    let showVals: { [key: string]: any } = {
      halfyear: `${yearNum}${clickVal}`,
      quarter: `${yearNum}年0${clickVal}季`
    }
    setInputVal(props.periodType ? showVals[props.periodType] : void 0)
    setEnumSelectedYearVal(yearNum)
    setEnumSelectedVal(clickVal)
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
  const menuListItem: CSSProperties = {
    margin: '8px 0',
    cursor: 'pointer',
    padding: '2px 8px',
    borderRadius: '16px'
  }
  const menuListActiveItem: CSSProperties = {
    margin: '8px 0',
    cursor: 'pointer',
    padding: '2px 8px',
    borderRadius: '16px',
    color: '#fff',
    backgroundColor: '#1976d2'
  }
  const dateYearItemWrap = {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '8px',
    alignItems: 'center'
  }
  const dateYear = {
    color: '#597197',
    backgroundColor: 'rgb(242,244,250)',
    borderRadius: '0 19px 19px 0',
    padding: '4px'
  }
  const enumItemSx = {
    'padding': '4px 16px',
    'borderRadius': '4px',
    'cursor': 'pointer',
    '&:hover': {
      color: '#333',
      background: ' #ecf3fe'
    }
  }
  const activeHalfyear = {
    color: '#fff',
    backgroundColor: '#356abb'
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
              width: '249px'
            },
          '& .MuiYearPicker-root button': {
            height: '30px'
          }
        }}
      >
        <div style={datePickerHeaderWrapStyle}>
          <IconButton
            aria-label="日期后退按钮"
            component="span"
            onClick={handleBackDate}
          >
            <ArrowBackIosIcon
              sx={{
                fontSize: '16px',
                color: '#8C8C8C'
              }}
            />
          </IconButton>
          {props.periodType === 'month' && (
            <div
              style={datePickerHeaderTextStyle}
              id="menuWrapScopeForDateModal"
              aria-controls="menuScopeForDateModal"
              aria-haspopup="true"
              aria-expanded={openForDateModal ? 'true' : undefined}
              ref={menuWrapScopeForDateModal}
              onClick={handleClickForDateModal}
            >
              {monthNameVal}年
            </div>
          )}
          {props.periodType !== 'month' && (
            <div
              style={datePickerHeaderTextStyle}
              id="menuWrapScopeForDateModal"
              aria-controls="menuScopeForDateModal"
              aria-haspopup="true"
              aria-expanded={openForDateModal ? 'true' : undefined}
              ref={menuWrapScopeForDateModal}
              onClick={handleClickForDateModal}
            >
              {minDateNameVal}年 - {maxDateNameVal}年
            </div>
          )}
          <IconButton
            aria-label="日期前进按钮"
            component="span"
            onClick={handleNextDate}
          >
            <ArrowForwardIosIcon
              sx={{
                fontSize: '16px',
                color: '#8C8C8C'
              }}
            />
          </IconButton>
        </div>
        {props.periodType === 'years' && (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <YearPicker
              date={inputDateVal}
              isDateDisabled={() => false}
              minDate={minDateVal}
              maxDate={maxDateVal}
              onChange={(newDate) => setInputDateVal(newDate)}
            />
          </LocalizationProvider>
        )}

        {props.periodType &&
          dateEnumVal &&
          dateEnumVal.map((val: enumLayoutData) => (
            <Box sx={dateYearItemWrap}>
              <Box sx={dateYear}>{val.title}</Box>
              {val.enumArr.map((enumVal) => {
                return (
                  <Box
                    sx={enumItemSx}
                    style={
                      val.title === enumSelectedYearVal &&
                      enumVal == enumSelectedVal
                        ? activeHalfyear
                        : void 0
                    }
                    onClick={() => handleEnumClick(val.title, enumVal)}
                  >
                    {enumVal}
                  </Box>
                )
              })}
            </Box>
          ))}

        {/* {props.periodType === 'month' && dateMonth.map((val: number[]) => (
          <Box sx={dateYearItemWrap}>
            {val}月
          </Box>
        ))} */}

        <div style={calendarOperateWrapStyles}>
          <Button variant="contained" onClick={handleSelectedCurrent}>
            本年
          </Button>
          <Button variant="contained" onClick={handleConfirmDate}>
            确定
          </Button>
          <Button variant="contained" onClick={() => handleClearSelectDate()}>
            清空
          </Button>
        </div>
      </Menu>
      <Menu
        style={yearPickerWrap}
        onClose={handleCloseForDateModal}
        open={openForDateModal}
        anchorEl={anchorElForDateModal}
        id="menuScopeForDateModal"
        sx={{
          '& .css-1poimk-MuiPaper-root-MuiMenu-paper-MuiPaper-root-MuiPopover-paper':
            {
              width: '166px'
            },
          '& .MuiMenu-list': {
            display: 'flex',
            flexWrap: 'wrap',
            padding: '10px'
          }
        }}
      >
        {dateModalVal &&
          dateModalVal.map((val: any) => (
            <li
              style={
                dateModalSelectedVal === val ? menuListActiveItem : menuListItem
              }
              onClick={() => handleClickDateModal(val)}
            >
              {val}
            </li>
          ))}
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
  disabled: false,
  periodType: 'years'
}

export default JGPeriod
export { JGPeriod }
export type { JGPeriodProps }
