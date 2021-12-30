import { JGComponent } from '@v-act/jgcomponent'
import { JGRichTextViewer } from '@v-act/jgrichtextviewer'

const RichTextViewer = () => {
  return (
    <JGComponent>
      <JGRichTextViewer
        top="33px"
        left="57px"
        multiHeight="344px"
        multiWidth="395px"
      ></JGRichTextViewer>
    </JGComponent>
  )
}

export default RichTextViewer
