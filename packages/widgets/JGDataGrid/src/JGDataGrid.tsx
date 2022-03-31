import { Property } from 'csstype'
import Box from '@mui/material/Box'
import { Table } from 'antd'
import '../src/JGDataGrid.css'
// import 'antd/dist/antd.css'
import toTree from 'array-to-tree'
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
  allowMerge?: boolean
  rowsFixedCount?: number
  showGridSummary?: boolean
}

const rowSelection = {
  onChange: (selectedRowKeys: React.Key[], selectedRows: any) => {},
  getCheckboxProps: (record: any) => ({
    name: record.name
  })
}

const JGDataGrid = (props: JGDataGridProps) => {
  const context = useContext()

  console.log('context')
  console.log(context)
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
    control,
    allowMerge,
    rowsFixedCount
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

  if (rowsFixedCount) {
    if (allowMerge) {
      let data: any = []
      control.controls.some((item: any, index: any) => {
        let val = item.properties.labelText.split('|')

        for (let i = 0; i < rowsFixedCount; i++) {
          data.push({
            id: val[i] ? 'a' + (val[i] ? val[i] : '') : i.toString() + 'a',
            pid:
              i == 0
                ? '$$$'
                : val[i - 1]
                ? 'a' + (val[i - 1] ? val[i - 1] : '')
                : (i - 1).toString() + 'a',
            title: val[i] ? val[i] : '',
            dataIndex: item.properties.code,
            width: index == 0 ? 200 : 100,
            align: index == 0 ? undefined : 'center',
            key: item.properties.code,
            ellipsis: adaLineHeight == true ? false : 'enble'
          })
          // dataTreeHeader.push(dataTree[0])
        }
      })

      console.log('data')
      console.log(data)
      let data2 = data.filter((item: any) => {
        return item.id !== item.pid
      })
      console.log('data2')
      console.log(data2)
      // let data3 = deepcopy(data2)

      let map = new Map()
      data2.forEach((item: any, index: any) => {
        if (!map.has(item['id'])) {
          map.set(item['id'], item)
        }
      })
      let data3 = [...map.values()]

      console.log('data3')
      console.log(data3)

      let dataTreeA: any = []
      dataTreeA = toTree(data3, {
        parentProperty: 'pid',
        customID: 'id'
      })
      console.log('dataTreeA')
      console.log(dataTreeA)
      dataTreeA.some((item: any) => {
        dataHeader.push(item)
      })
    } else {
      control.controls.some((item: any, index: any) => {
        let val = item.properties.labelText.split('|')
        let data: any = []

        for (let i = 0; i < rowsFixedCount; i++) {
          data.push({
            id: i.toString() + 'a',
            pid: i == 0 ? '$$$' : (i - 1).toString() + 'a',
            title: val[i] ? val[i] : '',
            dataIndex: item.properties.code,
            width: index == 0 ? 200 : 100,
            align: index == 0 ? undefined : 'center',
            key: item.properties.code,
            ellipsis: adaLineHeight == true ? false : 'enble'
          })
          // dataTreeHeader.push(dataTree[0])
        }
        console.log('data')
        console.log(data)

        let dataTreeA: any = []
        dataTreeA = toTree(data, {
          parentProperty: 'pid',
          customID: 'id'
        })
        console.log('dataTreeA')
        console.log(dataTreeA)
        dataTreeA.some((item: any) => {
          dataHeader.push(item)
        })
      })
    }
  } else {
    control.controls.some((item: any, index: any) => {
      dataHeader.push({
        title: item.properties.labelText,
        dataIndex: item.properties.code,
        width: index == 0 ? 200 : 100,
        align: index == 0 ? undefined : 'center',
        key: item.properties.code,
        ellipsis: adaLineHeight == true ? false : 'enble'
      })
    })
  }

  // control.controls.some((item: any, index: any) => {
  //   dataHeader.push({
  //     title: item.properties.labelText,
  //     dataIndex: item.properties.code,
  //     align: 'center',
  //     key: item.properties.code,
  //     ellipsis: adaLineHeight == true ? false : 'enble'
  //   })
  // })

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
  if (control.headerControls && control.headerControls.length > 0) {
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
          display: 'flex',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ width: '50%', flexShrink: 1 }}>
          {headerDataLeft.length == 0
            ? ''
            : headerDataLeft[0].controls.length > 0
            ? ContextProvider({
                context: { position: 'relative' },
                children: bgconvert(headerDataLeft[0])
              })
            : ''}
        </Box>

        <Box
          sx={{
            width: '50%',
            display: 'flex',
            justifyContent: 'flex-end',
            flexShrink: 1
          }}
        >
          {headerDataRight.length == 0
            ? ''
            : headerDataRight[0].controls.length > 0
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
        // footer={() => 'Footer'}
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
