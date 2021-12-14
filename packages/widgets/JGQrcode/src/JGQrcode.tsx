import QRCode from 'qrcode.react'
import Box from '@mui/material/Box'
import { Property } from 'csstype'

interface JGQrcodeProps {
  left?: Property.Left
  top?: Property.Top
  height?: Property.Height
  width?: Property.Width
  position?: Property.Position
  margin?: Property.Margin
  padding?: Property.Padding
  percentheight?: Property.Height
  percentwidth?: Property.Width
  textTop?: Property.Top
  backcolor?: string
  ForeColor?: string
  rendertype?: 'canvas' | 'svg' | undefined
  qrcontent: string
  correctlevel?: 'L' | 'M' | 'Q' | 'H' | undefined
  istext?: boolean
  text?: string
}

const JGQrcode = (props: JGQrcodeProps) => {
  const {
    left,
    top,
    height,
    width,
    position,
    margin,
    padding,
    percentheight,
    percentwidth,
    backcolor,
    ForeColor,
    rendertype,
    qrcontent,
    correctlevel,
    istext,
    text
  } = props
  return (
    <Box
      sx={{
        left: left,
        top: top,
        width: percentwidth ? percentwidth : width,
        height: percentheight ? percentheight : width,
        position: position,
        margin: margin,
        padding: padding
      }}
    >
      <QRCode
        style={{
          width: '100%',
          height: '100%'
        }}
        value={qrcontent}
        size={200}
        fgColor={ForeColor}
        bgColor={backcolor}
        renderAs={rendertype}
        level={correctlevel}
      />

      {istext ? (
        <Box
          sx={{
            left: '0px',
            top: height,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            color: ForeColor,
            position: 'absolute',
            width: '100%'
          }}
        >
          {text}
        </Box>
      ) : (
        ''
      )}
    </Box>
  )
}

JGQrcode.defaultProps = {
  qrcontent: 'www.baidu.com',
  left: '20px',
  top: '50px',
  width: '200px',
  height: '200px',
  position: 'absolute',
  textTop: '250px',
  correctlevel: 'L',
  rendertype: 'canvas',
  backcolor: '#fff',
  ForeColor: '#000'
}

export default JGQrcode
export { JGQrcode, JGQrcodeProps }
