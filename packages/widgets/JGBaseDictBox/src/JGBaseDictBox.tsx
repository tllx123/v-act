import React, { CSSProperties, forwardRef } from 'react'

import InputUnstyled, { InputUnstyledProps } from '@mui/base/InputUnstyled'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import { styled } from '@mui/system'
import { JGInputLabel } from '@v-act/jginputlabel'
import { Height, Width } from '@v-act/schema-types'
import { useContext } from '@v-act/widget-context'
import { toHeight, toLabelWidth, toWidth } from '@v-act/widget-utils'

interface JGBaseDictBoxProps extends InputUnstyledProps {
  /** 其他*/
  /**
   * 标题
   */
  labelText?: string

  /** 格式 */
  /**
   * 左边距
   */
  left?: number
  /**
   * 上边距
   */
  top?: number
  /**
   * 高度
   */
  multiHeight?: Height
  /**
   * 宽度
   */
  multiWidth?: Width

  /** 格式 */
  /**
   * 标题宽度
   */
  labelWidth?: number
  // /**
  //  * 显示
  //  */
  // visible?: boolean

  /** 数据 */
  /**
   * 只读
   */
  readOnly?: boolean
  /**
   * 提醒文字
   */
  placeholder?: string
  /**
   * 必填
   */
  isMust?: boolean
  /**
   * 使能
   */
  enabled?: boolean

  /**
   * 点击事件
   */
  click?: Function
}

const StyledInputElement = styled('input')`
  border: 1px solid #dcdee2;
  border-radius: 4px;
  color: #333;
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

  [disabled] {
    background: #f6f7fb;
  }
`
const CssOutlinedInput = forwardRef(function (
  props: JGBaseDictBoxProps,
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

const JGBaseDictBox = function (props: JGBaseDictBoxProps) {
  const context = useContext()

  const width = toWidth(props.multiWidth, context, '235px')
  const height = toHeight(props.multiHeight, context, '26px')
  const labelWidth = toLabelWidth(props.labelWidth, context, 94)

  //触发点击事件
  const myFun = () => {
    props.click && props.click()
  }

  const wrapStyles: CSSProperties = {
    width: width,
    height: height,
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    position: context.position,
    left: props.left,
    overflow: 'visible',
    top: props.top,
    fontFamily:
      'Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,\\5FAE\\8F6F\\96C5\\9ED1,Arial,sans-serif'
  }

  const inputStyles: CSSProperties = {
    width: '100%',
    height: height,
    position: 'relative'
  }

  const buttonStyles: CSSProperties = {
    width: '16px',
    height: '16px'
  }

  const openStyle: CSSProperties = {
    color: '#9e9e9e'
  }

  const InputAdornmentSty: CSSProperties = {
    width: '18px',
    position: 'absolute',
    top: '2px',
    right: '15px',
    height: '100%',
    display: props.enabled && !props.readOnly ? 'inline-flex' : 'none' ////使能(true)与只读(false)才显示按钮
  }

  return (
    <div style={wrapStyles}>
      <JGInputLabel width={labelWidth} height={height} required={props.isMust}>
        {props.labelText}
      </JGInputLabel>

      <CssOutlinedInput
        style={inputStyles}
        readOnly={true}
        disabled={!props.enabled}
        endAdornment={
          <InputAdornment style={InputAdornmentSty} position="end">
            <IconButton style={openStyle} onClick={myFun}>
              <OpenInNewIcon sx={{ width: '20px', height: '20px' }} />
            </IconButton>
          </InputAdornment>
        }
      />
    </div>
  )
}

JGBaseDictBox.defaultProps = {
  left: '0px',
  top: '0px',
  multiHeight: '26px',
  multiWidth: '235px',
  labelWidth: 94,
  labelText: '文本',
  placeholder: '',
  isMust: false,
  enabled: true,
  readOnly: false
}

export default JGBaseDictBox
export { JGBaseDictBox, type JGBaseDictBoxProps }
