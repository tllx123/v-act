import { useContext } from 'react'

import PageStackProvider from './PageStackProvider'

export default function usePageStackInfo() {
  return useContext(PageStackProvider.Context)
}
