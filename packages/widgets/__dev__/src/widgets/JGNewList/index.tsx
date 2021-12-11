import { JGComponent } from '@v-act/jgcomponent'
import { JGNewList } from 'packages/widgets/JGNewsList/dist'

const Button = () => {
  return (
    <JGComponent>
      <JGNewList
        top="32px"
        left="89px"
        height="188px"
        width="350px"
      ></JGNewList>

      <JGNewList
        top="32px"
        left="500px"
        height="368px"
        width="350px"
      ></JGNewList>
    </JGComponent>
  )
}

export default Button
