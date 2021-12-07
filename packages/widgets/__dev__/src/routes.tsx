import { useRoutes } from 'react-router-dom'

import JGButton from './widgets/JGButton'
import JGImage from './widgets/JGImage'
import JGLabel from './widgets/JGLabel'
import JGNewList from './widgets/JGNewList'
import JGTextBox from './widgets/JGTextBox'

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
    }
  ])

export default Routes
