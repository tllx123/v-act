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
    type: '2',
    code: 'form4',
    name: '自定义窗体',
    desc: '',
    version: '',
    platformVersion: '3',
    isExtendable: 'false'
  },
  propertys: {
    property: [
      { _: '375', $: { code: 'Width' } },
      { _: '667', $: { code: 'Height' } },
      { _: 'StaticHeight', $: { code: 'HeightSet' } },
      { _: 'None', $: { code: 'LayoutType' } },
      { $: { code: 'BackColor' } },
      { _: '自定义窗体', $: { code: 'Name' } },
      { $: { code: 'CustomGridValue' } },
      { $: { code: 'ImageValue' } },
      { _: 'contain', $: { code: 'ImagePosition' } },
      { _: 'Center Center', $: { code: 'ContentAlignment' } },
      { _: 'None', $: { code: 'TileStyle' } },
      { _: 'True', $: { code: 'IsScrollFollow' } },
      { _: '{"Effect":"None"}', $: { code: 'Animation' } },
      {
        _: '{"Effect":"HorizontalSlip","Delay":"0"}',
        $: { code: 'AnimationIn' }
      },
      {
        _: '{"Effect":"HorizontalSlip","Delay":"0"}',
        $: { code: 'AnimationOut' }
      },
      {
        _: '["vendor.lib.js","form4.lib.js","form4.lib.css"]',
        $: { code: 'RefResources' }
      },
      { _: 'form4', $: { code: 'Code' } }
    ]
  },
  controls: {
    control: {
      $: { code: 'JGMDiv1', name: '自定义Div', type: 'JGMDiv' },
      propertys: {
        property: [
          { _: '自定义Div', $: { code: 'Alias' } },
          { _: 'Top, Bottom, Left, Right', $: { code: 'Anchor' } },
          { _: 'False', $: { code: 'AutoHeight' } },
          { _: '0', $: { code: 'Bottom' } },
          { _: 'JGMDiv1', $: { code: 'Code' } },
          { $: { code: 'DisplayScale' } },
          { _: '667', $: { code: 'Height' } },
          { _: 'mathParent', $: { code: 'LayoutWidth' } },
          { _: '0', $: { code: 'Left' } },
          { _: 'Simple', $: { code: 'Mode' } },
          { _: '100%', $: { code: 'PercentHeight' } },
          { _: '100%', $: { code: 'PercentWidth' } },
          { _: '0', $: { code: 'Right' } },
          { _: '0, 0, 0, 0', $: { code: 'Spacing' } },
          { _: '0', $: { code: 'Top' } },
          { _: 'True', $: { code: 'Visible' } },
          {
            _: '{"Html":"","Entities":"","JavaScript":"","Css":"","Events":"","EventCodes":null,"Others":null,"ModuleJavaScript":"","ModuleCss":"","TagNames":["vui-container"],"widgets":[{"code":"JGDiv1_vuicontainer1","name":null,"props":{}}],"config":{"mode":"v3-compatible-mode"},"vjsList":[{"name":"vjs.framework.extension.platform.custom.resource.v3-vdk","version":"1.2.0.SNAPSHOT","symbolicName":"com.toone.v3.platform-vjs.framework.extension.platform.custom.resource.v3-vdk"}],"i18n":null,"skin":null,"skinVars":null}',
            $: { code: 'WidgetTemplate' }
          },
          { _: '375', $: { code: 'Width' } },
          { _: '0', $: { code: 'ZIndex' } }
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
      { $: { code: 'FormCloseAction', name: '窗体关闭事件' }, evaluateRule: '' }
    ]
  },
  logics: {
    logic: {
      $: { type: 'client' },
      ruleSets: {
        ruleSet: {
          $: {
            code: 'test',
            name: '',
            desc: '',
            isExtendable: 'false',
            isRuleChainVisible: 'false'
          },
          ruleRoute: {
            _: [
              {
                tagName: 'evaluateRule',
                attrs: { code: 'BR_ShowMessage1' },
                children: [
                  {
                    tagName: 'callback',
                    attrs: {},
                    children: [
                      {
                        tagName: 'evaluateRule',
                        attrs: { code: 'BR_ShowMessage1_1' },
                        children: []
                      }
                    ]
                  }
                ]
              },
              {
                tagName: 'if',
                attrs: {},
                children: [
                  {
                    tagName: 'define',
                    attrs: {},
                    children: [
                      { tagName: 'expression', attrs: {}, children: ['True'] }
                    ]
                  },
                  {
                    tagName: 'sequence',
                    attrs: {},
                    children: [
                      {
                        tagName: 'evaluateRule',
                        attrs: { code: 'BR_ShowMessage1_2' },
                        children: []
                      }
                    ]
                  }
                ]
              },
              {
                tagName: 'else',
                attrs: {},
                children: [
                  {
                    tagName: 'sequence',
                    attrs: {},
                    children: [
                      {
                        tagName: 'evaluateRule',
                        attrs: { code: 'BR_ShowMessage1_3' },
                        children: []
                      },
                      {
                        tagName: 'foreach',
                        attrs: {},
                        children: [
                          {
                            tagName: 'define',
                            attrs: {},
                            children: [
                              {
                                tagName: 'varCode',
                                attrs: {},
                                children: ['var']
                              },
                              {
                                tagName: 'entityType',
                                attrs: {},
                                children: ['ruleSetInput']
                              },
                              {
                                tagName: 'entityCode',
                                attrs: {},
                                children: ['ds']
                              }
                            ]
                          },
                          {
                            tagName: 'sequence',
                            attrs: {},
                            children: [
                              {
                                tagName: 'evaluateRule',
                                attrs: { code: 'BR_ShowMessage1_3_1' },
                                children: []
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ],
            $: {
              'xmlns:q3': 'http://www.w3.org/2001/XMLSchema',
              'p9:type': 'q3:string',
              'xmlns:p9': 'http://www.w3.org/2001/XMLSchema-instance'
            }
          },
          ruleInstances: {
            ruleInstance: [
              {
                $: {
                  ruleCode: 'ShowMessage',
                  ruleName: '显示设置的提示信息',
                  instanceCode: 'BR_ShowMessage1',
                  instanceName: '显示设置的提示信息',
                  isNeedLog: 'False',
                  isEnabled: 'True',
                  transactionType: 'none'
                },
                condition: '',
                ruleConfig:
                  '{"showType":"0","time":"3","simpleChinesePrompt":{"msgnote":"\\"阿斯蒂芬\\"","type":"1"}}'
              },
              {
                $: {
                  ruleCode: 'ShowMessage',
                  ruleName: '显示设置的提示信息',
                  instanceCode: 'BR_ShowMessage1_3_1',
                  instanceName: '显示设置的提示信息_3_1',
                  isNeedLog: 'False',
                  isEnabled: 'True',
                  transactionType: 'none'
                },
                condition: '',
                ruleConfig:
                  '{"showType":"0","time":"3","simpleChinesePrompt":{"msgnote":"\\"阿斯蒂芬\\"","type":"1"}}'
              },
              {
                $: {
                  ruleCode: 'ShowMessage',
                  ruleName: '显示设置的提示信息',
                  instanceCode: 'BR_ShowMessage1_3',
                  instanceName: '显示设置的提示信息_3',
                  isNeedLog: 'False',
                  isEnabled: 'True',
                  transactionType: 'none'
                },
                condition: '',
                ruleConfig:
                  '{"showType":"0","time":"3","simpleChinesePrompt":{"msgnote":"\\"阿斯蒂芬\\"","type":"1"}}'
              },
              {
                $: {
                  ruleCode: 'ShowMessage',
                  ruleName: '显示设置的提示信息',
                  instanceCode: 'BR_ShowMessage1_1',
                  instanceName: '显示设置的提示信息_1',
                  isNeedLog: 'False',
                  isEnabled: 'True',
                  transactionType: 'none'
                },
                condition: '',
                ruleConfig:
                  '{"showType":"0","time":"3","simpleChinesePrompt":{"msgnote":"\\"阿斯蒂芬\\"","type":"1"}}'
              },
              {
                $: {
                  ruleCode: 'ShowMessage',
                  ruleName: '显示设置的提示信息',
                  instanceCode: 'BR_ShowMessage1_2',
                  instanceName: '显示设置的提示信息_2',
                  isNeedLog: 'False',
                  isEnabled: 'True',
                  transactionType: 'none'
                },
                condition: '',
                ruleConfig:
                  '{"showType":"0","time":"3","simpleChinesePrompt":{"msgnote":"\\"阿斯蒂芬\\"","type":"1"}}'
              }
            ]
          },
          routeContext: '',
          inputs: {
            variables: {
              variable: {
                $: {
                  code: 'ds',
                  name: '',
                  type: 'entity',
                  initValue: '',
                  enumValue: '',
                  desc: ''
                }
              }
            },
            dataTypes: {
              dataType: {
                $: { code: 'ds' },
                element: [
                  {
                    $: {
                      code: 'a',
                      name: '',
                      type: 'char',
                      initValue: '',
                      enumValue: '',
                      length: '255',
                      precision: '0',
                      desc: ''
                    }
                  },
                  {
                    $: {
                      code: 'b',
                      name: '',
                      type: 'char',
                      initValue: '',
                      enumValue: '',
                      length: '255',
                      precision: '0',
                      desc: ''
                    }
                  }
                ]
              }
            }
          },
          outputs: ''
        }
      }
    }
  },
  dataBindings: { dataBinding: { dataSource: '' } },
  windowVariants: { variables: '', dataTypes: '' },
  windowOutputs: { variables: '', dataTypes: '' },
  expressions: {
    expression: [
      { $: { content: 'True', type: 'client' } },
      { $: { content: '"阿斯蒂芬"', type: 'client' } }
    ]
  }
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
        windowCode: 'form4',
        componentPackMappingDatas: {},
        envirmentContext: {
          optimizeLink: true,
          isEncryptToken: false,
          ExceptionInstanceIden: 'vxl0b2bdLP7aSIRoZJlf1Q__',
          CompatibleMode: true
        },
        inputParam: {
          variable: {
            windowCode: 'form4',
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
