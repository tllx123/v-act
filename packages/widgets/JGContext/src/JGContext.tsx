import { Property } from 'csstype'

import { ContextProvider, useContext } from '@v-act/widget-context'

interface JGContextProps {
  position: Property.Position
  children?: JSX.Element | JSX.Element[] | null
}

const JGContext = function (props: JGContextProps) {
  const context = useContext()
  context.position = props.position
  return <ContextProvider context={context}>{props.children}</ContextProvider>
}

JGContext.defaultProps = {
  position: 'absolute'
}

export default JGContext
export { JGContext, type JGContextProps }
