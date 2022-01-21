import React, { useState } from 'react'
import { useContext } from '@v-act/widget-context'
import { Property } from 'csstype'
import { toHeight, toWidth } from '@v-act/widget-utils'
import Box from '@mui/material/Box'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import TextareaAutosize from '@mui/material/TextareaAutosize'

export interface JGRichTextEditorProps {
  left?: Property.Left
  top?: Property.Top
  position?: Property.Position
  height?: Property.Height
  width?: Property.Width
  tablename?: string | null
  columnname?: string | null
  control?: any
}

const JGRichTextEditor = (props: JGRichTextEditorProps) => {
  const context = useContext()
  const { left, top, height, width, position, ...resprops } = props

  const [value, setValue] = useState('')
  return (
    <Box
      sx={{
        'width': toWidth(width, context, '235px'),
        'height': toHeight(height, context, '26px'),
        'position': context.position,
        'left': left,
        'top': top,
        'resize': 'none',
        'border': '1px solid #dcdee2',
        'color': '#333',
        'borderRadius': '4px',
        '&:hover': {
          borderColor: '#356abb'
        },
        '&:focus': {
          borderColor: '#356abb',
          background: '#fff',
          boxShadow: '0 0 0 2px rgba(53, 106, 187, 0.3)',
          outline: 'none'
        },
        '&:disabled': {
          background: '#f6f7fb'
        }
      }}
      component={TextareaAutosize}
    >
      {/* <Box
        sx={{ width: '100%', height: "100%" }}
        component={ReactQuill}
        theme="snow" value={value} onChange={setValue}
      >
      </Box> */}
    </Box>
  )
}

JGRichTextEditor.defaultProps = {
  left: '20px',
  top: '50px',
  width: '300px',
  height: '300px',
  position: 'absolute'
}

export default JGRichTextEditor
