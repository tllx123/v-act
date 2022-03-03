import { Property } from 'csstype'
export default interface JGComponentProps {
  left?: Property.Left
  top?: Property.Top
  height?: Property.Height
  width?: Property.Width
  position?: Property.Position
  margin?: Property.Margin
  padding?: Property.Padding
  readonly?: boolean
  ismust?: boolean
  labeltext?: string
  labelWidth?: number
  placeholder?: string
  labelVisible?: boolean
  disabled?: boolean
  value?: string
  onChanged?: (e: any) => void
}
