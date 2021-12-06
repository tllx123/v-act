import { useRoutes } from 'react-router-dom'

import JGButton from './widgets/JGButton'
import JGLabel from './widgets/JGLabel'

const Routes = () =>
  useRoutes([
    {
      path: '/JGButton',
      element: <JGButton />
    },
    {
      path: '/JGLabel',
      element: <JGLabel />
    }
  ])

export default Routes
