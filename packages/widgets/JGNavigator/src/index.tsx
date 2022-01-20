import { Control } from '@v-act/schema-types'
import {
  toBoolean,
  toNumber,
  valueofHeight,
  valueofWidth
} from '@v-act/widget-utils'

import { JGNavigator, JGNavigatorProps } from './JGNavigator'

const getNavData = function (control: Control) {
  let flat = function (item: any, mergeData: any, labelTitle = 'text') {
    return item.reduce((prev: any, next: any) => {
      let item = { [labelTitle]: next.properties.labelText }
      const events = next.events
      if (labelTitle === 'text' && events && events.length > 0) {
        const eventMap: { [eventCode: string]: Function } = {}
        events.forEach((evt: any) => {
          eventMap[evt.code] = evt.handler
        })
        item.click = eventMap.OnClick
      }
      if (next.controls.length) {
        item.nodes = [...flat(next.controls, [], 'text')]
      }

      prev.push(item)
      return prev
    }, mergeData)
  }
  if (control.controls.length) {
    var reduceData = flat(control.controls, [], 'panelText')
    return reduceData
  }
}

const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element
): JSX.Element {
  const pros = control.properties
  const props: JGNavigatorProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    multiWidth: valueofWidth(pros.multiWidth, '235px'),
    multiHeight: valueofHeight(pros.multiHeight, '26px'),
    width: toNumber(pros.multiWidth) + 'px',
    height: toNumber(pros.multiHeight) + 'px',
    placeholder: pros.placeholder,
    visible: toBoolean(pros.visible, true),
    children: [],
    navData: getNavData(control),
    isMulOpened: toBoolean(pros.isMulOpened, false),
    openPanelOnLoad: toBoolean(pros.openPanelOnLoad, true)
  }
  return <JGNavigator {...props}></JGNavigator>
}

export default JGNavigator

export { convert, JGNavigator }
