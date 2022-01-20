import { forwardRef } from 'react'

import { Property } from 'csstype'

import { Box, BoxProps, styled } from '@mui/material'
import { ReactEnum } from '@v-act/schema-types'
import { Entities, useContext } from '@v-act/widget-context'
import { toHeight, toWidth } from '@v-act/widget-utils'

interface JGComponentProps {
  bottom?: Property.Bottom
  height?: Property.Height
  left?: Property.Left
  right?: Property.Right
  top?: Property.Top
  width?: Property.Width
  entities?: Entities
  padding?: Property.Padding
  children?: JSX.Element | JSX.Element[] | null
}

const JGComponentRoot = styled(Box, {
  name: 'JGComponent',
  slot: 'Root'
})(({ theme }) => ({
  position: 'relative'
}))

const JGComponent = forwardRef<HTMLDivElement, JGComponentProps>(
  (inProps, ref) => {
    const context = useContext()
    context.entities = inProps.entities
    const props: BoxProps = {
      sx: {
        width: toWidth(inProps.width, context, ReactEnum.Space),
        top: inProps.top,
        right: inProps.right,
        left: inProps.left,
        padding:
          typeof inProps.padding !== 'undefined' ? inProps.padding : '16px', //窗体内间距
        height: toHeight(inProps.height, context, ReactEnum.Space),
        bottom: inProps.bottom
      }
    }
    return (
      <JGComponentRoot {...props} ref={ref}>
        {inProps.children}
      </JGComponentRoot>
    )
  }
)

JGComponent.defaultProps = {
  height: '450px',
  width: '960px'
}

export default JGComponent
export { JGComponent, type JGComponentProps }
