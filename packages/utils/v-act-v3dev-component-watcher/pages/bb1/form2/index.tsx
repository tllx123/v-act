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
    code: 'form2',
    name: '新窗体2',
    desc: '',
    version: '1',
    platformVersion: '3',
    isExtendable: 'false'
  },
  propertys: {
    property: [
      { $: { code: 'BackColor' } },
      { _: '0, 0, 0, 0', $: { code: 'Padding' } },
      { _: '新窗体2', $: { code: 'Name' } },
      { $: { code: 'RefResources' } },
      { _: 'form2', $: { code: 'Code' } }
    ]
  },
  controls: {
    control: {
      $: { code: 'JGTabControl1', type: 'JGTabControl' },
      propertys: {
        property: [
          { _: 'JGTabControl1', $: { code: 'Code' } },
          { _: '233', $: { code: 'Height' } },
          { _: '95', $: { code: 'Left' } },
          { _: '233px', $: { code: 'MultiHeight' } },
          { _: '460px', $: { code: 'MultiWidth' } },
          { _: '51.8%', $: { code: 'PercentHeight' } },
          { _: '47.9%', $: { code: 'PercentWidth' } },
          { _: '1', $: { code: 'TabIndex' } },
          { _: '62', $: { code: 'Top' } },
          { _: '460', $: { code: 'Width' } }
        ]
      },
      controls: {
        control: [
          {
            $: { code: 'JGTabPage1', name: '页签1', type: 'JGTabPage' },
            propertys: {
              property: [
                { _: 'JGTabPage1', $: { code: 'Code' } },
                { _: '页签1', $: { code: 'LabelText' } },
                { _: 'content', $: { code: 'MultiHeight' } },
                { _: 'content', $: { code: 'MultiWidth' } },
                { _: '2', $: { code: 'TabIndex' } }
              ]
            },
            controls: {
              control: {
                $: { code: 'JGButton1', name: '按钮1', type: 'JGButton' },
                propertys: {
                  property: [
                    { _: 'JGButton1', $: { code: 'Code' } },
                    { _: '按钮1', $: { code: 'LabelText' } },
                    { _: '58', $: { code: 'Left' } },
                    { _: '26px', $: { code: 'MultiHeight' } },
                    { _: '59px', $: { code: 'MultiWidth' } },
                    { _: '13.5%', $: { code: 'PercentHeight' } },
                    { _: '12.8%', $: { code: 'PercentWidth' } },
                    { _: '0', $: { code: 'TabIndex' } },
                    { _: '74', $: { code: 'Top' } },
                    { _: '59', $: { code: 'Width' } }
                  ]
                },
                controls: '',
                events: {
                  event: {
                    $: { code: 'OnClick', name: '单击事件' },
                    evaluateRule: { $: { code: 'bb1.form2.JGButton1_OnClick' } }
                  }
                },
                dataBindings: { dataBinding: { dataMembers: '' } }
              }
            },
            events: '',
            dataBindings: { dataBinding: { dataMembers: '' } }
          },
          {
            $: { code: 'JGTabPage2', name: '页签2', type: 'JGTabPage' },
            propertys: {
              property: [
                { _: 'JGTabPage2', $: { code: 'Code' } },
                { _: '页签2', $: { code: 'LabelText' } },
                { _: 'content', $: { code: 'MultiHeight' } },
                { _: 'content', $: { code: 'MultiWidth' } },
                { _: '3', $: { code: 'TabIndex' } }
              ]
            },
            controls: {
              control: {
                $: { code: 'JGTextBox1', name: '文本', type: 'JGTextBox' },
                propertys: {
                  property: [
                    { _: 'JGTextBox1', $: { code: 'Code' } },
                    { _: '文本', $: { code: 'LabelText' } },
                    { _: '71', $: { code: 'Left' } },
                    { _: '26px', $: { code: 'MultiHeight' } },
                    { _: '235px', $: { code: 'MultiWidth' } },
                    { _: '13.5%', $: { code: 'PercentHeight' } },
                    { _: '51.1%', $: { code: 'PercentWidth' } },
                    { _: '4', $: { code: 'TabIndex' } },
                    { _: '72', $: { code: 'Top' } }
                  ]
                },
                controls: '',
                events: {
                  event: [
                    {
                      $: { code: 'OnValueChanged', name: '值改变事件' },
                      evaluateRule: ''
                    },
                    {
                      $: { code: 'OnValueLoaded', name: '值加载事件' },
                      evaluateRule: ''
                    },
                    {
                      $: { code: 'OnLabelClick', name: '单击标题' },
                      evaluateRule: ''
                    },
                    {
                      $: { code: 'OnKeyDown', name: '键盘按下' },
                      evaluateRule: ''
                    },
                    {
                      $: { code: 'OnEnter', name: '获取焦点' },
                      evaluateRule: ''
                    },
                    {
                      $: { code: 'OnLeave', name: '失去焦点' },
                      evaluateRule: ''
                    }
                  ]
                },
                dataBindings: {
                  dataBinding: {
                    dataMembers: {
                      dataMember: {
                        $: { name: '字段名称', code: 'ColumnName' }
                      }
                    }
                  }
                }
              }
            },
            events: '',
            dataBindings: { dataBinding: { dataMembers: '' } }
          }
        ]
      },
      events: {
        event: {
          $: { code: 'TabIndexChangedAction', name: '页签切换事件' },
          evaluateRule: ''
        }
      },
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
  logics: {
    logic: {
      $: { type: 'client' },
      ruleSets: {
        ruleSet: {
          $: {
            code: 'JGButton1_OnClick',
            name: '按钮1_单击事件',
            desc: '',
            isExtendable: 'false',
            isRuleChainVisible: 'false'
          },
          ruleRoute: {
            _: [
              {
                tagName: 'evaluateRule',
                attrs: { code: 'BR_ShowMessage1' },
                children: []
              }
            ],
            $: {
              'xmlns:q2': 'http://www.w3.org/2001/XMLSchema',
              'p9:type': 'q2:string',
              'xmlns:p9': 'http://www.w3.org/2001/XMLSchema-instance'
            }
          },
          ruleInstances: {
            ruleInstance: {
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
                '{"showType":"0","time":"3","simpleChinesePrompt":{"msgnote":"\\"asdfasdf\\"","type":"1"}}'
            }
          },
          routeContext: '',
          inputs: '',
          outputs: ''
        }
      },
      ruleInstances: {
        ruleInstance: {
          $: {
            ruleCode: 'ExecuteRuleSet',
            ruleName: '执行方法',
            instanceCode: 'bb1.form2.JGButton1_OnClick',
            instanceName: '执行方法',
            isNeedLog: 'false',
            isEnabled: 'true',
            transactionType: 'none'
          },
          condition: '',
          ruleConfig:
            '{"filter": null,"invokeTarget": {"sourceType": "client-ruleSet","invokeType": "local","componentCode": "bb1","windowCode": "form2","ruleSetCode": "JGButton1_OnClick"},"invokeParams": null,"returnMapping": null}'
        }
      }
    }
  },
  entitys: {
    entity: {
      $: { code: 'ds', name: 'ds', chineseName: '', isExtendable: 'false' },
      entityFields: {
        entityField: [
          {
            $: {
              code: 'id',
              name: 'id',
              chineseName: '',
              type: 'char',
              length: '255',
              precision: '',
              defaultValue: ''
            },
            expression: ''
          },
          {
            $: {
              code: 'a',
              name: 'a',
              chineseName: '',
              type: 'char',
              length: '255',
              precision: '',
              defaultValue: ''
            },
            expression: ''
          },
          {
            $: {
              code: 'b',
              name: 'b',
              chineseName: '',
              type: 'char',
              length: '255',
              precision: '',
              defaultValue: ''
            },
            expression: ''
          }
        ]
      },
      events: { event: { $: { code: 'OnLoaded', name: '实体加载事件' } } }
    }
  },
  dataBindings: { dataBinding: { dataSource: '' } },
  windowVariants: { variables: '', dataTypes: '' },
  windowOutputs: { variables: '', dataTypes: '' },
  expressions: { expression: { $: { content: '"asdfasdf"', type: 'client' } } }
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
        windowCode: 'form2',
        componentPackMappingDatas: {},
        envirmentContext: {
          optimizeLink: true,
          isEncryptToken: false,
          ExceptionInstanceIden: 'vxl0b2bdLP7aSIRoZJlf1Q__',
          CompatibleMode: true
        },
        inputParam: {
          variable: {
            windowCode: 'form2',
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
