import { Property } from 'csstype'
import { Table, Switch, Space } from 'antd'
import Box from '@mui/material/Box'
import toTree from 'array-to-tree'
import { useContext } from '@v-act/widget-context'
import { toHeight, toLabelWidth, toWidth } from '@v-act/widget-utils'
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
  const context = useContext()
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
        left: left,
        top: top,
        width: toWidth(width, context, '235px'),
        height: toHeight(height, context, '26px'),
        position: context.position
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
  data: [
    {
      id: '1',
      key: 1,
      name: 'John Brown sr.',
      age: 60,
      address: 'New York No. 1 Lake Park'
    },
    {
      id: '2',
      pid: '1',
      key: 11,
      name: 'John Brown',
      age: 42,
      address: 'New York No. 2 Lake Park'
    },
    {
      id: '3',
      pid: '2',
      key: 12,
      name: 'John Brown jr.',
      age: 30,
      address: 'New York No. 3 Lake Park'
    },
    {
      id: '4',
      pid: '2',
      key: 13,
      name: 'Jim Green sr.',
      age: 72,
      address: 'London No. 1 Lake Park'
    },
    {
      id: '45',

      key: 131,
      name: 'Jim Green',
      age: 42,
      address: 'London No. 2 Lake Park'
    },
    {
      id: '48',
      pid: '45',
      key: 1312,
      name: 'Jimmy Green sr.',
      age: 18,
      address: 'London No. 4 Lake Park'
    }
  ],
  dataTreeHeader: [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age'
    },
    {
      title: 'Address',
      dataIndex: 'address',

      key: 'address'
    }
  ],
  pagination: false
}

export default JGTreeGrid
