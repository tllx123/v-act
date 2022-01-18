import FrameHeader from './FrameHeader'

interface IPrototypeFrameProps {}

const IPrototypeFrame = function (props: IPrototypeFrameProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%'
      }}
    >
      <FrameHeader logo="http://vstore-proto.yindangu.com/itop/resources/a71806b940171866c8bef08a64028809_Fileno_2.jpg?v=C419D9BE74E453FC280B084C655DCA65A0AC1229"></FrameHeader>
    </div>
  )
}

export { IPrototypeFrame, type IPrototypeFrameProps }
