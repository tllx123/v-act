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
  click?: Function
}

interface navDataItem {
  panelText: string
  nodes?: Array<navNode>
}

interface JGNavigatorProps extends AccordionProps {
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

  navData?: Array<navDataItem>
  /**
   * 是否收回菜单
   */
  isMulOpened?: boolean
  /**
   * 是否打开第一个
   */
  openPanelOnLoad?: boolean
}

const Accordion = styled((props: JGNavigatorProps) => (
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
    cursor: 'pointer'
  }
}))

const JGNavigator = function (props: JGNavigatorProps) {
  const [expanded, setExpanded] = React.useState<string | false>(
    props.openPanelOnLoad ? 'panel0' : false
  )

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      // if (props.isMulOpened) {
      //   setExpanded(newExpanded ? panel : false)
      // } else {
      //   if (expanded !== panel) setExpanded(newExpanded ? panel : false)
      // }
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
      {props.navData &&
        props.navData.length &&
        props.navData.map((val, i) => (
          <Accordion
            expanded={props.isMulOpened ? void 0 : expanded === 'panel' + i}
            onChange={handleChange('panel' + i)}
            key={i}
            defaultExpanded={props.openPanelOnLoad && i === 0 ? true : void 0}
          >
            <AccordionSummary
              aria-controls={'panel-content' + i}
              id={'panel-header' + i}
            >
              <Typography>{val.panelText}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {val.nodes &&
                val.nodes.map((nodeVal, nodeIndex) => (
                  <Typography
                    key={nodeIndex}
                    onClick={() => {
                      console.log('nodeVal', nodeVal)
                      if (nodeVal.click) {
                        nodeVal.click.apply(this)
                      }
                    }}
                  >
                    {nodeVal.text}
                  </Typography>
                ))}
            </AccordionDetails>
          </Accordion>
        ))}
    </div>
  )
}
JGNavigator.defaultProps = {
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
  ],
  isMulOpened: false,
  openPanelOnLoad: true
}
export default JGNavigator
export { JGNavigator }
export type { JGNavigatorProps }
