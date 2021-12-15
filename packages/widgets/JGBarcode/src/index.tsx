import { Control, toBoolean, toNumber } from '@v-act/schema-types'
import { JGBarcode, JGBarcodeProps } from './JGBarcode'

const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element | null
): JSX.Element {
  const pros = control.JGBarcodeProperty

  const props: JGBarcodeProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    width: toNumber(pros.multiWidth) + 'px',
    height: toNumber(pros.multiHeight) + 'px',
    format: pros.format,
    font: pros.BarContent,
    background: pros.BackColor,
    lineColor: pros.ForeColor,
    displayValue: pros.IsShowText,
    value: pros.BarContent,
    barcodwidth: toNumber(pros.multiWidth),
    barcodheight: toNumber(pros.multiHeight)
  }
  return <JGBarcode {...props}></JGBarcode>
}

export { JGBarcode, convert }
