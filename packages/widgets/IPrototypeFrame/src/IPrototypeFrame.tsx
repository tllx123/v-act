import { useState } from 'react'

import { FrameHeader, ListItem } from './FrameHeader'
import IFrame from './IFrame'
import { IndexContent, MenuData } from './IndexContent'

interface IPrototypeFrameProps {
  headMenu?: ListItem[]
  sideMenu?: MenuData[]
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
        logo="http://vstore-proto.yindangu.com/itop/resources/a71806b940171866c8bef08a64028809_Fileno_2.jpg?v=C419D9BE74E453FC280B084C655DCA65A0AC1229"
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
