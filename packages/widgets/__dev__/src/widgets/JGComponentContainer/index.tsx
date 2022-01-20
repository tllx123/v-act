import { JGComponentContainer, convert } from '@v-act/jgcomponentcontainer'
import { JGComponent } from '@v-act/jgcomponent'
const componentcontainer = () => {
  return (
    <JGComponent>
      {convert({
        type: 'JGComponentContainer',
        properties: {
          code: 'JGComponentContainer16',
          height: '266',
          left: '544',
          multiHeight: '266px',
          multiWidth: '439px',
          percentHeight: '38.4%',
          percentWidth: '38.1%',
          tabIndex: '1',
          top: '125',
          width: '439'
        },
        headerControls: [],
        controls: [],
        dataBindings: [
          {
            dataSource: 'formAllFreeEntity',
            dataMembers: []
          }
        ],
        events: [
          {
            code: 'OnContainerInited',
            name: ''
          }
        ]
      })}
    </JGComponent>
  )
}

export default componentcontainer
