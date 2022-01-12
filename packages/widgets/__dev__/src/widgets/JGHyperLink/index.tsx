import { JGComponent } from '@v-act/jgcomponent'
import { JGHyperLink } from '@v-act/jghyperlink'

const HyperLink = () => {
  return (
    <JGComponent>
      <JGHyperLink
        top={21}
        left={15}
        multiHeight="26px"
        multiWidth="235px"
        labelText="链接"
        labelWidth={60}
        labelVisible={true}
        enabled={true}
      ></JGHyperLink>
    </JGComponent>
  )
}

export default HyperLink
