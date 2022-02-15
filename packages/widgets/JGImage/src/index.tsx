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
    height: toNumber(pros.height || pros.multiHeight) + 'px',
    imagePosition: pros.imagePosition,
    image: pros.imageValue
      ? getComponentResPath(pros.imageValue, componentCode)
      : undefined
  }
  const events = control.events
  if (events && events.length > 0) {
    const eventMap: { [eventCode: string]: Function } = {}
    events.forEach((evt) => {
      eventMap[evt.code] = evt.handler
    })
    props.click = eventMap.OnClick
  }
  return <JGImage {...props}>{pros.labelText}</JGImage>
}

export { JGImage }
