import { Property } from 'csstype'
import { TreeView, TreeViewPropsBase } from '@mui/lab'
import { TreeItem, TreeItemProps } from '@mui/lab'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import Box from '@mui/material/Box'
import toTree from 'array-to-tree'

export interface JGTreeViewProps extends TreeViewPropsBase {
  left?: Property.Left
  top?: Property.Top
  position?: Property.Position
  height?: Property.Height
  width?: Property.Width
  readonly?: boolean
  disable?: boolean
  data?: any
}

const JGTreeView = (props: JGTreeViewProps) => {
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

  let isReadonly = false
  if (readonly || disable) {
    isReadonly = true
  }

  const renderTree = (nodes: any) => (
    <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name}>
      {Array.isArray(nodes.children)
        ? nodes.children.map((node: any) => renderTree(node))
        : null}
    </TreeItem>
  )

  return (
    <Box
      sx={{
        position: position,
        left: left,
        top: top,
        width: width,
        height: height,
        pointerEvents: isReadonly ? 'none' : 'auto'
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
        {renderTree(dataTree[0])}
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
    { id: '1', name: '1' },
    { id: '2', name: '2', pid: '1' },
    { id: '3', name: '3', pid: '2' },
    { id: '11', name: '11', pid: '2' },
    { id: '22', name: '22', pid: '11' },
    { id: '33', name: '33', pid: '22' }
  ]
}

export default JGTreeView