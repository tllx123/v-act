import { createElement, Fragment } from 'react'

import { Control, Window } from '@v-act/vdev'
import { convertWindowSchema } from '@v-act/widget-utils'

import {
  JGTabControl,
  convert as convertJGTabControl
} from '@v-act/jgtabcontrol'
import { JGSteps, convert as convertJGSteps } from '@v-act/jgsteps'
import {
  JGRecordPaging,
  convert as convertJGRecordPaging
} from '@v-act/jgrecordpaging'
import { JGImage, convert as convertJGImage } from '@v-act/jgimage'
import { JGLabel, convert as convertJGLabel } from '@v-act/jglabel'
import { JGButton, convert as convertJGButton } from '@v-act/jgbutton'

const __window: Window = {
  type: 'component',
  code: 'form9679228fae924591b3ec1c0c343ba7a0',
  name: 'home',
  desc: '',
  controls: [
    {
      code: 'JGTabControl2',
      type: 'JGTabControl',
      controls: [
        {
          code: 'JGTabPage3',
          name: '业务控件',
          type: 'JGTabPage',
          controls: [
            {
              code: 'JGSteps7',
              type: 'JGSteps',
              controls: [],
              properties: {
                code: 'JGSteps7',
                height: 64,
                left: 86,
                multiHeight: '64px',
                multiWidth: '330px',
                percentHeight: '15.6%',
                percentWidth: '34.4%',
                stepDownSource:
                  '{"DataSourceSetting":{"DataConfig":{"DefaultSaveColumn":null,"DefaultShowColumn":null,"SourceType":"Entity","SourceID":"JGSteps7","SourceName":"JGSteps7","MapTable":null,"SaveColumn":"SaveColumn","ShowColumn":"ShowColumn","SortField":null,"SortType":null,"DescColumn":"DescColumn","StatusColumn":"StatusColumn","MaxRecCount":0,"QueryField":null,"QueryMethod":null,"IsPickListFields":false,"ApiOutputVar":null,"ConstData":null,"SqlQueryConstData":null,"EntityConstData":null,"Condition":null,"QueryParam":null,"PickListFields":null,"InvokeApiParams":null},"DataSourceType":"Entity"}}',
                tabIndex: 5,
                top: 115
              }
            },
            {
              code: 'JGRecordPaging6',
              name: '记录导航',
              type: 'JGRecordPaging',
              controls: [],
              properties: {
                code: 'JGRecordPaging6',
                labelText: '记录导航',
                left: 43,
                multiHeight: '25px',
                multiWidth: '222px',
                percentHeight: '6.1%',
                percentWidth: '23.1%',
                tabIndex: 4,
                top: 84
              }
            }
          ],
          properties: {
            code: 'JGTabPage3',
            labelText: '业务控件',
            multiHeight: 'content',
            multiWidth: 'content',
            tabIndex: 1
          }
        },
        {
          code: 'JGTabPage4',
          name: '字段控件',
          type: 'JGTabPage',
          controls: [],
          properties: {
            code: 'JGTabPage4',
            labelText: '字段控件',
            multiHeight: 'content',
            multiWidth: 'content',
            tabIndex: 2
          }
        },
        {
          code: 'JGTabPage5',
          name: '通用控件',
          type: 'JGTabPage',
          controls: [
            {
              code: 'JGImage10',
              type: 'JGImage',
              controls: [],
              properties: {
                code: 'JGImage10',
                columnName: 'JGImage10',
                left: 3,
                multiHeight: '100px',
                multiWidth: '100px',
                percentHeight: '24.4%',
                percentWidth: '10.4%',
                tabIndex: 8,
                top: 71
              }
            },
            {
              code: 'JGLabel9',
              name: '标签',
              type: 'JGLabel',
              controls: [],
              properties: {
                code: 'JGLabel9',
                labelText: '标签',
                left: 3,
                multiHeight: '24px',
                multiWidth: '68px',
                percentHeight: '5.9%',
                percentWidth: '7.1%',
                top: 41
              }
            },
            {
              code: 'JGButton8',
              name: '按钮1',
              type: 'JGButton',
              controls: [],
              properties: {
                code: 'JGButton8',
                height: 32,
                labelText: '按钮1',
                left: 3,
                multiHeight: '32px',
                multiWidth: '59px',
                percentHeight: '7.8%',
                percentWidth: '6.1%',
                tabIndex: 6,
                top: 3,
                width: 59
              }
            }
          ],
          properties: {
            code: 'JGTabPage5',
            labelText: '通用控件',
            multiHeight: 'content',
            multiWidth: 'content',
            tabIndex: 3
          }
        }
      ],
      properties: {
        code: 'JGTabControl2',
        dock: 'Fill',
        height: 450,
        multiHeight: 'space',
        multiWidth: 'space',
        percentHeight: '100%',
        percentWidth: '100%',
        width: 960
      }
    }
  ],
  properties: {
    padding: '0, 0, 0, 0',
    name: 'home',
    code: 'form9679228fae924591b3ec1c0c343ba7a0'
  },
  _dependencies: [
    'JGTabControl',
    'JGSteps',
    'JGRecordPaging',
    'JGImage',
    'JGLabel',
    'JGButton'
  ]
}

const __controls = {
  JGTabControl: { control: JGTabControl, convert: convertJGTabControl },
  JGSteps: { control: JGSteps, convert: convertJGSteps },
  JGRecordPaging: { control: JGRecordPaging, convert: convertJGRecordPaging },
  JGImage: { control: JGImage, convert: convertJGImage },
  JGLabel: { control: JGLabel, convert: convertJGLabel },
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
