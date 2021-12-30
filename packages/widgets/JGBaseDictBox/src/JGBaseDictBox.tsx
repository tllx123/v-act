import React, { CSSProperties } from 'react'

import { InputUnstyledProps } from '@mui/base/InputUnstyled'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import {
  FormControl,
  IconButton,
  InputAdornment,
  OutlinedInput
} from '@mui/material'
import { styled } from '@mui/system'
import { JGInputLabel } from '@v-act/jginputlabel'
import { Height, Width } from '@v-act/schema-types'
import { useContext } from '@v-act/widget-context'
import { toHeight, toLabelWidth, toWidth } from '@v-act/widget-utils'

interface JGBaseDictBoxProps extends InputUnstyledProps {
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
   * 只读
   */
  readOnly?: boolean
}

const StyledInputElement = styled('input')`
  border: 1px solid #dcdee2;
  border-right: 0;
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
const CssOutlinedInput = styled(OutlinedInput)({
  '&:hover fieldset': {
    borderColor: 'yellow'
  }
})

const JGBaseDictBox = function (props: JGBaseDictBoxProps) {
  if (!props.visible) {
    return null
  }
  const context = useContext()
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
        visible={props.labelVisible}
        required={props.isMust}
      >
        {props.labelText}
      </JGInputLabel>

      <FormControl variant="outlined">
        <CssOutlinedInput
          style={inputStyles}
          readOnly={props.readOnly}
          endAdornment={
            <InputAdornment style={InputAdornmentSty} position="end">
              <IconButton style={openStyle}>
                <OpenInNewIcon sx={{ width: '20px', height: '20px' }} />
              </IconButton>
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
  labelVisible: true,
  readOnly: true
}

export default JGBaseDictBox
export { JGBaseDictBox, type JGBaseDictBoxProps }
