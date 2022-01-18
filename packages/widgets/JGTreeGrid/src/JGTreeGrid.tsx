import { Property } from 'csstype'
import { Table, Switch, Space } from 'antd'
import 'antd/dist/antd.css'
import Box from '@mui/material/Box'
import toTree from 'array-to-tree'
import { useContext } from '@v-act/widget-context'
import {
  toHeight,
  toLabelWidth,
  toWidth,
  getEntityDatas
} from '@v-act/widget-utils'
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
  // dataTreeHeader?: Array<dataTreeHeader>
  data?: any
  tablename?: string | null
  columnname?: string | null
  control?: any
  labelText?: any
}

const rowSelection = {
  onChange: (selectedRowKeys: React.Key[], selectedRows: any) => {},
  getCheckboxProps: (record: any) => ({
    name: record.name
  })
}

const JGTreeGrid = (props: JGTreeGridProps) => {
  const context = useContext()

  const {
    left,
    top,
    height,
    width,
    position,
    // dataTreeHeader,
    data,
    tablename,
    control,
    labelText,
    ...resprops
  } = props

  let dataTreeHeader: any = []

  control.controls.some((item: any) => {
    dataTreeHeader.push({
      title: item.properties.labelText,
      dataIndex: item.properties.code,
      key: item.properties.code
    })
  })

  console.log('---dataTemp---')
  let dataTemp: any = [
    {
      id: '1',
      JGTextBoxColumn13: '文件夹-1',
      IsLeaf: false,
      JGPercentColumn17: '34',
      JGPeriodColumn18: '45',
      JGImageColumn19: '546',
      JGBaseDictBoxColumn20: '456',
      JGComboBoxColumn21: '456'
    },
    {
      id: '2',
      PID: '1',
      JGTextBoxColumn13: '文件1-1',
      IsLeaf: true,
      JGTextBoxColumn15: '657'
    },
    {
      id: '3',
      PID: '2',
      JGTextBoxColumn13: '45345',
      IsLeaf: false,
      JGTextBoxColumn15: '7567',
      JGBaseDictBoxColumn20: '45'
    },
    {
      id: '4',
      PID: '3',
      JGTextBoxColumn13: '57645',
      IsLeaf: false,
      JGPeriodColumn18: '454',
      JGBaseDictBoxColumn20: '45'
    },
    {
      id: '5',
      PID: '4',
      JGTextBoxColumn13: '654765',
      IsLeaf: true,
      JGTextBoxColumn14: '56765',
      JGComboBoxColumn21: '4564'
    },
    {
      id: '6',
      PID: '1',
      JGTextBoxColumn13: '文件1-2',
      IsLeaf: true,
      JGPercentColumn17: '546',
      JGComboBoxColumn21: '567'
    },
    {
      id: '7',
      JGTextBoxColumn13: '文件夹-2',
      IsLeaf: false,
      JGTextBoxColumn15: '456',
      JGImageColumn19: '5tryrt'
    },
    {
      id: '8',
      PID: '7',
      JGTextBoxColumn13: '文件2-1',
      IsLeaf: true,
      JGTextBoxColumn14: '45',
      JGBaseDictBoxColumn20: '45'
    },
    {
      id: '9',
      PID: '7',
      JGTextBoxColumn13: '文件2-2',
      IsLeaf: true,
      JGPercentColumn17: '5',
      JGImageColumn19: '45',
      JGComboBoxColumn21: '45'
    },
    {
      id: '10',
      PID: '7',
      JGTextBoxColumn13: 'ewrwe',
      IsLeaf: true,
      JGTextBoxColumn14: '45'
    },
    {
      id: '11',
      PID: '7',
      JGTextBoxColumn13: 'ereter',
      IsLeaf: true,
      JGTextBoxColumn15: '45',
      JGComboBoxColumn21: '45'
    },
    {
      id: '12',
      PID: '7',
      JGTextBoxColumn13: 'tyrtytry',
      IsLeaf: true
    }
  ]
  // if (tablename) {
  //   dataTemp = getEntityDatas(tablename, context)
  //   // console.log(dataTemp)
  // }

  dataTemp.some((item2: any, index: any) => {
    item2.key = index
  })

  let dataTree = []
  if (dataTemp) {
    dataTree = toTree(dataTemp, {
      parentProperty: 'PID',
      customID: 'id'
    })
  }

  console.log('dataTreeHeader')
  console.log(dataTreeHeader)
  console.log('dataTemp')
  console.log(dataTemp)
  console.log('dataTree')
  console.log(dataTree)

  console.log('toWidth')
  console.log(toWidth(width, context, '235px'))

  console.log('toHeight')
  console.log(toHeight(height, context, '26px'))
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
      <Table
        rowSelection={{ ...rowSelection }}
        bordered
        columns={dataTreeHeader}
        dataSource={dataTree}
        {...resprops}
      />
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
