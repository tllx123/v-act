import { JGTreeGrid, convert } from '@v-act/jgtreegrid'
import { JGComponent } from '@v-act/jgcomponent'
const treegrid = () => {
  return (
    <JGComponent>
      {convert({
        type: 'JGTreeGrid',
        properties: {
          chooseMode: '3',
          code: 'JGTreeGrid110',
          height: '230',
          labelText: '树表',
          left: '89',
          multiHeight: '230px',
          multiWidth: '480px',
          percentHeight: '28.4%',
          percentWidth: '35.7%',
          rowHeight: '28',
          showRowNumbers: 'True',
          showToolbar: 'True',
          tabIndex: '1',
          top: '114',
          width: '480'
        },
        headerControls: [
          {
            type: 'JGToolbar',
            properties: {
              code: 'JGToolbar114',
              width: '478'
            },
            headerControls: [],
            controls: [
              {
                type: 'JGToolbarMenu',
                properties: {
                  code: 'JGToolbarMenu115',
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
                  code: 'JGToolbarMenu116',
                  displayStyle: 'ImageAndText',
                  height: '21',
                  icon: 'export',
                  labelText: '导出',
                  left: '69',
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
                  code: 'JGToolbarMenu117',
                  displayStyle: 'ImageAndText',
                  height: '21',
                  icon: 'add',
                  labelText: '新增',
                  left: '130',
                  top: '10',
                  type: 'add',
                  width: '67'
                },
                headerControls: [],
                controls: [
                  {
                    type: 'JGToolbarMenu',
                    properties: {
                      code: 'JGToolbarMenu118',
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
                      code: 'JGToolbarMenu119',
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
        controls: [
          {
            type: 'JGTextBoxColumn',
            properties: {
              code: 'JGTextBoxColumn111',
              labelText: '文本',
              width: '140'
            },
            headerControls: [],
            controls: [],
            dataBindings: [
              {
                dataSource: 'JGTreeGrid110',
                dataMembers: [
                  {
                    name: '字段名称',
                    code: 'ColumnName',
                    value: 'JGTextBoxColumn111'
                  }
                ]
              }
            ]
          },
          {
            type: 'JGTextBoxColumn',
            properties: {
              code: 'JGTextBoxColumn112',
              labelText: '文本'
            },
            headerControls: [],
            controls: [],
            dataBindings: [
              {
                dataSource: 'JGTreeGrid110',
                dataMembers: [
                  {
                    name: '字段名称',
                    code: 'ColumnName',
                    value: 'JGTextBoxColumn112'
                  }
                ]
              }
            ]
          },
          {
            type: 'JGTextBoxColumn',
            properties: {
              code: 'JGTextBoxColumn113',
              labelText: '文本'
            },
            headerControls: [],
            controls: [],
            dataBindings: [
              {
                dataSource: 'JGTreeGrid110',
                dataMembers: [
                  {
                    name: '字段名称',
                    code: 'ColumnName',
                    value: 'JGTextBoxColumn113'
                  }
                ]
              }
            ]
          }
        ],
        dataBindings: [
          {
            dataSource: 'JGTreeGrid110',
            dataMembers: [
              {
                name: '树显示字段',
                code: 'TreeColumName',
                value: 'JGTextBoxColumn111'
              },
              {
                name: '父记录字段',
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

export default treegrid
