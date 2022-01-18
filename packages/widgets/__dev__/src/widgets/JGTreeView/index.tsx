import { JGTreeView, convert } from '@v-act/jgtreeview'
import { JGComponent } from '@v-act/jgcomponent'
const treeview = () => {
  return (
    <JGComponent>
      {convert({
        type: 'JGTreeView',
        properties: {
          code: 'JGTreeView1',
          height: '300',
          labelText: '树',
          left: '405',
          multiHeight: '300px',
          multiWidth: '233px',
          percentHeight: '34.8%',
          percentWidth: '19.8%',
          tabIndex: '0',
          top: '134',
          width: '233'
        },
        headerControls: [],
        controls: [],
        dataBindings: [
          {
            dataSource: 'JGTreeView1',
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
