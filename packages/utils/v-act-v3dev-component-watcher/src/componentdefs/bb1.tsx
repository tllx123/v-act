import { parse as parseComponent } from '@v-act/component-schema-utils'
const componentSchema = {
  $: { code: 'bb1', name: 'bb1', desc: '', matchVersion: '0' },
  logics: {
    logic: {
      $: { type: 'server' },
      ruleSets: {
        ruleSet: {
          $: {
            code: 'kkkk',
            name: 'kkk',
            desc: 'kk',
            nameSpace: '',
            transactionType: 'transaction',
            isExtendable: 'false',
            isRuleChainVisible: 'false'
          },
          ruleRoute: {
            _: '<Root />',
            $: {
              'xmlns:q4': 'http://www.w3.org/2001/XMLSchema',
              'p7:type': 'q4:string',
              'xmlns:p7': 'http://www.w3.org/2001/XMLSchema-instance'
            }
          },
          ruleInstances: '',
          routeContext: '',
          inputs: {
            variables: {
              variable: {
                $: {
                  code: 'a',
                  name: '',
                  type: 'char',
                  initValue: '',
                  enumValue: '',
                  length: '255',
                  desc: ''
                }
              }
            },
            dataTypes: ''
          },
          outputs: {
            variables: {
              variable: {
                $: {
                  code: 'gg',
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
                $: { code: 'gg' },
                element: [
                  {
                    $: {
                      code: 'dh',
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
                      code: 'dh1',
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
          }
        }
      }
    }
  },
  models: {
    model: {
      $: {
        name: 'ds',
        isDeleted: 'false',
        code: 'f7b90fe9f59640858a68dc845bfd9b33',
        desc: '',
        chineseName: ''
      },
      fields: {
        field: [
          {
            $: {
              type: 'char',
              precision: '0',
              fieldName: 'id',
              length: '128',
              code: 'Column_id',
              desc: '',
              defaultvalue: '',
              name: '',
              isNType: 'false',
              isNotNull: 'true'
            }
          },
          {
            $: {
              type: 'date',
              precision: '0',
              fieldName: 'a',
              length: '50',
              code: '8b629bf5d79c4684b974485d91f0cee6',
              desc: '',
              defaultvalue: '',
              name: '',
              isNType: 'false'
            }
          },
          {
            $: {
              type: 'char',
              precision: '0',
              fieldName: 'b',
              length: '255',
              code: '9d9cfbcf55974d4583f174e9686a4b07',
              desc: '',
              defaultvalue: '',
              name: '',
              isNType: 'false'
            }
          },
          {
            $: {
              type: 'char',
              precision: '0',
              fieldName: 'c',
              length: '255',
              code: 'e249105b54e84149b006f1ae554af28c',
              desc: '',
              defaultvalue: '',
              name: '',
              isNType: 'false'
            }
          }
        ]
      },
      indexes: {
        index: {
          $: { name: 'PK_1373340758', isUnique: 'false', isPrimaryKey: 'true' },
          indexFields: {
            indexField: {
              $: { isAsc: 'true', indexOrder: '0', fieldName: 'id' }
            }
          }
        }
      },
      records: ''
    }
  },
  variants: '',
  options: '',
  querys: '',
  resourcePackages: '',
  expressions: '',
  metaInfos: { metaInfo: { $: { type: 'model' }, modelMetas: '' } },
  menuItems: '',
  resources: {
    resource: [
      {
        $: {
          type: 'other',
          fullName: 'form4.lib.js',
          fileCode: 'form4.lib.js',
          isDeleted: 'false',
          hashCode: '88F91C0959ABD35EC8F6815E03A957A444E4A8BA'
        },
        content: 'resource/bb1_form4.lib.js'
      },
      {
        $: {
          type: 'other',
          fullName: 'vendor.lib.js',
          fileCode: 'vendor.lib.js',
          isDeleted: 'false',
          hashCode: 'F4B5C9CC9D134DEBA1B337420EC75AC4B2707E58'
        },
        content: 'resource/bb1_vendor.lib.js'
      },
      {
        $: {
          type: 'other',
          fullName: 'form4.lib.js',
          fileCode: 'form4.lib.js',
          isDeleted: 'false',
          hashCode: '88F91C0959ABD35EC8F6815E03A957A444E4A8BA'
        },
        content: 'resource/bb1_form4.lib.js'
      },
      {
        $: {
          type: 'other',
          fullName: 'vendor.lib.js',
          fileCode: 'vendor.lib.js',
          isDeleted: 'false',
          hashCode: 'F4B5C9CC9D134DEBA1B337420EC75AC4B2707E58'
        },
        content: 'resource/bb1_vendor.lib.js'
      }
    ]
  },
  manifest: {
    'bundle-info': {
      'symbolic-name': 'bb1',
      'bundle-name': 'bb1',
      'bundle-version': '1.0.0',
      'bundle-type': 'RuntimeSchema',
      'provider': 'xiedh',
      'description': '',
      'lastModified': '1646732239000',
      'outTableInitDatas': 'false'
    },
    'interface': { apis: '', spis: '' },
    'dependencies': '',
    'imports': {
      import: [
        {
          $: {
            componentCode: 'com.toone.v3.platform-widget-smartclient-JGButton',
            componentName: '按钮'
          }
        },
        {
          $: {
            componentCode:
              'com.toone.v3.platform-widget-smartclient-JGComboBox',
            componentName: '下拉选择'
          }
        },
        {
          $: {
            componentCode:
              'com.toone.v3.platform-widget-smartclient-JGTabControl',
            componentName: '页签'
          }
        },
        {
          $: {
            componentCode: 'com.toone.v3.platform-widget-smartclient-JGReport',
            componentName: '报表'
          }
        },
        {
          $: {
            componentCode: 'com.toone.v3.platform-widget-smartclient-JGTextBox',
            componentName: '文本'
          }
        },
        {
          $: {
            componentCode:
              'com.toone.v3.platform-widget-smartclient-JGTreeView',
            componentName: '树'
          }
        },
        {
          $: {
            componentCode: 'com.toone.v3.platform-Webrule_ShowMessage',
            componentName: '显示设置的提示信息'
          }
        },
        {
          $: {
            componentCode: 'com.toone.v3.platform-Webrule_ExecuteRuleSet',
            componentName: '执行方法'
          }
        }
      ]
    },
    'consistencies': {
      consistency: [
        { $: { matchCode: 'ClientRules.ExecuteRuleSet', matchVersion: '2' } },
        { $: { matchCode: 'ClientRules.ShowMessage', matchVersion: '1' } },
        { $: { matchCode: 'ComponentControls.JGTreeView', matchVersion: '3' } },
        { $: { matchCode: 'ComponentControls.JGComboBox', matchVersion: '1' } },
        {
          $: { matchCode: 'ComponentControls.JGTabControl', matchVersion: '1' }
        },
        { $: { matchCode: 'ComponentControls.JGButton', matchVersion: '1' } },
        { $: { matchCode: 'ComponentControls.JGTextBox', matchVersion: '1' } },
        { $: { matchCode: 'ComponentControls.JGReport', matchVersion: '2' } },
        { $: { matchCode: 'MobileControls.JGMDiv', matchVersion: '4' } }
      ]
    }
  },
  domains: {
    module: [
      {
        $: { code: 'functional_prdaction' },
        elements: {
          element: {
            $: { code: 'ActionManager' },
            config:
              '{\r\n    "actionEntity": {        \r\n        "datas": {\r\n            "values": []\r\n        }\r\n    },\r\n    "actionWindow": {\r\n        "datas": {\r\n            "values": []\r\n        }\r\n    },\r\n\t"actionNavigationInfo":{\r\n        "datas": {\r\n            "values": []\r\n        }\r\n\t}\r\n}'
          }
        }
      },
      {
        $: { code: 'functional_bizWindow' },
        elements: {
          element: {
            $: { code: 'BizWindowInstance' },
            config: '{"bizWindowInstance":[],"manifest":[]}'
          }
        }
      }
    ]
  },
  extendableWindows: '',
  spiInfos: '',
  annotations: '',
  annotationNotes: '',
  annotationInstances: ''
}
const parse = function () {
  parseComponent(componentSchema)
}
export { parse }
