import { useRoutes } from 'react-router-dom'

import JGButton from './widgets/JGButton'
import JGImage from './widgets/JGImage'
import JGLabel from './widgets/JGLabel'
import JGTextBox from './widgets/JGTextBox'
import JGFloatBox from './widgets/JGFloatBox'
import JGPassword from './widgets/JGPassword'

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
      path: '/JGFloatBox',
      element: <JGFloatBox />
    },
    {
      path: '/JGPassword',
      element: <JGPassword />
    }
  ])

export default Routes
