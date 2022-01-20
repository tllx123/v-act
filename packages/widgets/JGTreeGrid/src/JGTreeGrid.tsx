import { Property } from 'csstype'
import { Table, Switch, Space } from 'antd'
// import 'antd/dist/antd.css'
import Box from '@mui/material/Box'
import toTree from 'array-to-tree'
import { useContext } from '@v-act/widget-context'
import '../src/JGTreeGrid.css'
import {
  toHeight,
  toWidth,
  getEntityDatas,
  getCompEvent
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
  readonly?: boolean
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
    readonly
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
  let dataTemp: any = []

  if (tablename) {
    dataTemp = getEntityDatas(tablename, context)
  }

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

  let clickProps = () => {}

  if (getCompEvent(control).hasOwnProperty('OnClick')) {
    clickProps = getCompEvent(control).OnClick
  }

  return (
    <Box
      sx={{
        left: left,
        top: top,
        width: toWidth(width, context, '235px'),
        height: toHeight(height, context, '26px'),
        position: context.position,
        pointerEvents: readonly ? 'none' : 'auto'
      }}
    >
      <Table
        onRow={(record) => {
          return {
            onClick: clickProps
          }
        }}
        scroll={{
          y: toHeight(height, context, '26px'),
          x: toWidth(width, context, '235px')
        }}
        rowSelection={{ ...rowSelection }}
        bordered
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
