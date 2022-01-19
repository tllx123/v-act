import { JGDataGrid, convert } from '@v-act/jgdatagrid'
import { JGComponent } from '@v-act/jgcomponent'
import { JGFormLayout } from '@v-act/jgformlayout'
const datagrid = () => {
  return (
    <JGComponent>
      {convert({
        type: 'JGDataGrid',
        properties: {
          chooseMode: '3',
          code: 'JGDataGrid1',
          height: '230',
          labelText: '列表',
          left: '529',
          multiHeight: '230px',
          multiWidth: '480px',
          percentHeight: '31.2%',
          percentWidth: '37.7%',
          readOnly: 'True',
          rowHeight: '28',
          showRowNumbers: 'False',
          tabIndex: '0',
          top: '366',
          width: '480'
        },
        headerControls: [
          {
            type: 'JGToolbar',
            properties: {
              code: 'JGToolbar5'
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
        controls: [
          {
            type: 'JGTextBoxColumn',
            properties: {
              code: 'JGTextBoxColumn2',
              labelText: '文本'
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
              labelText: '文本'
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
              labelText: '文本'
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
            type: 'JGLongDateTimePickerColumn',
            properties: {
              code: 'JGLongDateTimePickerColumn6',
              labelText: '长日期'
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
                    value: 'JGLongDateTimePickerColumn6'
                  }
                ]
              }
            ]
          },
          {
            type: 'JGComboBoxColumn',
            properties: {
              code: 'JGComboBoxColumn7',
              labelText: '下拉选择'
            },
            headerControls: [],
            controls: [],
            dataBindings: [
              {
                dataSource: 'JGDataGrid1',
                dataMembers: [
                  {
                    name: '标识字段',
                    code: 'IDColumnName',
                    value: 'JGComboBoxColumn7_IDColumnName'
                  },
                  {
                    name: '显示字段',
                    code: 'ColumnName',
                    value: 'JGComboBoxColumn7'
                  }
                ]
              }
            ]
          },
          {
            type: 'JGPercentColumn',
            properties: {
              code: 'JGPercentColumn8',
              labelText: '百分比'
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
                    value: 'JGPercentColumn8'
                  }
                ]
              }
            ]
          },
          {
            type: 'JGPeriodColumn',
            properties: {
              code: 'JGPeriodColumn9',
              labelText: '期次'
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
                    value: 'JGPeriodColumn9'
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
