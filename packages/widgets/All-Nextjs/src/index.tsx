import dynamic from 'next/dynamic'

const JGComponent = dynamic(() =>
  import('@v-act/jgcomponent').then((mod) => mod.JsonJGComponent)
)

const JGButton = dynamic(() =>
  import('@v-act/jgbutton').then((mod) => mod.JsonJGButton)
)

const widgetDefines = {
  JGButton,
  JGComponent
}

export { widgetDefines }
