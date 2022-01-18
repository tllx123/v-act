import { IPrototypeFrame } from '@v-act/iprototypeframe'
import { JGComponent } from '@v-act/jgcomponent'

const activityPanel = () => {
  return (
    <JGComponent height="100%" width="100%">
      <IPrototypeFrame></IPrototypeFrame>
    </JGComponent>
  )
}

export default activityPanel
