import { Property } from 'csstype'
import Box from '@mui/material/Box'
import { Table } from 'antd'
import '../src/JGDataGrid.css'
// import 'antd/dist/antd.css'
import { ContextProvider, useContext } from '@v-act/widget-context'
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
      key: item.properties.code
    })
  })

  let data: any = []
  if (tablename) {
    data = getEntityDatas(tablename, context)
  }

  // data = [
  //   {
  //     JGTextBoxColumn2: '请问请问'
  //   },
  //   {
  //     JGTextBoxColumn3: '去问我去饿',
  //     JGDateTimePickerColumn6: '2022-01-17',
  //     JGFloatBoxColumn7: '2312',
  //     JGIntegerBoxColumn8: 43534
  //   },
  //   {
  //     JGTextBoxColumn2: '撒地方撒旦',
  //     JGTextBoxColumn4: '阿斯顿发射点',
  //     JGDateTimePickerColumn6: '2022-01-13',
  //     JGFloatBoxColumn7: '233',
  //     JGIntegerBoxColumn8: 65454
  //   },
  //   {
  //     JGTextBoxColumn2: '梵蒂冈的',
  //     JGTextBoxColumn3: 'u一天具体有',
  //     JGTextBoxColumn4: 'utyru它犹如',
  //     JGFloatBoxColumn7: '645',
  //     JGIntegerBoxColumn8: 87
  //   }
  // ]

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

  return (
    <Box
      sx={{
        left: left,
        top: top,
        width: '100%',
        height: '100%',
        position: context.position,
        display: ishide ? 'none' : 'block',
        boxShadow: 'none',
        pointerEvents: readonly ? 'none' : 'auto'
      }}
    >
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
      />
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
