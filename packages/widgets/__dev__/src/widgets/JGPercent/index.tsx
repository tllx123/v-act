import { JGComponent } from '@v-act/jgcomponent'
import { JGPercent } from '@v-act/jgpercent'

const Percent = () => {
  return (
    <JGComponent>
      <JGPercent
        width="80%"
        height="80px"
        top="26px"
        left="30px"
        value={100}
      ></JGPercent>
      <JGPercent
        top="126px"
        left="30px"
        value={10}
        fontColor="yellow"
        visible={true}
        frontColor="blue"
        onClick={(a) => {
          console.log(121)
        }}
      ></JGPercent>
    </JGComponent>
  )
}

export default Percent
