import { Property } from 'csstype'
import { Table, Switch, Space } from 'antd'
import 'antd/dist/antd.css'
import Box from '@mui/material/Box'
import toTree from 'array-to-tree'
import { useContext } from '@v-act/widget-context'
import '../src/JGTreeGrid.css'
import { toHeight, toWidth } from '@v-act/widget-utils'
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
    data,
    tablename,
    control,
    labelText,
    ...resprops
  } = props

  let dataTreeHeader: any = []

  control.controls.some((item: any, index: any) => {
    dataTreeHeader.push({
      title: item.properties.labelText,
      dataIndex: item.properties.code,
      width: index == 0 ? 200 : 100,
      align: index == 0 ? undefined : 'center',
      key: item.properties.code
    })
  })

  console.log('---dataTemp---')
  let dataTemp: any = [
    {
      id: '1',
      JGTextBoxColumn2: '文件夹-1',
      IsLeaf: false,
      key: 0
    },
    {
      id: '2',
      PID: '1',
      JGTextBoxColumn2: '文件1-1',
      IsLeaf: true,
      JGTextBoxColumn3: '尔特人',
      JGTextBoxColumn4: '儿童',
      JGPeriodColumn6: '24234',
      JGImageColumn7: '234',
      key: 1
    },
    {
      id: '3',
      PID: '1',
      JGTextBoxColumn2: '文件1-2',
      IsLeaf: true,
      JGComboBoxColumn9: '234',
      key: 2
    },
    {
      id: '4',
      PID: '3',
      JGTextBoxColumn2: '温柔',
      IsLeaf: false,
      JGTextBoxColumn3: '委任为',
      JGPercentColumn8: '234',
      key: 3
    },
    {
      id: '5',
      PID: '4',
      JGTextBoxColumn2: '有人提议',
      IsLeaf: false,
      JGTextBoxColumn4: 'er特瑞特',
      JGImageColumn7: '认为其二r',
      key: 4
    },
    {
      id: '6',
      PID: '5',
      JGTextBoxColumn2: '体育体育',
      IsLeaf: true,
      JGTextBoxColumn3: 'w二',
      JGPeriodColumn6: '去微软',
      key: 5
    },
    {
      id: '7',
      PID: '1',
      JGTextBoxColumn2: '请问温柔',
      IsLeaf: true,
      JGTextBoxColumn3: 'r委任为',
      JGTextBoxColumn4: 'er他',
      JGImageColumn7: '234',
      JGPercentColumn8: '234',
      key: 6
    },
    {
      id: '8',
      PID: '1',
      JGTextBoxColumn2: '温柔',
      IsLeaf: true,
      JGTextBoxColumn4: '位',
      JGComboBoxColumn9: '234',
      key: 7
    },
    {
      id: '9',
      PID: '1',
      JGTextBoxColumn2: 'e让他',
      IsLeaf: true,
      JGImageColumn7: '我去人',
      key: 8
    },
    {
      id: '10',
      JGTextBoxColumn2: '文件夹-2',
      IsLeaf: false,
      key: 9
    },
    {
      id: '11',
      PID: '10',
      JGTextBoxColumn2: '文件2-1',
      IsLeaf: true,
      JGTextBoxColumn4: '234',
      JGImageColumn7: '234',
      JGPercentColumn8: '34',
      JGComboBoxColumn9: '234',
      key: 10
    },
    {
      id: '12',
      PID: '10',
      JGTextBoxColumn2: '文件2-2',
      IsLeaf: true,
      JGPeriodColumn6: '234',
      key: 11
    },
    {
      id: '13',
      IsLeaf: true,
      JGImageColumn7: '234',
      JGPercentColumn8: '234',
      JGComboBoxColumn9: '234',
      key: 12
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

  // console.log('dataTreeHeader')
  // console.log(dataTreeHeader)
  // console.log('dataTemp')
  // console.log(dataTemp)
  // console.log('dataTree')
  // console.log(dataTree)

  // console.log('toWidth')
  // console.log(toWidth(width, context, '235px'))

  // console.log('toHeight')
  // console.log(toHeight(height, context, '26px'))

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
      <Table
        scroll={{
          y: toHeight(height, context, '26px'),
          x: toWidth(width, context, '235px')
        }}
        rowSelection={{ ...rowSelection }}
        bordered
        // childrenColumnName=""
        columns={dataTreeHeader}
        dataSource={dataTree}
        size="small"
        pagination={false}
      />
    </Box>
  )
}

JGTreeGrid.defaultProps = {
  left: '100px',
  top: '50px',
  width: '800px',
  height: '600px',
  position: 'absolute'
}

export default JGTreeGrid
