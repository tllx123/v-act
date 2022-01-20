import { JGTreeGrid, convert } from '@v-act/jgtreegrid'
import { JGComponent } from '@v-act/jgcomponent'
const treegrid = () => {
  return (
    <JGComponent>
      {convert({
        type: 'JGTreeGrid',
        properties: {
          chooseMode: '3',
          code: 'JGTreeGrid1',
          height: '411',
          labelText: '树表',
          left: '317',
          multiHeight: '411px',
          multiWidth: '741px',
          percentHeight: '48%',
          percentWidth: '54.9%',
          rowHeight: '28',
          showRowNumbers: 'True',
          tabIndex: '0',
          top: '190',
          width: '741'
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
              labelText: '文本',
              width: '140'
            },
            headerControls: [],
            controls: [],
            dataBindings: [
              {
                dataSource: 'JGTreeGrid1',
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
                dataSource: 'JGTreeGrid1',
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
                dataSource: 'JGTreeGrid1',
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
            type: 'JGPeriodColumn',
            properties: {
              code: 'JGPeriodColumn6',
              labelText: '期次'
            },
            headerControls: [],
            controls: [],
            dataBindings: [
              {
                dataSource: 'JGTreeGrid1',
                dataMembers: [
                  {
                    name: '字段名称',
                    code: 'ColumnName',
                    value: 'JGPeriodColumn6'
                  }
                ]
              }
            ]
          },
          {
            type: 'JGImageColumn',
            properties: {
              code: 'JGImageColumn7',
              labelText: '图片'
            },
            headerControls: [],
            controls: [],
            dataBindings: [
              {
                dataSource: 'JGTreeGrid1',
                dataMembers: [
                  {
                    name: '字段名称',
                    code: 'ColumnName',
                    value: 'JGImageColumn7'
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
                dataSource: 'JGTreeGrid1',
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
            type: 'JGComboBoxColumn',
            properties: {
              code: 'JGComboBoxColumn9',
              labelText: '下拉选择'
            },
            headerControls: [],
            controls: [],
            dataBindings: [
              {
                dataSource: 'JGTreeGrid1',
                dataMembers: [
                  {
                    name: '标识字段',
                    code: 'IDColumnName',
                    value: 'JGComboBoxColumn9_IDColumnName'
                  },
                  {
                    name: '显示字段',
                    code: 'ColumnName',
                    value: 'JGComboBoxColumn9'
                  }
                ]
              }
            ]
          }
        ],
        dataBindings: [
          {
            dataSource: 'JGTreeGrid1',
            dataMembers: [
              {
                name: '树显示字段',
                code: 'TreeColumName',
                value: 'JGTextBoxColumn2'
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
