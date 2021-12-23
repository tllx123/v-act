import { JGDataGrid } from '@v-act/jgdatagrid'
import { JGComponent } from '@v-act/jgcomponent'
const datagrid = () => {
  return (
    <JGComponent>
      <JGDataGrid
        data={[
          { id: '1', name: '11', num: '120' },
          { id: '2', name: '22', num: '122' },
          { id: '3', name: '33', num: '130' },
          { id: '4', name: '44', num: '140' }
        ]}
        dataHeader={[
          { code: 'id', name: 'id号' },
          { code: 'name', name: '名称' },
          { code: 'num', name: '数量' }
        ]}
      />

      <JGDataGrid
        top={500}
        width={300}
        height={300}
        data={[
          { id: '1', name: '11', num: '120' },
          { id: '2', name: '22', num: '122' },
          { id: '3', name: '33', num: '130' },
          { id: '4', name: '44', num: '140' }
        ]}
        dataHeader={[
          { code: 'id', name: 'id号' },
          { code: 'name', name: '名称' },
          { code: 'num', name: '数量' }
        ]}
      />
    </JGComponent>
  )
}

export default datagrid
