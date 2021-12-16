import {
  Control,
  ReactEnum,
  toNumber,
  valueofHeight,
  valueofWidth
} from '@v-act/schema-types'

import {
  ContentAlignment,
  HorizontalAlign,
  JGGroupPanel,
  JGGroupPanelProps,
  Setting,
  VerticalAlign
} from './JGGroupPanel'

const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element[] | null
): JSX.Element {
  const pros = control.properties
  const settings: Setting[] = []
  const props: JGGroupPanelProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    multiWidth: valueofWidth(pros.multiWidth, ReactEnum.Space),
    multiHeight: valueofHeight(pros.multiHeight, ReactEnum.Space),
    numCols: toNumber(pros.numCols, 3),
    groupTitle: pros.groupTitle || '',
    contentAlignment:
      pros.contentAlignment == 'Vertical'
        ? ContentAlignment.Vertical
        : pros.contentAlignment == 'Horizontal'
        ? ContentAlignment.Horizontal
        : ContentAlignment.Table,
    setting: settings
  }
  const controls = control.controls
  if (controls && controls.length > 0) {
    controls.forEach((con) => {
      const childProps = con.properties
      const setting: Setting = {
        key: childProps.code,
        horizontalAlign:
          childProps.horizontalAlign == 'Center'
            ? HorizontalAlign.Center
            : childProps.horizontalAlign == 'Right'
            ? HorizontalAlign.Right
            : HorizontalAlign.Left,
        verticalAlign:
          childProps.verticalAlign == 'Middle'
            ? VerticalAlign.Middle
            : childProps.verticalAlign == 'Bottom'
            ? VerticalAlign.Bottom
            : VerticalAlign.Top
      }
      settings.push(setting)
    })
  }
  return <JGGroupPanel {...props}>{render(controls)}</JGGroupPanel>
}

export default JGGroupPanel

export {
  ContentAlignment,
  convert,
  HorizontalAlign,
  JGGroupPanel,
  VerticalAlign
}
