import { JGComponent } from '@v-act/jgcomponent'
import { JGWorkFlowGraph } from '@v-act/jgworkflowgraph'

const workFlowGraph = () => {
  return (
    <JGComponent>
      <JGWorkFlowGraph
        top="143px"
        left="296px"
        multiWidth="137px"
        multiHeight="161px"
      ></JGWorkFlowGraph>
    </JGComponent>
  )
}

export default workFlowGraph
