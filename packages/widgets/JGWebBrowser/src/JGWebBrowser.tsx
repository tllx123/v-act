import Box from '@mui/material/Box'
import { Property } from 'csstype'
import Iframe from 'react-iframe'
import { useContext } from '@v-act/widget-context'
import { toHeight, toLabelWidth, toWidth } from '@v-act/widget-utils'
interface JGWebBrowserProps {
  left?: Property.Left
  top?: Property.Top
  position?: Property.Position
  height?: Property.Height
  width?: Property.Width
  url: string
  param?: object
}

const obj2strUrl = (obj: any) => {
  let str = ''
  let key: string
  for (key in obj) {
    str = `${str}${key}=${obj[key]}&`
  }
  str = str.substring(0, str.length - 1)
  return str
}

const JGWebBrowser = (props: JGWebBrowserProps) => {
  const context = useContext()
  const { left, top, height, width, position, url, param, ...resprops } = props

  let urlTemp = url
  if (param) {
    urlTemp = url + '?' + obj2strUrl(param)
  }
  console.log('asdasdasda')
  console.log(urlTemp)
  return (
    <Box
      sx={{
        left: left,
        top: top,
        width: toWidth(width, context, '235px'),
        height: toHeight(height, context, '26px'),
        position: context.position
      }}
    >
      <Iframe url={urlTemp} width="100%" height="100%" {...resprops} />
    </Box>
  )
}

JGWebBrowser.defaultProps = {
  left: '20px',
  top: '50px',
  width: '200px',
  height: '200px',
  position: 'absolute'
}

export default JGWebBrowser
export { JGWebBrowser, JGWebBrowserProps }
