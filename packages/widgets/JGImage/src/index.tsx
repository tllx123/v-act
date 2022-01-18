import { Control, JGImageProperty } from '@v-act/schema-types'
import { getComponentResPath, toNumber } from '@v-act/widget-utils'

import JGImage, { JGImageProps } from './JGImage'

export const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element | null,
  componentCode: string
): JSX.Element {
  const pros: JGImageProperty = control.properties
  const props: JGImageProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    width: toNumber(pros.multiWidth) + 'px',
    height: toNumber(pros.multiHeight) + 'px',
    image: pros.imageValue
      ? getComponentResPath(pros.imageValue, componentCode)
      : undefined
  }
  return <JGImage {...props}>{pros.labelText}</JGImage>
}

export { JGImage }
