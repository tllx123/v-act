import { JGDataGrid, convert } from '@v-act/jgdatagrid'
import { JGComponent } from '@v-act/jgcomponent'
import { JGFormLayout } from '@v-act/jgformlayout'
const datagrid = () => {
  return (
    <JGComponent>
      {convert({
        type: 'JGDataGrid',
        properties: {
          allowMerge: 'True',
          code: 'JGDataGrid1',
          height: '438',
          labelText: '列表',
          left: '167',
          multiHeight: '438px',
          multiWidth: '727px',
          percentHeight: '52.3%',
          percentWidth: '56.5%',
          readOnly: 'True',
          rowHeight: '28',
          rowsFixedCount: '3',
          rowWidthMode: 'PercentWidth',
          showToolbar: 'True',
          tabIndex: '0',
          top: '125',
          width: '727'
        },
        headerControls: [
          {
            type: 'JGToolbar',
            properties: {
              code: 'JGToolbar5',
              width: '725'
            },
            headerControls: [],
            controls: [
              {
                type: 'JGToolbarMenu',
                properties: {
                  code: 'JGToolbarMenu9',
                  displayStyle: 'ImageAndText',
                  height: '21',
                  icon: 'import',
                  labelText: '导入',
                  left: '8',
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
                  code: 'JGToolbarMenu10',
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
                  code: 'JGToolbarMenu11',
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
                      code: 'JGToolbarMenu20',
                      height: '21',
                      labelText: '下拉菜单项',
                      type: 'custom'
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
                      code: 'JGToolbarMenu21',
                      height: '21',
                      labelText: '下拉菜单项',
                      type: 'custom'
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
                  code: 'JGToolbarMenu12',
                  displayStyle: 'ImageAndText',
                  height: '21',
                  icon: 'tingyong',
                  labelText: '停用',
                  left: '558',
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
              },
              {
                type: 'JGToolbarMenu',
                properties: {
                  align: 'Right',
                  code: 'JGToolbarMenu13',
                  displayStyle: 'ImageAndText',
                  height: '21',
                  icon: 'template',
                  labelText: '模板',
                  left: '611',
                  top: '10',
                  type: 'template',
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
                  code: 'JGToolbarMenu14',
                  displayStyle: 'ImageAndText',
                  height: '21',
                  icon: 'more',
                  labelText: '更多',
                  left: '664',
                  top: '10',
                  type: 'more',
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
              code: 'JGTextBoxColumn2',
              labelText: '文本|文本|文本'
            },
            headerControls: [],
            controls: [],
            dataBindings: [
              {
                dataSource: 'JGDataGrid1',
                dataMembers: [
                  {
                    name: '字段名称',
                    code: 'ColumnName',
                    value: 'JGTextBoxColumn2'
                  }
                ]
              }
            ]
          },
          {
            type: 'JGTextBoxColumn',
            properties: {
              code: 'JGTextBoxColumn3',
              labelText: '文本|文本|文本'
            },
            headerControls: [],
            controls: [],
            dataBindings: [
              {
                dataSource: 'JGDataGrid1',
                dataMembers: [
                  {
                    name: '字段名称',
                    code: 'ColumnName',
                    value: 'JGTextBoxColumn3'
                  }
                ]
              }
            ]
          },
          {
            type: 'JGTextBoxColumn',
            properties: {
              code: 'JGTextBoxColumn4',
              labelText: '文本|文本|文本'
            },
            headerControls: [],
            controls: [],
            dataBindings: [
              {
                dataSource: 'JGDataGrid1',
                dataMembers: [
                  {
                    name: '字段名称',
                    code: 'ColumnName',
                    value: 'JGTextBoxColumn4'
                  }
                ]
              }
            ]
          },
          {
            type: 'JGDateTimePickerColumn',
            properties: {
              code: 'JGDateTimePickerColumn6',
              labelText: '日期'
            },
            headerControls: [],
            controls: [],
            dataBindings: [
              {
                dataSource: 'JGDataGrid1',
                dataMembers: [
                  {
                    name: '字段名称',
                    code: 'ColumnName',
                    value: 'JGDateTimePickerColumn6'
                  }
                ]
              }
            ]
          },
          {
            type: 'JGFloatBoxColumn',
            properties: {
              code: 'JGFloatBoxColumn7',
              labelText: '小数',
              showGridSummary: 'True'
            },
            headerControls: [],
            controls: [],
            dataBindings: [
              {
                dataSource: 'JGDataGrid1',
                dataMembers: [
                  {
                    name: '字段名称',
                    code: 'ColumnName',
                    value: 'JGFloatBoxColumn7'
                  }
                ]
              }
            ]
          },
          {
            type: 'JGIntegerBoxColumn',
            properties: {
              code: 'JGIntegerBoxColumn8',
              labelText: '整数',
              showGridSummary: 'True'
            },
            headerControls: [],
            controls: [],
            dataBindings: [
              {
                dataSource: 'JGDataGrid1',
                dataMembers: [
                  {
                    name: '字段名称',
                    code: 'ColumnName',
                    value: 'JGIntegerBoxColumn8'
                  }
                ]
              }
            ]
          }
        ],
        dataBindings: [
          {
            dataSource: 'JGDataGrid1',
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

export default datagrid
