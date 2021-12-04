import { defineConfig } from 'vite'

import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      babel: {
        presets: [
          [
            '@babel/preset-react',
            {
              runtime: 'automatic'
            }
          ]
        ]
      }
    })
  ]
})
