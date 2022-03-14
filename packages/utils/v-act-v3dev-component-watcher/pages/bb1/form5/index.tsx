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
    code: 'form5',
    name: '新窗体4',
    desc: '',
    version: '1',
    platformVersion: '3',
    isExtendable: 'false'
  },
  propertys: {
    property: [
      { _: '0, 0, 0, 0', $: { code: 'Padding' } },
      { _: '新窗体4', $: { code: 'Name' } },
      { $: { code: 'RefResources' } },
      { _: 'form5', $: { code: 'Code' } }
    ]
  },
  controls: '',
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
        windowCode: 'form5',
        componentPackMappingDatas: {},
        envirmentContext: {
          optimizeLink: true,
          isEncryptToken: false,
          ExceptionInstanceIden: 'vxl0b2bdLP7aSIRoZJlf1Q__',
          CompatibleMode: true
        },
        inputParam: {
          variable: {
            windowCode: 'form5',
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
