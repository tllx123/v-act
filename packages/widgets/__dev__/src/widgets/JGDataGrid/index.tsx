import { JGDataGrid, convert } from '@v-act/jgdatagrid'
import { JGComponent } from '@v-act/jgcomponent'
import { JGFormLayout } from '@v-act/jgformlayout'
const datagrid = () => {
  return (
    <JGComponent>
      {convert({
        type: 'JGDataGrid',
        properties: {
          code: 'JGDataGrid1',
          height: '283',
          labelText: '列表',
          left: '183',
          multiHeight: '283px',
          multiWidth: '752px',
          percentHeight: '39.6%',
          percentWidth: '62.6%',
          tabIndex: '0',
          top: '186',
          width: '752'
        },
        headerControls: [
          {
            type: 'JGToolbar',
            properties: {
              code: 'JGToolbar1'
            },
            headerControls: [],
            controls: [],
            dataBindings: [
              {
                dataSource: null,
                dataMembers: []
              }
            ],
            event: []
          }
        ],
        controls: [
          {
            type: 'JGTextBoxColumn',
            properties: {
              code: 'JGTextBoxColumn_a',
              labelText: 'a'
            },
            headerControls: [],
            controls: [],
            dataBindings: [
              {
                dataSource: 'ds',
                dataMembers: [
                  {
                    name: '字段名称',
                    code: 'ColumnName',
                    value: 'a'
                  }
                ]
              }
            ],
            event: []
          },
          {
            type: 'JGTextBoxColumn',
            properties: {
              code: 'JGTextBoxColumn_b',
              labelText: 'b'
            },
            headerControls: [],
            controls: [],
            dataBindings: [
              {
                dataSource: 'ds',
                dataMembers: [
                  {
                    name: '字段名称',
                    code: 'ColumnName',
                    value: 'b'
                  }
                ]
              }
            ],
            event: []
          },
          {
            type: 'JGTextBoxColumn',
            properties: {
              code: 'JGTextBoxColumn_c',
              labelText: 'c'
            },
            headerControls: [],
            controls: [],
            dataBindings: [
              {
                dataSource: 'ds',
                dataMembers: [
                  {
                    name: '字段名称',
                    code: 'ColumnName',
                    value: 'c'
                  }
                ]
              }
            ],
            event: []
          },
          {
            type: 'JGTextBoxColumn',
            properties: {
              code: 'JGTextBoxColumn_d',
              labelText: 'd'
            },
            headerControls: [],
            controls: [],
            dataBindings: [
              {
                dataSource: 'ds',
                dataMembers: [
                  {
                    name: '字段名称',
                    code: 'ColumnName',
                    value: 'd'
                  }
                ]
              }
            ],
            event: []
          },
          {
            type: 'JGTextBoxColumn',
            properties: {
              code: 'JGTextBoxColumn_e',
              labelText: 'e'
            },
            headerControls: [],
            controls: [],
            dataBindings: [
              {
                dataSource: 'ds',
                dataMembers: [
                  {
                    name: '字段名称',
                    code: 'ColumnName',
                    value: 'e'
                  }
                ]
              }
            ],
            event: []
          }
        ],
        dataBindings: [
          {
            dataSource: 'ds',
            dataMembers: [
              {
                name: '分组字段',
                code: 'GroupByFieldName'
              }
            ]
          }
        ],
        event: []
      })}
    </JGComponent>
  )
}

export default datagrid
