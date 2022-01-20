import { useState } from 'react'

import { FrameHeader } from './FrameHeader'
import IFrame from './IFrame'
import { IndexContent, MenuData } from './IndexContent'
import { ListItem } from './utils'

interface IPrototypeFrameProps {
  headMenu?: ListItem[]
  sideMenu?: MenuData[]
  logo?: string
}

const IPrototypeFrame = function (props: IPrototypeFrameProps) {
  const [headerItem, setHeaderItem] = useState<ListItem | null>(null)
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%'
      }}
    >
      <FrameHeader
        list={props.headMenu}
        onMenuChange={(item) => {
          setHeaderItem(item)
        }}
        logo={props.logo}
      ></FrameHeader>
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexGrow: 1
        }}
      >
        {headerItem == null || headerItem.type == 'index' ? (
          <IndexContent menu={props.sideMenu}></IndexContent>
        ) : (
          <IFrame src={headerItem.data}></IFrame>
        )}
      </div>
    </div>
  )
}

export { IPrototypeFrame, type IPrototypeFrameProps }
