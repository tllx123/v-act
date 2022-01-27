import { Property } from 'csstype'
import { Table } from 'antd'
import Box from '@mui/material/Box'
import toTree from 'array-to-tree'
import { ContextProvider, useContext } from '@v-act/widget-context'
import '../src/JGTreeGrid.css'
import { convert as bgconvert } from '@v-act/jgbuttongroup'
import deepcopy from 'deepcopy'
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
  adaLineHeight?: boolean
  cascadeCheck?: boolean
  showRowNumbers?: boolean
  allowMerge?: boolean
  rowsFixedCount?: number
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
    readonly,
    adaLineHeight,
    cascadeCheck,
    showRowNumbers,
    allowMerge,
    rowsFixedCount
  } = props

  let dataTreeHeader: any = []

  if (showRowNumbers) {
    dataTreeHeader.push({
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
      // let data3 =   deepcopy(data2 )

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
        dataTreeHeader.push(item)
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
          dataTreeHeader.push(item)
        })
      })
    }
  } else {
    control.controls.some((item: any, index: any) => {
      dataTreeHeader.push({
        title: item.properties.labelText,
        dataIndex: item.properties.code,
        width: index == 0 ? 200 : 100,
        align: index == 0 ? undefined : 'center',
        key: item.properties.code,
        ellipsis: adaLineHeight == true ? false : 'enble'
      })
    })
  }

  console.log('---dataTemp---')
  let dataTemp: any = []

  if (tablename) {
    dataTemp = getEntityDatas(tablename, context)
  }

  if (dataTemp) {
    dataTemp.some((item2: any, index: any) => {
      item2.key = index
    })
  }

  // dataTemp = [
  //   {
  //     id: '1',
  //     JGTextBoxColumn111: '文件夹-1可直接返回第四u回复框上支付货款董事长',
  //     IsLeaf: false,
  //     key: 0
  //   },
  //   {
  //     id: '2',
  //     PID: '1',
  //     JGTextBoxColumn111: '文件1-1',
  //     IsLeaf: true,
  //     key: 1
  //   },
  //   {
  //     id: '3',
  //     PID: '1',
  //     JGTextBoxColumn111: '文件1-2',
  //     IsLeaf: true,
  //     key: 2
  //   },
  //   {
  //     id: '4',
  //     JGTextBoxColumn111: '文件夹-2',
  //     IsLeaf: false,
  //     key: 3
  //   },
  //   {
  //     id: '5',
  //     PID: '4',
  //     JGTextBoxColumn111: '文件2-1',
  //     IsLeaf: true,
  //     key: 4
  //   },
  //   {
  //     id: '6',
  //     PID: '4',
  //     JGTextBoxColumn111: '文件2-2',
  //     IsLeaf: true,
  //     key: 5
  //   }
  // ]
  // console.log(dataTemp)

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
            display: 'flex',
            justifyContent: 'flex-end',
            flexShrink: 1
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
        onRow={(record) => {
          return {
            onClick: clickProps
          }
        }}
        scroll={{
          y: toHeight(height, context, '26px'),
          x: toWidth(width, context, '235px')
        }}
        rowSelection={{ ...rowSelection, checkStrictly: cascadeCheck }}
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
