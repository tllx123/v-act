import { Property } from 'csstype'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Box from '@mui/material/Box'
import { convert as buttongroupConvert } from '@v-act/jgbuttongroup'

import {
  ContextProvider,
  createContext,
  useContext
} from '@v-act/widget-context'
import {
  toHeight,
  toLabelWidth,
  toWidth,
  getEntityDatas
} from '@v-act/widget-utils'
import { styled } from '@mui/material/styles'
import Paper from '@mui/material/Paper'
import { height } from '@mui/system'
interface dataHeader {
  code: string
  name: string
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: 'rgb(246, 247, 251)',
    fontWeight: 'bold',

    textAlign: 'center'
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    borderRight: '1px solid #DCDEE2'
  }
}))

const StyledTableRow = styled(TableRow)(() => ({
  '&:nth-of-type(odd)': {
    backgroundColor: '#FBFBFB'
  }
}))

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
}

const JGDataGrid = (props: JGDataGridProps) => {
  const context = useContext()
  const {
    left,
    top,
    height,
    width,
    position,
    readonly,
    rowHeight,
    // dataHeader,
    ishide,
    tablename,
    control
  } = props

  let dataHeader: Array<any> = []
  control.controls.some((item: any, index: any) => {
    dataHeader.push({
      code: item.properties.code,
      name: item.properties.labelText,
      key: index + 'head'
    })
  })

  console.log('---data---')
  let data: any
  if (tablename) {
    data = getEntityDatas(tablename, context)
  }

  data = [
    {
      JGTextBoxColumn2: '请问请问'
    },
    {
      JGTextBoxColumn3: '去问我去饿',
      JGDateTimePickerColumn6: '2022-01-17',
      JGFloatBoxColumn7: '2312',
      JGIntegerBoxColumn8: 43534
    },
    {
      JGTextBoxColumn2: '撒地方撒旦',
      JGTextBoxColumn4: '阿斯顿发射点',
      JGDateTimePickerColumn6: '2022-01-13',
      JGFloatBoxColumn7: '233',
      JGIntegerBoxColumn8: 65454
    },
    {
      JGTextBoxColumn2: '梵蒂冈的',
      JGTextBoxColumn3: 'u一天具体有',
      JGTextBoxColumn4: 'utyru它犹如',
      JGFloatBoxColumn7: '645',
      JGIntegerBoxColumn8: 87
    }
  ]

  if (Array.isArray(data)) {
    data.some((item: any, index: any) => {
      item.key = index + 'grid'
    })
  }

  console.log('dataHeader')
  console.log(dataHeader)
  console.log('data')
  console.log(data)

  let headerControlTemp = []
  if (control.headerControls) {
    console.log('control.headerControls[0].controls')
    console.log(control.headerControls[0].controls)
    headerControlTemp = control.headerControls[0].controls
  }

  const loadMenu = (headerControl: any) => {
    let param: any = {
      context: { position: 'relative' },
      children: buttongroupConvert(headerControl[0])
    }
    return ContextProvider(param)
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
        boxShadow: 'none'
      }}
    >
      {/* {headerControlTemp.length > 0 ? loadMenu(headerControlTemp) : <Box sx={{ width: '200px', height: '200px', background: '#000' }}></Box>} */}

      <TableContainer
        sx={{
          display: ishide ? 'none' : 'block',
          boxShadow: 'none'
        }}
        component={Paper}
      >
        <Table sx={{ width: '100%' }} size="small">
          <TableHead>
            <TableRow key="80000">
              {dataHeader?.map((row) => (
                <StyledTableCell
                  sx={{ border: '1px solid #DCDEE2' }}
                  component="th"
                  scope="row"
                  key={row.key}
                >
                  {row.name}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row: any) => (
              <StyledTableRow key={row.key} sx={{ height: rowHeight }}>
                {dataHeader?.map((item) => (
                  <TableCell
                    sx={{ border: '1px solid #DCDEE2!important' }}
                    scope="row"
                    key={item.code}
                  >
                    {row[item.code]}
                  </TableCell>
                ))}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
