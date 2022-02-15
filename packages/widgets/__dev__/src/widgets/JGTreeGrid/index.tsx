import { JGTreeGrid, convert } from '@v-act/jgtreegrid'
import { JGComponent } from '@v-act/jgcomponent'
const treegrid = () => {
  return (
    <JGComponent>
      {convert({
        type: 'JGDataGrid',
        properties: {
          allowMerge: 'True',
          code: 'JGDataGrid73',
          height: '336',
          labelText: '列表',
          left: '229',
          multiHeight: '336px',
          multiWidth: '480px',
          percentHeight: '38.9%',
          percentWidth: '39.5%',
          rowHeight: '28',
          rowsFixedCount: '5',
          showToolbar: 'True',
          tabIndex: '9',
          top: '341',
          width: '480'
        },
        headerControls: [
          {
            type: 'JGToolbar',
            properties: {
              code: 'JGToolbar77',
              width: '478'
            },
            headerControls: [],
            controls: [
              {
                type: 'JGToolbarMenu',
                properties: {
                  code: 'JGToolbarMenu78',
                  displayStyle: 'ImageAndText',
                  height: '21',
                  icon: 'open',
                  labelText: '选择',
                  left: '8',
                  top: '10',
                  type: 'open',
                  width: '53',
                  size: 0
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
                  code: 'JGToolbarMenu79',
                  displayStyle: 'ImageAndText',
                  height: '21',
                  icon: 'add',
                  labelText: '新增',
                  left: '69',
                  top: '10',
                  type: 'add',
                  width: '53',
                  size: 0
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
                  code: 'JGToolbarMenu80',
                  displayStyle: 'ImageAndText',
                  height: '21',
                  icon: 'update',
                  labelText: '修改',
                  left: '130',
                  top: '10',
                  type: 'update',
                  width: '53',
                  size: 0
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
                  code: 'JGToolbarMenu81',
                  displayStyle: 'ImageAndText',
                  height: '21',
                  icon: 'save',
                  labelText: '保存',
                  left: '-88',
                  top: '10',
                  type: 'save',
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
                  code: 'JGToolbarMenu82',
                  displayStyle: 'ImageAndText',
                  height: '21',
                  icon: 'moveUp',
                  labelText: '上移',
                  left: '-35',
                  top: '10',
                  type: 'moveUp',
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
                  code: 'JGToolbarMenu83',
                  displayStyle: 'ImageAndText',
                  height: '21',
                  icon: 'moveDown',
                  labelText: '下移',
                  left: '18',
                  top: '10',
                  type: 'moveDown',
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
                  code: 'JGToolbarMenu84',
                  displayStyle: 'ImageAndText',
                  height: '21',
                  icon: 'relegation',
                  labelText: '升降级',
                  left: '71',
                  top: '10',
                  type: 'relegation',
                  width: '67'
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
                  code: 'JGToolbarMenu85',
                  displayStyle: 'ImageAndText',
                  height: '21',
                  icon: 'print',
                  labelText: '打印',
                  left: '138',
                  top: '10',
                  type: 'print',
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
                  code: 'JGToolbarMenu86',
                  displayStyle: 'ImageAndText',
                  height: '21',
                  icon: 'fuzhi',
                  labelText: '复制',
                  left: '191',
                  top: '10',
                  type: 'fuzhi',
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
                  code: 'JGToolbarMenu87',
                  displayStyle: 'ImageAndText',
                  height: '21',
                  icon: 'liucheng',
                  labelText: '流程图',
                  left: '244',
                  top: '10',
                  type: 'liucheng',
                  width: '67'
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
                  code: 'JGToolbarMenu88',
                  displayStyle: 'ImageAndText',
                  height: '21',
                  icon: 'jian',
                  labelText: '移除',
                  left: '311',
                  top: '10',
                  type: 'jian',
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
                  code: 'JGToolbarMenu89',
                  displayStyle: 'ImageAndText',
                  height: '21',
                  icon: 'qiyong',
                  labelText: '启用',
                  left: '364',
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
                  code: 'JGToolbarMenu90',
                  displayStyle: 'ImageAndText',
                  height: '21',
                  icon: 'tingyong',
                  labelText: '停用',
                  left: '417',
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
        controls: [
          {
            type: 'JGTextBoxColumn',
            properties: {
              code: 'JGTextBoxColumn74',
              labelText: 'qwdsa||asd||qwwq'
            },
            headerControls: [],
            controls: [],
            dataBindings: [
              {
                dataSource: 'JGDataGrid73',
                dataMembers: [
                  {
                    name: '字段名称',
                    code: 'ColumnName',
                    value: 'JGTextBoxColumn74'
                  }
                ]
              }
            ]
          },
          {
            type: 'JGTextBoxColumn',
            properties: {
              code: 'JGTextBoxColumn75',
              labelText: '文本|wq|Dc|Dc|Dc'
            },
            headerControls: [],
            controls: [],
            dataBindings: [
              {
                dataSource: 'JGDataGrid73',
                dataMembers: [
                  {
                    name: '字段名称',
                    code: 'ColumnName',
                    value: 'JGTextBoxColumn75'
                  }
                ]
              }
            ]
          },
          {
            type: 'JGTextBoxColumn',
            properties: {
              code: 'JGTextBoxColumn76',
              labelText: '文本|wq|文3本|文本4|文本1'
            },
            headerControls: [],
            controls: [],
            dataBindings: [
              {
                dataSource: 'JGDataGrid73',
                dataMembers: [
                  {
                    name: '字段名称',
                    code: 'ColumnName',
                    value: 'JGTextBoxColumn76'
                  }
                ]
              }
            ]
          }
        ],
        dataBindings: [
          {
            dataSource: 'JGDataGrid73',
            dataMembers: [
              {
                name: '分组字段',
                code: 'GroupByFieldName'
              }
            ]
          }
        ]
      })}
    </JGComponent>
  )
}

export default treegrid
