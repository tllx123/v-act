import { useRoutes } from 'react-router-dom'

import JGButton from './widgets/JGButton'
import JGImage from './widgets/JGImage'
import JGLabel from './widgets/JGLabel'
import JGNewList from './widgets/JGNewList'
import JGRecordPaging from './widgets/JGRecordPaging'
import JGTextBox from './widgets/JGTextBox'
import JGLongTextBox from './widgets/JGLongTextBox'
import JGCheckBox from './widgets/JGCheckBox'
import JGDateTimePicker from './widgets/JGDateTimePicker'
import JGLongDateTimePicker from './widgets/JGLongDateTimePicker'
import JGQrcode from './widgets/JGQrcode'
const Routes = () =>
  useRoutes([
    {
      path: '/JGButton',
      element: <JGButton />
    },
    {
      path: '/JGLabel',
      element: <JGLabel />
    },
    {
      path: '/JGImage',
      element: <JGImage />
    },
    {
      path: '/JGTextBox',
      element: <JGTextBox />
    },
    {
      path: '/JGNewList',
      element: <JGNewList />
    },
    {
      path: '/JGRecordPaging',
      element: <JGRecordPaging />
    },
    {
      path: '/JGLongTextBox',
      element: <JGLongTextBox />
    },
    {
      path: '/JGCheckBox',
      element: <JGCheckBox />
    },
    {
      path: '/JGDateTimePicker',
      element: <JGDateTimePicker />
    },
    {
      path: '/JGLongDateTimePicker',
      element: <JGLongDateTimePicker />
    },
    {
      path: '/JGQrcode',
      element: <JGQrcode />
    }
  ])

export default Routes
