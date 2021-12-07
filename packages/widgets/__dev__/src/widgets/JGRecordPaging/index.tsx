import { JGComponent } from '@v-act/jgcomponent'
import { JGRecordPaging } from '@v-act/jgrecordpaging'

const Button = () => {
  return (
    <JGComponent>
      <JGRecordPaging
        count={10}
        top="74px"
        left="85px"
        height="25px"
        width="222px"
      ></JGRecordPaging>

      <JGRecordPaging
        count={10}
        top="136px"
        left="300px"
        height="25px"
        width="222px"
      ></JGRecordPaging>
    </JGComponent>
  )
}

export default Button
