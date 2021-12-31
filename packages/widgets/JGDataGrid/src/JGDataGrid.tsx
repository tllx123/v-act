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
    {
      index: '1',
      id: '440883',
      name: '张三',
      num: '男',
      text1: '181cm',
      text2: '56kg',
      text3: '$56',
      text4: '2000-01-23',
      text5: '***',
      text6: '***.JPG',
      key: '1'
    },
    {
      index: '2',
      id: '440884',
      name: '李四',
      num: '男',
      text1: '171cm',
      text2: '63kg',
      text3: '$76',
      text4: '2001-01-23',
      text5: '***',
      text6: '***.JPG',
      key: '2'
    },
    {
      index: '3',
      id: '440885',
      name: '王五',
      num: '男',
      text1: '176cm',
      text2: '68kg',
      text3: '$16',
      text4: '2006-01-23',
      text5: '***',
      text6: '***.JPG',
      key: '3'
    },
    {
      index: '4',
      id: '440886',
      name: '赵六',
      num: '女',
      text1: '168cm',
      text2: '50kg',
      text3: '$66',
      text4: '2003-01-23',
      text5: '***',
      text6: '***.JPG',
      key: '4'
    },
    {
      index: '5',
      id: '440887',
      name: '孙七',
      num: '女',
      text1: '162cm',
      text2: '45kg',
      text3: '$86',
      text4: '2005-01-23',
      text5: '***',
      text6: '***.JPG',
      key: '5'
    },
    {
      index: '6',
      id: '440888',
      name: '周八',
      num: '男',
      text1: '173cm',
      text2: '60kg',
      text3: '$96',
      text4: '2004-01-23',
      text5: '***',
      text6: '***.JPG',
      key: '6'
    },
    {
      index: '7',
      id: '440889',
      name: '吴九',
      num: '男',
      text1: '172cm',
      text2: '70kg',
      text3: '$06',
      text4: '2009-01-23',
      text5: '***',
      text6: '***.JPG',
      key: '7'
    }
  ],
  dataHeader: [
    { code: 'index', name: '', key: '8' },
    { code: 'id', name: '文本', key: '9' },
    { code: 'name', name: '文本', key: '10' },
    { code: 'num', name: '文本', key: '11' },
    { code: 'text1', name: '文本', key: '12' },
    { code: 'text3', name: '小数', key: '13' },
    { code: 'text2', name: '下拉选择', key: '14' },
    { code: 'text4', name: '日期', key: '15' },
    { code: 'text5', name: '弹出选择', key: '16' },
    { code: 'text6', name: '图片', key: '17' }
  ]
}

export default JGDataGrid
