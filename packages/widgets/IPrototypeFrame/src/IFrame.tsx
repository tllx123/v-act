interface IFrameProps {
  src?: string
}
const IFrame = function (props: IFrameProps) {
  const src = props.src
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        border: 0,
        backgroundColor: 'white'
      }}
    >
      {src ? (
        <iframe
          src={props.src}
          style={{
            width: '100%',
            height: '100%',
            border: 0
          }}
        ></iframe>
      ) : null}
    </div>
  )
}
export default IFrame
