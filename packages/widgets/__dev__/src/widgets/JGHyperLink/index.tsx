import { JGHyperLink } from '@v-act/jghyperlink'
import { JGComponent } from '@v-act/jgcomponent'

const HyperLink = () => {
  return (
    <JGComponent>
      <JGHyperLink
        top={33}
        left={57}
        multiHeight="26px"
        multiWidth="188px"
        labelText="文件"
      ></JGHyperLink>
    </JGComponent>
  )
}

export default HyperLink
