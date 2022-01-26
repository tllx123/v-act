import React, { useState, useEffect } from 'react'
import { FieldValue, useContext } from '@v-act/widget-context'
import { Property } from 'csstype'
// import { createRequire } from 'module';
// const require = createRequire(import.meta.url);
import {
  toHeight,
  toWidth,
  getFieldValue,
  isNullOrUnDef
} from '@v-act/widget-utils'
import Box from '@mui/material/Box'
// import Quill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const ReactQuill = typeof window === 'object' ? require('react-quill') : false

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
  const {
    left,
    top,
    height,
    width,
    position,
    tablename,
    columnname,
    ...resprops
  } = props

  let defulValue: any = ''
  let value: FieldValue = ''
  if (props.tablename && props.columnname) {
    value = getFieldValue(props.tablename, props.columnname, context)
    value = isNullOrUnDef(value) ? '' : value
  }

  if (value) {
    defulValue = value
  }
  console.log('defulValue')
  console.log(defulValue)

  const [valueRich, setValue] = useState(defulValue)

  if (ReactQuill) {
    return (
      <Box
        sx={{
          width: toWidth(width, context, '235px'),
          height: toHeight(height, context, '26px'),
          position: context.position,
          left: left,
          top: top
        }}
      >
        <Box
          sx={{ width: '100%', height: '100%' }}
          component={ReactQuill}
          theme="snow"
          value={valueRich}
          onChange={setValue}
        ></Box>
      </Box>
    )
  } else {
    return <Box></Box>
  }
}

JGRichTextEditor.defaultProps = {
  left: '20px',
  top: '50px',
  width: '300px',
  height: '300px',
  position: 'absolute'
}

export default JGRichTextEditor
