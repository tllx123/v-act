import { JGTreeView, convert } from '@v-act/jgtreeview'
import { JGComponent } from '@v-act/jgcomponent'
const treeview = () => {
  return (
    <JGComponent>
      {convert({
        type: 'JGTreeView',
        properties: {
          code: 'JGTreeView62',
          enabled: 'False',
          height: '300',
          labelText: '树',
          left: '359',
          multiHeight: '300px',
          multiWidth: '233px',
          percentHeight: '34.7%',
          percentWidth: '20.2%',
          readOnly: 'True',
          tabIndex: '14',
          top: '439',
          width: '233'
        },
        headerControls: [],
        controls: [],
        dataBindings: [
          {
            dataSource: 'JGTreeView62',
            dataMembers: [
              {
                name: '显示字段',
                code: 'TreeColumnName',
                value: 'TreeColumnName'
              },
              {
                name: '父标识字段',
                code: 'PIDColumn',
                value: 'PID'
              },
              {
                name: '排序字段',
                code: 'OrderNoColumn',
                value: 'OrderNo'
              },
              {
                name: '层级码字段',
                code: 'InnerCodeColumn',
                value: 'InnerCode'
              },
              {
                name: '左码字段',
                code: 'LeftCodeColumn',
                value: 'LeftCode'
              },
              {
                name: '右码字段',
                code: 'RightCodeColumn',
                value: 'RightCode'
              },
              {
                name: '叶子节点字段',
                code: 'LeafNode',
                value: 'IsLeaf'
              }
            ]
          }
        ]
      })}

      {convert({
        type: 'JGTreeView',
        properties: {
          cascadeCheck: 'True',
          code: 'JGTreeView61',
          displayMode: '2',
          height: '300',
          labelText: '级联',
          left: '43',
          multiHeight: '300px',
          multiWidth: '233px',
          percentHeight: '34.7%',
          percentWidth: '20.2%',
          tabIndex: '13',
          top: '439',
          width: '233'
        },
        headerControls: [],
        controls: [],
        dataBindings: [
          {
            dataSource: 'JGTreeView61',
            dataMembers: [
              {
                name: '显示字段',
                code: 'TreeColumnName',
                value: 'TreeColumnName'
              },
              {
                name: '父标识字段',
                code: 'PIDColumn',
                value: 'PID'
              },
              {
                name: '排序字段',
                code: 'OrderNoColumn',
                value: 'OrderNo'
              },
              {
                name: '层级码字段',
                code: 'InnerCodeColumn',
                value: 'InnerCode'
              },
              {
                name: '左码字段',
                code: 'LeftCodeColumn',
                value: 'LeftCode'
              },
              {
                name: '右码字段',
                code: 'RightCodeColumn',
                value: 'RightCode'
              },
              {
                name: '叶子节点字段',
                code: 'LeafNode',
                value: 'IsLeaf'
              }
            ]
          }
        ]
      })}

      {convert({
        type: 'JGTreeView',
        properties: {
          code: 'JGTreeView60',
          displayMode: '2',
          height: '300',
          labelText: '不级联',
          left: '720',
          multiHeight: '300px',
          multiWidth: '233px',
          percentHeight: '34.7%',
          percentWidth: '20.2%',
          tabIndex: '12',
          top: '76',
          width: '233'
        },
        headerControls: [],
        controls: [],
        dataBindings: [
          {
            dataSource: 'JGTreeView60',
            dataMembers: [
              {
                name: '显示字段',
                code: 'TreeColumnName',
                value: 'TreeColumnName'
              },
              {
                name: '父标识字段',
                code: 'PIDColumn',
                value: 'PID'
              },
              {
                name: '排序字段',
                code: 'OrderNoColumn',
                value: 'OrderNo'
              },
              {
                name: '层级码字段',
                code: 'InnerCodeColumn',
                value: 'InnerCode'
              },
              {
                name: '左码字段',
                code: 'LeftCodeColumn',
                value: 'LeftCode'
              },
              {
                name: '右码字段',
                code: 'RightCodeColumn',
                value: 'RightCode'
              },
              {
                name: '叶子节点字段',
                code: 'LeafNode',
                value: 'IsLeaf'
              }
            ]
          }
        ]
      })}

      {convert({
        type: 'JGTreeView',
        properties: {
          code: 'JGTreeView45',
          height: '300',
          labelText: '树',
          left: '42',
          multiHeight: '300px',
          multiWidth: '538px',
          percentHeight: '34.7%',
          percentWidth: '46.7%',
          showToolbar: 'True',
          tabIndex: '0',
          top: '76',
          width: '538'
        },
        headerControls: [
          {
            type: 'JGToolbar',
            properties: {
              code: 'JGToolbar46',
              width: '536'
            },
            headerControls: [],
            controls: [
              {
                type: 'JGToolbarMenu',
                properties: {
                  code: 'JGToolbarMenu47',
                  displayStyle: 'ImageAndText',
                  height: '21',
                  icon: 'open',
                  labelText: '选择',
                  left: '8',
                  top: '10',
                  type: 'open',
                  width: '53'
                },
                headerControls: [],
                controls: [],
                dataBindings: [
                  {
                    dataSource: null,
                    dataMembers: []
                  }
                ]
              },
              {
                type: 'JGToolbarMenu',
                properties: {
                  code: 'JGToolbarMenu48',
                  displayStyle: 'ImageAndText',
                  height: '21',
                  icon: 'import',
                  labelText: '导入',
                  left: '69',
                  top: '10',
                  type: 'import',
                  width: '53'
                },
                headerControls: [],
                controls: [],
                dataBindings: [
                  {
                    dataSource: null,
                    dataMembers: []
                  }
                ]
              },
              {
                type: 'JGToolbarMenu',
                properties: {
                  code: 'JGToolbarMenu49',
                  displayStyle: 'ImageAndText',
                  height: '21',
                  icon: 'export',
                  labelText: '导出',
                  left: '130',
                  top: '10',
                  type: 'export',
                  width: '53'
                },
                headerControls: [],
                controls: [],
                dataBindings: [
                  {
                    dataSource: null,
                    dataMembers: []
                  }
                ]
              },
              {
                type: 'JGToolbarMenu',
                properties: {
                  code: 'JGToolbarMenu49',
                  displayStyle: 'ImageAndText',
                  height: '21',
                  icon: 'export',
                  labelText: '导出',
                  left: '130',
                  top: '10',
                  type: 'export',
                  width: '53'
                },
                headerControls: [],
                controls: [],
                dataBindings: [
                  {
                    dataSource: null,
                    dataMembers: []
                  }
                ]
              },
              {
                type: 'JGToolbarMenu',
                properties: {
                  code: 'JGToolbarMenu49',
                  displayStyle: 'ImageAndText',
                  height: '21',
                  icon: 'export',
                  labelText: '导出',
                  left: '130',
                  top: '10',
                  type: 'export',
                  width: '53'
                },
                headerControls: [],
                controls: [],
                dataBindings: [
                  {
                    dataSource: null,
                    dataMembers: []
                  }
                ]
              },
              {
                type: 'JGToolbarMenu',
                properties: {
                  code: 'JGToolbarMenu49',
                  displayStyle: 'ImageAndText',
                  height: '21',
                  icon: 'export',
                  labelText: '导出',
                  left: '130',
                  top: '10',
                  type: 'export',
                  width: '53'
                },
                headerControls: [],
                controls: [],
                dataBindings: [
                  {
                    dataSource: null,
                    dataMembers: []
                  }
                ]
              },
              {
                type: 'JGToolbarMenu',
                properties: {
                  code: 'JGToolbarMenu49',
                  displayStyle: 'ImageAndText',
                  height: '21',
                  icon: 'export',
                  labelText: '导出',
                  left: '130',
                  top: '10',
                  type: 'export',
                  width: '53'
                },
                headerControls: [],
                controls: [],
                dataBindings: [
                  {
                    dataSource: null,
                    dataMembers: []
                  }
                ]
              },
              {
                type: 'JGToolbarMenu',
                properties: {
                  code: 'JGToolbarMenu50',
                  displayStyle: 'ImageAndText',
                  height: '21',
                  icon: 'add',
                  labelText: '新增',
                  left: '191',
                  top: '10',
                  type: 'add',
                  width: '67'
                },
                headerControls: [],
                controls: [
                  {
                    type: 'JGToolbarMenu',
                    properties: {
                      code: 'JGToolbarMenu51',
                      height: '21',
                      labelText: '新增同级',
                      type: 'addSibling'
                    },
                    headerControls: [],
                    controls: [],
                    dataBindings: [
                      {
                        dataSource: null,
                        dataMembers: []
                      }
                    ]
                  },
                  {
                    type: 'JGToolbarMenu',
                    properties: {
                      code: 'JGToolbarMenu52',
                      height: '21',
                      labelText: '新增子级',
                      type: 'addChild'
                    },
                    headerControls: [],
                    controls: [],
                    dataBindings: [
                      {
                        dataSource: null,
                        dataMembers: []
                      }
                    ]
                  }
                ],
                dataBindings: [
                  {
                    dataSource: null,
                    dataMembers: []
                  }
                ]
              },
              {
                type: 'JGToolbarMenu',
                properties: {
                  align: 'Right',
                  code: 'JGToolbarMenu53',
                  displayStyle: 'ImageAndText',
                  height: '21',
                  icon: 'qiyong',
                  labelText: '启用',
                  left: '316',
                  top: '10',
                  type: 'qiyong',
                  width: '53'
                },
                headerControls: [],
                controls: [],
                dataBindings: [
                  {
                    dataSource: null,
                    dataMembers: []
                  }
                ]
              },
              {
                type: 'JGToolbarMenu',
                properties: {
                  align: 'Right',
                  code: 'JGToolbarMenu54',
                  displayStyle: 'ImageAndText',
                  height: '21',
                  icon: 'tingyong',
                  labelText: '停用',
                  left: '369',
                  top: '10',
                  type: 'tingyong',
                  width: '53'
                },
                headerControls: [],
                controls: [],
                dataBindings: [
                  {
                    dataSource: null,
                    dataMembers: []
                  }
                ]
              }
            ],
            dataBindings: [
              {
                dataSource: null,
                dataMembers: []
              }
            ]
          }
        ],
        controls: [],
        dataBindings: [
          {
            dataSource: 'JGTreeView45',
            dataMembers: [
              {
                name: '显示字段',
                code: 'TreeColumnName',
                value: 'TreeColumnName'
              },
              {
                name: '父标识字段',
                code: 'PIDColumn',
                value: 'PID'
              },
              {
                name: '排序字段',
                code: 'OrderNoColumn',
                value: 'OrderNo'
              },
              {
                name: '层级码字段',
                code: 'InnerCodeColumn',
                value: 'InnerCode'
              },
              {
                name: '左码字段',
                code: 'LeftCodeColumn',
                value: 'LeftCode'
              },
              {
                name: '右码字段',
                code: 'RightCodeColumn',
                value: 'RightCode'
              },
              {
                name: '叶子节点字段',
                code: 'LeafNode',
                value: 'IsLeaf'
              }
            ]
          }
        ]
      })}
    </JGComponent>
  )
}

export default treeview
