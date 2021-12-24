import { forwardRef } from 'react'

import { Property } from 'csstype'

import { Pagination, PaginationProps, styled } from '@mui/material'
import { useContext } from '@v-act/widget-context'
import { toHeight, toWidth } from '@v-act/widget-utils'

export interface JGRecordPagingProps extends PaginationProps {
  bottom?: Property.Bottom
  count?: number
  height?: Property.Height
  left?: Property.Left
  right?: Property.Right
  top?: Property.Top
  width?: Property.Width
}

const JGRecordPagingRoot = styled(Pagination, {
  name: 'JGRecordPaging',
  slot: 'Root'
})(({ theme }) => ({}))

const JGRecordPaging = forwardRef<any, JGRecordPagingProps>((inProps, ref) => {
  const context = useContext()
  const sx = inProps.sx || {}
  const props: PaginationProps = {
    count: inProps.count ?? 10,
    shape: inProps.shape ?? 'rounded',
    showFirstButton: inProps.showFirstButton ?? true,
    showLastButton: inProps.showLastButton ?? true,
    siblingCount: inProps.siblingCount ?? 0,
    boundaryCount: inProps.boundaryCount ?? 0,
    size: inProps.size ?? 'small',
    variant: inProps.variant ?? 'outlined',
    sx: {
      ...sx,
      height: toHeight(inProps.height, context, '25px'),
      width: toWidth(inProps.width, context, '222px'),
      position: context ? context.position : 'absolute',
      top: inProps.top,
      right: inProps.right,
      left: inProps.left,
      bottom: inProps.bottom
    }
  }
  return <JGRecordPagingRoot {...props} ref={ref} />
})

JGRecordPaging.defaultProps = {
  height: '25px',
  width: '222px'
}

export default JGRecordPaging
