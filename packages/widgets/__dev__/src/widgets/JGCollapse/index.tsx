import { JGCollapse, JGCollapsePanel } from '@v-act/jgcollapse'
import { JGComponent } from '@v-act/jgcomponent'

const Collapse = () => {
  return (
    <JGComponent width="100%" height="100%">
      <JGCollapse width="100%" height="100%">
        <JGCollapsePanel title="折叠面板1">
          <button>按钮1</button>
        </JGCollapsePanel>
        <JGCollapsePanel title="折叠面板2">
          <button>按钮2</button>
        </JGCollapsePanel>
        <JGCollapsePanel title="折叠面板3">
          <button>按钮3</button>
        </JGCollapsePanel>
      </JGCollapse>
    </JGComponent>
  )
}

export default Collapse
