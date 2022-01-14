import { defineConfig } from 'vite'

const nodeExternal = ['art-template', 'fast-xml-parser', 'fs-extra', 'path']

export default defineConfig(async () => {
  const name = '@v-act/core'
  const entry = './src/index.ts'
  const external = [...nodeExternal]
  const fileName = (fmt) => (fmt === 'umd' ? 'index.js' : 'index.es.js')

  return {
    build: {
      emptyOutDir: true,
      lib: { entry, name, fileName, formats: ['umd', 'es'] },
      rollupOptions: { external },
      sourcemap: true
    }
  }
})
