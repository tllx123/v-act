import { useRoutes } from 'react-router-dom'

import Home from './widgets/Home'
import JGAttachment from './widgets/JGAttachment'
import JGButton from './widgets/JGButton'
import JGFloatBox from './widgets/JGFloatBox'
import JGImage from './widgets/JGImage'
import JGIntegerBox from './widgets/JGIntegerBox'
import JGLabel from './widgets/JGLabel'
import JGLocateBox from './widgets/JGLocateBox'
import JGNewList from './widgets/JGNewList'
import JGPassword from './widgets/JGPassword'
import JGPeriod from './widgets/JGPeriod'
import JGPortal from './widgets/JGPortal'
import JGRecordPaging from './widgets/JGRecordPaging'
import JGSteps from './widgets/JGSteps'
import JGTabControl from './widgets/JGTabControl'
import JGTextBox from './widgets/JGTextBox'
import JGLongTextBox from './widgets/JGLongTextBox'
import JGCheckBox from './widgets/JGCheckBox'
import JGDateTimePicker from './widgets/JGDateTimePicker'
import JGLongDateTimePicker from './widgets/JGLongDateTimePicker'
import JGQrcode from './widgets/JGQrcode'
import JGComboBox from './widgets/JGComboBox'
import JGCheckBoxGroup from './widgets/JGCheckBoxGroup'
import JGRadioGroup from './widgets/JGRadioGroup'
import JGPercent from './widgets/JGPercent'
const Routes = () =>
  useRoutes([
    {
      path: '/',
      element: <Home />
    },
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
      path: '/JGPortal',
      element: <JGPortal />
    },
    {
      path: '/JGRecordPaging',
      element: <JGRecordPaging />
    },
    {
      path: '/JGSteps',
      element: <JGSteps />
    },
    {
      path: '/JGFloatBox',
      element: <JGFloatBox />
    },
    {
      path: '/JGPassword',
      element: <JGPassword />
    },
    {
      path: '/JGIntegerBox',
      element: <JGIntegerBox />
    },
    {
      path: '/JGAttachment',
      element: <JGAttachment />
    },
    {
      path: '/JGPeriod',
      element: <JGPeriod />
    },
    {
      path: '/JGTabControl',
      element: <JGTabControl />
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
    },
    {
      path: '/JGLocateBox',
      element: <JGLocateBox />
    },
    {
      path: '/JGTabControl',
      element: <JGTabControl />
    },{
      path: '/JGComboBox',
      element: <JGComboBox />
    },{
      path: '/JGCheckBoxGroup',
      element: <JGCheckBoxGroup />
    },{
      path: '/JGRadioGroup',
      element: <JGRadioGroup />
    },{
      path: '/JGPercent',
      element: <JGPercent />
    }
  ])

export default Routes
