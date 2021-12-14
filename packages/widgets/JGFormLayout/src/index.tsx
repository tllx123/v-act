import { Control, ReactEnum } from '@v-act/schema-types'
import { toNumber, valueofHeight, valueofWidth } from '@v-act/widget-utils'

import { JGFormLayout, JGFormLayoutProps } from './JGFormLayout'

const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element[] | null
): JSX.Element {
  const pros = control.properties
  const props: JGFormLayoutProps = {
    top: toNumber(pros.top),
    left: toNumber(pros.left),
    numCols: toNumber(pros.numCols, 3),
    groupTitle: pros.groupTitle || '',
    titleWidth: pros.titleWidth ? pros.titleWidth : ReactEnum.Content,
    multiWidth: valueofWidth(pros.multiWidth, '235px'),
    multiHeight: valueofHeight(pros.multiHeight, ReactEnum.Content)
  }
  return (
    <JGFormLayout {...props}>
      {control.controls ? render(control.controls) : null}
    </JGFormLayout>
  )
}

export default JGFormLayout

export { convert, JGFormLayout }
