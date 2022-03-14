import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import useStackInfo from '../../../src/components/usePageStackInfo'
import { parse } from '../../../src/componentdefs/bb1'
import { parseWindowSchema } from '@v-act/window-schema-utils'
const JGComponent1 = dynamic(() => {
  return import('@v-act/jgcomponent').then((mod) => mod.JsonJGComponent)
})
const JGSpacer1 = dynamic(() => {
  return import('@v-act/jgspacer').then((mod) => mod.JsonJGSpacer)
})
const JGGroupPanel1 = dynamic(() => {
  return import('@v-act/jggrouppanel').then((mod) => mod.JsonJGGroupPanel)
})
const JGContext1 = dynamic(() => {
  return import('@v-act/jgcontext').then((mod) => mod.JsonJGContext)
})
const JGButtonGroup1 = dynamic(() => {
  return import('@v-act/jgbuttongroup').then((mod) => mod.JsonJGButtonGroup)
})
const JGCollapse1 = dynamic(() => {
  return import('@v-act/jgcollapse').then((mod) => mod.JsonJGCollapse)
})

const widgetDefines: {
  [widgetType: string]: {
    defaultProps?:
      | {
          [pro: string]: any
        }
      | undefined
  }
} = {}
widgetDefines.JGSpacer = JGSpacer1
widgetDefines.JGGroupPanel = JGGroupPanel1
widgetDefines.JGComponent = JGComponent1
widgetDefines.JGContext = JGContext1
widgetDefines.JGButtonGroup = JGButtonGroup1
widgetDefines.JGCollapse = JGCollapse1

const windowObjs = {
  $: {
    type: '1',
    code: 'form3',
    name: '新窗体3',
    desc: '',
    version: '1',
    platformVersion: '3',
    isExtendable: 'false'
  },
  propertys: {
    property: [
      { $: { code: 'BackColor' } },
      { _: '0, 0, 0, 0', $: { code: 'Padding' } },
      { _: '新窗体3', $: { code: 'Name' } },
      { $: { code: 'RefResources' } },
      { _: 'form3', $: { code: 'Code' } }
    ]
  },
  controls: {
    control: {
      $: { code: 'JGReport1', type: 'JGReport' },
      propertys: {
        property: [
          { _: 'JGReport1', $: { code: 'Code' } },
          { _: '301', $: { code: 'Height' } },
          { _: '48', $: { code: 'Left' } },
          { _: '301px', $: { code: 'MultiHeight' } },
          { _: '784px', $: { code: 'MultiWidth' } },
          { _: '66.9%', $: { code: 'PercentHeight' } },
          { _: '81.7%', $: { code: 'PercentWidth' } },
          { _: '0', $: { code: 'TabIndex' } },
          { _: '66', $: { code: 'Top' } },
          { _: '784', $: { code: 'Width' } }
        ]
      },
      controls: '',
      events: '',
      dataBindings: { dataBinding: { dataMembers: '' } }
    }
  },
  events: {
    event: [
      { $: { code: 'FormLoadAction', name: '窗体加载事件' }, evaluateRule: '' },
      {
        $: { code: 'ResizeAction', name: '窗体大小改变事件' },
        evaluateRule: ''
      },
      {
        $: { code: 'FormCloseAction', name: '窗体关闭后事件' },
        evaluateRule: ''
      },
      {
        $: { code: 'FormClosingAction', name: '窗体关闭前事件' },
        evaluateRule: ''
      }
    ]
  },
  logics: '',
  dataBindings: { dataBinding: { dataSource: '' } },
  windowVariants: { variables: '', dataTypes: '' },
  windowOutputs: { variables: '', dataTypes: '' },
  expressions: ''
}

function Index() {
  parse()
  const router = useRouter()
  const stackInfo = useStackInfo()
  useEffect(async () => {
    try {
      debugger
      const viewLib = (
        await import(
          '@v-act/vjs.framework.extension.publish.window.render.smartclient.viewlib'
        )
      ).ViewLib
      viewLib.init({
        paramCfg: {
          skinType: 'default',
          runningMode: 'test',
          debug: false,
          debugPort: '',
          devId: '',
          contextPath: '',
          refComponents: {},
          showChromePlugin: false
        },
        languageCode: '',
        componentCode: 'bb1',
        windowCode: 'form3',
        componentPackMappingDatas: {},
        envirmentContext: {
          optimizeLink: true,
          isEncryptToken: false,
          ExceptionInstanceIden: 'vxl0b2bdLP7aSIRoZJlf1Q__',
          CompatibleMode: true
        },
        inputParam: {
          variable: {
            windowCode: 'form3',
            componentCode: 'bb1',
            workspaceKey: ''
          }
        },
        winDatas: windowObjs
      })
    } catch (e) {
      console.error(e)
    }
  })
  return (
    <React.Fragment>
      {parseWindowSchema('bb1', windowObjs, widgetDefines, {
        router,
        stackInfo
      })}
    </React.Fragment>
  )
}

export default Index
