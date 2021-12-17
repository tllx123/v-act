import React, { ReactNode } from 'react'

import { Property } from 'csstype'

import { Height, Width } from '@v-act/schema-types'

interface WidgetContextProps {
  position: Property.Position
  labelWidth?: number
  multiHeight?: Height
  multiWidth?: Width
}

interface ContextProviderProps {
  context?: WidgetContextProps
  children?: ReactNode
}

const defaultContext: WidgetContextProps = {
  position: 'absolute'
}

const WidgetContext = React.createContext<WidgetContextProps>(defaultContext)
WidgetContext.displayName = '控件position上下文'

function withContext<T>(
  Component: React.ComponentType<T> | React.FunctionComponent<T>
) {
  return (props: T) => {
    return (
      <WidgetContext.Consumer>
        {(context) => <Component context={context} {...props} />}
      </WidgetContext.Consumer>
    )
  }
  /*const WithWidgetContext = React.forwardRef(function (props, ref) {
    return (
      <WidgetContext.Consumer>
        {(context) => <Component context={context} ref={ref} {...props} />}
      </WidgetContext.Consumer>
    )
  })
  return WithWidgetContext*/
}

const useContext = function () {
  return React.useContext(WidgetContext)
}

const createContext = function (
  context: WidgetContextProps | undefined | null
) {
  return Object.assign({}, defaultContext, context || {})
}

const ContextProvider = function (props: ContextProviderProps) {
  const context = props.context || { position: 'absolute' }
  const children = props.children
  return (
    <WidgetContext.Provider value={context}>{children}</WidgetContext.Provider>
  )
}

export {
  ContextProvider,
  createContext,
  useContext,
  WidgetContext,
  type WidgetContextProps,
  withContext
}
