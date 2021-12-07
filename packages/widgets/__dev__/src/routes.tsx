import { useRoutes } from 'react-router-dom'

import Home from './widgets/Home'
import JGButton from './widgets/JGButton'
import JGImage from './widgets/JGImage'
import JGLabel from './widgets/JGLabel'
import JGNewList from './widgets/JGNewList'
import JGPortal from './widgets/JGPortal'
import JGRecordPaging from './widgets/JGRecordPaging'
import JGSteps from './widgets/JGSteps'
import JGTextBox from './widgets/JGTextBox'
import JGFloatBox from './widgets/JGFloatBox'
import JGPassword from './widgets/JGPassword'

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
    }
  ])

export default Routes
