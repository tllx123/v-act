import { Plugin } from 'vite'
const vitePluginDts = () => {
  const plugin: Plugin = {
    name: 'vite:dts',
    apply: 'build',
    async generateBundle({ format }) {
      if (format !== 'es') return
      this.emitFile({
        type: 'asset',
        fileName: 'index.d.ts',
        source: `export * from './../src'`
      })
    }
  }

  return plugin
}

export default vitePluginDts
