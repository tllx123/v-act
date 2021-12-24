import { CSSProperties } from 'react'

import { Property } from 'csstype'

import InputLabel from '@mui/material/InputLabel'

interface JGInputLabelProps {
  width?: Property.Width | number
  height?: Property.Height | number
  visible?: boolean
  required?: boolean
  children?: JSX.Element | JSX.Element[] | null | string
}

function JGInputLabel(props: JGInputLabelProps) {
  if (!props.visible) {
    return null
  }
  const styles: CSSProperties = {
    width: props.width,
    height: props.height,
    lineHeight: props.height,
    textAlign: 'right',
    paddingRight: '6px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontSize: '14px',
    color: '#333',
    flexShrink: 0
  }
  return (
    <InputLabel style={styles}>
      {props.children}
      {props.required ? <label style={{ color: 'red' }}>*</label> : ''}:
    </InputLabel>
  )
}

JGInputLabel.defaultProps = {
  width: '94px',
  height: '26px',
  value: '',
  required: false,
  visible: true
}

export { JGInputLabel, type JGInputLabelProps }
