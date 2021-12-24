import { JGDataGrid } from '@v-act/jgdatagrid'
import { JGComponent } from '@v-act/jgcomponent'
import { JGFormLayout } from '@v-act/jgformlayout'
const datagrid = () => {
  return (
    <JGComponent>
      <JGFormLayout
        left={197}
        top={168}
        multiHeight="content"
        multiWidth="800px"
        groupTitle="分组标题"
      >
        <JGDataGrid />
      </JGFormLayout>
    </JGComponent>
  )
}

export default datagrid
