import { Control, toNumber, toBoolean } from '@v-act/schema-types'
import { Height, Width } from '@v-act/schema-types'
import Box from '@mui/material/Box'

interface JGTabPageProps {
  code: string

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

  children?: any
}

const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element | null
): JSX.Element {
  const pros = control.properties
  const props: JGTabPageProps = {
    code: pros.code,
    multiHeight: pros.multiHeight ? pros.multiHeight : 'content',
    multiWidth: pros.multiWidth ? pros.multiWidth : 'space'
  }
  return <JGTabPage {...props}>{render(control.controls)}</JGTabPage>
}

function JGTabPage(props: JGTabPageProps) {
  const { children, code, value, ...other } = props
  return (
    <div
      role="tabpanel"
      hidden={code !== value}
      id={`vertical-tabpanel-${code}`}
      aria-labelledby={`vertical-tab-${code}`}
      {...other}
    >
      {value === code && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

export default JGTabPage
export { JGTabPage, convert }
