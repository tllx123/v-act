import { Property } from 'csstype'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { useContext } from '@v-act/widget-context'
import { toHeight, toWidth } from '@v-act/widget-utils'
import { styled } from '@mui/material/styles'
import Paper from '@mui/material/Paper'
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

const StyledTableRow = styled(TableRow)(({ theme }) => ({
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
    data,
    dataHeader,
    ishide,
    ...resprops
  } = props

  return (
    <TableContainer
      sx={{
        left: left,
        top: top,
        width: '100%',
        height: '100%',
        position: context.position,
        display: ishide ? 'none' : 'block',
        // border: '1px solid #DCDEE2',
        boxShadow: 'none'
      }}
      component={Paper}
    >
      <Table sx={{ width: '100%', height: '100%' }} size="small" {...resprops}>
        <TableHead>
          <TableRow key="80000">
            {dataHeader?.map((row) => (
              <StyledTableCell
                sx={{ border: '1px solid #DCDEE2' }}
                component="th"
                scope="row"
                key={row.code}
              >
                {row.name}
              </StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row: any) => (
            <StyledTableRow key={row.id}>
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
  )
}

JGDataGrid.defaultProps = {
  left: '20px',
  top: '50px',
  width: '800px',
  height: 'auto',
  position: 'absolute',
  data: [
    { index: '1', name: '', num: '', key: '1' },
    { index: '2', name: '', num: '', key: '2' },
    { index: '3', name: '', num: '', key: '3' },
    { index: '4', name: '', num: '', key: '4' },
    { index: '5', name: '', num: '', key: '4' },
    { index: '6', name: '', num: '', key: '4' },
    { index: '7', name: '', num: '', key: '4' }
  ],
  dataHeader: [
    { code: 'index', name: '', key: '8' },
    { code: 'id', name: '文本', key: '5' },
    { code: 'name', name: '文本', key: '6' },
    { code: 'num', name: '文本', key: '7' },
    { code: 'text1', name: '文本', key: '5' },
    { code: 'text2', name: '小数', key: '6' },
    { code: 'text3', name: '下拉选择', key: '7' },
    { code: 'text4', name: '日期', key: '5' },
    { code: 'text5', name: '弹出选择', key: '6' },
    { code: 'text6', name: '图片', key: '7' }
  ]
}

export default JGDataGrid
