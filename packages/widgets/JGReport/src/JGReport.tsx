import { Fragment } from 'react'

import { Property } from 'csstype'

import { SpreadSheets, Worksheet } from '@grapecity/spread-sheets-react'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import FindInPageIcon from '@mui/icons-material/FindInPage'
import PreviewIcon from '@mui/icons-material/Preview'
import VisibilityIcon from '@mui/icons-material/Visibility'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { Height, Width } from '@v-act/schema-types'
import { useContext } from '@v-act/widget-context'
import { toCssAxisVal } from '@v-act/widget-utils'

interface JGReportProps {
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
  /**
   * 显示
   */
  visible?: boolean
  /**
   * 显示工具栏
   */
  isShowToolbar?: boolean
  /**
   * 只读
   */
  readonly?: boolean
}

const JGReport = function (props: JGReportProps) {
  if (!props.visible) {
    return null
  }
  const context = useContext()
  const children = []
  if (props.isShowToolbar) {
    children.push(
      <Box
        display="grid"
        gridTemplateColumns={'repeat(24, 1fr)'}
        gap={2}
        sx={{
          height: '44px',
          overflow: 'hidden',
          borderBottom: '1px solid #aaa'
        }}
      >
        <Button
          variant="contained"
          sx={{ height: '32px', width: '130px', margin: ' 4px 0px 4px 4px' }}
          startIcon={<FileUploadIcon />}
        >
          导出Excel
        </Button>
        <Button
          variant="contained"
          sx={{ height: '32px', width: '130px', margin: ' 4px 0px 4px 4px' }}
          startIcon={<VisibilityIcon />}
        >
          快速打印
        </Button>
        <Button
          variant="contained"
          sx={{ height: '32px', width: '130px', margin: ' 4px 0px 4px 4px' }}
          startIcon={<PreviewIcon />}
        >
          普通打印
        </Button>
        <Button
          variant="contained"
          sx={{ height: '32px', width: '130px', margin: ' 4px 0px 4px 4px' }}
          startIcon={<FindInPageIcon />}
        >
          预览打印
        </Button>
      </Box>
    )
  }
  children.push(
    <Box sx={{ width: '100%', height: '100%' }}>
      <SpreadSheets>
        <Worksheet></Worksheet>
      </SpreadSheets>
    </Box>
  )
  return (
    <Stack
      sx={{
        border: '1px solid #ddd',
        left: toCssAxisVal(props.left, '0px'),
        top: toCssAxisVal(props.top, '0px'),
        position: context.position,
        width: toCssAxisVal(props.multiWidth, JGReport.defaultProps.multiWidth),
        height: toCssAxisVal(
          props.multiHeight,
          JGReport.defaultProps.multiHeight
        )
      }}
    >
      {children.map((child, index) => {
        return <Fragment key={index}>{child}</Fragment>
      })}
    </Stack>
  )
}

JGReport.defaultProps = {
  multiHeight: '147px',
  multiWidth: '237px',
  visible: true,
  isShowToolbar: true,
  readonly: false
}

export { JGReport, type JGReportProps }
