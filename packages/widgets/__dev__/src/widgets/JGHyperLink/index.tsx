import { JGComponent } from '@v-act/jgcomponent'
import { JGHyperLink } from '@v-act/jghyperlink'

const HyperLink = () => {
  return (
    <JGComponent>
      <JGHyperLink
        top={21}
        left={15}
        multiHeight="44px"
        multiWidth="352px"
        labelText="链接"
      ></JGHyperLink>
    </JGComponent>
  )
}

export default HyperLink
