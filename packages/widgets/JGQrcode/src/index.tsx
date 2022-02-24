import {
  Control,
  toNumber,
  WidgetRenderContext,
  WidgetRenderer
} from '@v-act/schema-types'

import { JGQrcode, JGQrcodeProps } from './JGQrcode'

const JsonJGQrcode = function (props: {
  control: Control
  render: WidgetRenderer
  componentCode: string
  context: WidgetRenderContext
}) {
  return convert(props.control, props.render)
}

const convert = function (
  control: Control,
  render: WidgetRenderer
): JSX.Element {
  const pros = control.jgqrcodeproperties

  const props: JGQrcodeProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    width: toNumber(pros.multiWidth) + 'px',
    height: toNumber(pros.multiHeight) + 'px',
    rendertype: pros.RenderType,
    qrcontent: pros.QRContent
  }
  return <JGQrcode {...props}></JGQrcode>
}

export { convert, JGQrcode, JsonJGQrcode }
