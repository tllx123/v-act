import {
  Control,
  WidgetRenderContext,
  WidgetRenderer
} from '@v-act/schema-types'
import { toNumber } from '@v-act/widget-utils'

import { JGBarcode, JGBarcodeProps } from './JGBarcode'

const convert = function (
  control: Control,
  render: WidgetRenderer,
  componentCode: string,
  context: WidgetRenderContext
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

const JsonJGBarcode = function (props: {
  control: Control
  render: WidgetRenderer
  componentCode: string
  context: WidgetRenderContext
}) {
  return convert(
    props.control,
    props.render,
    props.componentCode,
    props.context
  )
}

export { convert, JGBarcode, JsonJGBarcode }
