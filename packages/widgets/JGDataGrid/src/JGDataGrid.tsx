import { Property } from 'csstype'
import Box from '@mui/material/Box'
import { Table } from 'antd'
import '../src/JGDataGrid.css'
import 'antd/dist/antd.css'
import { ContextProvider, useContext } from '@v-act/widget-context'
import { convert as bgconvert } from '@v-act/jgbuttongroup'
import deepcopy from 'deepcopy'
import {
  toHeight,
  toWidth,
  getEntityDatas,
  getCompEvent
} from '@v-act/widget-utils'
interface dataHeader {
  code: string
  name: string
}

export interface JGDataGridProps {
  left?: Property.Left
  top?: Property.Top
  position?: Property.Position
  height?: Property.Height
  width?: Property.Width
  readonly?: boolean
  ishide?: boolean
  data?: any
  dataHeader?: Array<dataHeader>
  tablename?: string | null
  columnname?: string | null
  control?: any
  rowHeight?: string
  showRowNumbers?: boolean
  chooseMode?: string
  adaLineHeight?: boolean
}

const rowSelection = {
  onChange: (selectedRowKeys: React.Key[], selectedRows: any) => {},
  getCheckboxProps: (record: any) => ({
    name: record.name
  })
}

const JGDataGrid = (props: JGDataGridProps) => {
  const context = useContext()
  const {
    left,
    top,
    height,
    width,
    readonly,
    rowHeight,
    chooseMode,
    showRowNumbers,
    ishide,
    tablename,
    adaLineHeight,
    control
  } = props

  let dataHeader: Array<any> = []

  if (showRowNumbers) {
    dataHeader.push({
      title: '',
      dataIndex: '####3',
      align: 'center',
      width: 50,
      render(text: any, record: any, index: any) {
        return index + 1
      }
    })
  }

  control.controls.some((item: any, index: any) => {
    dataHeader.push({
      title: item.properties.labelText,
      dataIndex: item.properties.code,
      align: 'center',
      key: item.properties.code,
      ellipsis: adaLineHeight == true ? false : 'enble'
    })
  })

  let data: any = []
  if (tablename) {
    data = getEntityDatas(tablename, context)
  }

  if (Array.isArray(data)) {
    data.some((item: any, index: any) => {
      item.key = index + 'grid'
    })
  }

  let headerControlTemp = []
  if (control.headerControls) {
    console.log('control.headerControls[0].controls')
    console.log(control.headerControls[0].controls)
    headerControlTemp = control.headerControls[0].controls
  }

  let tableProp: any = {}
  if (chooseMode === '3') {
    tableProp.rowSelection = rowSelection
  }

  let clickProps = () => {}

  if (getCompEvent(control).hasOwnProperty('OnClick')) {
    clickProps = getCompEvent(control).OnClick
  }

  let headerDataLeft: any = deepcopy(control.headerControls)
  let headerDataRight: any = deepcopy(control.headerControls)

  if (control.headerControls.length > 0) {
    if (headerDataLeft.length > 0) {
      headerDataLeft[0].controls = []
      headerDataRight[0].controls = []
      control.headerControls[0].controls.some((item: any) => {
        console.log('item.properties.align')
        console.log(item.properties.align)
        if (item.properties.align) {
          // item.properties.height = 'auto'
          // item.properties.showBorder = false

          headerDataRight[0].controls.push(item)
          headerDataRight[0].properties.top = 0
          headerDataRight[0].properties.showBorder = 'false'
          headerDataRight[0].properties.size = 0
          headerDataRight[0].properties.align = 'end'
        } else {
          item.properties.size = 0
          headerDataLeft[0].controls.push(item)
          headerDataLeft[0].properties.top = 0
          headerDataLeft[0].properties.showBorder = 'false'
          headerDataLeft[0].properties.size = 0
        }
      })
    }
  }

  return (
    <Box
      sx={{
        left: left,
        top: top,
        width: toWidth(width, context, '235px'),
        height: toHeight(height, context, '26px'),
        position: context.position,
        display: ishide ? 'none' : 'block',
        boxShadow: 'none',
        pointerEvents: readonly ? 'none' : 'auto'
      }}
    >
      <Box
        sx={{
          display: 'flex'
          // justifyContent: 'space-between',
        }}
      >
        <Box sx={{ width: '50%', overflow: 'hidden' }}>
          {headerDataLeft.length == 1
            ? ContextProvider({
                context: { position: 'relative' },
                children: bgconvert(headerDataLeft[0])
              })
            : ''}
        </Box>

        <Box
          sx={{
            width: '50%',
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'flex-end'
          }}
        >
          {headerDataRight.length == 1
            ? ContextProvider({
                context: { position: 'relative' },
                children: bgconvert(headerDataRight[0])
              })
            : ''}
        </Box>
      </Box>
      <Table
        {...tableProp}
        onRow={(record) => {
          return {
            onClick: clickProps
          }
        }}
        scroll={{
          y: toHeight(height, context, '26px'),
          x: toWidth(width, context, '235px')
        }}
        bordered
        columns={dataHeader}
        dataSource={data}
        size="small"
        pagination={false}
      ></Table>
    </Box>
  )
}

JGDataGrid.defaultProps = {
  left: '20px',
  top: '50px',
  width: '800px',
  height: 'auto',
  position: 'absolute',
  data: []
}

export default JGDataGrid
