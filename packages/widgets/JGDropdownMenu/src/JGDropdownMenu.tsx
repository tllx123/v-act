import * as React from 'react'

import { Property } from 'csstype'

import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp'
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import MuiAccordionSummary, {
  AccordionSummaryProps
} from '@mui/material/AccordionSummary'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

type navNode = {
  text: string
}

interface navData {
  panelText: string
  nodes?: Array<navNode>
}

interface JGDropdownMenuProps extends AccordionProps {
  /**
   * 左边距
   */
  left?: Property.Left
  /**
   * 上边距
   */
  top?: Property.Top
  /**
   * 高度
   */
  multiHeight?: Property.Height
  /**
   * 宽度
   */
  multiWidth?: Property.Width
  /**
   * 显示
   */
  visible?: boolean
  /**
   * 显示宽度
   */
  width?: Property.Width

  /**
   * 显示高度
   */
  height?: Property.Height

  children: NonNullable<React.ReactNode>

  navData?: Array<navData>
}

const Accordion = styled((props: JGDropdownMenuProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  'backgroundColor': 'transparent',
  '&:before': {
    display: 'none'
  }
}))

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  'backgroundColor': 'transparent',
  'flexDirection': 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)'
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1)
  },
  'minHeight': '38px',
  '& .css-wc12p6-MuiButtonBase-root-MuiAccordionSummary-root .MuiAccordionSummary-content':
    {
      padding: 0,
      margin: '0 0 0 8px'
    },
  '& .css-ahj2mt-MuiTypography-root': {
    'fontSize': '14px',
    '&:hover': {
      color: '#356abb'
    }
  }
}))

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  'padding': 0,
  '& .css-ahj2mt-MuiTypography-root': {
    fontSize: '14px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '42px'
  },
  '& .css-ahj2mt-MuiTypography-root:hover': {
    color: '#356abb',
    cursor: ''
  }
}))

const JGDropdownMenu = function (props: JGDropdownMenuProps) {
  const [expanded, setExpanded] = React.useState<string | false>('panel1')

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false)
    }
  const navWrap: React.CSSProperties = {
    width: props.width || props.multiWidth,
    height: props.height || props.multiHeight,
    fontSize: '14px',
    backgroundColor: '#ececec',
    position: 'absolute',
    left: props.left,
    top: props.top,
    fontFamily:
      'Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,\\5FAE\\8F6F\\96C5\\9ED1,Arial,sans-serif'
  }
  return (
    <div style={navWrap}>
      {props.navData.length &&
        props.navData.map((val, i) => (
          <Accordion
            expanded={expanded === 'panel' + i}
            onChange={handleChange('panel' + i)}
            key={i}
          >
            <AccordionSummary
              aria-controls={'panel-content' + i}
              id={'panel-header' + i}
            >
              <Typography>{val.panelText}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {val.nodes.map((nodeVal, nodeIndex) => (
                <Typography key={nodeIndex}>{nodeVal.text}</Typography>
              ))}
            </AccordionDetails>
          </Accordion>
        ))}
    </div>
  )
}
JGDropdownMenu.defaultProps = {
  left: 0,
  top: 0,
  multiHeight: 419,
  multiWidth: 194,
  visible: true,
  navData: [
    {
      panelText: '看板21',
      nodes: [
        {
          text: '看板1 - 子项1'
        },
        {
          text: '看板1 - 子项2'
        }
      ]
    },
    {
      panelText: '看板2',
      nodes: [
        {
          text: '看板2 - 子项1'
        },
        {
          text: '看板2 - 子项2'
        }
      ]
    }
  ]
}
export default JGDropdownMenu
export { JGDropdownMenu, JGDropdownMenuProps }
