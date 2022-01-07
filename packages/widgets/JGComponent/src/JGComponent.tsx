import { forwardRef } from 'react'

import { Property } from 'csstype'

import { Box, BoxProps, styled } from '@mui/material'
import { ReactEnum } from '@v-act/schema-types'
import { ContextProvider, useContext } from '@v-act/widget-context'
import {
  getChildrenWithoutFragmentRecursively,
  toHeight,
  toWidth
} from '@v-act/widget-utils'

interface JGComponentProps {
  bottom?: Property.Bottom
  height?: Property.Height
  left?: Property.Left
  right?: Property.Right
  top?: Property.Top
  width?: Property.Width
  children?: JSX.Element | JSX.Element[] | null
}

const JGComponentRoot = styled(Box, {
  name: 'JGComponent',
  slot: 'Root'
})(({ theme }) => ({
  position: 'relative'
}))

const splitChildren = function (
  children: JSX.Element | JSX.Element[] | null | undefined
) {
  const items = getChildrenWithoutFragmentRecursively(children)
  const result: {
    absolute: JSX.Element[]
    static: JSX.Element[]
  } = { absolute: [], static: [] }
  items.forEach((item) => {
    if (item.props.multiWidth == 'space' || item.props.multiWidth == '100%') {
      result.static.push(item)
    } else if (
      item.props.multiHeight == 'space' ||
      item.props.multiHeight == '100%'
    ) {
      result.static.push(item)
    } else {
      result.absolute.push(item)
    }
  })
  return result
}

const JGComponent = forwardRef<HTMLDivElement, JGComponentProps>(
  (inProps, ref) => {
    const context = useContext()
    const props: BoxProps = {
      sx: {
        width: toWidth(inProps.width, context, ReactEnum.Space),
        top: inProps.top,
        right: inProps.right,
        left: inProps.left,
        padding: '16px', //窗体内间距
        height: toHeight(inProps.height, context, ReactEnum.Space),
        bottom: inProps.bottom
      }
    }
    const result = splitChildren(inProps.children)
    let children: JSX.Element[] = []
    if (result.static.length > 0) {
      children.push(
        <ContextProvider context={{ position: 'static' }}>
          {result.static}
        </ContextProvider>
      )
    }
    children = children.concat(result.absolute)
    return (
      <JGComponentRoot {...props} ref={ref}>
        {children}
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
