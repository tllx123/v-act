import { Control, toBoolean, toNumber } from '@v-act/schema-types'
import { JGQrcode, JGQrcodeProps } from './JGQrcode'

const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element | null
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

export { JGQrcode, convert }
