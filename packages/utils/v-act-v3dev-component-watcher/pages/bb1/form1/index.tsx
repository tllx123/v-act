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
    code: 'form1',
    name: '新窗体1',
    desc: '',
    version: '1',
    platformVersion: '3',
    isExtendable: 'false'
  },
  propertys: {
    property: [
      { $: { code: 'BackColor' } },
      { _: '0, 0, 0, 0', $: { code: 'Padding' } },
      { _: '新窗体1', $: { code: 'Name' } },
      { $: { code: 'RefResources' } },
      { _: 'form1', $: { code: 'Code' } }
    ]
  },
  controls: {
    control: [
      {
        $: { code: 'JGTreeView1', name: '树', type: 'JGTreeView' },
        propertys: {
          property: [
            { _: 'JGTreeView1', $: { code: 'Code' } },
            { _: '树', $: { code: 'LabelText' } },
            { _: '73', $: { code: 'Left' } },
            { _: '97px', $: { code: 'MultiHeight' } },
            { _: '235px', $: { code: 'MultiWidth' } },
            { _: '21.6%', $: { code: 'PercentHeight' } },
            { _: '24.5%', $: { code: 'PercentWidth' } },
            { _: '9', $: { code: 'TabIndex' } },
            { _: '208', $: { code: 'Top' } }
          ]
        },
        controls: '',
        headerControls: {
          control: {
            $: { code: 'JGToolbar1', type: 'JGToolbar' },
            propertys: { property: { _: 'JGToolbar1', $: { code: 'Code' } } },
            controls: '',
            events: '',
            dataBindings: { dataBinding: { dataMembers: '' } }
          }
        },
        events: {
          event: [
            {
              $: { code: 'OnValueLoaded', name: '值加载事件' },
              evaluateRule: ''
            },
            {
              $: { code: 'OnSelectIndexChanged', name: '记录切换事件' },
              evaluateRule: ''
            },
            { $: { code: 'OnClick', name: '单击事件' }, evaluateRule: '' },
            {
              $: { code: 'NodeCollapseEvent', name: '节点折叠事件' },
              evaluateRule: ''
            },
            {
              $: { code: 'OnDoubleClick', name: '双击事件' },
              evaluateRule: ''
            },
            {
              $: { code: 'NodeExpandEvent', name: '节点展开事件' },
              evaluateRule: ''
            },
            {
              $: { code: 'OnSelectionChanged', name: '记录选择变更' },
              evaluateRule: ''
            }
          ]
        },
        dataBindings: {
          dataBinding: {
            dataSource: 'tree',
            dataMembers: {
              dataMember: [
                { _: 'name', $: { name: '显示字段', code: 'TreeColumnName' } },
                { _: 'PID', $: { name: '父标识字段', code: 'PIDColumn' } },
                {
                  _: 'OrderNo',
                  $: { name: '排序字段', code: 'OrderNoColumn' }
                },
                {
                  _: 'InnerCode',
                  $: { name: '层级码字段', code: 'InnerCodeColumn' }
                },
                {
                  _: 'LeftCode',
                  $: { name: '左码字段', code: 'LeftCodeColumn' }
                },
                {
                  _: 'RightCode',
                  $: { name: '右码字段', code: 'RightCodeColumn' }
                },
                { _: 'IsLeaf', $: { name: '叶子节点字段', code: 'LeafNode' } }
              ]
            }
          }
        }
      },
      {
        $: { code: 'JGGroupPanel1', type: 'JGFormLayout' },
        propertys: {
          property: [
            { _: 'JGGroupPanel1', $: { code: 'Code' } },
            { _: 'Table', $: { code: 'ContentAlignment' } },
            { _: 'JGFormLayout', $: { code: 'GroupType' } },
            { _: '114', $: { code: 'Height' } },
            { _: '628', $: { code: 'Left' } },
            { _: 'content', $: { code: 'MultiHeight' } },
            { _: '245px', $: { code: 'MultiWidth' } },
            { _: '1', $: { code: 'NumCols' } },
            { _: '25.3%', $: { code: 'PercentHeight' } },
            { _: '25.5%', $: { code: 'PercentWidth' } },
            {
              _: '{"Rows":[{"Cols":[{"ControlCode":"JGComboBox2","ColSpan":1,"EndRow":false,"StartRow":false}],"RowHeight":32},{"Cols":[{"ControlCode":"JGComboBox3","ColSpan":1,"EndRow":false,"StartRow":false}],"RowHeight":32},{"Cols":[{"ControlCode":"JGComboBox1","ColSpan":1,"EndRow":false,"StartRow":false}],"RowHeight":32}]}',
              $: { code: 'RowCols' }
            },
            { _: '208', $: { code: 'Top' } },
            { _: '245', $: { code: 'Width' } }
          ]
        },
        controls: {
          control: [
            {
              $: { code: 'JGComboBox2', name: '下拉选择', type: 'JGComboBox' },
              propertys: {
                property: [
                  { _: 'JGComboBox2', $: { code: 'Code' } },
                  { _: '32', $: { code: 'Height' } },
                  { _: '下拉选择', $: { code: 'LabelText' } },
                  { _: 'Right', $: { code: 'LabelTextAlign' } },
                  { _: '1', $: { code: 'Left' } },
                  { _: '32px', $: { code: 'MultiHeight' } },
                  { _: '243px', $: { code: 'MultiWidth' } },
                  { _: '28.1%', $: { code: 'PercentHeight' } },
                  { _: '99.2%', $: { code: 'PercentWidth' } },
                  { _: '7', $: { code: 'TabIndex' } },
                  { _: '1', $: { code: 'Top' } },
                  { _: '243', $: { code: 'Width' } }
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
                  { $: { code: 'OnLeave', name: '失去焦点' }, evaluateRule: '' }
                ]
              },
              dataBindings: {
                dataBinding: {
                  dataMembers: {
                    dataMember: [
                      { $: { name: '标识字段', code: 'IDColumnName' } },
                      { $: { name: '显示字段', code: 'ColumnName' } }
                    ]
                  }
                }
              }
            },
            {
              $: { code: 'JGComboBox3', name: '下拉选择', type: 'JGComboBox' },
              propertys: {
                property: [
                  { _: 'JGComboBox3', $: { code: 'Code' } },
                  { _: '32', $: { code: 'Height' } },
                  { _: '下拉选择', $: { code: 'LabelText' } },
                  { _: 'Right', $: { code: 'LabelTextAlign' } },
                  { _: '1', $: { code: 'Left' } },
                  { _: '32px', $: { code: 'MultiHeight' } },
                  { _: '243px', $: { code: 'MultiWidth' } },
                  { _: '28.1%', $: { code: 'PercentHeight' } },
                  { _: '99.2%', $: { code: 'PercentWidth' } },
                  { _: '8', $: { code: 'TabIndex' } },
                  { _: '41', $: { code: 'Top' } },
                  { _: '243', $: { code: 'Width' } }
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
                  { $: { code: 'OnLeave', name: '失去焦点' }, evaluateRule: '' }
                ]
              },
              dataBindings: {
                dataBinding: {
                  dataMembers: {
                    dataMember: [
                      { $: { name: '标识字段', code: 'IDColumnName' } },
                      { $: { name: '显示字段', code: 'ColumnName' } }
                    ]
                  }
                }
              }
            },
            {
              $: { code: 'JGComboBox1', name: '下拉选择', type: 'JGComboBox' },
              propertys: {
                property: [
                  { _: 'JGComboBox1', $: { code: 'Code' } },
                  {
                    _: '{"DataSourceSetting":{"DataConfig":{"DefaultSaveColumn":null,"DefaultShowColumn":null,"SourceType":null,"SourceID":null,"SourceName":null,"MapTable":null,"SaveColumn":null,"ShowColumn":null,"SortField":null,"SortType":null,"DescColumn":null,"StatusColumn":null,"MaxRecCount":0,"QueryField":null,"QueryMethod":null,"IsPickListFields":false,"ApiOutputVar":null,"ConstData":[{"id":"a","text":"A","selected":"False"},{"id":"b","text":"B","selected":"False"}],"SqlQueryConstData":null,"EntityConstData":null,"Condition":null,"QueryParam":null,"PickListFields":null,"InvokeApiParams":null},"DataSourceType":"CustomConst"}}',
                    $: { code: 'DropDownSource' }
                  },
                  { _: '32', $: { code: 'Height' } },
                  { _: '下拉选择', $: { code: 'LabelText' } },
                  { _: 'Right', $: { code: 'LabelTextAlign' } },
                  { _: '1', $: { code: 'Left' } },
                  { _: '32px', $: { code: 'MultiHeight' } },
                  { _: '243px', $: { code: 'MultiWidth' } },
                  { _: '28.1%', $: { code: 'PercentHeight' } },
                  { _: '99.2%', $: { code: 'PercentWidth' } },
                  { _: '5', $: { code: 'TabIndex' } },
                  { _: '81', $: { code: 'Top' } },
                  { _: '243', $: { code: 'Width' } }
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
                  { $: { code: 'OnLeave', name: '失去焦点' }, evaluateRule: '' }
                ]
              },
              dataBindings: {
                dataBinding: {
                  dataMembers: {
                    dataMember: [
                      { $: { name: '标识字段', code: 'IDColumnName' } },
                      { $: { name: '显示字段', code: 'ColumnName' } }
                    ]
                  }
                }
              }
            }
          ]
        },
        events: '',
        dataBindings: { dataBinding: { dataMembers: '' } }
      },
      {
        $: { code: 'JGTabControl1', type: 'JGTabControl' },
        propertys: {
          property: [
            { _: 'JGTabControl1', $: { code: 'Code' } },
            { _: '288', $: { code: 'Height' } },
            { _: '108', $: { code: 'Left' } },
            { _: '288px', $: { code: 'MultiHeight' } },
            { _: '361px', $: { code: 'MultiWidth' } },
            { _: '64%', $: { code: 'PercentHeight' } },
            { _: '37.6%', $: { code: 'PercentWidth' } },
            { _: '1', $: { code: 'TabIndex' } },
            { _: '63', $: { code: 'Top' } },
            { _: '361', $: { code: 'Width' } }
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
                      { _: '57', $: { code: 'Left' } },
                      { _: '26px', $: { code: 'MultiHeight' } },
                      { _: '59px', $: { code: 'MultiWidth' } },
                      { _: '10.5%', $: { code: 'PercentHeight' } },
                      { _: '16.3%', $: { code: 'PercentWidth' } },
                      { _: '0', $: { code: 'TabIndex' } },
                      { _: '55', $: { code: 'Top' } },
                      { _: '59', $: { code: 'Width' } }
                    ]
                  },
                  controls: '',
                  events: {
                    event: {
                      $: { code: 'OnClick', name: '单击事件' },
                      evaluateRule: {
                        $: { code: 'bb1.form1.JGButton1_OnClick' }
                      }
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
                  $: { code: 'JGButton2', name: '按钮2', type: 'JGButton' },
                  propertys: {
                    property: [
                      { _: 'JGButton2', $: { code: 'Code' } },
                      { _: '按钮2', $: { code: 'LabelText' } },
                      { _: '46', $: { code: 'Left' } },
                      { _: '26px', $: { code: 'MultiHeight' } },
                      { _: '59px', $: { code: 'MultiWidth' } },
                      { _: '10.5%', $: { code: 'PercentHeight' } },
                      { _: '16.3%', $: { code: 'PercentWidth' } },
                      { _: '4', $: { code: 'TabIndex' } },
                      { _: '55', $: { code: 'Top' } },
                      { _: '59', $: { code: 'Width' } }
                    ]
                  },
                  controls: '',
                  events: {
                    event: {
                      $: { code: 'OnClick', name: '单击事件' },
                      evaluateRule: ''
                    }
                  },
                  dataBindings: { dataBinding: { dataMembers: '' } }
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
    ]
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
                        attrs: { code: 'BR_ShowMessage2' },
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
                        attrs: { code: 'BR_ShowMessage3' },
                        children: []
                      }
                    ]
                  }
                ]
              },
              {
                tagName: 'foreach',
                attrs: {},
                children: [
                  {
                    tagName: 'define',
                    attrs: {},
                    children: [
                      { tagName: 'varCode', attrs: {}, children: ['var1'] },
                      {
                        tagName: 'entityType',
                        attrs: {},
                        children: ['window']
                      },
                      { tagName: 'entityCode', attrs: {}, children: ['ds'] }
                    ]
                  },
                  {
                    tagName: 'sequence',
                    attrs: {},
                    children: [
                      {
                        tagName: 'evaluateRule',
                        attrs: { code: 'BR_ShowMessage4' },
                        children: []
                      }
                    ]
                  }
                ]
              },
              {
                tagName: 'evaluateRule',
                attrs: { code: 'BR_ShowMessage5' },
                children: []
              }
            ],
            $: {
              'xmlns:q1': 'http://www.w3.org/2001/XMLSchema',
              'p9:type': 'q1:string',
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
                  '{"showType":"0","time":"3","simpleChinesePrompt":{"msgnote":"\\"asdfadsf\\"","type":"1"}}'
              },
              {
                $: {
                  ruleCode: 'ShowMessage',
                  ruleName: '显示设置的提示信息',
                  instanceCode: 'BR_ShowMessage5',
                  instanceName: '显示设置的提示信息_4',
                  isNeedLog: 'False',
                  isEnabled: 'True',
                  transactionType: 'none'
                },
                condition: '',
                ruleConfig:
                  '{"showType":"0","time":"3","simpleChinesePrompt":{"msgnote":"\\"asdf\\"","type":"1"}}'
              },
              {
                $: {
                  ruleCode: 'ShowMessage',
                  ruleName: '显示设置的提示信息',
                  instanceCode: 'BR_ShowMessage4',
                  instanceName: '显示设置的提示信息_3',
                  isNeedLog: 'False',
                  isEnabled: 'True',
                  transactionType: 'none'
                },
                condition: '',
                ruleConfig:
                  '{"showType":"0","time":"3","simpleChinesePrompt":{"msgnote":"\\"asdf \\"","type":"1"}}'
              },
              {
                $: {
                  ruleCode: 'ShowMessage',
                  ruleName: '显示设置的提示信息',
                  instanceCode: 'BR_ShowMessage3',
                  instanceName: '显示设置的提示信息_2',
                  isNeedLog: 'False',
                  isEnabled: 'True',
                  transactionType: 'none'
                },
                condition: '',
                ruleConfig:
                  '{"showType":"0","time":"3","simpleChinesePrompt":{"msgnote":"\\"aaasdf\\"","type":"1"}}'
              },
              {
                $: {
                  ruleCode: 'ShowMessage',
                  ruleName: '显示设置的提示信息',
                  instanceCode: 'BR_ShowMessage2',
                  instanceName: '显示设置的提示信息_1',
                  isNeedLog: 'False',
                  isEnabled: 'True',
                  transactionType: 'none'
                },
                condition: '',
                ruleConfig:
                  '{"showType":"0","time":"3","simpleChinesePrompt":{"msgnote":"\\"asdfasdf\\"","type":"1"}}'
              }
            ]
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
            instanceCode: 'bb1.form1.JGButton1_OnClick',
            instanceName: '执行方法',
            isNeedLog: 'false',
            isEnabled: 'true',
            transactionType: 'none'
          },
          condition: '',
          ruleConfig:
            '{"filter": null,"invokeTarget": {"sourceType": "client-ruleSet","invokeType": "local","componentCode": "bb1","windowCode": "form1","ruleSetCode": "JGButton1_OnClick"},"invokeParams": null,"returnMapping": null}'
        }
      }
    }
  },
  entitys: {
    entity: [
      {
        $: {
          code: 'ds',
          name: 'ds',
          chineseName: 'ds1',
          isExtendable: 'false'
        },
        entityFields: {
          entityField: [
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
            },
            {
              $: {
                code: 'c',
                name: 'c',
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
      },
      {
        $: {
          code: 'tree',
          name: 'tree',
          chineseName: '',
          isExtendable: 'false'
        },
        entityFields: {
          entityField: [
            {
              $: {
                code: 'PID',
                name: 'PID',
                chineseName: '父记录字段',
                type: 'char',
                length: '255',
                precision: '',
                defaultValue: ''
              },
              expression: ''
            },
            {
              $: {
                code: 'OrderNo',
                name: 'OrderNo',
                chineseName: '排序字段',
                type: 'integer',
                length: '50',
                precision: '',
                defaultValue: ''
              },
              expression: ''
            },
            {
              $: {
                code: 'InnerCode',
                name: 'InnerCode',
                chineseName: '层级码字段',
                type: 'char',
                length: '255',
                precision: '',
                defaultValue: ''
              },
              expression: ''
            },
            {
              $: {
                code: 'IsLeaf',
                name: 'IsLeaf',
                chineseName: '叶子节点字段',
                type: 'boolean',
                length: '',
                precision: '',
                defaultValue: ''
              },
              expression: ''
            },
            {
              $: {
                code: 'name',
                name: 'name',
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
    ]
  },
  dataBindings: { dataBinding: { dataSource: '' } },
  windowVariants: { variables: '', dataTypes: '' },
  windowOutputs: { variables: '', dataTypes: '' },
  expressions: {
    expression: [
      { $: { content: 'True', type: 'client' } },
      { $: { content: '"asdfadsf"', type: 'client' } },
      { $: { content: '"asdf"', type: 'client' } },
      { $: { content: '"asdf "', type: 'client' } },
      { $: { content: '"aaasdf"', type: 'client' } },
      { $: { content: '"asdfasdf"', type: 'client' } }
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
        windowCode: 'form1',
        componentPackMappingDatas: {},
        envirmentContext: {
          optimizeLink: true,
          isEncryptToken: false,
          ExceptionInstanceIden: 'vxl0b2bdLP7aSIRoZJlf1Q__',
          CompatibleMode: true
        },
        inputParam: {
          variable: {
            windowCode: 'form1',
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
