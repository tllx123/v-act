import { JGPercent } from '@v-act/jgpercent'
import { JGComponent } from '@v-act/jgcomponent'
import { formLabelClasses } from 'packages/templates/v-act-component-template/node_modules/@mui/material'

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
      ></JGPercent>
    </JGComponent>
  )
}

export default Percent
