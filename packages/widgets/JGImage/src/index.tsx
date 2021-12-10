import { Control, toNumber } from '@v-act/schema-types'

import JGImage, { JGImageProps } from './JGImage'

export const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element | null
): JSX.Element {
  const pros = control.properties
  const props: JGImageProps = {
    top: toNumber(pros.top) + '',
    left: toNumber(pros.left) + '',
    width: toNumber(pros.multiWidth) + '',
    height: toNumber(pros.multiHeight) + ''
  }
  return <JGImage {...props}>{pros.labelText}</JGImage>
}

export { JGImage }
