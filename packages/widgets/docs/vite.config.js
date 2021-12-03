import { defineConfig } from 'vite'
import reactJsx from 'vite-react-jsx'

import reactRefresh from '@vitejs/plugin-react-refresh'

export default defineConfig({
  plugins: [reactJsx(), reactRefresh()]
})
