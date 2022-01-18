import React, { useMemo } from 'react'

const Context = React.createContext({ thisLevel: 0, topLevel: 0 })

interface PageStackProviderProperty {
  topLevel: number

  thisLevel: number

  children?: JSX.Element | JSX.Element[]
}

const PageStackProvider = function (props: PageStackProviderProperty) {
  const { topLevel, thisLevel, children } = props
  const value = useMemo(() => {
    return { thisLevel, topLevel }
  }, [thisLevel, topLevel])
  return <Context.Provider value={value}>{children}</Context.Provider>
}

PageStackProvider.Context = Context

export default PageStackProvider
