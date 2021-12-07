import { defineConfig } from 'vite'

import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          [
            'babel-plugin-direct-import',
            {
              modules: ['@mui/system', '@mui/material', '@mui/icons-material']
            }
          ]
        ]
      }
    })
  ]
})
