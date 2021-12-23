import { JGTreeGrid } from '@v-act/jgtreegrid'
import { JGComponent } from '@v-act/jgcomponent'
const treegrid = () => {
  return (
    <JGComponent>
      <JGTreeGrid
        dataTreeHeader={[
          {
            title: 'Name',
            dataIndex: 'name',
            key: 'name'
          },
          {
            title: 'Age',
            dataIndex: 'age',
            key: 'age'
          },
          {
            title: 'Address',
            dataIndex: 'address',

            key: 'address'
          }
        ]}
        data={[
          {
            id: '1',
            key: 1,
            name: 'John Brown sr.',
            age: 60,
            address: 'New York No. 1 Lake Park'
          },
          {
            id: '2',
            pid: '1',
            key: 11,
            name: 'John Brown',
            age: 42,
            address: 'New York No. 2 Lake Park'
          },
          {
            id: '3',
            pid: '2',
            key: 12,
            name: 'John Brown jr.',
            age: 30,
            address: 'New York No. 3 Lake Park'
          },
          {
            id: '4',
            pid: '2',
            key: 13,
            name: 'Jim Green sr.',
            age: 72,
            address: 'London No. 1 Lake Park'
          },
          {
            id: '45',

            key: 131,
            name: 'Jim Green',
            age: 42,
            address: 'London No. 2 Lake Park'
          },
          {
            id: '48',
            pid: '45',
            key: 1312,
            name: 'Jimmy Green sr.',
            age: 18,
            address: 'London No. 4 Lake Park'
          }
        ]}
      />
    </JGComponent>
  )
}

export default treegrid
