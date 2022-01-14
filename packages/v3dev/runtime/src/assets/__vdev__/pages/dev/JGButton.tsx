import { createElement, Fragment } from 'react'

import { Control, Window } from '@v-act/vdev'
import { convertWindowSchema } from '@v-act/widget-utils'

import { JGButton, convert as convertJGButton } from '@v-act/jgbutton'

const __window: Window = {
  type: 'component',
  code: 'JGButton',
  name: 'JGButton',
  desc: '',
  controls: [
    {
      code: 'JGButton11',
      name: '按钮1',
      type: 'JGButton',
      controls: [],
      properties: {
        code: 'JGButton11',
        height: 62,
        labelText: '按钮1',
        left: 147,
        multiHeight: '62px',
        multiWidth: '102px',
        percentHeight: '13.8%',
        percentWidth: '10.6%',
        top: 185,
        width: 102
      }
    },
    {
      code: 'JGButton1',
      name: '按钮1',
      type: 'JGButton',
      controls: [],
      properties: {
        code: 'JGButton1',
        labelText: '按钮1',
        left: 147,
        multiHeight: '26px',
        multiWidth: '59px',
        percentHeight: '5.8%',
        percentWidth: '6.1%',
        top: 153,
        width: 59
      }
    }
  ],
  properties: { padding: '0, 0, 0, 0', name: 'JGButton', code: 'JGButton' },
  _dependencies: ['JGButton']
}

const __controls = {
  JGButton: { control: JGButton, convert: convertJGButton }
}

const __render = (controls: Control[]) => {
  const stackInfo = useStackInfo()

  return controls.map((control) => (
    <Fragment key={control.properties.code}>
      {convertWindowSchema(__window, __controls, __converters, null as any)}
    </Fragment>
  ))
}

const __page = () => __render(__window.controls)

export default __page
