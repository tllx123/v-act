import { Fragment, useState } from 'react'

import { Property } from 'csstype'

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import { Height, Width } from '@v-act/schema-types'
import { useContext } from '@v-act/widget-context'
import { toHeight, toWidth } from '@v-act/widget-utils'

interface JGCollapseProps {
  left?: Property.Left
  top?: Property.Top
  height?: Height
  width?: Width
  position?: Property.Position
  children?: JSX.Element | JSX.Element[] | null
}

interface JGCollapsePanelProps {
  title?: string
  children?: JSX.Element | JSX.Element[] | null
}

const JGCollapse = (props: JGCollapseProps) => {
  const context = useContext()
  const { left, top } = props
  const height = toHeight(props.height, context, '100%')
  const width = toWidth(props.width, context, '100%')
  const position = props.position || context.position
  return (
    <Box
      sx={{
        left,
        top,
        position,
        height,
        width
      }}
    >
      <List>{props.children}</List>
    </Box>
  )
}

const JGCollapsePanel = function (props: JGCollapsePanelProps) {
  const title = props.title || ''
  const [expand, setExpand] = useState(true)
  const icon = expand ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />
  return (
    <Fragment>
      <ListItem
        sx={{
          padding: '0px',
          paddingBottom: '8px'
        }}
      >
        <div
          style={{
            width: '100%',
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            padding: '0px',
            margin: '0px'
          }}
          onClick={() => {
            setExpand(!expand)
          }}
        >
          <span
            style={{
              width: '4px',
              height: '100%',
              backgroundColor: '#356abb'
            }}
          ></span>
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              marginLeft: '8px',
              borderBottom: '1px solid #DCDEE2'
            }}
          >
            {icon}
            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
              {title}
            </span>
          </div>
        </div>
      </ListItem>
      {expand ? (
        <ListItem
          sx={{
            padding: '0px',
            paddingBottom: '8px'
          }}
        >
          {props.children}
        </ListItem>
      ) : null}
    </Fragment>
  )
}

JGCollapse.defaultProps = {
  width: '100%',
  height: 'auto',
  left: 0,
  top: 0
}
export default JGCollapse
export {
  JGCollapse,
  JGCollapsePanel,
  type JGCollapsePanelProps,
  type JGCollapseProps
}
