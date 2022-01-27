import { JGTreeGrid, convert } from '@v-act/jgtreegrid'
import { JGComponent } from '@v-act/jgcomponent'
const treegrid = () => {
  return (
    <JGComponent>
      {convert({
        type: 'JGDataGrid',
        properties: {
          allowMerge: 'True',
          code: 'JGDataGrid64',
          height: '230',
          labelText: '列表',
          left: '297',
          multiHeight: '230px',
          multiWidth: '480px',
          percentHeight: '26.6%',
          percentWidth: '41.7%',
          rowHeight: '28',
          rowsFixedCount: '3',
          tabIndex: '0',
          top: '203',
          width: '480'
        },
        headerControls: [
          {
            type: 'JGToolbar',
            properties: {
              code: 'JGToolbar68'
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
              code: 'JGTextBoxColumn65',
              labelText: '文本||贝多芬'
            },
            headerControls: [],
            controls: [],
            dataBindings: [
              {
                dataSource: 'JGDataGrid64',
                dataMembers: [
                  {
                    name: '字段名称',
                    code: 'ColumnName',
                    value: 'JGTextBoxColumn65'
                  }
                ]
              }
            ]
          },
          {
            type: 'JGTextBoxColumn',
            properties: {
              code: 'JGTextBoxColumn66',
              labelText: '文本|文本|文本'
            },
            headerControls: [],
            controls: [],
            dataBindings: [
              {
                dataSource: 'JGDataGrid64',
                dataMembers: [
                  {
                    name: '字段名称',
                    code: 'ColumnName',
                    value: 'JGTextBoxColumn66'
                  }
                ]
              }
            ]
          },
          {
            type: 'JGTextBoxColumn',
            properties: {
              code: 'JGTextBoxColumn67',
              labelText: '文本|文本|文本'
            },
            headerControls: [],
            controls: [],
            dataBindings: [
              {
                dataSource: 'JGDataGrid64',
                dataMembers: [
                  {
                    name: '字段名称',
                    code: 'ColumnName',
                    value: 'JGTextBoxColumn67'
                  }
                ]
              }
            ]
          }
        ],
        dataBindings: [
          {
            dataSource: 'JGDataGrid64',
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
