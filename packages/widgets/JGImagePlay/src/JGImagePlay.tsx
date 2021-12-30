import React, { CSSProperties } from 'react'

import { Carousel } from 'antd'
import { Property } from 'csstype'

import { Box, BoxProps } from '@mui/material'
import { styled } from '@mui/system'
import { Height, Width } from '@v-act/schema-types'
import { useContext } from '@v-act/widget-context'
import { toHeight, toWidth } from '@v-act/widget-utils'

interface JGImagePlayProps extends BoxProps {
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

  [disabled] {
    background: #f6f7fb;
  }
`

// const CustomInput = forwardRef(function (
//   props: JGTextBoxProps,
//   ref: React.ForwardedRef<HTMLDivElement>
// ) {
//   return (
//     <InputUnstyled
//       components={{ Input: StyledInputElement }}
//       {...props}
//       ref={ref}
//     />
//   )
// })

function onChange(a, b, c) {
  console.log(a, b, c)
}

const JGImagePlay = function (props: JGImagePlayProps) {
  const context = useContext()
  const width = toWidth(props.multiWidth, context, '235px')
  const height = toHeight(props.multiHeight, context, '26px')

  const wrapStyles: CSSProperties = {
    width: width,
    height: height,
    display: 'flex',
    alignItems: 'center',
    position: context.position,
    left: props.left,
    top: props.top
  }
  const inputStyles = {
    width: '100%',
    height: height
  }

  const contentStyle: CSSProperties = {
    height: '160px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79'
  }

  return (
    <Box style={wrapStyles}>
      <Carousel>
        <div>
          <h3 style={contentStyle}>1</h3>
        </div>
        <div>
          <h3 style={contentStyle}>2</h3>
        </div>
        <div>
          <h3 style={contentStyle}>3</h3>
        </div>
        <div>
          <h3 style={contentStyle}>4</h3>
        </div>
      </Carousel>
      ,
    </Box>
  )
}

JGImagePlay.defaultProps = {
  left: '0px',
  top: '0px',
  multiHeight: '26px',
  multiWidth: '235px'
}

export default JGImagePlay
export { JGImagePlay, type JGImagePlayProps }
