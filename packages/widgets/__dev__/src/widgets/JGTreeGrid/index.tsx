import { JGTreeGrid, convert } from '@v-act/jgtreegrid'
import { JGComponent } from '@v-act/jgcomponent'
const treegrid = () => {
  return (
    <JGComponent>
      {convert({
        type: 'JGTreeGrid',
        properties: {
          allowMerge: 'True',
          code: 'JGTreeGrid12',
          height: '369',
          labelText: '树表',
          left: '252',
          multiHeight: '369px',
          multiWidth: '799px',
          percentHeight: '46.9%',
          percentWidth: '64.3%',
          rowHeight: '28',
          rowsFixedCount: '2',
          showRowNumbers: 'True',
          tabIndex: '0',
          top: '212',
          width: '799'
        },
        headerControls: [
          {
            type: 'JGToolbar',
            properties: {
              code: 'JGToolbar16'
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
              code: 'JGTextBoxColumn13',
              labelText: '文本|文本',
              width: '140'
            },
            headerControls: [],
            controls: [],
            dataBindings: [
              {
                dataSource: 'JGTreeGrid12',
                dataMembers: [
                  {
                    name: '字段名称',
                    code: 'ColumnName',
                    value: 'JGTextBoxColumn13'
                  }
                ]
              }
            ]
          },
          {
            type: 'JGTextBoxColumn',
            properties: {
              code: 'JGTextBoxColumn15',
              labelText: '文本|文本',
              width: '154'
            },
            headerControls: [],
            controls: [],
            dataBindings: [
              {
                dataSource: 'JGTreeGrid12',
                dataMembers: [
                  {
                    name: '字段名称',
                    code: 'ColumnName',
                    value: 'JGTextBoxColumn15'
                  }
                ]
              }
            ]
          },
          {
            type: 'JGTextBoxColumn',
            properties: {
              code: 'JGTextBoxColumn14',
              labelText: '文本|文本'
            },
            headerControls: [],
            controls: [],
            dataBindings: [
              {
                dataSource: 'JGTreeGrid12',
                dataMembers: [
                  {
                    name: '字段名称',
                    code: 'ColumnName',
                    value: 'JGTextBoxColumn14'
                  }
                ]
              }
            ]
          },
          {
            type: 'JGPercentColumn',
            properties: {
              code: 'JGPercentColumn17',
              labelText: '百分比|百分比'
            },
            headerControls: [],
            controls: [],
            dataBindings: [
              {
                dataSource: 'JGTreeGrid12',
                dataMembers: [
                  {
                    name: '字段名称',
                    code: 'ColumnName',
                    value: 'JGPercentColumn17'
                  }
                ]
              }
            ]
          },
          {
            type: 'JGPeriodColumn',
            properties: {
              code: 'JGPeriodColumn18',
              labelText: '期次|期次'
            },
            headerControls: [],
            controls: [],
            dataBindings: [
              {
                dataSource: 'JGTreeGrid12',
                dataMembers: [
                  {
                    name: '字段名称',
                    code: 'ColumnName',
                    value: 'JGPeriodColumn18'
                  }
                ]
              }
            ]
          },
          {
            type: 'JGImageColumn',
            properties: {
              code: 'JGImageColumn19',
              labelText: '图片|图片'
            },
            headerControls: [],
            controls: [],
            dataBindings: [
              {
                dataSource: 'JGTreeGrid12',
                dataMembers: [
                  {
                    name: '字段名称',
                    code: 'ColumnName',
                    value: 'JGImageColumn19'
                  }
                ]
              }
            ]
          },
          {
            type: 'JGBaseDictBoxColumn',
            properties: {
              code: 'JGBaseDictBoxColumn20',
              labelText: '弹出选择|弹出选择'
            },
            headerControls: [],
            controls: [],
            dataBindings: [
              {
                dataSource: 'JGTreeGrid12',
                dataMembers: [
                  {
                    name: '标识字段',
                    code: 'IDColumnName',
                    value: 'JGBaseDictBoxColumn20_IDColumnName'
                  },
                  {
                    name: '显示字段',
                    code: 'ColumnName',
                    value: 'JGBaseDictBoxColumn20'
                  }
                ]
              }
            ]
          },
          {
            type: 'JGComboBoxColumn',
            properties: {
              code: 'JGComboBoxColumn21',
              labelText: '下拉选择|下拉选择'
            },
            headerControls: [],
            controls: [],
            dataBindings: [
              {
                dataSource: 'JGTreeGrid12',
                dataMembers: [
                  {
                    name: '标识字段',
                    code: 'IDColumnName',
                    value: 'JGComboBoxColumn21_IDColumnName'
                  },
                  {
                    name: '显示字段',
                    code: 'ColumnName',
                    value: 'JGComboBoxColumn21'
                  }
                ]
              }
            ]
          }
        ],
        dataBindings: [
          {
            dataSource: 'JGTreeGrid12',
            dataMembers: [
              {
                name: '树显示字段',
                code: 'TreeColumName',
                value: 'JGTextBoxColumn13'
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
