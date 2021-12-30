import toTree from 'array-to-tree'
import { Property } from 'csstype'

import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { TreeItem, TreeView, TreeViewPropsBase } from '@mui/lab'
import Box from '@mui/material/Box'
import { Height, Width } from '@v-act/schema-types'
import { useContext } from '@v-act/widget-context'
import { toHeight, toWidth } from '@v-act/widget-utils'

export interface JGTreeViewProps extends TreeViewPropsBase {
  left?: Property.Left
  top?: Property.Top
  position?: Property.Position
  height?: Height
  width?: Width
  readonly?: boolean
  disable?: boolean
  data?: any
}

const JGTreeView = (props: JGTreeViewProps) => {
  const context = useContext()
  const {
    left,
    top,
    height,
    width,
    position,
    data,
    readonly,
    disable,
    ...resprops
  } = props

  let dataTree = []
  if (data) {
    dataTree = toTree(data, {
      parentProperty: 'pid',
      customID: 'id'
    })
  }

  console.log('dataTree')
  console.log(dataTree)

  let isReadonly = false
  if (readonly || disable) {
    isReadonly = true
  }

  const renderTreeRoot = (dataTree: any) => {
    const renderTree = (nodes: any) => {
      console.log(nodes)
      return (
        <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name}>
          {Array.isArray(nodes.children)
            ? nodes.children.map((nodeC: any) => renderTree(nodeC))
            : null}
        </TreeItem>
      )
    }

    return dataTree.map((item: any) => {
      console.log(item)
      return (
        <TreeItem key={item.id} nodeId={item.id} label={item.name}>
          {Array.isArray(item.children)
            ? item.children.map((nodeC: any) => renderTree(nodeC))
            : null}
        </TreeItem>
      )
    })
  }

  return (
    <Box
      sx={{
        left: left,
        top: top,
        width: toWidth(width, context, '235px'),
        height: toHeight(height, context, '26px'),
        position: context.position,
        pointerEvents: isReadonly ? 'none' : 'auto',
        border: '1px solid #999'
      }}
    >
      <TreeView
        sx={{
          width: '100%',
          height: '100%'
        }}
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        {...resprops}
      >
        {renderTreeRoot(dataTree)}
      </TreeView>
    </Box>
  )
}

JGTreeView.defaultProps = {
  left: '20px',
  top: '50px',
  width: '200px',
  height: '200px',
  position: 'absolute',
  data: [
    { id: '1', name: 'item1' },
    { id: '111', name: 'item1_1', pid: '1' },
    { id: '2', name: 'item2' },
    { id: '3', name: 'item2_1', pid: '2' },
    { id: '11', name: 'item2_2', pid: '2' },
    { id: '22', name: 'item2_2_1', pid: '11' },
    { id: '33', name: 'item2_2_1_1', pid: '22' }
  ]
}

export default JGTreeView
