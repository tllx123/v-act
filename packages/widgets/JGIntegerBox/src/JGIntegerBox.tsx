import React, { forwardRef } from 'react'

import InputUnstyled, { InputUnstyledProps } from '@mui/base/InputUnstyled'
import Box from '@mui/material/Box'
import { styled } from '@mui/system'
import { JGInputLabel } from '@v-act/jginputlabel'
import { JGComponentProps } from '@v-act/schema-types'

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
  props: InputUnstyledProps,
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

const JGIntegerBox = function (props: JGComponentProps) {
  const {
    left,
    top,
    height,
    width,
    ismust,
    labeltext,
    margin,
    padding,
    readonly,
    labelVisible,
    labelWidth,
    disabled,
    position,
    value,
    onChanged,
    placeholder
  } = props
  const handleChange = (e) => {
    let hasMinus = e.target.value.indexOf('-') === 0
    let filterVal = e.target.value.replace(/[^0-9]/gi, '')
    if (hasMinus) filterVal = '-' + filterVal
    onChanged && onChanged({ target: { value: filterVal } })
  }
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: width,
        height: height,
        position: position,
        left: left,
        top: top,
        margin: margin,
        padding: padding,
        pointerEvents: readonly ? 'none' : 'auto'
      }}
    >
      <JGInputLabel
        width={labelWidth}
        height={height}
        required={ismust}
        visible={labelVisible}
      >
        {labeltext}
      </JGInputLabel>
      <CustomInput
        placeholder={placeholder}
        type={'text'}
        onChange={(e) => handleChange(e)}
        value={value}
        disabled={disabled}
      />
    </Box>
  )
}

JGIntegerBox.defaultProps = {
  labeltext: '文本',
  width: '235px',
  height: '26px',
  position: 'absolute',
  left: 0,
  top: 0,
  placeholder: '',
  labelVisible: true,
  labelWidth: 94
}

export default JGIntegerBox
