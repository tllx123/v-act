import { Property } from 'csstype'
import { Height, Width } from '@v-act/schema-types'
import { useContext } from '@v-act/widget-context'
import { toHeight, toWidth } from '@v-act/widget-utils'

interface JGSpacerProps{
  /**
   * 左边距
   */
  left?: Property.Left
  /**
   * 上边距
   */
  top?: Property.Top
  /**
   * 高度
   */
  multiHeight?: Height
  /**
   * 宽度
   */
  multiWidth?: Width
}

const JGSpacer = function (props: JGSpacerProps) {
  const context = useContext()
  return (
    <div style={{
      position: context.position,
      width: toWidth(props.multiWidth,context,JGSpacer.defaultProps.multiWidth),
      height: toHeight(props.multiHeight,context,JGSpacer.defaultProps.multiHeight)
    }}>
    </div>
  )
}

JGSpacer.defaultProps = {
  left: '0px',
  top: '0px',
  multiHeight: '0px',
  multiWidth: '0px'
}

export default JGSpacer
export { JGSpacer, type JGSpacerProps }
