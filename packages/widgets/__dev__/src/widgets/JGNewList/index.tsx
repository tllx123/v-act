import { JGComponent } from '@v-act/jgcomponent'
import { JGNewsList } from '@v-act/jgnewslist'

const Button = () => {
  return (
    <JGComponent>
      <JGNewsList
        top="32px"
        left="89px"
        height="188px"
        width="350px"
      ></JGNewsList>

      <JGNewsList
        top="32px"
        left="500px"
        height="368px"
        width="350px"
      ></JGNewsList>
    </JGComponent>
  )
}

export default Button
