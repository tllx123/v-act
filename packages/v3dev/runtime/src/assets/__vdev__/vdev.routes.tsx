import { lazy } from 'react'

import { RouteObject } from 'react-router-dom'

const Vdevjgbutton = lazy(() => import('./pages/dev/JGButton'))

export default [
  { path: '/dev/JGButton', element: <Vdevjgbutton /> }
] as RouteObject[]
