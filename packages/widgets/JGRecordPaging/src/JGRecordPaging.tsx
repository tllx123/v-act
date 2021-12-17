import { forwardRef } from 'react'

import { Property } from 'csstype'

import { Pagination, PaginationProps, styled } from '@mui/material'

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
})(({ theme }) => ({
  position: 'absolute'
}))

const JGRecordPaging = forwardRef<any, JGRecordPagingProps>((inProps, ref) => {
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
      width: inProps.width,
      top: inProps.top,
      right: inProps.right,
      left: inProps.left,
      height: inProps.height,
      bottom: inProps.bottom
    }
  }
  return <JGRecordPagingRoot {...props} ref={ref} />
})

export default JGRecordPaging
