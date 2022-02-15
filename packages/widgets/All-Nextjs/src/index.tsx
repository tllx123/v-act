import dynamic from 'next/dynamic'

const IPrototypeFrame = dynamic(() =>
  import('@v-act/iprototypeframe').then((mod) => mod.convert)
)

export { IPrototypeFrame }
