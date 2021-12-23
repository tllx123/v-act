import { Property } from 'csstype'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { useContext } from '@v-act/widget-context'
import { toHeight, toLabelWidth, toWidth } from '@v-act/widget-utils'
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
        width: toWidth(width, context, '235px'),
        height: toHeight(height, context, '26px'),
        position: context.position,
        display: ishide ? 'none' : 'block'
      }}
    >
      <Table sx={{ minWidth: 650 }} size="small" {...resprops}>
        <TableHead>
          <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            {dataHeader?.map((row) => (
              <TableCell component="th" scope="row" key={row.code}>
                {row.name}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              {dataHeader?.map((item) => (
                <TableCell scope="row">{row[item.code]}</TableCell>
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
    { id: '1', name: '11', num: '120' },
    { id: '2', name: '22', num: '122' },
    { id: '3', name: '33', num: '130' },
    { id: '4', name: '44', num: '140' }
  ],
  dataHeader: [
    { code: 'id', name: 'id号' },
    { code: 'name', name: '名称' },
    { code: 'num', name: '数量' }
  ]
}

export default JGDataGrid
