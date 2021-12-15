import { Property } from 'csstype'
import Box from '@mui/material/Box'
import * as Barcode from 'react-barcode'

// var Barcode = require('react-barcode');
interface JGBarcodeProps {
  left?: Property.Left
  top?: Property.Top
  height?: Property.Height
  width?: Property.Width
  position?: Property.Position
  format?: string
  displayValue?: boolean
  font?: string
  lineColor?: string
  background?: string
  value?: string
  barcodwidth?: number
  barcodheight?: number
}

const JGBarcode = (props: JGBarcodeProps) => {
  const {
    left,
    top,
    width,
    height,
    position,
    barcodwidth,
    barcodheight,
    ...prop
  } = props
  return (
    <Box
      sx={{
        position: position,
        left: left,
        top: top,
        width: width,
        height: height
      }}
    >
      <Barcode
        textAlign="center"
        textPosition="bottom"
        width={barcodwidth}
        height={barcodheight}
        {...prop}
        margin={5}
      />
    </Box>
  )
}

JGBarcode.defaultProps = {
  value: 'https://tinypng.com/',
  left: '20px',
  top: '50px',
  width: '1.5px',
  height: '150px',
  position: 'absolute',
  barcodwidth: 1.5,
  barcodheight: 150
  // backcolor: '#fff',
  // ForeColor: '#000'
}

export default JGBarcode
export { JGBarcode, JGBarcodeProps }
