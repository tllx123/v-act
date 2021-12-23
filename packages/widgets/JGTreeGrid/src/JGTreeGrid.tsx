import { Property } from 'csstype'
import 'antd/dist/antd.css'
import { Table, Switch, Space } from 'antd'
import Box from '@mui/material/Box'
import toTree from 'array-to-tree'

interface dataTreeHeader {
  title: string
  dataIndex: string
  key: string
}

export interface JGTreeGridProps {
  left?: Property.Left
  top?: Property.Top
  position?: Property.Position
  height?: Property.Height
  width?: Property.Width
  dataTreeHeader?: Array<dataTreeHeader>
  data?: any
}

const JGTreeGrid = (props: JGTreeGridProps) => {
  const {
    left,
    top,
    height,
    width,
    position,
    dataTreeHeader,
    data,
    ...resprops
  } = props

  let dataTree = []
  if (data) {
    dataTree = toTree(data, {
      parentProperty: 'pid',
      customID: 'id'
    })
  }

  console.log(dataTreeHeader)

  return (
    <Box
      sx={{
        position: position,
        left: left,
        top: top,
        width: width,
        height: height
      }}
    >
      <Table columns={dataTreeHeader} dataSource={dataTree} {...resprops} />
    </Box>
  )
}

JGTreeGrid.defaultProps = {
  left: '100px',
  top: '50px',
  width: '800px',
  height: '600px',
  position: 'absolute',
  data: [],
  dataTreeHeader: [],
  pagination: false
}

export default JGTreeGrid
