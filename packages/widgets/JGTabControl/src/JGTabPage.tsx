import { CSSProperties } from 'react'
import { Control, toNumber, toBoolean } from '@v-act/schema-types'
import { Height, Width, ReactEnum } from '@v-act/schema-types'
import Box from '@mui/material/Box'

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

  children?: JSX.Element | null
}

const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element | null
): JSX.Element {
  const pros = control.properties
  const props: JGTabPageProps = {
    code: pros.code,
    labelText: pros.labelText,
    multiHeight: pros.multiHeight ? pros.multiHeight : ReactEnum.Content,
    multiWidth: pros.multiWidth ? pros.multiWidth : ReactEnum.Space
  }
  return (
    <JGTabPage key={pros.code} {...props}>
      {render(control.controls)}
    </JGTabPage>
  )
}

function JGTabPage(props: JGTabPageProps) {
  const { children, index, value } = props
  const styles: CSSProperties = {
    position: 'absolute'
  }
  return (
    <div
      style={styles}
      role="tabpanel"
      hidden={index !== value}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

export default JGTabPage
export { JGTabPage, convert }
