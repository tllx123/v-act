import React, { CSSProperties } from 'react'

import { InputUnstyledProps } from '@mui/base/InputUnstyled'
import { FormControl, InputAdornment, OutlinedInput } from '@mui/material'
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
}

const CssOutlinedInput = styled(OutlinedInput)({
  '&.MuiOutlinedInput-root': {
    'borderRadius': 4,
    'position': 'relative',
    'width': '100%',
    '&:focus': {
      boxShadow: '0 0 10px rgba(53,106,187,0.3)'
    },
    '&:hover fieldset': {
      borderColor: '#0960c3'
    }
  }
})

const JGBaseDictBox = function (props: JGBaseDictBoxProps) {
  const context = useContext()
  const width = toWidth(props.multiWidth, context, '235px')
  const height = toHeight(props.multiHeight, context, '26px')

  // const labelWidth = props.labelVisible
  //   ? toLabelWidth(props.labelWidth, context, 94)
  //   : 0
  const labelWidth = toLabelWidth(props.labelWidth, context, 94)

  //使能与只读两个位true时候disabled 才为true
  let isStart: boolean = false
  if (props.enabled && props.readOnly) {
    isStart = true
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

  const inputStyles = {
    width: '100%',
    height: height
  }

  const buttonStyles: CSSProperties = {
    width: '16px',
    height: '16px'
  }

  const openStyle: CSSProperties = {
    color: '#dcdee2'
  }

  const InputAdornmentSty: CSSProperties = {
    width: '18px'
  }

  return (
    <div style={wrapStyles}>
      <JGInputLabel
        width={labelWidth}
        height={height}
        //visible={props.labelVisible}
        required={props.isMust}
      >
        {props.labelText}
      </JGInputLabel>

      <FormControl variant="filled">
        <CssOutlinedInput
          sx={{
            legend: {
              width: 'auto'
            }
          }}
          style={inputStyles}
          readOnly={true}
          disabled={isStart}
          endAdornment={
            <InputAdornment style={InputAdornmentSty} position="end">
              {/* <IconButton style={openStyle} disabled={isStart}>
                <OpenInNewIcon sx={{ width: '20px', height: '20px' }} />
              </IconButton> */}
            </InputAdornment>
          }
        />
      </FormControl>
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
  visible: true,
  readOnly: true
}

export default JGBaseDictBox
export { JGBaseDictBox, type JGBaseDictBoxProps }
