import { CSSProperties } from 'react'

import Box from '@mui/material/Box'
import { toBoolean } from '@v-act/widget-utils'
import { Control, ControlReact, WidgetRenderer } from '@v-act/schema-types'

interface JGTabPageProps {
  code: string

  visible?: boolean

  index?: number

  value?: string
  /**
   * 标题
   */
  labelText?: string

  sx?: CSSProperties

  children?: JSX.Element | JSX.Element[] | null
}

const convert = function (
  control: Control,
  render: WidgetRenderer,
  tabControl: Control
): JSX.Element {
  const pros = control.properties
  const props: JGTabPageProps = {
    code: pros.code,
    visible: toBoolean(pros.visible, true),
    labelText: pros.labelText
  }
  const containerProps: ControlReact = {
    width: parseInt(tabControl.properties.width || '200'),
    height: parseInt(tabControl.properties.height || '100') - 40
  }
  return (
    <JGTabPage key={pros.code} {...props}>
      {render(control.controls, containerProps)}
    </JGTabPage>
  )
}

function JGTabPage(props: JGTabPageProps) {
  if (!props.visible) {
    return null
  }
  const { children, index, value } = props
  const styles = props.sx ? props.sx : {}
  return (
    <div
      style={styles}
      role="tabpanel"
      hidden={index !== value}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
    >
      {value === index && (
        <Box sx={{ p: 3, height: '100%', position: 'relative' }}>
          {children}
        </Box>
      )}
    </div>
  )
}

export default JGTabPage
export { convert, JGTabPage, type JGTabPageProps }
