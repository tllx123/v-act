import { CSSProperties } from 'react'

import Box from '@mui/material/Box'
import {
  Control,
  ControlReact,
  Height,
  ReactEnum,
  Width
} from '@v-act/schema-types'
import { useContext } from '@v-act/widget-context'

interface JGTabPageProps {
  code: string

  index?: number

  value?: string
  /**
   * 高度
   */
  multiHeight?: Height
  /**
   * 标题
   */
  labelText?: string
  /**
   * 宽度
   */
  multiWidth?: Width

  children?: JSX.Element | JSX.Element[] | null
}

const convert = function (
  control: Control,
  render: (
    controls: Array<Control>,
    containerReact: ControlReact
  ) => JSX.Element | null,
  tabControl: Control
): JSX.Element {
  const pros = control.properties
  const props: JGTabPageProps = {
    code: pros.code,
    labelText: pros.labelText,
    multiHeight: pros.multiHeight ? pros.multiHeight : ReactEnum.Content,
    multiWidth: pros.multiWidth ? pros.multiWidth : ReactEnum.Space
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
  const { children, index, value } = props
  const context = useContext()
  const styles: CSSProperties = {
    width: '100%',
    height: '100%'
  }
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
export { convert, JGTabPage }
