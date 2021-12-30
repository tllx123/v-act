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
    fontWeight: 'bold'
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0
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
        height: toHeight(height, context, '300px'),
        position: context.position,
        display: ishide ? 'none' : 'block',
        border: '1px solid #DCDEE2',
        boxShadow: 'none'
      }}
      component={Paper}
    >
      <Table sx={{ minWidth: 650 }} size="small" {...resprops}>
        <TableHead>
          <TableRow
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            key="80000"
          >
            {dataHeader?.map((row) => (
              <StyledTableCell component="th" scope="row" key={row.code}>
                {row.name}
              </StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row: any) => (
            <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              {dataHeader?.map((item) => (
                <TableCell scope="row" key={item.code}>
                  {row[item.code]}
                </TableCell>
              ))}
            </TableRow>
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
  height: '500px',
  position: 'absolute',
  data: [
    { id: '1', name: '11', num: '120', key: '1' },
    { id: '2', name: '22', num: '122', key: '2' },
    { id: '3', name: '33', num: '130', key: '3' },
    { id: '4', name: '44', num: '140', key: '4' }
  ],
  dataHeader: [
    { code: 'id', name: 'id号', key: '5' },
    { code: 'name', name: '名称', key: '6' },
    { code: 'num', name: '数量', key: '7' }
  ]
}

export default JGDataGrid
