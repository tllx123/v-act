import React, { CSSProperties, forwardRef } from 'react'

import { Property } from 'csstype'

import {
  Box,
  BoxProps,
  Button,
  InputUnstyled,
  InputUnstyledProps,
  Pagination,
  Stack,
  TablePagination
} from '@mui/material'
import { styled } from '@mui/system'
import { JGLabel } from '@v-act/jglabel'
import { Height, Width } from '@v-act/schema-types'
import { useContext } from '@v-act/widget-context'
import { toHeight, toWidth } from '@v-act/widget-utils'

interface JGPaginationProps extends BoxProps {
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

/*输入框*/
interface JGPaginationInputProps extends InputUnstyledProps {
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
   * 禁用
   */
  disabled?: boolean
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
//GO按钮
const buttonStyle: CSSProperties = {
  width: '22px',
  padding: '0px',
  minWidth: '0px'
}

//input
const inputStyle: CSSProperties = {
  width: '42px',
  margin: '0px 5px 0 32px'
}

const divStyle: CSSProperties = {
  display: 'flex',
  position: 'relative'
}

const CustomInput = forwardRef(function (
  props: JGPaginationInputProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  return (
    <div style={divStyle}>
      <JGLabel width={'28px'} height={'28px'}>
        到第
      </JGLabel>
      <InputUnstyled
        style={inputStyle}
        components={{ Input: StyledInputElement }}
        {...props}
        ref={ref}
      />
      <Button style={buttonStyle} variant="contained">
        GO
      </Button>
    </div>
  )
})
/*==================*/

interface TablePaginationActionsProps {
  count: number
  page: number
  rowsPerPage: number
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  return <Box sx={{ flexShrink: 0, ml: 2.5 }}></Box>
}

const JGPagination = function (props: JGPaginationProps) {
  const context = useContext()
  const width = toWidth(props.multiWidth, context, '235px')
  const height = toHeight(props.multiHeight, context, '26px')

  const wrapStyles: CSSProperties = {
    width: width,
    height: height,
    fontSize: '14px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: context.position,
    left: props.left,
    overflow: 'visible',
    top: props.top,
    fontFamily:
      'Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,\\5FAE\\8F6F\\96C5\\9ED1,Arial,sans-serif'
  }
  // 分页
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(25)
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 25))
    setPage(0)
  }

  const labelDisplayedRowsZh = function defaultLabelDisplayedRows({
    to,
    count
  }) {
    return `共 ${count !== -1 ? count : `more than ${to}`}条`
  }

  return (
    <Stack style={wrapStyles}>
      <Pagination
        color={'primary'}
        size={'small'}
        count={1}
        shape="rounded"
      ></Pagination>
      <CustomInput />
      <TablePagination
        component="div"
        count={0}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="每页显示"
        labelDisplayedRows={labelDisplayedRowsZh}
        ActionsComponent={TablePaginationActions}
      />
    </Stack>
  )
}

JGPagination.defaultProps = {
  left: '0px',
  top: '0px',
  multiHeight: '29px',
  multiWidth: '700px'
}

export default JGPagination
export { JGPagination, type JGPaginationProps }
